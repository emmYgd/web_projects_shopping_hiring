<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Validators\AdminCartRequestRules;

use App\Services\Interfaces\AdminCartInterface;
use App\Services\Traits\ModelAbstraction\AdminCartAbstraction;

final class AdminCartController extends Controller //implements BuyerCartInterface, PaymentInterface
{
   use AdminCartAbstraction;
   use AdminCartRequestRules;

   public function __construct()
   {
        //$this->createAdminDefault();
   }
  
   //first display the summary of all pending(not paid yet) or cleared cart(paid)
   public function FetchEachBuyerDetails(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->fetchEachBuyerDetailsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Wrong Buyer ID!");
         }
         
         //this should return in chunks or paginate:
         $detailsFound = $this->AdminFetchEachBuyerDetailsService($request);
         if( empty($detailsFound) )
         {
            throw new \Exception("Buyer Details not found!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'FetchSuccess!',
            'buyer_details' => $detailsFound
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
   public function FetchAllCartBuyerIDs(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->fetchAllCartBuyerIDsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not logged in yet!");
         }
         
         //this should return in chunks or paginate:
         $detailsFound = $this->AdminFetchAllCartBuyerIDsService();
         if( empty($detailsFound) )
         {
            throw new \Exception("No Buyer ID found!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'FetchSuccess!',
            'buyers' => $detailsFound
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


   public function FetchEachCartDetails(Request $request): JsonResponse
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
         $detailsFound = $this->AdminFetchEachCartDetailsService($request);
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
   public function FetchAllCartIDs(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->fetchAllCartIDsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not a logged in user!");
         }
         
         //this should return in chunks or paginate:
         $detailsFound = $this->AdminFetchAllCartIDsService($request);
            if( empty($detailsFound) )
            {
               throw new \Exception("${ $request->payment_status === 'Cleared' ? 'Cleared' : 'Pending'} Carts IDs not found!");
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
