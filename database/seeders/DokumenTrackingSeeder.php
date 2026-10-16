<?php

namespace Database\Seeders;

use App\Enums\DocumentStatus;
use App\Enums\UserRole;
use App\Models\BuktiPengeluaran;
use App\Models\DokumenPengajuan;
use App\Models\RealisasiAnggaran;
use App\Models\StandarBiaya;
use App\Models\StatusTracking;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DokumenTrackingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure representative users exist
        $applicant1 = User::updateOrCreate(
            ['email' => 'pengusul@univ.ac.id'],
            [
                'name' => 'Dr. Ahmad Hidayat, M.Kom.',
                'nip_nim' => '198507142010121002',
                'role' => UserRole::Pengusul,
                'unit' => 'Fakultas Ilmu Komputer (Prodi Informatika)',
                'password' => Hash::make('password'),
            ]
        );

        $applicant2 = User::updateOrCreate(
            ['email' => 'dosen.teknik@univ.ac.id'],
            [
                'name' => 'Dr. Eng. Siti Nurhaliza, S.T., M.T.',
                'nip_nim' => '198902112015042001',
                'role' => UserRole::Pengusul,
                'unit' => 'Fakultas Teknik (Teknik Elektro)',
                'password' => Hash::make('password'),
            ]
        );

        $financeStaff = User::updateOrCreate(
            ['email' => 'stafkeuangan@univ.ac.id'],
            [
                'name' => 'Siti Rahmawati, S.E.',
                'nip_nim' => '199003252014042001',
                'role' => UserRole::StafKeuangan,
                'unit' => 'Subbag Keuangan Fakultas Ilmu Komputer',
                'password' => Hash::make('password'),
            ]
        );

        $leader = User::updateOrCreate(
            ['email' => 'pimpinan@univ.ac.id'],
            [
                'name' => 'Prof. Dr. Ir. Bambang Sutrisno, M.Eng.',
                'nip_nim' => '196811201993031003',
                'role' => UserRole::Pimpinan,
                'unit' => 'Dekanat Fakultas Ilmu Komputer',
                'password' => Hash::make('password'),
            ]
        );

        $admin = User::updateOrCreate(
            ['email' => 'admin@univ.ac.id'],
            [
                'name' => 'Administrator Keuangan Pusat',
                'nip_nim' => '199201012018011001',
                'role' => UserRole::Admin,
                'unit' => 'Biro Perencanaan dan Keuangan',
                'password' => Hash::make('password'),
            ]
        );

        $sbmList = StandarBiaya::all()->keyBy('uraian_belanja');

        // Document 1: Diajukan (Stage 1)
        $doc1 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0001'],
            [
                'user_id' => $applicant1->id,
                'nama_kegiatan' => 'Seminar Nasional Kecerdasan Buatan dan Big Data 2026',
                'jenis_anggaran' => 'BOPTN (Bantuan Operasional PTN)',
                'uraian' => 'Penyelenggaraan seminar nasional tahunan bidang AI dengan menghadirkan 2 pakar industri dan 1 akademisi luar negeri.',
                'tgl_pelaksanaan' => now()->addMonths(2)->format('Y-m-d'),
                'total_usulan' => 18500000.00,
                'status_terkini' => DocumentStatus::Diajukan,
            ]
        );
        $doc1->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc1->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => DocumentStatus::Diajukan->description(),
            'waktu_update' => now()->subDays(2),
        ]);

        // Document 2: Verifikasi Fakultas (Stage 2)
        $doc2 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0002'],
            [
                'user_id' => $applicant2->id,
                'nama_kegiatan' => 'Workshop Pengembangan Kurikulum Berbasis Akreditasi Internasional IABEE',
                'jenis_anggaran' => 'PNBP Fakultas',
                'uraian' => 'Pelatihan dan lokakarya penyusunan RPS dan portofolio asesmen OBE untuk akreditasi IABEE prodi S1 Teknik Elektro.',
                'tgl_pelaksanaan' => now()->addWeeks(6)->format('Y-m-d'),
                'total_usulan' => 24000000.00,
                'status_terkini' => DocumentStatus::VerifikasiFakultas,
            ]
        );
        $doc2->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc2->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
            'waktu_update' => now()->subDays(4),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc2->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::VerifikasiFakultas,
            'posisi_berkas' => DocumentStatus::VerifikasiFakultas->defaultPosisiBerkas(),
            'catatan' => 'Berkas usulan lengkap. Sedang dicocokkan dengan pagu alokasi mata anggaran belanja PNBP Fakultas TA 2026.',
            'waktu_update' => now()->subDays(1),
        ]);

        // Document 3: Perlu Revisi (Stage 3 - with revision notes)
        $doc3 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0003'],
            [
                'user_id' => $applicant1->id,
                'nama_kegiatan' => 'Pengabdian Masyarakat: Literasi Digital dan IoT untuk UMKM Sentra Kerajinan',
                'jenis_anggaran' => 'Hibah Pengabdian Masyarakat',
                'uraian' => 'Pelatihan digital marketing dan pendampingan implementasi pencatatan pembukuan digital bagi 30 UMKM binaan fakultas.',
                'tgl_pelaksanaan' => now()->addMonth()->format('Y-m-d'),
                'total_usulan' => 15000000.00,
                'status_terkini' => DocumentStatus::PerluRevisi,
            ]
        );
        $doc3->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc3->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
            'waktu_update' => now()->subDays(6),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc3->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::VerifikasiFakultas,
            'posisi_berkas' => DocumentStatus::VerifikasiFakultas->defaultPosisiBerkas(),
            'catatan' => 'Pemeriksaan kepatuhan standar biaya masukan (SBM).',
            'waktu_update' => now()->subDays(4),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc3->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::PerluRevisi,
            'posisi_berkas' => DocumentStatus::PerluRevisi->defaultPosisiBerkas(),
            'catatan' => '1. Honorarium narasumber sebesar Rp 1.500.000/OJ melebihi batas SBM (maks. Rp 900.000/OJ). Mohon disesuaikan. 2. Lampirkan lembar persetujuan Kepala Departemen yang telah bertanda tangan.',
            'waktu_update' => now()->subDays(2),
        ]);

        // Document 4: Menunggu SK / Penetapan Universitas (Stage 4)
        $doc4 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0004'],
            [
                'user_id' => $applicant2->id,
                'nama_kegiatan' => 'Kolaborasi Riset Internasional dan Publikasi Terindeks Scopus Q1',
                'jenis_anggaran' => 'Dana Riset & Publikasi',
                'uraian' => 'Riset bersama University of Tokyo mengenai algoritma kompresi sinyal IoT dan penerbitan paper pada jurnal bereputasi.',
                'tgl_pelaksanaan' => now()->addMonths(3)->format('Y-m-d'),
                'total_usulan' => 45000000.00,
                'status_terkini' => DocumentStatus::MenungguSK,
            ]
        );
        $doc4->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc4->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
            'waktu_update' => now()->subDays(10),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc4->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::VerifikasiFakultas,
            'posisi_berkas' => DocumentStatus::VerifikasiFakultas->defaultPosisiBerkas(),
            'catatan' => 'Verifikasi fakultas selesai, berkas dinyatakan lengkap dan valid sesuai SBM.',
            'waktu_update' => now()->subDays(8),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc4->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::MenungguSK,
            'posisi_berkas' => DocumentStatus::MenungguSK->defaultPosisiBerkas(),
            'catatan' => 'Berkas pengajuan riset telah diteruskan ke Biro Perencanaan dan Keuangan Universitas untuk penerbitan SK Rektor.',
            'waktu_update' => now()->subDays(5),
        ]);

        // Document 5: Disetujui, Kegiatan Berjalan (Stage 5)
        $doc5 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0005'],
            [
                'user_id' => $applicant1->id,
                'nama_kegiatan' => 'Bootcamp Pemrograman Web Fullstack Mahasiswa Berprestasi 2026',
                'jenis_anggaran' => 'Kegiatan Kemahasiswaan',
                'uraian' => 'Pelatihan intensif 5 hari persiapan lomba gemastik divisi pengembangan aplikasi perangkat lunak.',
                'tgl_pelaksanaan' => now()->subDays(1)->format('Y-m-d'),
                'total_usulan' => 12500000.00,
                'status_terkini' => DocumentStatus::Disetujui,
            ]
        );
        $doc5->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc5->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
            'waktu_update' => now()->subDays(14),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc5->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::VerifikasiFakultas,
            'posisi_berkas' => DocumentStatus::VerifikasiFakultas->defaultPosisiBerkas(),
            'catatan' => 'Kelengkapan dokumen dan RAB telah diverifikasi sesuai SBM.',
            'waktu_update' => now()->subDays(12),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc5->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::MenungguSK,
            'posisi_berkas' => DocumentStatus::MenungguSK->defaultPosisiBerkas(),
            'catatan' => 'Diteruskan ke Dekanat untuk persetujuan penetapan kegiatan.',
            'waktu_update' => now()->subDays(10),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc5->id,
            'user_id' => $leader->id,
            'tahap' => DocumentStatus::Disetujui,
            'posisi_berkas' => DocumentStatus::Disetujui->defaultPosisiBerkas(),
            'catatan' => 'SK Dekan No. 412/UN.FILKOM/SK/2026 telah terbit. Alokasi disetujui, pengusul dipersilakan melaksanakan kegiatan.',
            'waktu_update' => now()->subDays(7),
        ]);

        // Document 6: SPJ Diterima & Diverifikasi (Stage 6)
        $doc6 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0006'],
            [
                'user_id' => $applicant2->id,
                'nama_kegiatan' => 'Kuliah Tamu Praktisi Industri Telekomunikasi 5G & Smart Grid',
                'jenis_anggaran' => 'BOPTN (Bantuan Operasional PTN)',
                'uraian' => 'Menghadirkan VP Network Infrastructure Telkomsel untuk kuliah tamu mahasiswa tingkat akhir.',
                'tgl_pelaksanaan' => now()->subWeeks(2)->format('Y-m-d'),
                'total_usulan' => 8500000.00,
                'status_terkini' => DocumentStatus::SpjDiverifikasi,
            ]
        );
        $doc6->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc6->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
            'waktu_update' => now()->subDays(25),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc6->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::VerifikasiFakultas,
            'posisi_berkas' => DocumentStatus::VerifikasiFakultas->defaultPosisiBerkas(),
            'catatan' => 'Verifikasi fakultas tuntas.',
            'waktu_update' => now()->subDays(23),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc6->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::MenungguSK,
            'posisi_berkas' => DocumentStatus::MenungguSK->defaultPosisiBerkas(),
            'catatan' => 'Proses penerbitan surat tugas dan alokasi dana.',
            'waktu_update' => now()->subDays(21),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc6->id,
            'user_id' => $leader->id,
            'tahap' => DocumentStatus::Disetujui,
            'posisi_berkas' => DocumentStatus::Disetujui->defaultPosisiBerkas(),
            'catatan' => 'Kegiatan disetujui, silakan dilaksanakan sesuai jadwal.',
            'waktu_update' => now()->subDays(18),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc6->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::SpjDiverifikasi,
            'posisi_berkas' => DocumentStatus::SpjDiverifikasi->defaultPosisiBerkas(),
            'catatan' => 'Bukti SPJ (kuitansi, daftar hadir, dokumentasi foto) telah diterima di Subbag Keuangan dan sedang diperiksa kelengkapannya.',
            'waktu_update' => now()->subDays(3),
        ]);

        // Add expense proofs for doc6
        $doc6->buktiPengeluarans()->delete();
        BuktiPengeluaran::create([
            'dokumen_pengajuan_id' => $doc6->id,
            'standar_biaya_id' => $sbmList['Honorarium Narasumber / Pakar Eksternal']->id ?? null,
            'jenis_bukti' => 'Kuitansi Honorarium Narasumber (3 Jam)',
            'nominal' => 2700000.00,
            'status_fisik' => 'Lengkap & Asli',
            'status_validasi_sbm' => 'Sesuai SBM',
        ]);
        BuktiPengeluaran::create([
            'dokumen_pengajuan_id' => $doc6->id,
            'standar_biaya_id' => $sbmList['Konsumsi Rapat / Kegiatan (Makan Berat)']->id ?? null,
            'jenis_bukti' => 'Faktur / Nota Konsumsi Makan Siang (100 Porsi)',
            'nominal' => 4800000.00,
            'status_fisik' => 'Lengkap & Asli',
            'status_validasi_sbm' => 'Sesuai SBM',
        ]);

        // Document 7: Diproses di SAKTI (Stage 7)
        $doc7 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0007'],
            [
                'user_id' => $applicant1->id,
                'nama_kegiatan' => 'Sertifikasi Kompetensi Cloud Computing AWS Mahasiswa',
                'jenis_anggaran' => 'RKA-K/L Universitas',
                'uraian' => 'Program sertifikasi internasional AWS Certified Cloud Practitioner untuk 40 mahasiswa berprestasi.',
                'tgl_pelaksanaan' => now()->subWeeks(3)->format('Y-m-d'),
                'total_usulan' => 32000000.00,
                'status_terkini' => DocumentStatus::DiprosesSakti,
            ]
        );
        $doc7->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc7->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
            'waktu_update' => now()->subDays(30),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc7->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::VerifikasiFakultas,
            'posisi_berkas' => DocumentStatus::VerifikasiFakultas->defaultPosisiBerkas(),
            'catatan' => 'Verifikasi fakultas tuntas.',
            'waktu_update' => now()->subDays(28),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc7->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::MenungguSK,
            'posisi_berkas' => DocumentStatus::MenungguSK->defaultPosisiBerkas(),
            'catatan' => 'SK penetapan dari pimpinan.',
            'waktu_update' => now()->subDays(26),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc7->id,
            'user_id' => $leader->id,
            'tahap' => DocumentStatus::Disetujui,
            'posisi_berkas' => DocumentStatus::Disetujui->defaultPosisiBerkas(),
            'catatan' => 'Disetujui dan kegiatan berjalan.',
            'waktu_update' => now()->subDays(23),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc7->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::SpjDiverifikasi,
            'posisi_berkas' => DocumentStatus::SpjDiverifikasi->defaultPosisiBerkas(),
            'catatan' => 'SPJ lengkap diverifikasi 100%.',
            'waktu_update' => now()->subDays(10),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc7->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::DiprosesSakti,
            'posisi_berkas' => DocumentStatus::DiprosesSakti->defaultPosisiBerkas(),
            'catatan' => 'Data tagihan telah diinput ke aplikasi SAKTI Kemenkeu (No. SPP: 00412/2026) dan menunggu validasi PPK/BPP.',
            'waktu_update' => now()->subDays(2),
        ]);

        // Document 8: Dana Cair (Stage 8 - Complete)
        $doc8 = DokumenPengajuan::updateOrCreate(
            ['nomor_pengajuan' => 'PROP/2026/0008'],
            [
                'user_id' => $applicant1->id,
                'nama_kegiatan' => 'Penyusunan Rencana Strategis (Renstra) Penelitian Fakultas 2026-2030',
                'jenis_anggaran' => 'BOPTN (Bantuan Operasional PTN)',
                'uraian' => 'Konsinyering 3 hari perumusan indikator kinerja utama riset dan peta jalan publikasi fakultas.',
                'tgl_pelaksanaan' => now()->subMonth()->format('Y-m-d'),
                'total_usulan' => 28500000.00,
                'status_terkini' => DocumentStatus::DanaCair,
            ]
        );
        $doc8->statusTrackings()->delete();
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'user_id' => null,
            'tahap' => DocumentStatus::Diajukan,
            'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
            'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
            'waktu_update' => now()->subDays(45),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::VerifikasiFakultas,
            'posisi_berkas' => DocumentStatus::VerifikasiFakultas->defaultPosisiBerkas(),
            'catatan' => 'Verifikasi fakultas tuntas.',
            'waktu_update' => now()->subDays(42),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::MenungguSK,
            'posisi_berkas' => DocumentStatus::MenungguSK->defaultPosisiBerkas(),
            'catatan' => 'Penerbitan SK Tim Perumus Renstra.',
            'waktu_update' => now()->subDays(39),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'user_id' => $leader->id,
            'tahap' => DocumentStatus::Disetujui,
            'posisi_berkas' => DocumentStatus::Disetujui->defaultPosisiBerkas(),
            'catatan' => 'SK Dekan No. 201/UN.FILKOM/2026 terbit.',
            'waktu_update' => now()->subDays(35),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::SpjDiverifikasi,
            'posisi_berkas' => DocumentStatus::SpjDiverifikasi->defaultPosisiBerkas(),
            'catatan' => 'Dokumen SPJ dan fisik kuitansi telah diperiksa lengkap.',
            'waktu_update' => now()->subDays(15),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::DiprosesSakti,
            'posisi_berkas' => DocumentStatus::DiprosesSakti->defaultPosisiBerkas(),
            'catatan' => 'Penerbitan SP2D melalui sistem SAKTI.',
            'waktu_update' => now()->subDays(8),
        ]);
        StatusTracking::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'user_id' => $financeStaff->id,
            'tahap' => DocumentStatus::DanaCair,
            'posisi_berkas' => DocumentStatus::DanaCair->defaultPosisiBerkas(),
            'catatan' => 'Realisasi pencairan dana telah ditransfer via SP2D Bank Mandiri No. TRF/2026/0892 ke rekening pengusul. Siklus pencairan selesai.',
            'waktu_update' => now()->subDays(3),
        ]);

        // Realisasi Anggaran for doc8
        RealisasiAnggaran::updateOrCreate(
            ['dokumen_pengajuan_id' => $doc8->id],
            [
                'total_realisasi' => 28150000.00,
                'tgl_pencairan' => now()->subDays(3)->format('Y-m-d'),
                'status_pencairan' => 'Dana Cair (SP2D Selesai)',
                'draf_rekap_spj' => 'SPJ lengkap 100% senilai Rp 28.150.000 (Sisa saldo pagu dikembalikan ke kas negara senilai Rp 350.000).',
            ]
        );

        // Bukti pengeluaran for doc8
        $doc8->buktiPengeluarans()->delete();
        BuktiPengeluaran::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'standar_biaya_id' => $sbmList['Sewa Gedung / Aula Pertemuan']->id ?? null,
            'jenis_bukti' => 'Invoice Sewa Aula Konsinyering Hotel',
            'nominal' => 7500000.00,
            'status_fisik' => 'Lengkap & Asli',
            'status_validasi_sbm' => 'Sesuai SBM',
        ]);
        BuktiPengeluaran::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'standar_biaya_id' => $sbmList['Konsumsi Rapat / Kegiatan (Makan Berat)']->id ?? null,
            'jenis_bukti' => 'Kuitansi Konsumsi 3 Hari (Fullboard)',
            'nominal' => 12650000.00,
            'status_fisik' => 'Lengkap & Asli',
            'status_validasi_sbm' => 'Sesuai SBM',
        ]);
        BuktiPengeluaran::create([
            'dokumen_pengajuan_id' => $doc8->id,
            'standar_biaya_id' => $sbmList['Honorarium Panitia Pelaksana (Ketua/Sekretaris)']->id ?? null,
            'jenis_bukti' => 'Daftar Penerimaan Honorarium Tim Perumus',
            'nominal' => 8000000.00,
            'status_fisik' => 'Lengkap & Asli',
            'status_validasi_sbm' => 'Sesuai SBM',
        ]);

        // 3. Seed realistic document batch across the last 90 days (July to October 2026)
        $batch = [
            ['PROP/2026/0009', $applicant1->id, 'Pengembangan Smart Campus IoT Sensor Node & Gateway Kampus Terpadu', 'BOPTN (Bantuan Operasional PTN)', 'Implementasi jaringan sensor node pengukur suhu, kelembaban, dan polusi udara kampus terpadu.', 82, 34000000.00, DocumentStatus::DanaCair],
            ['PROP/2026/0010', $applicant2->id, 'Publikasi Ilmiah Bereputasi Internasional Bidang Renewable Energy', 'Dana Riset & Publikasi', 'Bantuan publikasi jurnal Q1 bereputasi tinggi IEEE Transactions on Sustainable Energy.', 78, 50000000.00, DocumentStatus::DanaCair],
            ['PROP/2026/0011', $applicant1->id, 'Workshop Penulisan Buku Ajar dan Hak Kekayaan Intelektual (HKI)', 'PNBP Fakultas', 'Pelatihan dan pendampingan 25 dosen dalam mendaftarkan hak cipta modul ajar ke DJKI Kemenkumham.', 75, 16500000.00, DocumentStatus::DanaCair],
            ['PROP/2026/0012', $applicant2->id, 'Pengadaan Lisensi Software Simulasi MATLAB & ANSYS Laboratorium Komputasi', 'RKA-K/L Universitas', 'Perpanjangan lisensi tahunan campus-wide software engineering & computation 2026/2027.', 71, 68000000.00, DocumentStatus::DanaCair],
            ['PROP/2026/0013', $applicant1->id, 'Bimbingan Teknis Akreditasi Unggul LAM-INFOKOM Program Studi Informatika', 'PNBP Fakultas', 'Konsinyering 3 hari asesmen lapangan dan penyusunan LED/LKPS bersama asesor eksternal.', 66, 22000000.00, DocumentStatus::DiprosesSakti],
            ['PROP/2026/0014', $applicant2->id, 'Seminar Internasional IEEE International Conference on Cybernetics and Robotics', 'BOPTN (Bantuan Operasional PTN)', 'Sponsorship dan delegasi 5 paper dosen pada konferensi internasional di Bali.', 62, 42000000.00, DocumentStatus::DiprosesSakti],
            ['PROP/2026/0015', $applicant1->id, 'Penyelenggaraan Expo Kewirausahaan Mahasiswa dan Inkubator Bisnis', 'Kegiatan Kemahasiswaan', 'Pameran 40 produk tenant inovasi startup mahasiswa fakultas.', 57, 27500000.00, DocumentStatus::SpjDiverifikasi],
            ['PROP/2026/0016', $applicant1->id, 'Peningkatan Kapasitas Laboratorium Jaringan Komputer dan Keamanan Siber', 'RKA-K/L Universitas', 'Pengadaan rack server, firewall appliance, dan switch managed Cisco 48-port.', 53, 85000000.00, DocumentStatus::SpjDiverifikasi],
            ['PROP/2026/0017', $applicant2->id, 'Riset Terapan Baterai Kendaraan Listrik dan Sistem Manajemen Energi', 'Dana Riset & Publikasi', 'Pengujian siklus pengisian cepat modul baterai LiFePO4 untuk prototipe mobil listrik kampus.', 49, 75000000.00, DocumentStatus::Disetujui],
            ['PROP/2026/0018', $applicant2->id, 'Pengabdian Masyarakat: Pengolahan Sampah Organik Menjadi Biogas di Desa Binaan', 'Hibah Pengabdian Masyarakat', 'Instalasi reaktor biodigester portabel 500L dan pelatihan kelompok tani desa binaan.', 46, 19500000.00, DocumentStatus::Disetujui],
            ['PROP/2026/0019', $applicant1->id, 'Kuliah Pakar Internasional Data Science & Quantum Computing', 'BOPTN (Bantuan Operasional PTN)', 'Kuliah tamu hybrid dengan pemateri Principal AI Researcher dari NUS Singapura.', 43, 14000000.00, DocumentStatus::Disetujui],
            ['PROP/2026/0020', $applicant1->id, 'Penyusunan Kurikulum Program MBKM Magang Industri Bersertifikat', 'PNBP Fakultas', 'FGD kurikulum kemitraan bersama 8 perusahaan teknologi dan BUMN mitra kampus.', 40, 18000000.00, DocumentStatus::Disetujui],
            ['PROP/2026/0021', $applicant2->id, 'Pelatihan Asesor Penjaminan Mutu Internal (SPMI) Fakultas', 'PNBP Fakultas', 'Penyegaran dan sertifikasi 15 auditor mutu internal tingkat fakultas.', 36, 13500000.00, DocumentStatus::MenungguSK],
            ['PROP/2026/0022', $applicant1->id, 'Pengembangan Platform E-Learning Terintegrasi Single Sign-On (SSO)', 'RKA-K/L Universitas', 'Integrasi Moodle LMS fakultas dengan identity provider Google Workspace dan SIAKAD.', 33, 39000000.00, DocumentStatus::MenungguSK],
            ['PROP/2026/0023', $applicant2->id, 'Program Kreativitas Mahasiswa (PKM) Nasional Menuju PIMNAS 2026', 'Kegiatan Kemahasiswaan', 'Pendampingan intensif reviewer nasional bagi 12 proposal lolos pendanaan Dikti.', 29, 25000000.00, DocumentStatus::MenungguSK],
            ['PROP/2026/0024', $applicant2->id, 'Pengadaan Peralatan Praktikum Microcontroller & Robotics', 'RKA-K/L Universitas', 'Pembelian 30 kit STM32 ARM Cortex-M4 dan komponen modul sensor aktuator.', 25, 55000000.00, DocumentStatus::PerluRevisi],
            ['PROP/2026/0025', $applicant2->id, 'Konferensi Nasional Pendidikan Teknik Elektro dan Informatika', 'PNBP Fakultas', 'Penyelenggaraan simposium nasional kurikulum pendidikan vokasi dan sarjana teknik.', 22, 21000000.00, DocumentStatus::PerluRevisi],
            ['PROP/2026/0026', $applicant1->id, 'Uji Sertifikasi Kompetensi Profesi Analis Sistem dan Data', 'BOPTN (Bantuan Operasional PTN)', 'Pelaksanaan uji kompetensi BNSP skema Associate Data Scientist bagi 35 mahasiswa.', 18, 31500000.00, DocumentStatus::VerifikasiFakultas],
            ['PROP/2026/0027', $applicant1->id, 'Workshop Penulisan Proposal Hibah Kedaireka Matching Fund 2026', 'PNBP Fakultas', 'Coaching clinic penajaman kemitraan DUDI dan anggaran RAB hibah Matching Fund.', 15, 15000000.00, DocumentStatus::VerifikasiFakultas],
            ['PROP/2026/0028', $applicant2->id, 'Rintisan Kerja Sama Riset Transisi Energi dengan Institut Teknologi Bandung', 'Dana Riset & Publikasi', 'Kunjungan kerja saintifik dan penandatanganan MoA joint research konsorsium energi bersih.', 12, 29000000.00, DocumentStatus::VerifikasiFakultas],
            ['PROP/2026/0029', $applicant1->id, 'Pengembangan Sistem Repository Arsip Riset Dosen dan Tugas Akhir', 'RKA-K/L Universitas', 'Instalasi server DSpace dan digitalisasi berkas tugas akhir mahasiswa prodi.', 9, 26000000.00, DocumentStatus::Diajukan],
            ['PROP/2026/0030', $applicant1->id, 'Seminar Karir dan Job Fair Industri Teknologi Informasi 2026', 'Kegiatan Kemahasiswaan', 'Penyelenggaraan bursa kerja khusus IT menghadirkan 20 startup dan corporate partners.', 6, 20000000.00, DocumentStatus::Diajukan],
            ['PROP/2026/0031', $applicant2->id, 'Pengadaan Perangkat VR/AR untuk Laboratorium Interaksi Manusia dan Komputer', 'RKA-K/L Universitas', 'Pembelian 4 unit headset Meta Quest 3 dan workstation GPU RTX 4080.', 3, 62000000.00, DocumentStatus::Diajukan],
            ['PROP/2026/0032', $applicant1->id, 'Penyusunan Evaluasi Kinerja Dosen dan Rencana Kerja Tahunan 2027', 'PNBP Fakultas', 'Rapat kerja penyusunan target IKU fakultas dan penetapan rencana program 2027.', 1, 17500000.00, DocumentStatus::Diajukan],
        ];

        foreach ($batch as [$no, $userId, $title, $budgetType, $desc, $daysAgo, $total, $finalStatus]) {
            $createdTime = now()->subDays($daysAgo)->setTime(rand(8, 16), rand(0, 59));
            $doc = DokumenPengajuan::updateOrCreate(
                ['nomor_pengajuan' => $no],
                [
                    'user_id' => $userId,
                    'nama_kegiatan' => $title,
                    'jenis_anggaran' => $budgetType,
                    'uraian' => $desc,
                    'tgl_pelaksanaan' => now()->addWeeks(rand(2, 10))->format('Y-m-d'),
                    'total_usulan' => $total,
                    'status_terkini' => $finalStatus,
                    'created_at' => $createdTime,
                    'updated_at' => $createdTime,
                ]
            );

            $doc->statusTrackings()->delete();

            // Always add Stage 1 (Diajukan)
            StatusTracking::create([
                'dokumen_pengajuan_id' => $doc->id,
                'user_id' => null,
                'tahap' => DocumentStatus::Diajukan,
                'posisi_berkas' => DocumentStatus::Diajukan->defaultPosisiBerkas(),
                'catatan' => 'Usulan dan berkas proposal telah diajukan pengusul.',
                'waktu_update' => $createdTime,
            ]);

            // Add intermediate stages based on final status
            $stagesProgression = [
                DocumentStatus::VerifikasiFakultas,
                DocumentStatus::MenungguSK,
                DocumentStatus::Disetujui,
                DocumentStatus::SpjDiverifikasi,
                DocumentStatus::DiprosesSakti,
                DocumentStatus::DanaCair,
            ];

            $order = $finalStatus->order();
            $stepDays = max(1, (int) ($daysAgo / max(1, $order)));

            foreach ($stagesProgression as $idx => $stg) {
                if ($stg->order() <= $order) {
                    $trackingTime = (clone $createdTime)->addDays(($idx + 1) * $stepDays);
                    if ($trackingTime->isFuture()) {
                        $trackingTime = now()->subHours(rand(1, 12));
                    }
                    StatusTracking::create([
                        'dokumen_pengajuan_id' => $doc->id,
                        'user_id' => $stg->order() >= 5 ? $leader->id : $financeStaff->id,
                        'tahap' => $stg,
                        'posisi_berkas' => $stg->defaultPosisiBerkas(),
                        'catatan' => $stg->description(),
                        'waktu_update' => $trackingTime,
                    ]);
                }
            }

            // If stage is DanaCair, create realisasi
            if ($finalStatus === DocumentStatus::DanaCair) {
                RealisasiAnggaran::updateOrCreate(
                    ['dokumen_pengajuan_id' => $doc->id],
                    [
                        'total_realisasi' => $total,
                        'tgl_pencairan' => now()->subDays(rand(1, 10))->format('Y-m-d'),
                        'status_pencairan' => 'Dana Cair (SP2D Selesai)',
                        'draf_rekap_spj' => 'SPJ lengkap 100% senilai Rp '.number_format($total, 0, ',', '.').' telah diverifikasi.',
                    ]
                );
            }
        }
    }
}
