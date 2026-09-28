<?php

use App\Models\ArmyList;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('army_list_commands', function (Blueprint $table) {
            $table->dropForeign(['army_list_id']);
            $table->foreignIdFor(ArmyList::class)->change();
            $table->foreign('army_list_id')->references('id')->on('army_lists')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('army_list_commands', function (Blueprint $table) {
            $table->dropForeign(['army_list_id']);
            $table->foreignIdFor(ArmyList::class)->change();
            $table->foreign('army_list_id')->references('id')->on('army_lists');
        });
    }
};
