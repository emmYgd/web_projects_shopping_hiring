 <?php

namespace App\Http\Controllers\Validators;

trait BuyerCartRequestRules {

    protected function viewAllAvailableRules(): array
    {
        //set validation rules:
        $rules = [
            'buyer_id' => 'required | unique:buyers | size:20',
        ];

        return $rules;
    }


}