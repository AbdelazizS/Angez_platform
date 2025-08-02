<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    /**
     * Determine if the user can create a review for the order.
     */
    public function create(User $user, Order $order)
    {
        // Only clients can review
        if (!$user->isClient()) {
            return false;
        }
        // Order must belong to client
        if ($order->client_id !== $user->id) {
            return false;
        }
        // Order must be in review status and payment verified
        if ($order->status !== 'completed' || $order->payment_status !== 'verified') {
            return false;
        }
        // Only one review per order per client
        if ($order->reviews()->where('client_id', $user->id)->exists()) {
            return false;
        }
        return true;
    }

    /**
     * Determine if the user can view the review.
     */
    public function view(User $user, Review $review)
    {
        // Client or freelancer involved in the order can view
        return $user->id === $review->client_id || $user->id === $review->freelancer_id;
    }

    /**
     * Determine if the user can delete the review.
     */
    public function delete(User $user, Review $review)
    {
        return $user->id === $review->client_id;
    }
} 