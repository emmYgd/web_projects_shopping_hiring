<?php 

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;


use App\Services\Traits\ModelCRUD\AdminCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;


trait AdminExtrasAbstraction
{   
    //inherits all their methods:
    use AdminCRUD;
    use BuyerCRUD;

    //activate or deactivate referral program
    protected function AdminUpdateReferralDetailsService(Request $request): bool
    {
        $queryKeysValues = ['token_id' => $request->token_id];
        $newKeysValues = $request->except('token_id');

        $is_ref_details_updated = $this->AdminUpdateSpecificService($queryKeysValues, $newKeysValues);
        
        return  $is_ref_details_updated;
    }


    protected function AdminFetchReferralDetailsService(Request $request)//: array
    {
        $referral_details = [];

        //first read all the admin ref details:
        $queryKeysValues = ['token_id' => $request->token_id];
        $adminRefDetails = $this->AdminReadSpecificService($queryKeysValues);

        //Now get the count of the buyer links:
        $queryParam = "buyer_referral_link";
        $buyer_info = $this->BuyerReadSpecificAllTestNullService($queryParam);
        
        $ref_count = $buyer_info->count();

        //add all to the data array:
        
        $referral_details = [
            'is_ref_active' => $adminRefDetails->is_referral_prog_activated,
            'ref_bonus_currency' => $adminRefDetails->referral_bonus_currency,
            'ref_bonus' =>  $adminRefDetails->referral_bonus,
            'ref_links_total' => $ref_count
        ];
        
        //return $buyer_info;*/
       // return $referral_details;

        return  $referral_details;
    }

    protected function  AdminDisableReferralProgramService(Request $request): bool
    {
        $queryKeysValues = ['token_id' => $request->token_id];
        $newKeysValues = [
            'is_referral_prog_activated' => false,
            'referral_bonus' => null,
            'referral_bonus_currency' => null
        ];

        $is_ref_details_updated = $this->AdminUpdateSpecificService($queryKeysValues, $newKeysValues);
        
        return  $is_ref_details_updated;
    }


}

?>