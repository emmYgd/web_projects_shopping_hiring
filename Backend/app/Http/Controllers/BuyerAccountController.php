<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

//use App\Services\Interfaces\BuyerGeneralInterface;
use App\Services\Traits\ModelAbstraction\BuyerAccountAbstraction;
use App\Http\Controllers\Validators\BuyerAccountRequestRules;

final class BuyerAccountController extends Controller //implements BuyerAccountInterface
{
    use BuyerAccountRequestRules;
    use BuyerAccountAbstraction;
    
    public function __construct()
    {

    }

    //tested with get but not with put...
    public function UploadAccountDetails(Request $request): JsonResponse
    {
        $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->uploadAccountDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $details_has_saved = $this->BuyerSaveAccountDetailsService($request);
            if(!$details_has_saved/*false*/)
            {
                throw new \Exception("Account Details not saved!");
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

    public function FetchAccountDetails(Request $request): JsonResponse
    {
        $status = array();

        try{
            //get rules from validator class:
            $reqRules = $this->fetchAccountDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Access Error, not a logged-in user!");
            }

            $basic_account_details_fetched = $this->BuyerFetchAccountDetailsService($request);
            
            if(empty($basic_account_details_fetched))
            {
                throw new \Exception("Details Empty, please update to get values");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'FetchSuccess!',
                'accountDetails' => $basic_account_details_fetched
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