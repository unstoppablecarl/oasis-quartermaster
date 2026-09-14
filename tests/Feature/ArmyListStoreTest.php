<?php

use App\Models\ArmyList;
use App\Models\ArmyListType;
use App\Models\User;

test('user can create an army list with an army list type', function () {
    $user = User::factory()->create();
    $armyListType = ArmyListType::factory()->create();

    $response = $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'army_list_type_id' => $armyListType->id,
    ]);

    $armyList = ArmyList::where('display_name', 'My New List')->firstOrFail();
    $response->assertRedirect(route('army-lists.show', $armyList));
    expect($armyList->user_id)->toBe($user->id);
    expect($armyList->army_list_type_id)->toBe($armyListType->id);
});

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

    $this->actingAs($user)->post(route('army-lists.store'), [
        'display_name' => 'My New List',
        'custom_max_points' => 600,
    ]);

    $armyList = ArmyList::where('display_name', 'My New List')->firstOrFail();
    expect($armyList->army_list_type_id)->toBeNull();
    expect($armyList->custom_max_points)->toBe(600);
    expect($armyList->max_points)->toBe(600);
});
