<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $packagePrice = $this->faker->numberBetween(50000, 300000);
        $serviceFee = (int)($packagePrice * 0.10);
        $totalAmount = $packagePrice + $serviceFee;
        
        return [
            'service_id' => 1, // You may want to randomize or seed services first
            'client_id' => 1, // You may want to randomize or seed users first
            'freelancer_id' => 1, // You may want to randomize or seed users first
            'order_number' => 'ORD-' . date('Y') . '-' . str_pad($this->faker->unique()->numberBetween(1, 999999), 6, '0', STR_PAD_LEFT),
            'package_name' => $this->faker->randomElement(['Basic', 'Standard', 'Premium']),
            'package_price' => $packagePrice,
            'service_fee' => $serviceFee,
            'total_amount' => $totalAmount,
            'requirements' => $this->faker->paragraph(2),
            'additional_notes' => $this->faker->optional()->sentence(),
            'transaction_ref' => $this->faker->optional()->regexify('[A-Z0-9]{10}'),
            'payment_screenshot' => $this->faker->optional()->imageUrl(),
            'payment_status' => $this->faker->randomElement(['pending', 'verified', 'failed']),
            'payment_method' => $this->faker->randomElement(['bank_transfer', 'mobile_money', 'cash']),
            'status' => $this->faker->randomElement(['pending', 'payment_verified', 'in_progress', 'review', 'completed', 'cancelled']),
            'payment_verified_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'started_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'completed_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'cancelled_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ];
    }
}
