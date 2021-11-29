<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            /*$table->string('unique_buyer_id');
            $table->string('unique_cart_id')->unique();
            //already inside the Cart details:
            //$table->enum('payment_currency', ['USD', 'CAD', 'EUR'])->default('USD');
            $table->string('product_price')->
            $table->string()
            $table->timestamps();*/
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
