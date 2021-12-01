<?php

namespace App\Http\Controllers\Validators;

trait BuyerCartRequestRules {

    //pending or cleared
    protected function fetchAllBuyerCartIDsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id' => 'required | exists:buyers',
            'payment_status' => 'required',
        ];

        return $rules;   
    }

    protected function fetchEachCartDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id' => 'required | exists:buyers',
            'unique_cart_id' => 'required | exists:carts',
            'payment_status' => 'required',
        ];

        return $rules;   
    }

}
