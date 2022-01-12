<?php 

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;


use App\Services\Traits\ModelCRUD\AdminCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;
use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\LocationsAndTracksCRUD;


trait AdminExtrasAbstraction
{   
    //inherits all their methods:
    use AdminCRUD;
    use BuyerCRUD;
    use CartCRUD;
    use LocationsAndTracksCRUD;

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
        $all_buyer_collect =  $this->BuyerReadAllLazyService();
        $all_bonus_gen_so_far = $all_buyer_collect->pluck('buyer_total_referral_bonus'); 

        $sum_bonus_gen_so_far = $all_bonus_gen_so_far->sum();
        
        $referral_details = [
            'is_ref_active' => $adminRefDetails->is_referral_prog_activated,
            'ref_bonus_currency' => $adminRefDetails->referral_bonus_currency,
            'ref_bonus' =>  $adminRefDetails->referral_bonus,
            'ref_links_total' => $ref_count,
            'bonus_generated_so_far' => $sum_bonus_gen_so_far
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

    protected function  AdminFetchGeneralStatisticsService(Request $request): array
    {
        //first name and last name
        $queryKeysValues = [
            'unique_buyer_id' => $request->unique_buyer_id
        ];

        $queryKeysValues = [
            'payment_status' => 'pending'
        ];
        //all pending carts of this user:
        $all_pending_carts = $this->CartReadAllLazySpecificService($queryKeysValues)->count();

        $queryKeysValues = [
            'payment_status' => 'cleared'
        ];

        $cartModel = $this->CartReadAllLazySpecificService($queryKeysValues);
        //all cleared carts of this user:
        $all_cleared_carts = $cartModel->count();

        //total transactions so far:
        $total_transaction = $cartModel->pluck('purchase_price')->sum();

        //sales volume:
        $sales_volume_average = ( ($total_transaction/$all_cleared_carts) / $total_transaction ) * 100;

        $all_cleared_cart_ids = $cartModel->pluck('unique_cart_id');

        
        $all_tracked_goods_count = $this->LocationsAndTracksReadAllLazyService()->count();
        
        return [
            'all_pending_carts' => $all_pending_carts,
            'all_cleared_carts' => $all_cleared_carts,
            'total_transaction' =>  $total_transaction,
            'all_tracked_goods' => $all_tracked_goods_count,
            'sales_volume_average' => $sales_volume_average
        ];
    }
}

?>