<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (App::environment('local')) {
            $email = 'test@example.com';
            User::query()->updateOrCreate([
                'email' => $email,
            ], [
                'name' => 'Test User',
                'email' => $email,
                'email_verified_at' => now(),
                'password' => Hash::make('test'),
            ]);
        }
    }
}
