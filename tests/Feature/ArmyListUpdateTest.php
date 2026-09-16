<?php

use App\Models\ArmyList;
use App\Models\ArmyListType;
use App\Models\Unit;
use App\Models\User;

test('owner can update display name and sync units as json', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create(['display_name' => 'Original']);
    $units = Unit::factory()->count(2)->create();

    $response = $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => 'Updated Name',
        'army_list_type_id' => $armyList->army_list_type_id,
        'units' => [
            ['id' => $units[0]->id, 'quantity' => 3],
            ['id' => $units[1]->id, 'quantity' => 1],
        ],
    ]);

    $response->assertOk();
    $response->assertJsonPath('armyList.display_name', 'Updated Name');
    $response->assertJson([
        'armyList' => [
            'units' => [
                ['id' => $units[0]->id, 'quantity' => 3],
                ['id' => $units[1]->id, 'quantity' => 1],
            ],
        ],
    ]);

    expect($armyList->refresh()->display_name)->toBe('Updated Name');
    expect($armyList->units()->pluck('quantity', 'unit_id')->toArray())->toBe([
        $units[0]->id => 3,
        $units[1]->id => 1,
    ]);
});

test('updating units replaces the previous set', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();
    $units = Unit::factory()->count(2)->create();
    $armyList->units()->attach($units[0]->id, ['quantity' => 5, 'display_order' => 0]);

    $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => $armyList->display_name,
        'army_list_type_id' => $armyList->army_list_type_id,
        'units' => [
            ['id' => $units[1]->id, 'quantity' => 2],
        ],
    ])->assertOk();

    expect($armyList->units()->pluck('unit_id')->toArray())->toBe([$units[1]->id]);
});

test('units are persisted in the submitted display order', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();
    $units = Unit::factory()->count(3)->create();
    $armyList->units()->attach($units[0]->id, ['quantity' => 1, 'display_order' => 0]);
    $armyList->units()->attach($units[1]->id, ['quantity' => 1, 'display_order' => 1]);

    $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => $armyList->display_name,
        'army_list_type_id' => $armyList->army_list_type_id,
        'units' => [
            ['id' => $units[2]->id, 'quantity' => 1],
            ['id' => $units[0]->id, 'quantity' => 1],
            ['id' => $units[1]->id, 'quantity' => 1],
        ],
    ])->assertOk();

    expect($armyList->units()->pluck('unit_id')->toArray())->toBe([
        $units[2]->id,
        $units[0]->id,
        $units[1]->id,
    ]);
});

test('a user cannot update another users army list', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $armyList = ArmyList::factory()->for($owner)->create();

    $this->actingAs($otherUser)->putJson(route('army-lists.update', $armyList), [
        'display_name' => 'Hacked',
        'army_list_type_id' => $armyList->army_list_type_id,
    ])->assertForbidden();
});

test('edit page includes previously saved units', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();
    $unit = Unit::factory()->create();
    $armyList->units()->attach($unit->id, ['quantity' => 4, 'display_order' => 0]);

    $response = $this->actingAs($user)->get(route('army-lists.edit', $armyList));

    $response->assertInertia(fn ($page) => $page
        ->where('armyList.units', [['id' => $unit->id, 'quantity' => 4]])
    );
});

test('display name is required', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => '',
    ])->assertJsonValidationErrors('display_name');
});

test('owner can update the army list type', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();
    $newType = ArmyListType::factory()->create();

    $response = $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => $armyList->display_name,
        'army_list_type_id' => $newType->id,
    ]);

    $response->assertOk();
    $response->assertJsonPath('armyList.army_list_type_id', $newType->id);
    $response->assertJsonPath('armyList.max_points', $newType->max_points);
    expect($armyList->refresh()->army_list_type_id)->toBe($newType->id);
});

test('custom max points is required when no army list type is selected', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => $armyList->display_name,
        'army_list_type_id' => null,
    ])->assertJsonValidationErrors('custom_max_points');
});

test('custom max points must be empty when an army list type is selected', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => $armyList->display_name,
        'army_list_type_id' => $armyList->army_list_type_id,
        'custom_max_points' => 500,
    ])->assertJsonValidationErrors('custom_max_points');
});

test('custom max points is saved and used as the max points when no army list type is selected', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $response = $this->actingAs($user)->putJson(route('army-lists.update', $armyList), [
        'display_name' => $armyList->display_name,
        'army_list_type_id' => null,
        'custom_max_points' => 750,
    ]);

    $response->assertOk();
    $response->assertJsonPath('armyList.army_list_type_id', null);
    $response->assertJsonPath('armyList.max_points', 750);
    $armyList->refresh();
    expect($armyList->army_list_type_id)->toBeNull();
    expect($armyList->custom_max_points)->toBe(750);
});
