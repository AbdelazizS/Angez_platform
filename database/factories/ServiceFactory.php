<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1, // You may want to randomize or seed users first
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(2),
            'category' => $this->faker->randomElement(['Web Development', 'Graphic Design', 'Content Writing']),
            'subcategory' => $this->faker->word(),
            'price' => $this->faker->numberBetween(20000, 500000),
            'delivery_time' => $this->faker->randomElement(['1 day', '2 days', '3 days', '7 days']),
            'revisions' => $this->faker->numberBetween(1, 5),
            'tags' => $this->faker->randomElements(['HTML', 'CSS', 'JavaScript', 'SEO', 'WordPress', 'Logo Design', 'Branding'], 3),
            'gallery' => [],
            'features' => $this->faker->randomElements(['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Contact Forms', 'Analytics Integration'], 3),
            'is_popular' => $this->faker->boolean(30),
            'is_featured' => $this->faker->boolean(10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
