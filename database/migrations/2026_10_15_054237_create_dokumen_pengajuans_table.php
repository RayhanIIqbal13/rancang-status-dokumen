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
        Schema::create('dokumen_pengajuans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('nomor_pengajuan')->unique();
            $table->string('nama_kegiatan');
            $table->string('jenis_anggaran');
            $table->text('uraian');
            $table->date('tgl_pelaksanaan');
            $table->decimal('total_usulan', 15, 2);
            $table->string('file_proposal')->nullable();
            $table->string('status_terkini')->default('Diajukan')->index();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['status_terkini', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_pengajuans');
    }
};
