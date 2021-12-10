<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Validators\BuyerCartRequestRules;

use App\Services\Interfaces\BuyerCartInterface;
use App\Services\Traits\ModelAbstraction\BuyerCartAbstraction;

final class BuyerCartController extends Controller //implements BuyerCartInterface, PaymentInterface
{
   use BuyerCartAbstraction;
   use BuyerCartRequestRules;

   public function __construct()
   {
        //$this->createBuyerDefault();
   }

   public function SavePendingCartDetails(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->savePendingCartDetailsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Invalid Pending Cart Details provided!");
         }
         
         //this should return in chunks or paginate:
         $detailsSaved = $this->BuyerSavePendingCartDetailsService($request);
         if( !$detailsSaved )
         {
            throw new \Exception("Pending Cart Details not saved!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'SaveSuccess!',
         ];

      }
      catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'SaveError!',
            'short_description' => $ex->getMessage()
         ];

      }
      /*finally
      {*/
         return response()->json($status, 200);
      //}
   }

   public function FetchEachBuyerCartDetails(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->fetchEachCartDetailsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Invalid Cart ID provided!");
         }
         
         //this should return in chunks or paginate:
         $detailsFound = $this->BuyerFetchEachCartDetailsService($request);
         if( empty($detailsFound) )
         {
            throw new \Exception("Pending Cart Details not found! Ensure that this is not a Cleared Cart ID.");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'FetchSuccess!',
            'cart_details' => $detailsFound
         ];

      }
      catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'FetchError!',
            'short_description' => $ex->getMessage()
         ];

      }
      /*finally
      {*/
         return response()->json($status, 200);
      //}
   }



   //first display the summary of all pending(not paid yet) or cleared cart(paid)
   public function FetchAllBuyerCartIDs(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->fetchAllBuyerCartIDsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not a logged in user!");
         }
         
         //this should return in chunks or paginate:
         $detailsFound = $this->BuyerFetchAllCartIDsService($request);
            if( empty($detailsFound) )
            {
               throw new \Exception("{ $request->payment_status === 'cleared' ? 'Cleared' : 'Pending'} Carts IDs not found!");
            }

         $status = [
            'code' => 1,
            'serverStatus' => 'FetchSuccess!',
            'allCartIDs' => $detailsFound
         ];

      }
      catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'FetchError!',
            'short_description' => $ex->getMessage()
         ];

      }
      /*finally
      {*/
         return response()->json($status, 200);
      //}
   }

   

}
