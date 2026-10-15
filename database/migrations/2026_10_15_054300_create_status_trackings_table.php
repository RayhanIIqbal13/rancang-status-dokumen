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
        Schema::create('status_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dokumen_pengajuan_id')->constrained('dokumen_pengajuans')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('tahap')->index();
            $table->string('posisi_berkas');
            $table->text('catatan')->nullable();
            $table->timestamp('waktu_update')->useCurrent();
            $table->timestamps();

            $table->index(['dokumen_pengajuan_id', 'waktu_update']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('status_trackings');
    }
};
