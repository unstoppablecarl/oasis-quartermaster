<?php

namespace App\Http\Requests;

class UpdateArmyListRequest extends StoreArmyListRequest
{
    public function rules(): array
    {
        return parent::rules() + [
            'units' => ['array'],
            'units.*.id' => ['required', 'integer', 'exists:units,id'],
            'units.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
