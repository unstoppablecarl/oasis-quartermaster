<?php

namespace Database\Seeders;

use App\Models\Command;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class CommandSeeder extends Seeder
{
    public function run(): void
    {
        $jsonString = file_get_contents('static-data/data.json');
        $data = json_decode($jsonString, true);

        foreach ($data['COMMANDS'] as $command) {
            $find = Arr::only($command, ['id']);
            $values = Arr::only($command, ['display_name']);

            Command::query()->updateOrCreate($find, $values);
        }
    }
}
