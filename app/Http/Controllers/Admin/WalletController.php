<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\PayoutProcessedMail;
use App\Models\PayoutRequest;
use App\Models\PaymentProof;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function index()
    {
        $wallets = Wallet::with('user')
            ->latest()
            ->paginate(20);

        $pendingPayouts = PayoutRequest::with(['user', 'paymentProof'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Wallet/Index', [
            'wallets' => $wallets,
            'pendingPayouts' => $pendingPayouts,
        ]);
    }

    public function processPayout(Request $request, PayoutRequest $payoutRequest)
    {
        try {
            $request->validate([
                'status' => 'required|in:approved,rejected',
                'payment_screenshot' => 'required_if:status,approved|file|image|max:2048',
                'reference_number' => 'required_if:status,approved|string|max:100',
                'notes' => 'nullable|string|max:500',
                'rejection_reason' => 'required_if:status,rejected|nullable|string|max:500',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Payout validation failed', [
                'payout_id' => $payoutRequest->id,
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            throw $e;
        }
    
        // Check if payout is already processed
        if ($payoutRequest->status !== 'pending') {
            Log::warning('Attempted to process already processed payout', [
                'payout_id' => $payoutRequest->id,
                'current_status' => $payoutRequest->status
            ]);
            return back()->withErrors(['error' => 'Payout request has already been processed']);
        }
    
        DB::beginTransaction();
    
        try {
            $status = $request->status === 'approved' ? 'payout_paid' : 'rejected';
            
            $payoutRequest->update([
                'status' => $status,
                'admin_id' => auth()->id(),
                'processed_at' => now(),
                'admin_notes' => $request->status === 'rejected'
                    ? "Rejected: {$request->rejection_reason}"
                    : $request->notes,
            ]);
    
            if ($status === 'payout_paid') {
                // Upload payment proof
                $screenshotPath = $request->file('payment_screenshot')->store('payment_proofs');
    
                PaymentProof::create([
                    'payout_request_id' => $payoutRequest->id,
                    'admin_id' => auth()->id(),
                    'screenshot_path' => $screenshotPath,
                    'reference_number' => $request->reference_number,
                    'payment_date' => now(),
                    'notes' => $request->notes,
                ]);
    
                // Create transaction record for paid payout
                WalletTransaction::create([
                    'wallet_id' => $payoutRequest->user->wallet->id,
                    'type' => 'payout_paid',
                    'amount' => $payoutRequest->amount,
                    'description' => "Payout request paid - {$payoutRequest->amount} SDG",
                    'payout_request_id' => $payoutRequest->id,
                    'admin_id' => auth()->id(),
                    'status' => 'completed',
                ]);
    
                $successMessage = "Payout approved and processed successfully. Amount: {$payoutRequest->amount} SDG";
            } else {
                // Return amount to wallet with detailed transaction
                $wallet = $payoutRequest->user->wallet;
                $wallet->increment('balance', $payoutRequest->amount);
    
                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'payout_rejected',
                    'amount' => $payoutRequest->amount,
                    'description' => "Payout request rejected - {$payoutRequest->amount} SDG returned to wallet. Reason: {$request->rejection_reason}",
                    'payout_request_id' => $payoutRequest->id,
                    'admin_id' => auth()->id(),
                    'status' => 'completed',
                ]);
    
                $successMessage = "Payout rejected. Amount {$payoutRequest->amount} SDG returned to freelancer wallet.";
            }
    
            // Send notification email
            Mail::to($payoutRequest->user->email)
                ->queue(new PayoutProcessedMail($payoutRequest));
    
            DB::commit();
    
            return back()->with('success', $successMessage);
    
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payout processing failed', [
                'payout_id' => $payoutRequest->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors(['error' => 'Failed to process payout. Please try again.']);
        }
    }

    public function manualOperation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:credit,debit',
            'amount' => 'required|numeric|min:0',
            'reason' => 'required|string',
        ]);

        $wallet = Wallet::where('user_id', $request->user_id)->firstOrFail();

        if ($request->type === 'credit') {
            $wallet->increment('balance', $request->amount);
        } else {
            if ($wallet->balance < $request->amount) {
                return back()->withErrors(['amount' => 'Insufficient balance for debit']);
            }
            $wallet->decrement('balance', $request->amount);
        }

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'type' => $request->type,
            'amount' => $request->type === 'credit' ? $request->amount : -$request->amount,
            'description' => $request->reason,
            'admin_id' => auth()->id(),
        ]);

        return back()->with('success', 'Wallet operation completed');
    }

    public function lock(Wallet $wallet)
    {
        $wallet->update(['is_locked' => true]);
        return back()->with('success', 'Wallet locked');
    }
    public function unlock(Wallet $wallet)
    {
        $wallet->update(['is_locked' => false]);
        return back()->with('success', 'Wallet unlocked');
    }
    public function bulkLock(Request $request)
    {
        $request->validate(['wallet_ids' => 'required|array', 'wallet_ids.*' => 'exists:wallets,id']);
        Wallet::whereIn('id', $request->wallet_ids)->update(['is_locked' => true]);
        return back()->with('success', 'Selected wallets locked');
    }
    public function bulkUnlock(Request $request)
    {
        $request->validate(['wallet_ids' => 'required|array', 'wallet_ids.*' => 'exists:wallets,id']);
        Wallet::whereIn('id', $request->wallet_ids)->update(['is_locked' => false]);
        return back()->with('success', 'Selected wallets unlocked');
    }
    public function export(Request $request)
    {
        $wallets = Wallet::with('user')->get();
        $filename = 'wallets_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ];
        $callback = function () use ($wallets) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['User', 'Email', 'Balance', 'Status', 'Last Updated']);
            foreach ($wallets as $wallet) {
                fputcsv($file, [
                    $wallet->user->name,
                    $wallet->user->email,
                    $wallet->balance,
                    $wallet->is_locked ? 'Locked' : 'Active',
                    $wallet->updated_at,
                ]);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }
    public function show(Wallet $wallet)
    {
        $wallet->load('user');
        $transactions = $wallet->transactions()->latest()->paginate(20);
        return Inertia::render('Admin/Wallet/Show', [
            'wallet' => $wallet,
            'transactions' => $transactions,
        ]);
    }

    public function approvePayout(Request $request, PayoutRequest $payout)
    {
        $request->validate([
            'reference_number' => 'required|string',
            'payment_screenshot' => 'required|file|image|max:2048',
            'notes' => 'nullable|string|max:500',
        ]);
        if ($payout->status !== 'pending') {
            return back()->withErrors(['error' => __('admin.payout.errors.alreadyProcessed')]);
        }
        $screenshotPath = $request->file('payment_screenshot')->store('payment_proofs');
        $payout->update([
            'status' => 'payout_paid',
            'admin_id' => auth()->id(),
            'processed_at' => now(),
            'admin_notes' => $request->notes,
        ]);
        PaymentProof::create([
            'payout_request_id' => $payout->id,
            'admin_id' => auth()->id(),
            'screenshot_path' => $screenshotPath,
            'reference_number' => $request->reference_number,
            'payment_date' => now(),
            'notes' => $request->notes,
        ]);
        $payout->user->wallet->transactions()->create([
            'type' => 'payout_paid',
            'amount' => -$payout->amount,
            'description' => __('admin.payout.transaction.paid', ['amount' => $payout->amount]),
            'payout_request_id' => $payout->id,
            'admin_id' => auth()->id(),
        ]);

         // Send notification to freelancer
         
        return back()->with('success', __('admin.payout.success.paid'));
    }
    public function rejectPayout(Request $request, PayoutRequest $payout)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);
        if ($payout->status !== 'pending') {
            return back()->withErrors(['error' => __('admin.payout.errors.alreadyProcessed')]);
        }
        $payout->update([
            'status' => 'rejected',
            'admin_id' => auth()->id(),
            'processed_at' => now(),
            'admin_notes' => $request->reason,
        ]);
        $wallet = $payout->user->wallet;
        $wallet->increment('balance', $payout->amount);
        $wallet->transactions()->create([
            'type' => 'payout_rejected',
            'amount' => $payout->amount,
            'description' => __('admin.payout.transaction.rejected', ['amount' => $payout->amount, 'reason' => $request->reason]),
            'payout_request_id' => $payout->id,
            'admin_id' => auth()->id(),
        ]);
        return back()->with('success', __('admin.payout.success.rejected'));
    }
    public function showPayout(PayoutRequest $payout)
    {
        $payout->load(['user', 'paymentProof']);
        $transactions = $payout->user->wallet->transactions()->where('payout_request_id', $payout->id)->get();
        return response()->json([
            'payout' => $payout,
            'payment_proof_url' => $payout->paymentProof ? asset('storage/' . $payout->paymentProof->screenshot_path) : null,
            'transactions' => $transactions,
        ]);
    }
}
