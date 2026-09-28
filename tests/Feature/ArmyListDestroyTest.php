<?php

use App\Models\ArmyList;
use App\Models\Command;
use App\Models\User;

test('owner can delete their army list', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $response = $this->actingAs($user)->delete(route('army-lists.destroy', $armyList));

    $response->assertRedirect(route('army-lists.index'));
    expect(ArmyList::find($armyList->id))->toBeNull();
});

test('owner can delete an army list that has commands attached', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();
    $command = Command::factory()->create();
    $armyList->commands()->sync([$command->id]);

    $response = $this->actingAs($user)->delete(route('army-lists.destroy', $armyList));

    $response->assertRedirect(route('army-lists.index'));
    expect(ArmyList::find($armyList->id))->toBeNull();
    expect(Command::find($command->id))->not->toBeNull();
});

test('a user cannot delete another users army list', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $armyList = ArmyList::factory()->for($owner)->create();

    $this->actingAs($otherUser)->delete(route('army-lists.destroy', $armyList))->assertForbidden();
    expect(ArmyList::find($armyList->id))->not->toBeNull();
});
