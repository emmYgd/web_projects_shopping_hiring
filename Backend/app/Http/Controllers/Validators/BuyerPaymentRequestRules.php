<?php

namespace App\Http\Controllers\Validators;

trait BuyerPaymentRequestRules {

    protected function fetchAllCardDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id' => 'required | exists:buyers', 
        ];

        return $rules;
    }

    protected function uploadCardDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id' => 'required | exists:buyers',
            'buyer_bank_card_type' => 'required',
            'buyer_bank_card_number'=> 'required',
            'buyer_bank_card_cvv' => 'required',
            'buyer_bank_card_expiry_month' => 'required',
            'buyer_bank_card_expiry_year' => 'required'
        ];

        return $rules;
    }

    //pending or cleared

    protected function fetchAllCartIDsRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id' => 'required | exists:admins', 
            'payment_status' => 'required',
        ];

        return $rules;   
    }

    protected function fetchEachCartDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id' => 'required | exists:admins', 
            'unique_cart_id' => 'required | exists:carts',
            'payment_status' => 'required',
        ];

        return $rules;   
    }

   
}
