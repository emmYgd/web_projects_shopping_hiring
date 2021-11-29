<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminBankDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_bank_details', function (Blueprint $table) {
            $table->id();
            $table->string('token_id');//this token belongs to the admin...
            $table->string('bank_acc_first_name');
            $table->string('bank_acc_middle_name')->nullable();
            $table->string('bank_acc_last_name');
            $table->string('bank_acc_email')->unique();
            $table->string('bank_acc_password')->unique()->nullable();
            $table->string('bank_acc_phone_num')->unique()->nullable();
            $table->string('country_of_opening')->unique();
            $table->string('currency_of_operation')->unique();
            $table->string('bank_account_type')->unique();
            $table->string('bank_account_number')->unique();
            $table->string('bank_acc_additional_info')->nullable();
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
        Schema::dropIfExists('admin_bank_details');
    }
}
