<?php 

namespace App\Services\Traits\ModelAbstraction;

use App\Services\Traits\ModelCRUD\LocationCRUD;

use Illuminate\Http\Request;

trait BuyerExtrasAbstraction
{   
    //inherits all their methods:
    use LocationCRUD;
    
    protected function BuyerTrackGoodsService(Request $request): array
    {
        $buyer_id = $request->buyer_id;
        $cart_id = $request->intern_id;

        $queryKeysValues = [
            'buyer_id' => $buyer_id, 
            'cart_id' => $cart_id,
        ];

        $location_details = $this->LocationReadSpecificService($queryKeysValues);
        return $location_details;
        //return from location table values: 
        //present location, expected date and time of delivery
    }


    protected function BuyerConfirmDeliveryService(Request $request): bool
    {
        $buyer_id = $request->buyer_id;

        $queryKeysValues = [ 'buyer_id' => $buyer_id];

        $newKeysValues = ['is_cart_delivered' => $request->is_cart_delivered,//true in this case
        ];

        $details_has_updated = $this->LocationUpdateSpecificService($queryKeysValues, $newKeysValues);

        return $details_has_updated;
    }


    /*This is already provided in the CommentRateAbstraction trait 
    protected function BuyerCommentRateService(Request $request): bool
    {
    }*/
    
}