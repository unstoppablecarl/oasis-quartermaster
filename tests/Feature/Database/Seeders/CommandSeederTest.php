<?php

use App\Models\Command;
use App\Models\Unit;
use Database\Seeders\CommandSeeder;

it('seeds commands into the commands table, not the units table', function () {
    (new CommandSeeder)->run();

    expect(Command::query()->where('display_name', 'Firepower')->exists())->toBeTrue();
    expect(Unit::query()->where('display_name', 'Firepower')->exists())->toBeFalse();
});
