<?php

test('guests can view the draft army list view page', function () {
    $response = $this->get(route('army-lists.draft.show'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('ArmyLists/Draft/Show'));
});

test('guests can view the draft army list edit page', function () {
    $response = $this->get(route('army-lists.draft.edit'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('ArmyLists/Create'));
});

test('guests can view the draft army list print page', function () {
    $response = $this->get(route('army-lists.draft.print'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('ArmyLists/Draft/Print'));
});
