<?php

namespace App\Http\Controllers\Validators;

trait AdminGeneralRequestRules {

    protected function uploadProductTextRules(): array
    {
        //set validation rules:
        $rules = [
             'token_id'=> 'required | string | size:10 | exists:admins',
            /*'product_category'=> 'required | string',
            'product_title'=> 'required | string',
            'product_summary'=> 'required | string',
            'product_description'=> 'required | string',
            'product_currency_of_payment'=> 'required | string',
            'product_price'=> 'required',
            'product_shipping_cost' =>'required',
            'product_add_info'=> 'required | string',
            'product_ship_guarantee_info'=> 'required | string'*/
        ];

        return $rules;
    }

    protected function uploadProductDetailsImageRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id' => 'required | string | size:10 | exists:admins',
            'product_token_id' =>  'required | exists:products',//string | size:10
            'main_image_1' => 'required | file', //at least one main pic image
            'main_image_2' => 'file',
            'logo_1' => 'required | file', //at least one logo image
            'logo2' => 'file'
        ];

        return $rules;
    }

    protected function fetchAllProductIDsRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id'=> 'required | string | size:10 | exists:admins'
        ];

        return $rules;
    }

    protected function fetchEachProductDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id'=> 'required | string | size:10 | exists:admins',
            'product_token_id' => 'required | string | size:10 | exists:products'
        ];

        return $rules;
    }


    protected function updateBusinessDetailsRules(): array
    {
        //set validation rules:
        $rules = [
             'token_id'=> 'required | string | size:10 | exists:admins',
            /*'business_name'=> 'required | string',
            'company_name'=> 'required | string',
            'business_country'=> 'required | string',
            'business_state'=> 'required | string',
            'business_city_or_town'=> 'required | string',
            'business_street_or_close'=> 'required',
            'business_apartment_suite_or_unit' =>'required',
            'business_phone_number'=> 'required | string',
            'business_email' => 'required | string'*/
        ];

        return $rules;
    }

    protected function fetchBusinessDetailsRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id'=> 'required | string | size:10 | exists:admins'
        ];

        return $rules;
    }


    protected function getSalesDataRules(): array
    {
		//set validation rules:
        $rules = [
            'admin_id'=> 'required | unique:admins'
        ];

        return $rules;
    }

    protected function viewFrequentRules(): array
    {
        //set validation rules:
        $rules = [
            'admin_id'=> 'required | unique:admins',
            'is_cleared' => 'required | bool',
        ];

        return $rules;
    }

}

?>