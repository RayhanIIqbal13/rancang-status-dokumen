<?php

namespace Database\Seeders;

use App\Models\StandarBiaya;
use Illuminate\Database\Seeder;

class StandarBiayaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $standards = [
            [
                'kategori' => 'Honorarium',
                'uraian_belanja' => 'Honorarium Narasumber / Pakar Eksternal',
                'satuan' => 'OJ (Orang / Jam)',
                'batas_tarif' => 900000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Honorarium',
                'uraian_belanja' => 'Honorarium Moderator Seminar / Workshop',
                'satuan' => 'OK (Orang / Kegiatan)',
                'batas_tarif' => 700000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Honorarium',
                'uraian_belanja' => 'Honorarium Panitia Pelaksana (Ketua/Sekretaris)',
                'satuan' => 'OK (Orang / Kegiatan)',
                'batas_tarif' => 450000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Perjalanan Dinas',
                'uraian_belanja' => 'Uang Harian Perjalanan Dinas Wilayah Jawa',
                'satuan' => 'OH (Orang / Hari)',
                'batas_tarif' => 430000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Perjalanan Dinas',
                'uraian_belanja' => 'Biaya Penginapan / Hotel Bintang 3',
                'satuan' => 'Hari / Kamar',
                'batas_tarif' => 750000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Konsumsi',
                'uraian_belanja' => 'Konsumsi Rapat / Kegiatan (Makan Berat)',
                'satuan' => 'Kotak / Porsi',
                'batas_tarif' => 48000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Konsumsi',
                'uraian_belanja' => 'Konsumsi Kudapan / Snack Rapat',
                'satuan' => 'Kotak / Porsi',
                'batas_tarif' => 22000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Akomodasi & Sarana',
                'uraian_belanja' => 'Sewa Gedung / Aula Pertemuan',
                'satuan' => 'Hari',
                'batas_tarif' => 2500000.00,
                'tahun' => 2026,
            ],
            [
                'kategori' => 'Transportasi',
                'uraian_belanja' => 'Transportasi Lokal Petugas / Peserta',
                'satuan' => 'Orang / PP',
                'batas_tarif' => 150000.00,
                'tahun' => 2026,
            ],
        ];

        foreach ($standards as $std) {
            StandarBiaya::updateOrCreate(
                [
                    'uraian_belanja' => $std['uraian_belanja'],
                    'tahun' => $std['tahun'],
                ],
                $std
            );
        }
    }
}
