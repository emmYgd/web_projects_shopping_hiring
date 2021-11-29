<?php

namespace App\Http\Controllers\Validators;

trait BuyerReferralRequestRules 
{
    protected function genReferralLinksRules(): array
    {
		//set validation rules:
        $rules = [
            'buyer_id' => 'required | unique:buyers',
        ];

        return $rules;
    }

    //admin can change the referral bonus to any amount per click...
    protected function changeReferralBonusRules(): array
    {
        //set validation rules:
        $rules = [
            'buyer_id' => 'required | unique:buyers',
            
        ];

        return $rules;
    }
}