<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Validators\BuyerReferralRequestRules;

use App\Services\Interfaces\BuyerReferralInterface;
use App\Services\Traits\ModelAbstraction\BuyerReferralAbstraction;

final class BuyerExtrasController extends Controller //implements BuyerExtrasInterface
{
   use BuyerReferralRequestRules;
   use BuyerReferralAbstraction;

   public function __construct()
   {
        //$this->createAdminDefault();
   }

   public function GenReferralLinks(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->genReferralLinksRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not logged in yet!");
         }

         //this should return in chunks or paginate:
         $links_has_formed = $this->BuyerGenReferralLinksService($request);
         if(!$links_has_formed)
         {
            throw new \Exception("Referral links not formed!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'Referral Links Formed!',
            'referral_link' => $$links_has_formed
         ];

      }catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'Link Formation Error!',
            'short_description' => $ex->getMessage(),
         ];

      }finally
      {
         return response()->json($status, 200);
      }
      
   }

   ReferralBonus
   public function ReferralUsage(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->referralBonusRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not logged in yet!");
         }

         //this should return in chunks or paginate:
         $links_has_formed = $this->BuyerGenReferralLinksService($request);
         if(!$links_has_formed)
         {
            throw new \Exception("Referral links not formed!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'Referral Links Formed!',
            'referral_link' => $links_has_formed
         ];

      }catch(\Exception $ex)
      {

         $status = [
            'code' => 0,
            'serverStatus' => 'Link Formation Error!',
            'short_description' => $ex->getMessage(),
         ];

      }finally
      {
         return response()->json($status, 200);
      }
      
   }


}