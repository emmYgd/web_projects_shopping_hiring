<?php 

namespace App\Services\Traits\ModelAbstraction;

use App\Services\Traits\ModelCRUD\ReferralCRUD;
use App\Services\Traits\ModelCRUD\AdminCRUD;

use Illuminate\Http\Request;

trait BuyerExtrasAbstraction
{   
    //inherits all their methods:
    use ReferralCRUD;
    use AdminCRUD;
    
    protected function BuyerGenReferralLinksService(Request $request): array | bool
    {
        //first check if admin has activated the referral program:
        $admin_details = $this->AdminReadAllService();

        $is_referral_activated = $admin_details->referral_program_active;
        if(!$is_referral_activated)
        {
            throw new \Exception("Referral Program Not Activated Yet!");
        }

        //if it is activated, continue:
        $buyer_id = $request->buyer_id;
        $sub_ref_url = "/public/api/v1/buyers/${buyer_id}";

        $current_domain = $request()->getSchemeAndHttpHost();//return https://internshire.com

        $referral_link = '$current_domain' . '$buyer_id';
        //e.g https://internshire.com/public/api/v1/buyers/{buyer_id}

        $params_to_save = [
            'buyer_id' => $buyer_id,
            'referral_link' => $referral_link,

            //times_used => continuosly add 1 each time it is clicked.//use scope in the Model field while updating

            //referral_amount=>to be set by the admin..
            //'is_referral_approved' => $is_approved//referral program must be approved by the admin before usage
        ];

        //save in the referral table: 
        $params_has_saved =  $this->ReferralCreateAllService($params_to_save);
        if(!$params_has_saved){
            return false;
        }

        return $params_to_save;
    }

}