<?php

namespace Database\Seeders;

use App\Models\ArmyListType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class ArmyListTypeSeeder extends Seeder
{
    public function run(): void
    {
        $jsonString = file_get_contents('resources/static-data/data.json');
        $data = json_decode($jsonString, true);

        foreach ($data['ARMY_LIST_TYPES'] as $armyListType) {
            $find = Arr::only($armyListType, ['id']);
            $values = Arr::only($armyListType, ['display_name', 'max_points']);

            ArmyListType::query()->updateOrCreate($find, $values);
        }
    }
}
