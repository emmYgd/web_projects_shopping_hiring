<?php

namespace App\Http\Controllers\Validators;

trait BuyerBillingAndShippingRequestRules {

    protected function uploadBillingDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id'=> 'required | string | size:10 | exists:buyers',
            'billing_username' => 'required | string ',
            'billing_user_company' => 'string', 
            'billing_country' => 'string', 
            'billing_state'  => 'required | string',
            'billing_city_or_town'  => 'required | string',
            'billing_street_or_close'  => 'required | string',
            'billing_home_apartment_suite_or_unit'  => 'required | string',
            'billing_phone_number'  => 'required | string',
            'billing_email'  => 'required | string',
        ];

        return $rules;
    }

    protected function fetchBillingDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id'=> 'required | string | exists:buyers'
        ];

        return $rules;
    }

    protected function uploadShippingDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id'=> 'required | string | size:10 | exists:admins',
            /*'bank_acc_first_name'=> 'required | string',
            'bank_acc_middle_name'=> 'string',
            'bank_acc_last_name'=> 'required | string',
            'bank_acc_email'=> 'required | string',
            'bank_acc_password'=> 'string',
            'bank_acc_phone_num'=> 'string',
            'country_of_opening' =>'required',
            'currency_of_operation'=> 'required | string',
            'bank_account_type' => 'required | string',
            'bank_account_number' => 'required | string',
            'bank_acc_additional_info' => 'string'*/
        ];

        return $rules;
    }

    protected function fetchShippingDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id'=> 'required | string | exists:admins'
        ];

        return $rules;
    }
}