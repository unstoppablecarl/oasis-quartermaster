<?php

use App\Models\ArmyList;
use App\Models\Command;

it('belongs to many army lists', function () {
    $command = Command::factory()->create();
    $armyLists = ArmyList::factory()->count(2)->create();

    $command->armyLists()->attach($armyLists->pluck('id'));

    expect($command->armyLists)->toHaveCount(2);
    expect($command->armyLists->pluck('id')->sort()->values()->all())
        ->toBe($armyLists->pluck('id')->sort()->values()->all());
});
