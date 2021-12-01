<?php

namespace App\Http\Controllers\Validators;

trait BuyerAccountRequestRules 
{
    protected function uploadAccountDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id'=> 'required | string | size:10 | exists:buyers',
            //'buyer_first_name' => 'required | string ',
            //'buyer_middle_name' => 'string',
            'buyer_last_name'=> 'required | string', 
            //'buyer_phone_number' => 'string',
            //'buyer_email' => 'string',
            //'buyer_password' =>'string',
        ];

        return $rules;
    }

    protected function fetchAccountDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id'=> 'required | string | exists:buyers'
        ];

        return $rules;
    }
}