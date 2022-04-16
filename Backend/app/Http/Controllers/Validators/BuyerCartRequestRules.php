<?php

namespace App\Http\Controllers\Validators;

trait BuyerCartRequestRules 
{

    protected function savePendingCartDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id' => 'required | string | exists:buyers',
            'attached_goods_ids' => 'required',
            'purchase_currency' => 'required',
            'purchase_price' => 'required',
            'payment_status' => 'required | string',
        ];

        return $rules;   
    }


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
