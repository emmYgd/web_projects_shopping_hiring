<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminGeneralBusinessDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_general_business_details', function (Blueprint $table) {
            $table->id();
            $table->string('token_id');//this token belongs to the admin...
            $table->string('business_name');
            $table->string('company_name');
            $table->string('business_country');
            $table->string('business_state');
            $table->string('business_city_or_town');
            $table->string('business_street_or_close');
            $table->string('business_apartment_suite_or_unit');
            $table->string('business_phone_number');
            $table->string('business_email');
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
        Schema::dropIfExists('admin_general_business_details');
    }
}
