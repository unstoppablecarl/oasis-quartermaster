<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class StoreArmyListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'display_name' => 'required|string|max:255',
            'army_list_type_id' => ['nullable', 'integer', 'exists:army_list_types,id'],
            'custom_max_points' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $hasArmyListType = $this->filled('army_list_type_id');
            $hasCustomMaxPoints = $this->filled('custom_max_points');

            if (! $hasArmyListType && ! $hasCustomMaxPoints) {
                $validator->errors()->add('custom_max_points', 'The custom max points field is required when no army list type is selected.');
            }

            if ($hasArmyListType && $hasCustomMaxPoints) {
                $validator->errors()->add('custom_max_points', 'The custom max points field must be empty when an army list type is selected.');
            }
        });
    }
}
