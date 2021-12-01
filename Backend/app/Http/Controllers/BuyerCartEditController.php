<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Validators\BuyerCartRequestRules;

use App\Services\Interfaces\BuyerCartInterface;
use App\Services\Traits\ModelAbstraction\BuyerCartAbstraction;
use App\Services\Interfaces\PaymentInterface;
use App\Services\Traits\ModelAbstraction\PaymentAbstraction;

final class BuyerCartEditController extends Controller //implements BuyerCartInterface, PaymentInterface
{
   use BuyerCartEditAbstraction, BuyerCartEditRequestRules;
   use PaymentAbstraction, PaymentAbstractionRules;

   public function __construct()
   {
        //$this->createAdminDefault();
   }

   public function AddGoodsToCart(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->addGoodsToCartRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails()){
            throw new \Exception("Invalid Input provided!");
         }

         //this should return in chunks or paginate:
         $is_cart_created = $this->BuyerAddGoodsToCartService($request);
         if(!$is_cart_created) {
            throw new \Exception("Cart Not Created successfully!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'Creation Success!',
         ];

      }
      catch(\Exception $ex)
      {
         $status = [
            'code' => 0,
            'serverStatus' => 'Creation Error!',
            'short_description' => $ex->getMessage()
         ];

      }
      finally
      {
         return response()->json($status, 200);
      }

   }

   //first display the summary of all pending(not paid yet) or cleared cart(paid)
   public function ViewCartsByCategory(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->viewCartsByCategoryRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails()){
            throw new \Exception("Access Error, Not logged in yet!");
         }
         
         //this should return in chunks or paginate:
         $detailsFound = $this->BuyerViewCartByCategoryService($request);
            if( empty($detailsFound) ){
               throw new \Exception("${ $request->is_cleared ? 'Cleared' : 'Pending'} Carts not found!");
            }

         $status = [
            'code' => 1,
            'serverStatus' => 'Search Success!',
            'employers' => $detailsFound
         ];

      }
      catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'Search Error!',
            'short_description' => $ex->getMessage()
         ];

      }
      finally
      {
         return response()->json($status, 200);
      }

   }


   public function EditPendingCartGoods(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->editPendingCartGoodsRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Invalid Input Provided!");
         }

         $cart_was_edited = $this->BuyerEditPendingCartGoodsService($request);

         if(!$is_details_saved)
         {
            throw new \Exception("Wasn't able to change cart contents successfully!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'Cart Contents Changed Successfully!'
         ];

      }
      catch(\Exception $ex)
      {
         $status = [
            'code' => 0,
            'serverStatus' => 'Update Error!',
            'short_description' => $ex->getMessage()
         ];

      }
      finally
      {
         return response()->json($status, 200);
      }

   }


   public function DeletePendingCart(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->deletePendingCartRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not logged in yet!");
         }

         //this should return in chunks or paginate:
         $is_cart_deleted = $this->BuyerDeletePendingCartService($request);
         if(!$is_cart_deleted)
         {
            throw new \Exception("Cart not deleted successfully!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'Cart Deleted!',
         ];

      }catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'Cart Not Deleted Yet!',
            'short_description' => $ex->getMessage()
         ];

      }finally
      {
         return response()->json($status, 200);
      }

   }
   
   
}
