<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bukti_pengeluarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dokumen_pengajuan_id')->constrained('dokumen_pengajuans')->cascadeOnDelete();
            $table->foreignId('standar_biaya_id')->nullable()->constrained('standar_biayas')->nullOnDelete();
            $table->string('jenis_bukti');
            $table->decimal('nominal', 15, 2);
            $table->string('file_digital')->nullable();
            $table->string('status_fisik')->default('Belum Diterima');
            $table->string('status_validasi_sbm')->default('Perlu Verifikasi');
            $table->timestamps();

            $table->index(['dokumen_pengajuan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bukti_pengeluarans');
    }
};
