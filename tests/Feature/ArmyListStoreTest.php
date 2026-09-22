<?php

use App\Models\ArmyList;
use App\Models\ArmyListType;
use App\Models\Command;
use App\Models\Faction;
use App\Models\User;

test('user can create an army list with an army list type', function () {
    $user = User::factory()->create();
    $armyListType = ArmyListType::factory()->create();
    $faction = Faction::factory()->create();
    $commands = Command::factory()->count(2)->create();

    $response = $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'army_list_type_id' => $armyListType->id,
        'faction_id' => $faction->id,
        'public' => false,
        'commands' => [
            ['id' => $commands[0]->id],
            ['id' => $commands[1]->id],
        ],
    ]);

    $armyList = ArmyList::where('display_name', 'My New List')->firstOrFail();
    $response->assertRedirect(route('army-lists.edit', $armyList));
    expect($armyList->user_id)->toBe($user->id);
    expect($armyList->army_list_type_id)->toBe($armyListType->id);
    expect($armyList->faction_id)->toBe($faction->id);
});

test('user can create an army list with commands synced', function () {
    $user = User::factory()->create();
    $armyListType = ArmyListType::factory()->create();
    $faction = Faction::factory()->create();
    $commands = Command::factory()->count(2)->create();

    $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'army_list_type_id' => $armyListType->id,
        'faction_id' => $faction->id,
        'public' => false,
        'commands' => [
            ['id' => $commands[0]->id],
            ['id' => $commands[1]->id],
        ],
    ]);

    $armyList = ArmyList::where('display_name', 'My New List')->firstOrFail();
    expect($armyList->commands()->pluck('command_id')->sort()->values()->toArray())
        ->toBe([$commands[0]->id, $commands[1]->id]);
});

test('faction id is required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'public' => false,
    ])->assertSessionHasErrors('faction_id');
});

test('exactly two commands are required', function (array $commandIds) {
    $user = User::factory()->create();
    $faction = Faction::factory()->create();

    $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'faction_id' => $faction->id,
        'public' => false,
        'commands' => collect($commandIds)->map(fn (int $id) => ['id' => $id])->all(),
    ])->assertSessionHasErrors('commands');
})->with([
    'no commands' => [[]],
    'one command' => fn () => [Command::factory()->create()->id],
    'three commands' => fn () => Command::factory()->count(3)->create()->pluck('id')->all(),
]);

test('custom max points is required when no army list type is selected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
    ])->assertSessionHasErrors('custom_max_points');
});

test('custom max points must be empty when an army list type is selected', function () {
    $user = User::factory()->create();
    $armyListType = ArmyListType::factory()->create();

    $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'army_list_type_id' => $armyListType->id,
        'custom_max_points' => 500,
    ])->assertSessionHasErrors('custom_max_points');
});

test('custom max points is saved when creating an army list without an army list type', function () {
    $user = User::factory()->create();
    $faction = Faction::factory()->create();
    $commands = Command::factory()->count(2)->create();

    $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'custom_max_points' => 600,
        'faction_id' => $faction->id,
        'public' => true,
        'commands' => [
            ['id' => $commands[0]->id],
            ['id' => $commands[1]->id],
        ],
    ]);

    $armyList = ArmyList::where('display_name', 'My New List')->firstOrFail();
    expect($armyList->army_list_type_id)->toBeNull();
    expect($armyList->custom_max_points)->toBe(600);
    expect($armyList->max_points)->toBe(600);
});
