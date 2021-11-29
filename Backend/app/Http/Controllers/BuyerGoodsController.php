<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Validators\BuyerGoodsRequestRules;

use App\Services\Interfaces\BuyerCartInterface;
use App\Services\Traits\ModelAbstraction\BuyerCartAbstraction;

final class BuyerCartController extends Controller //implements BuyerCartInterface
{
   use BuyerCartAbstraction;
   use BuyerCartRequestRules;

   public function __construct()
   {
        //$this->createAdminDefault();
   }

    public function ViewAvailableGoods(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->viewAllAvailableGoods();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails()){
            throw new \Exception("Access Error, Not logged in yet!");
         }

         //this should return in chunks or paginate:
         $detailsFound = $this->BuyerViewAvailableGoodsService($request);
         if( empty($detailsFound) ){
            throw new \Exception("Commodities for sale not Found!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'Search Success!',
            'employers' => $detailsFound
         ];

      }catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'Search Error!',
            'short_description' => $ex->getMessage()
         ];

      }finally
      {
         return response()->json($status, 200);
      }

   }

}