<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_create_review_for_eligible_order()
    {
        $client = User::factory()->create();
        $freelancer = User::factory()->create();
        $order = Order::factory()->create([
            'client_id' => $client->id,
            'freelancer_id' => $freelancer->id,
            'status' => 'review',
            'payment_status' => 'verified',
        ]);
        $this->actingAs($client);
        $response = $this->postJson("/client/orders/{$order->id}/review", [
            'rating' => 5,
            'comment' => 'Great work!',
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', [
            'order_id' => $order->id,
            'client_id' => $client->id,
            'freelancer_id' => $freelancer->id,
            'rating' => 5,
            'comment' => 'Great work!',
        ]);
    }

    public function test_client_cannot_create_review_for_ineligible_order()
    {
        $client = User::factory()->create();
        $freelancer = User::factory()->create();
        $order = Order::factory()->create([
            'client_id' => $client->id,
            'freelancer_id' => $freelancer->id,
            'status' => 'in_progress',
            'payment_status' => 'pending',
        ]);
        $this->actingAs($client);
        $response = $this->postJson("/client/orders/{$order->id}/review", [
            'rating' => 5,
            'comment' => 'Great work!',
        ]);
        $response->assertStatus(403);
    }

    public function test_only_one_review_per_order_per_client()
    {
        $client = User::factory()->create();
        $freelancer = User::factory()->create();
        $order = Order::factory()->create([
            'client_id' => $client->id,
            'freelancer_id' => $freelancer->id,
            'status' => 'review',
            'payment_status' => 'verified',
        ]);
        Review::create([
            'order_id' => $order->id,
            'client_id' => $client->id,
            'freelancer_id' => $freelancer->id,
            'rating' => 4,
            'comment' => 'Good',
        ]);
        $this->actingAs($client);
        $response = $this->postJson("/client/orders/{$order->id}/review", [
            'rating' => 5,
            'comment' => 'Another review',
        ]);
        $response->assertStatus(403);
    }

    public function test_freelancer_and_client_can_view_review()
    {
        $client = User::factory()->create();
        $freelancer = User::factory()->create();
        $order = Order::factory()->create([
            'client_id' => $client->id,
            'freelancer_id' => $freelancer->id,
            'status' => 'review',
            'payment_status' => 'verified',
        ]);
        $review = Review::create([
            'order_id' => $order->id,
            'client_id' => $client->id,
            'freelancer_id' => $freelancer->id,
            'rating' => 5,
            'comment' => 'Great work!',
        ]);
        $this->actingAs($client);
        $response = $this->getJson("/client/orders/{$order->id}/review");
        $response->assertStatus(200);
        $this->actingAs($freelancer);
        $response = $this->getJson("/client/orders/{$order->id}/review");
        $response->assertStatus(200);
    }
} 