<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDokumenPengajuanRequest extends FormRequest
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
            'nama_kegiatan' => ['required', 'string', 'max:255'],
            'jenis_anggaran' => ['required', 'string', 'max:100'],
            'uraian' => ['required', 'string'],
            'tgl_pelaksanaan' => ['required', 'date'],
            'total_usulan' => ['required', 'numeric', 'min:0'],
            'file_proposal' => ['nullable', 'file', 'mimes:pdf,doc,docx,zip', 'max:25600'],
        ];
    }

    /**
     * Custom error messages for validator.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama_kegiatan.required' => 'Nama kegiatan wajib diisi.',
            'jenis_anggaran.required' => 'Jenis anggaran wajib dipilih.',
            'uraian.required' => 'Uraian kegiatan dan target luaran wajib diisi.',
            'tgl_pelaksanaan.required' => 'Tanggal pelaksanaan kegiatan wajib ditentukan.',
            'total_usulan.required' => 'Estimasi total usulan biaya wajib diisi.',
            'total_usulan.numeric' => 'Estimasi total biaya harus berupa angka.',
            'file_proposal.file' => 'Berkas proposal yang diunggah tidak valid.',
            'file_proposal.mimes' => 'Format berkas proposal harus berupa PDF, DOCX, DOC, atau ZIP.',
            'file_proposal.max' => 'Ukuran berkas proposal tidak boleh melebihi 25 MB.',
        ];
    }

    /**
     * Custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nama_kegiatan' => 'Nama Kegiatan',
            'jenis_anggaran' => 'Jenis Anggaran',
            'uraian' => 'Uraian Kegiatan',
            'tgl_pelaksanaan' => 'Tanggal Pelaksanaan',
            'total_usulan' => 'Total Usulan Anggaran',
            'file_proposal' => 'File Dokumen Proposal & RAB',
        ];
    }
}
