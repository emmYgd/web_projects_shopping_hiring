<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->string('unique_cart_id');
            $table->string('unique_buyer_id')->nullable();
            //associated ids attached to this cart:
            $table->json('attached_goods_ids')->nullable();//this is not neccessary as it will be recorded in the goods table
            $table->enum('purchase_currency', ['USD', 'CAD', 'EUR'])->default('USD');
            $table->float('purchase_price')->nullable();
            $table->enum('payment_status', ['pending', 'cleared'])->default('pending');
            
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
        Schema::dropIfExists('carts');
    }
}
