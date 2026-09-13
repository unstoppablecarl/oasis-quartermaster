<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonString = file_get_contents('resources/static-data/data.json');
        $data = json_decode($jsonString, true);

        foreach ($data['UNITS'] as $unit) {
            Unit::query()->updateOrCreate([
                'id' => $unit['id'],
            ], Arr::only($unit, ['display_name']));
        }
    }
}
