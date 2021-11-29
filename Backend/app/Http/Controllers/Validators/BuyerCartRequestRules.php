<?php

namespace App\Http\Controllers\Validators;

trait BuyerCartRequestRules {

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

            'commodity_ids' => 'required | json',//all commodities added to this cart

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


    //edit important fields after login: all the nullable fields must now be compulsory:
    protected function viewAllJobPostsRules(): array
    {
        //set validation rules:
        $rules = [
            'employer_id' => 'required | unique:employers',
            'industry' => 'required',
            'category' => 'required',
            'unit_handling_recruitment' => 'required', //HR, Outsourced, or Founder
            'brief_details' => 'required | min:5, max:100', //what the company does, aims and objectives(brief)
            'salary_range' => 'required | json', //from/to - average salary willing to pay interns at this time
    		'online_presence' => 'required | json', //including: website, facebook, twitter, linkedin, etc
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


    protected function delayJobPostRules(): array
    {
        //set validation rules:
        $rules = [
            'employer_id' => 'required | unique: interns',
            'job_post_id' => 'required | unique: jobs',
            'is_delayed' => 'required | bool'
        ];

        return $rules;
    }

}
