<?php

namespace App\Http\Controllers\Validators;

trait BuyerCartEditRequestRules {

//A cart be associated with many goods...
	protected function addGoodsToCartRules(): array
	{
		//set validation rules:
        $rules = [
            'cart_id' => 'required | unique:carts | size:15',
            'goods_total_number'=> 'required | numeric',
            'goods_total_cost' => 'required | numeric',
            //the buyer that wants to make this purchase:
        	'buyer_id' => 'required | unique:buyers | size:20', 

            'product_ids' => 'required | json',//all commodities added to this cart

            'is_cleared' => 'required | bool', //either not paid for yet (is_cleared=false) or has been paid for - cleared (is_cleared=true); defaults to false
        ];

        return $rules;   
    }

    protected function viewAllCartGoodsRules(): array
    {
        //set validation rules:
        $rules = [
            'cart_id' => 'required | unique:carts | size:15',
            //the buyer that wants to make this purchase:
            'buyer_id' => 'required | unique:buyers | size:20', 
        ];

        return $rules;   
    }

    //pending or cleared
    protected function viewCartsByCategory(): array
    {
        //set validation rules:
        $rules = [
            'buyer_id' => 'required | unique:buyers | size:20', 
            'is_cleared' => 'required | bool',
        ];

        return $rules;   
    }

    protected function editPendingCartGoodsRules(): array
    {
        $rules = [

		    'cart_id' => 'required | unique:carts | size:15',
            'goods_total_number'=> 'required | numeric',
            'goods_total_cost' => 'required | numeric',
            //the buyer that wants to make this purchase:
            'buyer_id' => 'required | unique:buyers | size:20', 

            'commodity_ids' => 'required | json',//all commodities added to this cart

            'is_cleared' => 'required | bool', //either not paid for yet (is_cleared=false) or has been paid for - cleared (is_cleared=true); defaults to false

        ];

        return $rules;

    }


    protected function deletePendingCartRules(): array
    {
        //set validation rules:
        $rules = [
            'buyer_id' => 'required | unique: buyers'
            'cart_id' => 'required | unique: carts',
        ];

        return $rules;
    }

?>