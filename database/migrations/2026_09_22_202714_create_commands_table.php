<?php

use App\Models\ArmyList;
use App\Models\Command;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commands', function (Blueprint $table) {
            $table->id();
            $table->string('display_name');
        });

        Schema::create('army_list_commands', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ArmyList::class)->index()->constrained();
            $table->foreignIdFor(Command::class)->index()->constrained();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commands');
        Schema::dropIfExists('army_list_commands');

    }
};
