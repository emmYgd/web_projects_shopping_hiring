<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('token_id')->unique();

            /*$table->string('admin_name')->unique()->nullable();
            $table->string('admin_company')->unique()->nullable();

            $table->string('country_of_operation')->unique()->nullable();
            $table->string('state_of_operation')->unique()->nullable();
            $table->string('city_or_town_of_operation')->unique()->nullable();

            $table->string('street_or_close_address')->unique()->nullable();
            $table->string('apartment_suite_unit_address')->unique()->nullable();*/

            $table->string('email')->unique();
            //$table->string('phone_number')->unique()->nullable();
            $table->string('password')->unique();

            $table->string('is_logged_in')->bool()->default(false);
            $table->string('is_referral_prog_activated')->bool()->default(false);
            $table->string('referral_bonus')->nullable();
            $table->string('referral_bonus_currency')->nullable();
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
        Schema::dropIfExists('admins');
    }
}
