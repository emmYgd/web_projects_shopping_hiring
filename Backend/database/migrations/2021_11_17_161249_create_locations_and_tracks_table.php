<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationsAndTracksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations_and_tracks', function (Blueprint $table) {
            $table->id();

            $table->string('unique_cart_id')->unique();
            $table->enum('cart_status', ['Processing', 'PickUp', 'In-Transit', 'On-hold'])->default('Processing')->nullable();
            $table->string('current_country')->nullable();
            $table->string('current_state')->nullable();
            $table->string('current_city_or_town')->nullable();
            $table->string('current_street')->nullable();
            $table->string('shipped_date')->nullable();
            $table->string('expected_delivery_date')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('locations_and_tracks');
    }
}
