<?php

use App\Models\ArmyListType;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('army_lists', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique()->index();
            $table->string('display_name');
            $table->unsignedInteger('custom_max_points')->nullable();
            $table->foreignIdFor(User::class, '')->index();
            $table->foreignIdFor(ArmyListType::class, '')->index()->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('army_lists');
    }
};
