<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['display_name',])]
class Unit extends Model
{
    public $timestamps = false;

    public function armyLists(): BelongsToMany
    {
        return $this->belongsToMany(ArmyList::class)->withPivot('quantity');
    }
}
