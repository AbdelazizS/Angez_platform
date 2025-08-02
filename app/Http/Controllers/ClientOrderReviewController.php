<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\FreelancerReviewReceivedMail;

class ClientOrderReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request, Order $order)
    {
        try {
            $user = Auth::user();
            Log::info('Review submission attempt', [
                'order_id' => $order->id ?? null,
                'user_id' => $user->id ?? null,
                'freelancer_id' => $order->freelancer_id ?? null,
            ]);
            $this->authorize('create', [Review::class, $order]);
    
            $validated = $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:2000',
                'media' => 'nullable|array',
                'media.*' => 'string',
            ]);
    
            $review = Review::create([
                'order_id' => $order->id,
                'client_id' => $user->id,
                'freelancer_id' => $order->freelancer_id,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
                // 'media' => $validated['media'] ?? null,
            ]);

            // Notify freelancer
            Mail::to($order->freelancer->email)->queue(new FreelancerReviewReceivedMail($review));
    
            return redirect()->back()->with('success', __('reviews.created_successfully'));
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Order not found or not accessible.'], 404);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            Log::error('Review authorization failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['review' => 'You are not allowed to review this order.']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Review validation failed: ' . json_encode($e->errors()));
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Unexpected review error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->withErrors(['review' => 'An unexpected error occurred.']);
        }
    }

    /**
     * Show a review for an order (optional).
     */
    public function show(Order $order)
    {
        $review = $order->reviews()->where('client_id', Auth::id())->with('client')->firstOrFail();
        $this->authorize('view', $review);
        return response()->json($review);
    }

    /**
     * Delete a review for an order.
     */
    public function destroy(Request $request, Order $order)
    {
        try {
            $user = Auth::user();
            $review = $order->reviews()->where('client_id', $user->id)->firstOrFail();
            $this->authorize('delete', $review);
            $review->delete();
            return redirect()->back()->with('success', __('reviews.deleted_successfully'));
        } catch (\Exception $e) {
            Log::error('Review delete error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['review' => __('reviews.delete_error')]);
        }
    }
} 