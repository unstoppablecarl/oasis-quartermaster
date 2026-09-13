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
            'can' => [
                'update' => $canUpdate,
                'delete' => $canDelete,
            ],
        ];
    }
}
