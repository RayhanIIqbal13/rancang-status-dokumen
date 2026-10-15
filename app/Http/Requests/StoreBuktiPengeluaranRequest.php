<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBuktiPengeluaranRequest extends FormRequest
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
            'standar_biaya_id' => ['nullable', 'exists:standar_biayas,id'],
            'jenis_bukti' => ['required', 'string', 'max:255'],
            'nominal' => ['required', 'numeric', 'min:0'],
            'file_digital' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'status_fisik' => ['nullable', 'string', 'max:100'],
            'status_validasi_sbm' => ['nullable', 'string', 'max:100'],
        ];
    }
}
