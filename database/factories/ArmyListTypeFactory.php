<?php

namespace Database\Factories;

use App\Models\ArmyListType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ArmyListType>
 */
class ArmyListTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'display_name' => fake()->words(2, true),
            'max_points' => fake()->numberBetween(200, 1000),
        ];
    }
}
