<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

//use App\Services\Interfaces\AdminGeneralInterface;
use App\Services\Traits\ModelAbstraction\AdminGeneralAbstraction;
use App\Http\Controllers\Validators\AdminGeneralRequestRules;

final class AdminGeneralController extends Controller //implements AdminGeneralInterface
{
    use AdminGeneralRequestRules;
    use AdminGeneralAbstraction;
    
    public function __construct()
    {

    }

    //tested with get but not with put...
    public function UploadProductTextDetails(Request $request): JsonResponse
    {
        $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->uploadProductTextRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $details_saved = $this->AdminSaveProductDetailsService($request);
            if(!($details_saved['is_saved']))
            {
                throw new \Exception("Product Details not saved!");
            }

             $status = [
                'code' => 1,    
                'serverStatus' => 'textDetailsSaved!',
                'product_token_id' => $details_saved['product_token_id']
            ];

        }
        catch(\Exception $ex)
        {

             $status = [
                'code' => 0,
                'serverStatus' => 'textDetailsNotSaved!',
                'short_description' => $ex->getMessage()
            ];

        }
        //finally{
            return response()->json($status, 200);
        /*}*/
    }

     //buyers can update their images if they so wish
    public function UploadProductDetailsImage(Request $request):  JsonResponse
    {
        $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->uploadProductDetailsImageRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $files_has_saved = $this->AdminSaveProductImageService($request);
            if(!$files_has_saved/*false*/)
            {
                throw new \Exception("Product Image not saved!");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'imageDetailsSaved!',
                'requestLists' => $request->file('main_image_1')
            ];

        }
        catch(\Exception $ex){

             $status = [
                'code' => 0,
                'serverStatus' => 'imageDetailsNotSaved!',
                'short_description' => $ex->getMessage()
            ];

        }//finally{
            return response()->json($status, 200);
        //}

    }



    //tested with get but not with put...
    public function UpdateBusinessDetails(Request $request): JsonResponse
    {
        $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->updateBusinessDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $details_has_saved = $this->AdminSaveBusinessDetailsService($request);
            if(!$details_has_saved/*false*/)
            {
                throw new \Exception("Business Details not saved!");
            }

             $status = [
                'code' => 1,    
                'serverStatus' => 'bizDetailsSaved!',
                //'test' => $details_has_saved
            ];

        }
        catch(\Exception $ex)
        {

             $status = [
                'code' => 0,
                'serverStatus' => 'bizDetailsNotSaved!',
                'short_description' => $ex->getMessage()

            ];

        }
        //finally{
            return response()->json($status, 200);
        /*}*/
    }

    public function FetchBusinessDetails(Request $request): JsonResponse
    {
        $status = array();

        try{
            //get rules from validator class:
            $reqRules = $this->fetchBusinessDetailsRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Access Error, can't connect!");
            }

            $biz_details_fetched = $this->AdminFetchBusinessDetailsService($request);
            
            if(empty($biz_details_fetched))
            {
                throw new \Exception("Details Empty, please update to get values");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'FetchSuccess!',
                'bizDetails' => $biz_details_fetched
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
