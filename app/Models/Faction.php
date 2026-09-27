<?php

namespace App\Models;

use Database\Factories\FactionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $display_name
 */
#[Fillable(['display_name'])]
class Faction extends Model
{
    /** @use HasFactory<FactionFactory> */
    use HasFactory;

    public $timestamps = false;

    /**
     * @return HasMany<ArmyList, $this>
     */
    public function armyLists(): HasMany
    {
        return $this->hasMany(ArmyList::class);
    }
}
