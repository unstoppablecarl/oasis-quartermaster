<?php

namespace App\Models;

use Database\Factories\ArmyListTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $display_name
 * @property int $max_points
 */
#[Fillable(['display_name', 'max_points'])]
class ArmyListType extends Model
{
    /** @use HasFactory<ArmyListTypeFactory> */
    use HasFactory;

    public $timestamps = false;

    public function armyLists(): HasMany
    {
        return $this->hasMany(ArmyList::class);
    }
}
