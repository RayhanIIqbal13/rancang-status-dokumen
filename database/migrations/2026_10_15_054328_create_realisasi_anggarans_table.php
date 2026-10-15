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
        Schema::create('realisasi_anggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dokumen_pengajuan_id')->unique()->constrained('dokumen_pengajuans')->cascadeOnDelete();
            $table->decimal('total_realisasi', 15, 2);
            $table->date('tgl_pencairan')->nullable();
            $table->string('status_pencairan')->default('Menunggu SAKTI');
            $table->text('draf_rekap_spj')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('realisasi_anggarans');
    }
};
