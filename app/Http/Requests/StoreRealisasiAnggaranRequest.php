<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRealisasiAnggaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'total_realisasi' => ['required', 'numeric', 'min:0'],
            'tgl_pencairan' => ['nullable', 'date'],
            'status_pencairan' => ['required', 'string', 'max:100'],
            'draf_rekap_spj' => ['nullable', 'string'],
        ];
    }
}
