<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class ArmyListResource extends JsonResource
{
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
            'can' => [
                'update' => $canUpdate,
                'delete' => $canDelete,
            ],
        ];
    }
}
