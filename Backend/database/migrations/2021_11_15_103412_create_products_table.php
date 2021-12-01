<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('product_token_id')->unique();

            //texts:
            $table->string('product_category');
            $table->string('product_title');
            $table->string('product_summary');
            $table->string('product_description');
            $table->string('product_currency_of_payment');
            $table->string('product_price');
            $table->string('product_shipping_cost');
            $table->string('product_add_info')->nullable();
            $table->string('product_ship_guarantee_info')->nullable();

            //images:
            $table->binary('main_image_1')->nullable();
            $table->binary('main_image_2')->nullable();
            $table->binary('logo_1')->nullable();
            $table->binary('logo_2')->nullable();

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
        Schema::dropIfExists('products');
    }
}
