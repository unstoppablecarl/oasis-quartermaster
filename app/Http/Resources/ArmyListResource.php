<?php

namespace App\Http\Resources;

use App\Models\ArmyListType;
use App\Models\Command;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;

/**
 * @property string $uuid
 * @property string $display_name
 * @property int|null $army_list_type_id
 * @property ArmyListType|null $armyListType
 * @property int|null $custom_max_points
 * @property int|null $maxPoints
 * @property bool $public
 * @property int $faction_id
 * @property Collection<int, Command> $commands
 * @property Collection<int, Unit> $units
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ArmyListResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $canUpdate = Gate::allows('update', $this->resource);
        $canDelete = Gate::allows('delete', $this->resource);

        return [
            'uuid' => $this->uuid,
            'display_name' => $this->display_name,
            'army_list_type_id' => $this->army_list_type_id,
            'army_list_type' => $this->whenLoaded('armyListType', fn () => $this->armyListType ? new ArmyListTypeResource($this->armyListType) : null),
            'custom_max_points' => $this->custom_max_points,
            'max_points' => $this->maxPoints,
            'public' => $this->public,
            'faction_id' => $this->faction_id,
            'commands' => $this->whenLoaded('commands', fn () => $this->commands->map(fn ($command) => [
                'id' => $command->id,
            ])),
            'units' => $this->whenLoaded('units', fn () => $this->units->map(fn ($unit) => [
                'id' => $unit->id,
                'quantity' => $unit->pivot->quantity,
            ])),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'can' => [
                'update' => $canUpdate,
                'delete' => $canDelete,
            ],
        ];
    }
}
