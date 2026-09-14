<?php

use App\Http\Controllers\ArmyListController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Home')->name('home');

Route::inertia('rules', 'Rules')->name('rules');
Route::inertia('dice-roller', 'DiceRoller')->name('dice-roller');

Route::get('army-lists/create', [ArmyListController::class, 'create'])->name('army-lists.create');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('army-lists', ArmyListController::class)->except('create');

});

require __DIR__.'/settings.php';
