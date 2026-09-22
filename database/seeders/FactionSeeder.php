<?php

namespace Database\Seeders;

use App\Models\Faction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class FactionSeeder extends Seeder
{
    public function run(): void
    {
        $jsonString = file_get_contents('static-data/data.json');
        $data = json_decode($jsonString, true);

        foreach ($data['FACTIONS'] as $faction) {
            $find = Arr::only($faction, ['id']);
            $values = Arr::only($faction, ['display_name']);

            Faction::query()->updateOrCreate($find, $values);
        }
    }
}
