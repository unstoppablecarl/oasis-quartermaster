<?php

use App\Http\Controllers\ArmyListController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Home')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');

    Route::resource('army-lists', ArmyListController::class);
});

require __DIR__.'/settings.php';
