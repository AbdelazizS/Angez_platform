<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Mail\NewPayoutRequestMail;
use App\Models\PayoutRequest;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Create wallet if it doesn't exist
        $wallet = $user->createWalletIfNotExists();
        
        $transactions = $wallet->transactions()
            ->with(['order', 'payoutRequest'])
            ->latest()
            ->paginate(20);
            
        $payoutRequests = $user->payoutRequests()
            ->with('paymentProof')
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Freelancer/Wallet/Index', [
            'wallet' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'is_locked' => $wallet->is_locked,
            ],
            'transactions' => $transactions,
            'payoutRequests' => $payoutRequests,
            'canRequestPayout' => $wallet->canRequestPayout(200000),
        ]);
    }
    
    public function requestPayout(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:200000',
            'bank_account_details' => 'required|string|max:1000',
        ]);
        
        $user = auth()->user();
        $wallet = $user->wallet;
        
        if (!$wallet) {
            return back()->withErrors(['error' => 'Wallet not found']);
        }
        
        if ($wallet->is_locked) {
            return back()->withErrors(['error' => 'Wallet is locked']);
        }
        
        if ($wallet->balance < $request->amount) {
            return back()->withErrors(['amount' => 'Insufficient balance']);
        }
        
        // Create payout request
        $payoutRequest = PayoutRequest::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'bank_account_details' => $request->bank_account_details,
            'requested_at' => now(),
        ]);
    
        // Create transaction record
        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'payout_request',
            'amount' => -$request->amount,
            'description' => 'Payout request',
            'payout_request_id' => $payoutRequest->id,
        ]);
        
        // Deduct from wallet
        $wallet->decrement('balance', $request->amount);
        
        // Notify admin
        Mail::to(config('mail.admin_email'))->queue(new NewPayoutRequestMail($payoutRequest, $user));
        
        return back()->with('success', 'Payout request submitted successfully');
    }
}
