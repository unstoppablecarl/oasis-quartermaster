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
    $response->assertInertia(fn ($page) => $page
        ->component('ArmyLists/Draft/Print')
        ->where('printMode', 'list')
    );
});

test('guests can view the draft army list print page for a specific print mode', function () {
    $response = $this->get(route('army-lists.draft.print', ['mode' => 'cards']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('ArmyLists/Draft/Print')
        ->where('printMode', 'cards')
    );
});

test('an invalid draft army list print mode is not found', function () {
    $this->get('/army-lists/draft/print/invalid-mode')->assertNotFound();
});

test('the default draft army list print mode has no dedicated url', function () {
    $this->get('/army-lists/draft/print/list')->assertNotFound();
});
