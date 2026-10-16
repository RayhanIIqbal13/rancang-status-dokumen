<?php

use App\Enums\DocumentStatus;
use App\Enums\UserRole;
use App\Models\BuktiPengeluaran;
use App\Models\DokumenPengajuan;
use App\Models\StandarBiaya;
use App\Models\StatusTracking;
use App\Models\User;

beforeEach(function () {
    $this->applicant = User::factory()->create([
        'name' => 'Dr. Ahmad Hidayat',
        'role' => UserRole::Pengusul,
        'unit' => 'Fakultas Ilmu Komputer',
    ]);

    $this->financeStaff = User::factory()->create([
        'name' => 'Siti Rahmawati, S.E.',
        'role' => UserRole::StafKeuangan,
        'unit' => 'Subbag Keuangan Fakultas',
    ]);

    $this->leader = User::factory()->create([
        'name' => 'Prof. Dr. Bambang Sutrisno',
        'role' => UserRole::Pimpinan,
        'unit' => 'Dekanat',
    ]);
});

test('applicant can submit a new document proposal and system automatically initializes stage 1 Diajukan', function () {
    $payload = [
        'nama_kegiatan' => 'Seminar Riset AI 2026',
        'jenis_anggaran' => 'BOPTN (Bantuan Operasional PTN)',
        'uraian' => 'Penyelenggaraan seminar riset tingkat nasional.',
        'tgl_pelaksanaan' => now()->addDays(30)->format('Y-m-d'),
        'total_usulan' => 25000000,
    ];

    $response = $this->actingAs($this->applicant)
        ->post(route('dokumen-pengajuan.store'), $payload);

    $document = DokumenPengajuan::where('nama_kegiatan', 'Seminar Riset AI 2026')->first();

    expect($document)->not->toBeNull();
    expect($document->status_terkini)->toBe(DocumentStatus::Diajukan);
    expect($document->user_id)->toBe($this->applicant->id);

    // Initial StatusTracking must be automatically created by the system
    $firstTracking = StatusTracking::where('dokumen_pengajuan_id', $document->id)->first();
    expect($firstTracking)->not->toBeNull();
    expect($firstTracking->tahap)->toBe(DocumentStatus::Diajukan);
    expect($firstTracking->posisi_berkas)->toBe('Subbag Keuangan Fakultas');
    expect($firstTracking->user_id)->toBeNull(); // Automatically set by System
    expect($firstTracking->updater_name)->toBe('Sistem (Otomatis)');

    $response->assertRedirect(route('dokumen-pengajuan.show', $document));
});

test('applicant can view their own document details and status timeline', function () {
    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9991',
        'nama_kegiatan' => 'Pelatihan Mahasiswa',
        'jenis_anggaran' => 'PNBP Fakultas',
        'uraian' => 'Pelatihan intensif bidang data science.',
        'tgl_pelaksanaan' => now()->addDays(14)->format('Y-m-d'),
        'total_usulan' => 10000000,
        'status_terkini' => DocumentStatus::Diajukan,
    ]);

    StatusTracking::create([
        'dokumen_pengajuan_id' => $document->id,
        'user_id' => null,
        'tahap' => DocumentStatus::Diajukan,
        'posisi_berkas' => 'Subbag Keuangan Fakultas',
        'catatan' => 'Usulan dan proposal telah dikirim pengusul.',
        'waktu_update' => now(),
    ]);

    $response = $this->actingAs($this->applicant)
        ->get(route('dokumen-pengajuan.show', $document));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dokumen/show')
        ->has('document')
        ->has('stages')
        ->where('document.id', $document->id)
        ->where('document.status_terkini', DocumentStatus::Diajukan->value)
    );
});

test('finance staff can update status to Verifikasi Fakultas and record history', function () {
    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9992',
        'nama_kegiatan' => 'Workshop Kurikulum',
        'jenis_anggaran' => 'BOPTN',
        'uraian' => 'Uraian kegiatan workshop.',
        'tgl_pelaksanaan' => now()->addDays(20)->format('Y-m-d'),
        'total_usulan' => 15000000,
        'status_terkini' => DocumentStatus::Diajukan,
    ]);

    $response = $this->actingAs($this->financeStaff)
        ->post(route('dokumen-pengajuan.status.store', $document), [
            'tahap' => DocumentStatus::VerifikasiFakultas->value,
            'posisi_berkas' => 'Subbag Keuangan Fakultas',
            'catatan' => 'Kelengkapan dan kepatuhan SBM sedang diperiksa.',
        ]);

    $response->assertSessionHasNoErrors();
    $document->refresh();

    expect($document->status_terkini)->toBe(DocumentStatus::VerifikasiFakultas);

    $latestTracking = $document->latestStatusTracking;
    expect($latestTracking->tahap)->toBe(DocumentStatus::VerifikasiFakultas);
    expect($latestTracking->user_id)->toBe($this->financeStaff->id);
    expect($latestTracking->updater_name)->toBe($this->financeStaff->name);
    expect($latestTracking->catatan)->toBe('Kelengkapan dan kepatuhan SBM sedang diperiksa.');
});

test('updating to Perlu Revisi requires revision notes', function () {
    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9993',
        'nama_kegiatan' => 'Seminar Bisnis',
        'jenis_anggaran' => 'PNBP',
        'uraian' => 'Seminar kewirausahaan.',
        'tgl_pelaksanaan' => now()->addDays(25)->format('Y-m-d'),
        'total_usulan' => 8000000,
        'status_terkini' => DocumentStatus::VerifikasiFakultas,
    ]);

    // Attempt to set Perlu Revisi without notes
    $response = $this->actingAs($this->financeStaff)
        ->from(route('dokumen-pengajuan.show', $document))
        ->post(route('dokumen-pengajuan.status.store', $document), [
            'tahap' => DocumentStatus::PerluRevisi->value,
            'posisi_berkas' => 'Pengusul',
            'catatan' => '',
        ]);

    $response->assertSessionHasErrors(['catatan']);

    // Attempt with valid revision notes
    $validResponse = $this->actingAs($this->financeStaff)
        ->post(route('dokumen-pengajuan.status.store', $document), [
            'tahap' => DocumentStatus::PerluRevisi->value,
            'posisi_berkas' => 'Pengusul',
            'catatan' => 'Honor narasumber melebihi batas tarif SBM 2026. Mohon disesuaikan.',
        ]);

    $validResponse->assertSessionHasNoErrors();
    $document->refresh();
    expect($document->status_terkini)->toBe(DocumentStatus::PerluRevisi);
    expect($document->latestStatusTracking->catatan)->toBe('Honor narasumber melebihi batas tarif SBM 2026. Mohon disesuaikan.');
});

test('applicant cannot set staff-restricted stages', function () {
    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9994',
        'nama_kegiatan' => 'Kegiatan Mandiri',
        'jenis_anggaran' => 'BOPTN',
        'uraian' => 'Uraian pengajuan.',
        'tgl_pelaksanaan' => now()->addDays(30)->format('Y-m-d'),
        'total_usulan' => 5000000,
        'status_terkini' => DocumentStatus::Diajukan,
    ]);

    // Applicant tries to approve their own document directly
    $response = $this->actingAs($this->applicant)
        ->post(route('dokumen-pengajuan.status.store', $document), [
            'tahap' => DocumentStatus::DanaCair->value,
            'posisi_berkas' => 'Bendahara',
        ]);

    // Authorization check fails (either 403 or validation error based on role)
    expect($response->status())->toBeIn([403, 302]);
    if ($response->status() === 302) {
        $response->assertSessionHasErrors('tahap');
    }
});

test('pimpinan can approve document to Disetujui, Kegiatan Berjalan', function () {
    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9995',
        'nama_kegiatan' => 'Konferensi Internasional',
        'jenis_anggaran' => 'RKA-K/L',
        'uraian' => 'Konferensi internasional tahunan.',
        'tgl_pelaksanaan' => now()->addMonths(1)->format('Y-m-d'),
        'total_usulan' => 30000000,
        'status_terkini' => DocumentStatus::MenungguSK,
    ]);

    $response = $this->actingAs($this->leader)
        ->post(route('dokumen-pengajuan.status.store', $document), [
            'tahap' => DocumentStatus::Disetujui->value,
            'posisi_berkas' => 'Pelaksana Kegiatan / Pengusul',
            'catatan' => 'SK Dekan terbit, alokasi dana disetujui.',
        ]);

    $response->assertSessionHasNoErrors();
    $document->refresh();
    expect($document->status_terkini)->toBe(DocumentStatus::Disetujui);
});

test('applicant can resubmit revision when document is in Perlu Revisi status', function () {
    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9996',
        'nama_kegiatan' => 'Revisi Usulan Pengabdian',
        'jenis_anggaran' => 'Hibah Pengabdian Masyarakat',
        'uraian' => 'Uraian pengabdian.',
        'tgl_pelaksanaan' => now()->addDays(20)->format('Y-m-d'),
        'total_usulan' => 12000000,
        'status_terkini' => DocumentStatus::PerluRevisi,
    ]);

    StatusTracking::create([
        'dokumen_pengajuan_id' => $document->id,
        'user_id' => $this->financeStaff->id,
        'tahap' => DocumentStatus::PerluRevisi,
        'posisi_berkas' => 'Pengusul',
        'catatan' => 'Mohon sesuaikan RAB honorarium.',
        'waktu_update' => now(),
    ]);

    $response = $this->actingAs($this->applicant)
        ->post(route('dokumen-pengajuan.status.store', $document), [
            'tahap' => DocumentStatus::VerifikasiFakultas->value,
            'posisi_berkas' => 'Subbag Keuangan Fakultas',
            'catatan' => 'RAB honorarium telah disesuaikan dengan SBM 2026.',
        ]);

    $response->assertSessionHasNoErrors();
    $document->refresh();
    expect($document->status_terkini)->toBe(DocumentStatus::VerifikasiFakultas);
});

test('expense proofs can be added and validated against Standar Biaya Masukan', function () {
    $sbm = StandarBiaya::create([
        'kategori' => 'Konsumsi',
        'uraian_belanja' => 'Makan Siang Rapat',
        'satuan' => 'Porsi',
        'batas_tarif' => 48000.00,
        'tahun' => 2026,
    ]);

    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9997',
        'nama_kegiatan' => 'Kegiatan Konsumsi SPJ',
        'jenis_anggaran' => 'BOPTN',
        'uraian' => 'Konsumsi kegiatan.',
        'tgl_pelaksanaan' => now()->subDays(5)->format('Y-m-d'),
        'total_usulan' => 5000000,
        'status_terkini' => DocumentStatus::SpjDiverifikasi,
    ]);

    $response = $this->actingAs($this->financeStaff)
        ->post(route('dokumen-pengajuan.bukti-pengeluaran.store', $document), [
            'standar_biaya_id' => $sbm->id,
            'jenis_bukti' => 'Kuitansi Makan Siang (100 Porsi)',
            'nominal' => 45000.00, // Under SBM limit (48000)
            'status_fisik' => 'Lengkap & Asli',
        ]);

    $response->assertSessionHasNoErrors();

    $bukti = BuktiPengeluaran::where('dokumen_pengajuan_id', $document->id)->first();
    expect($bukti)->not->toBeNull();
    expect($bukti->status_validasi_sbm)->toBe('Sesuai SBM');
});

test('finance staff can view and add Standar Biaya Masukan', function () {
    $this->actingAs($this->financeStaff)
        ->get(route('standar-biaya.index'))
        ->assertOk();

    $this->actingAs($this->financeStaff)
        ->post(route('standar-biaya.store'), [
            'kategori' => 'Transportasi',
            'uraian_belanja' => 'Taksi Bandara Balikpapan - Kampus ITK',
            'satuan' => 'Kali',
            'batas_tarif' => 250000,
            'tahun' => 2026,
        ])
        ->assertRedirect();

    expect(StandarBiaya::where('uraian_belanja', 'Taksi Bandara Balikpapan - Kampus ITK')->exists())->toBeTrue();
});

test('users directory and financial reports can be accessed by authorized staff', function () {
    $this->actingAs($this->financeStaff)
        ->get(route('pengguna.index'))
        ->assertOk();

    $this->actingAs($this->financeStaff)
        ->get(route('laporan.index'))
        ->assertOk();
});

test('dedicated status tracking page loads active document and routes correctly', function () {
    $document = DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/0099',
        'nama_kegiatan' => 'Workshop Kurikulum OBE 2026',
        'jenis_anggaran' => 'BOPTN',
        'uraian' => 'Pengembangan kurikulum.',
        'tgl_pelaksanaan' => now()->addDays(14)->format('Y-m-d'),
        'total_usulan' => 12500000,
        'status_terkini' => DocumentStatus::Diajukan,
    ]);

    StatusTracking::create([
        'dokumen_pengajuan_id' => $document->id,
        'user_id' => null,
        'tahap' => DocumentStatus::Diajukan,
        'posisi_berkas' => 'Subbag Keuangan Fakultas',
        'catatan' => 'Berkas usulan telah terkirim oleh pengusul.',
        'waktu_update' => now(),
    ]);

    // Access status-tracking.index
    $response = $this->actingAs($this->applicant)
        ->get(route('status-tracking.index'))
        ->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('status-tracking/index')
        ->has('activeDocument')
        ->has('accessibleDocuments')
        ->has('stages')
        ->has('trackings')
    );

    // Access status-tracking.show redirects to status-tracking.index with dokumen_id
    $this->actingAs($this->applicant)
        ->get(route('status-tracking.show', $document))
        ->assertRedirect(route('status-tracking.index', ['dokumen_id' => $document->id]));
});

test('global search api returns matching documents and sbm items for command palette', function () {
    DokumenPengajuan::create([
        'user_id' => $this->applicant->id,
        'nomor_pengajuan' => 'PROP/2026/9999',
        'nama_kegiatan' => 'Seminar Teknologi Cloud Balikpapan',
        'jenis_anggaran' => 'BOPTN (Bantuan Operasional PTN)',
        'uraian' => 'Pengujian pencarian sistem command palette.',
        'tgl_pelaksanaan' => now()->addDays(14)->format('Y-m-d'),
        'total_usulan' => 12000000,
        'status_terkini' => DocumentStatus::Diajukan,
    ]);

    StandarBiaya::create([
        'kategori' => 'Honorarium',
        'uraian_belanja' => 'Honorarium Keynote Speaker Cloud',
        'satuan' => 'Orang / Jam',
        'batas_tarif' => 950000,
        'tahun' => 2026,
    ]);

    // Unauthenticated request is rejected
    $this->getJson(route('api.search'))->assertUnauthorized();

    // Authenticated search query
    $response = $this->actingAs($this->applicant)
        ->getJson(route('api.search', ['q' => 'Cloud']))
        ->assertOk();

    $response->assertJsonStructure([
        'documents' => [
            '*' => ['id', 'nomor_pengajuan', 'nama_kegiatan', 'jenis_anggaran', 'total_usulan', 'status_terkini', 'url'],
        ],
        'sbm' => [
            '*' => ['id', 'kategori', 'uraian_belanja', 'satuan', 'batas_tarif', 'tahun', 'url'],
        ],
    ]);

    expect($response->json('documents'))->toHaveCount(1)
        ->and($response->json('documents.0.nomor_pengajuan'))->toBe('PROP/2026/9999')
        ->and($response->json('sbm'))->toHaveCount(1)
        ->and($response->json('sbm.0.uraian_belanja'))->toBe('Honorarium Keynote Speaker Cloud');
});
