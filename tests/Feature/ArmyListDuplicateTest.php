<?php

use App\Models\ArmyList;
use App\Models\Command;
use App\Models\Unit;
use App\Models\User;

test('owner can duplicate their army list', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create([
        'display_name' => 'My Original List',
        'public' => true,
    ]);
    $units = Unit::factory()->count(2)->create();
    $commands = Command::factory()->count(2)->create();
    $armyList->units()->sync([
        $units[0]->id => ['quantity' => 3, 'display_order' => 0],
        $units[1]->id => ['quantity' => 1, 'display_order' => 1],
    ]);
    $armyList->commands()->sync($commands->pluck('id'));

    $response = $this->actingAs($user)->post(route('army-lists.duplicate', $armyList));

    $duplicate = ArmyList::where('display_name', 'My Original List (Copy)')->firstOrFail();
    $response->assertRedirect(route('army-lists.edit', $duplicate));
    expect($duplicate->id)->not->toBe($armyList->id);
    expect($duplicate->uuid)->not->toBe($armyList->uuid);
    expect($duplicate->user_id)->toBe($user->id);
    expect($duplicate->faction_id)->toBe($armyList->faction_id);
    expect($duplicate->army_list_type_id)->toBe($armyList->army_list_type_id);
    expect((bool) $duplicate->public)->toBeFalse();
    expect($duplicate->units()->pluck('unit_id')->sort()->values()->toArray())
        ->toBe([$units[0]->id, $units[1]->id]);
    expect($duplicate->commands()->pluck('command_id')->sort()->values()->toArray())
        ->toBe($commands->pluck('id')->sort()->values()->toArray());
});

test('user can duplicate another users public army list', function () {
    $owner = User::factory()->create();
    $duplicator = User::factory()->create();
    $armyList = ArmyList::factory()->for($owner)->create(['public' => true]);

    $response = $this->actingAs($duplicator)->post(route('army-lists.duplicate', $armyList));

    $duplicate = ArmyList::where('user_id', $duplicator->id)->firstOrFail();
    $response->assertRedirect(route('army-lists.edit', $duplicate));
});

test('user cannot duplicate another users private army list', function () {
    $owner = User::factory()->create();
    $duplicator = User::factory()->create();
    $armyList = ArmyList::factory()->for($owner)->create(['public' => false]);

    $this->actingAs($duplicator)->post(route('army-lists.duplicate', $armyList))
        ->assertNotFound();
});

test('guest cannot duplicate an army list', function () {
    $armyList = ArmyList::factory()->create(['public' => true]);

    $this->post(route('army-lists.duplicate', $armyList))
        ->assertRedirect(route('login'));
});
