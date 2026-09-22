<?php

use App\Models\ArmyList;
use App\Models\Command;
use App\Models\Faction;

it('belongs to a faction', function () {
    $faction = Faction::factory()->create();
    $armyList = ArmyList::factory()->create(['faction_id' => $faction->id]);

    expect($armyList->faction)->toBeInstanceOf(Faction::class);
    expect($armyList->faction->id)->toBe($faction->id);
});

it('belongs to many commands', function () {
    $armyList = ArmyList::factory()->create();
    $commands = Command::factory()->count(2)->create();

    $armyList->commands()->attach($commands->pluck('id'));

    expect($armyList->commands)->toHaveCount(2);
    expect($armyList->commands->pluck('id')->sort()->values()->all())
        ->toBe($commands->pluck('id')->sort()->values()->all());
});
