<?php

test('guests can view the army list create page', function () {
    $this->get(route('army-lists.create'))->assertOk();
});

test('guests are redirected to login when saving an army list', function () {
    $this->post(route('army-lists.store'), [
        'display_name' => 'My New List',
    ])->assertRedirect(route('login'));
});

test('guests can view the rules page', function () {
    $this->get(route('rules'))->assertOk();
});

test('guests can view the dice roller page', function () {
    $this->get(route('dice-roller'))->assertOk();
});

test('guests can view the print cards page', function () {
    $this->get(route('print-cards'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('PrintCards'));
});
