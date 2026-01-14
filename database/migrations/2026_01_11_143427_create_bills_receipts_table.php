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
        Schema::create('bills_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('posted_by');
            $table->string('total_bill');
            $table->string('rate');
            $table->date('due_date');
            $table->string('month');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills_receipts');
    }
};
