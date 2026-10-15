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
        Schema::create('standar_biayas', function (Blueprint $table) {
            $table->id();
            $table->string('kategori')->index();
            $table->string('uraian_belanja');
            $table->string('satuan');
            $table->decimal('batas_tarif', 15, 2);
            $table->unsignedSmallInteger('tahun')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('standar_biayas');
    }
};
