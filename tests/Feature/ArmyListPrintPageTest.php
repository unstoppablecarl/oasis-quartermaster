<?php

use App\Models\ArmyList;
use App\Models\User;

test('owner can view the print page', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $response = $this->actingAs($user)->get(route('army-lists.print', $armyList));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ArmyLists/Print')
        ->where('armyList.uuid', (string) $armyList->uuid)
        ->where('printMode', 'list')
    );
});

test('owner can view the print page for a specific print mode', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $response = $this->actingAs($user)->get(route('army-lists.print', [$armyList, 'mode' => 'cards']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ArmyLists/Print')
        ->where('printMode', 'cards')
    );
});

test('an invalid army list print mode is not found', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $this->actingAs($user)->get("/army-lists/{$armyList->uuid}/print/invalid-mode")->assertNotFound();
});

test('the default army list print mode has no dedicated url', function () {
    $user = User::factory()->create();
    $armyList = ArmyList::factory()->for($user)->create();

    $this->actingAs($user)->get("/army-lists/{$armyList->uuid}/print/list")->assertNotFound();
});

test('a user cannot view another users army list print page', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $armyList = ArmyList::factory()->for($owner)->create();

    $this->actingAs($otherUser)->get(route('army-lists.print', $armyList))->assertNotFound();
});
