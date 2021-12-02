<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

use App\Services\Traits\ModelAbstraction\BuyerProductAbstraction;
use App\Http\Controllers\Validators\BuyerProductRequestRules;

final class BuyerProductController extends Controller //implements BuyerCartInterface
{
   use BuyerProductAbstraction;
   use BuyerProductRequestRules;

   public function __construct()
   {
        //$this->createAdminDefault();
   }

    public function FetchAvailableProducts(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->fetchAvailableProductsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not logged in yet!");
         }

         //this should return in chunks or paginate:
         $detailsFound = $this->BuyerFetchAvailableProductsService();
         if( empty($detailsFound) )
         {
            throw new \Exception("Products Not Found!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'SearchSuccess!',
            'products' => $detailsFound
         ];

      }
      catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'SearchError!',
            'short_description' => $ex->getMessage()
         ];

      }/*finally
      {*/
         return response()->json($status, 200);
      //}

   }

}