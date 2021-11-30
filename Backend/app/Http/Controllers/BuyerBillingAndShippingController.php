<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

//use App\Services\Interfaces\BuyerGeneralInterface;
use App\Services\Traits\ModelAbstraction\BuyerBillingAndShippingAbstraction;
use App\Http\Controllers\Validators\BuyerBillingAndShippingRequestRules;

final class BuyerBillingAndShippingController extends Controller //implements BuyerBillingAndShippingInterface
{
    use BuyerBillingAndShippingRequestRules;
    use BuyerBillingAndShippingAbstraction;
    
    public function __construct()
    {

    }

    //tested with get but not with put...
    public function UploadBillingDetails(Request $request): JsonResponse
    {
        $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->uploadBillingDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $details_has_saved = $this->BuyerSaveBillingDetailsService($request);
            if(!$details_has_saved/*false*/)
            {
                throw new \Exception("Billing Details not saved!");
            }

             $status = [
                'code' => 1,    
                'serverStatus' => 'DetailsSaved!',
            ];

        }
        catch(\Exception $ex)
        {

             $status = [
                'code' => 0,
                'serverStatus' => 'DetailsNotSaved!',
                'short_description' => $ex->getMessage(),
            ];

        }
        //finally{
            return response()->json($status, 200);
        /*}*/
    }

    public function FetchBillingDetails(Request $request): JsonResponse
    {
        $status = array();

        try{
            //get rules from validator class:
            $reqRules = $this->fetchBillingDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Access Error, not a logged-in user!");
            }

            $billing_details_fetched = $this->BuyerFetchBillingDetailsService($request);
            
            if(empty($billing_details_fetched))
            {
                throw new \Exception("Details Empty, please update to get values");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'FetchSuccess!',
                'billingDetails' => $billing_details_fetched
            ];

        }
        catch(\Exception $ex)
        {

            $status = [
                'code' => 0,
                'serverStatus' => 'FetchError!',
                'short_description' => $ex->getMessage()
            ];

        }//finally{
            return response()->json($status, 200);
        //}
    }


    //tested with get but not with put...
    public function UploadShippingDetails(Request $request): JsonResponse
    {
        $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->uploadShippingDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $details_has_saved = $this->BuyerSaveShippingDetailsService($request);
            if(!$details_has_saved/*false*/)
            {
                throw new \Exception("Billing Details not saved!");
            }

             $status = [
                'code' => 1,    
                'serverStatus' => 'DetailsSaved!',
            ];

        }
        catch(\Exception $ex)
        {

             $status = [
                'code' => 0,
                'serverStatus' => 'DetailsNotSaved!',
                'short_description' => $ex->getMessage(),
            ];

        }
        //finally{
            return response()->json($status, 200);
        /*}*/
    }

    public function FetchShippingDetails(Request $request): JsonResponse
    {
        $status = array();

        try{
            //get rules from validator class:
            $reqRules = $this->fetchShippingDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Access Error, not a logged-in user!");
            }

            $shipping_details_fetched = $this->BuyerFetchShippingDetailsService($request);
            
            if(empty($shipping_details_fetched))
            {
                throw new \Exception("Details Empty, please update to get values");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'FetchSuccess!',
                'shippingDetails' => $shipping_details_fetched
            ];

        }
        catch(\Exception $ex)
        {

            $status = [
                'code' => 0,
                'serverStatus' => 'FetchError!',
                'short_description' => $ex->getMessage()
            ];

        }//finally{
            return response()->json($status, 200);
        //}
    }

}

?>
