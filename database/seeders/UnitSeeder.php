<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonString = file_get_contents('resources/static-data/data.json');
        $data = json_decode($jsonString, true);

        foreach ($data['Units'] as $unit) {
            Unit::query()->updateOrCreate([
                'id' => $unit['id'],
            ], $unit);
        }
    }
}
