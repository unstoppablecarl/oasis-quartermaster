<?php

namespace App\Models;

use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $display_name
 * @property-read object{quantity: int, display_order: int} $pivot
 */
#[Fillable(['display_name'])]
class Unit extends Model
{
    /** @use HasFactory<UnitFactory> */
    use HasFactory;

    public $timestamps = false;

    /**
     * @return BelongsToMany<ArmyList, $this>
     */
    public function armyLists(): BelongsToMany
    {
        return $this->belongsToMany(ArmyList::class)->withPivot('quantity');
    }
}
