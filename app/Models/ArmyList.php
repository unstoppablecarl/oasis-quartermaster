<?php

namespace App\Models;

use App\Http\Resources\ArmyListResource;
use Database\Factories\ArmyListFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseResource;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $display_name
 * @property string $uuid
 * @property int $user_id
 * @property int|null $army_list_type_id
 * @property int $faction_id
 * @property int|null $custom_max_points
 * @property bool $public
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[UseResource(ArmyListResource::class)]
#[Fillable(['display_name', 'army_list_type_id', 'faction_id', 'custom_max_points', 'public'])]
class ArmyList extends Model
{
    /** @use HasFactory<ArmyListFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<Unit, $this>
     */
    public function units(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class)->withPivot(['quantity', 'display_order'])->orderByPivot('display_order');
    }

    /**
     * @return BelongsTo<ArmyListType, $this>
     */
    public function armyListType(): BelongsTo
    {
        return $this->belongsTo(ArmyListType::class);
    }

    /**
     * @return BelongsTo<Faction, $this>
     */
    public function faction(): BelongsTo
    {
        return $this->belongsTo(Faction::class);
    }

    /**
     * @return BelongsToMany<Command, $this>
     */
    public function commands(): BelongsToMany
    {
        return $this->belongsToMany(Command::class, 'army_list_commands');
    }

    /**
     * @return Attribute<covariant int|null, never>
     */
    protected function maxPoints(): Attribute
    {
        return Attribute::get(fn (): ?int => $this->custom_max_points ?? $this->armyListType?->max_points);
    }

    protected static function booted()
    {
        static::creating(function ($m) {
            $m->uuid = Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
