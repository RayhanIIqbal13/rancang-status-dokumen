<?php

namespace App\Http\Requests;

use App\Enums\DocumentStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateStatusTrackingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tahap' => ['required', new Enum(DocumentStatus::class)],
            'posisi_berkas' => ['required', 'string', 'max:255'],
            'catatan' => [
                Rule::requiredIf(fn () => $this->input('tahap') === DocumentStatus::PerluRevisi->value),
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    /**
     * Custom message for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'catatan.required' => 'Catatan revisi wajib diisi apabila status diubah menjadi Perlu Revisi.',
        ];
    }
}
