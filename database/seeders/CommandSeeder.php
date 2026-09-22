<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class CommandSeeder extends Seeder
{
    public function run(): void
    {
        $jsonString = file_get_contents('static-data/data.json');
        $data = json_decode($jsonString, true);

        foreach ($data['COMMANDS'] as $unit) {
            $find = Arr::only($unit, ['id']);
            $values = Arr::only($unit, ['display_name']);

            Unit::query()->updateOrCreate($find, $values);
        }
    }
}
