<?php

use App\Models\Faction;
use Database\Seeders\FactionSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factions', function (Blueprint $table) {
            $table->id();
            $table->string('display_name');
        });

        $seeder = new FactionSeeder;
        $seeder->run();

        Schema::table('army_lists', function (Blueprint $table) {
            $table->foreignIdFor(Faction::class)->default(1)->index()->constrained();
        });
    }

    public function down(): void
    {
        Schema::table('army_lists', function (Blueprint $table) {
            $table->dropColumn('faction_id');
        });
        Schema::dropIfExists('factions');
    }
};
