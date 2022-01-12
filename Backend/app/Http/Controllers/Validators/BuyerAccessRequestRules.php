<?php

namespace App\Http\Controllers\Validators;

trait BuyerAccessRequestRules {

	protected function registerRules(): array
    {
		//set validation rules:
        $rules = [
            'buyer_first_name' => 'required | string', 
            'buyer_middle_name' => 'string',
            'buyer_last_name' => 'required | string',
            'buyer_phone_number' => 'string',
            'buyer_email' => 'required | string',
            'buyer_password' => 'required | string | min:5'
        ];

        return $rules;
    }

    protected function loginRules(): array
    {
		//set validation rules:
        $rules = [
            'buyer_email' => 'required | string | different:buyer_password',
            'buyer_password' => 'required | string | min:5 | different:buyer_email'
        ];

        return $rules;

    }

    protected function confirmLoginStateRules(): array
    {
        $rules =  [
            'unique_buyer_id'=>'required | exists:buyers',
        ];
        return $rules;
    }

    protected function resetPasswordRules(): array
    {
        //set validation rules:
        $rules = [
            'buyer_email' => 'required | different:new_password | exists:buyers',
            'new_password' => 'required | different:buyer_email'
        ];

        return $rules;
    }

    protected function editRules(): array
    {
        //set validation rules:
        $rules = [
            'buyer_id' => 'required | unique:buyers',
            'means_of_payment' => 'nullable',//credit card, online transfer, bitcoin
            
            /*Your credit card info is PCII compliant and safe with us, even we don't know it*/
            'card_name' => 'nullable',
            'card_number' => 'nullable',
            'card_cvv' => 'nullable',
        ];

        return $rules;

    }

    protected function filesAndImagesRules(): array
    {
        //set validation rules:
        $rules = [
            'buyer_id' => 'required | unique: buyers',
            'profile_picture' => 'nullable | image | mimes:jpg,png | dimensions:min_width=100,max_width=200,min_height=200,max_height=400',
        ];

        return $rules;
    }


    protected function logoutRules(): array
    {
        //set validation rules:
        $rules = [
            'unique_buyer_id' => 'required' //| unique: buyers',
        ];

        return $rules;
    }

}

?>