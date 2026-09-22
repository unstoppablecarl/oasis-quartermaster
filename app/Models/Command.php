<?php

namespace App\Models;

use Database\Factories\CommandFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['display_name'])]
class Command extends Model
{
    /** @use HasFactory<CommandFactory> */
    use HasFactory;

    public $timestamps = false;

    public function armyLists(): BelongsToMany
    {
        return $this->belongsToMany(ArmyList::class, 'army_list_commands');
    }
}
