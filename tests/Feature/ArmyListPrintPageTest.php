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
    );
});

test('a user cannot view another users army list print page', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $armyList = ArmyList::factory()->for($owner)->create();

    $this->actingAs($otherUser)->get(route('army-lists.print', $armyList))->assertForbidden();
});

test('guests are redirected to login', function () {
    $armyList = ArmyList::factory()->create();

    $this->get(route('army-lists.print', $armyList))->assertRedirect(route('login'));
});
