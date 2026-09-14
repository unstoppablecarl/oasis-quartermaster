<?php

namespace Database\Factories;

use App\Models\ArmyList;
use App\Models\ArmyListType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ArmyList>
 */
class ArmyListFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'army_list_type_id' => ArmyListType::factory(),
            'display_name' => fake()->words(2, true),
        ];
    }
}
