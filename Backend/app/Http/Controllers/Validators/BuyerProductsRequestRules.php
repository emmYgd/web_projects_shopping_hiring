 <?php

namespace App\Http\Controllers\Validators;

trait BuyerProductRequestRules 
{

    protected function fetchAvailableProductsRules(): array
    {
        //set validation rules:
        $rules = [
            //'buyer_id' => 'required | unique:buyers | size:20',
        ];

        return $rules;
    }


}