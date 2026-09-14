<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('army_list_types', function (Blueprint $table) {
            $table->id();
            $table->string('display_name');
            $table->unsignedInteger('max_points');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('army_list_types');
    }
};
