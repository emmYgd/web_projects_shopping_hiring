<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Validators\BuyerReferralRequestRules;

use App\Services\Interfaces\BuyerReferralInterface;
use App\Services\Traits\ModelAbstraction\BuyerReferralAbstraction;

final class BuyerReferralController extends Controller //implements BuyerExtrasInterface
{
   use BuyerReferralRequestRules;
   use BuyerReferralAbstraction;

   public function __construct()
   {
        //$this->createAdminDefault();
   }

   public function GenUniqueReferralLink(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         $reqRules = $this->genUniqueReferralLinkRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not logged in yet!");
         }

         //this should return in chunks or paginate:
         $unique_referral_link = $this->BuyerGenReferralLinkService($request);
         if(!$unique_referral_link)
         {
            throw new \Exception("Referral link not formed!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'RefLinkFormed!',
            'referral_link' =>  $unique_referral_link
         ];

      }
      catch(\Exception $ex)
      {
         $status = [
            'code' => 0,
            'serverStatus' => 'RefLinkNotFormed!',
            'short_description' => $ex->getMessage(),
         ];

      }/*finally
      {*/
         return response()->json($status, 200);
      //}
      
   }

   public function ReferralBonus(Request $request): JsonResponse
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
         $ref_bonus_details = $this->BuyerGetReferralBonusService($request);
         if( empty($ref_bonus_details) ) 
         {
            throw new \Exception("Referral Bonus not found!");
         }

         $status = [
            'code' => 1,
            'serverStatus' => 'FetchSuccess!',
            'referral_bonus_details' =>  $ref_bonus_details
         ];

      }
      catch(\Exception $ex)
      {
         $status = [
            'code' => 0,
            'serverStatus' => 'FetchError!',
            'short_description' => $ex->getMessage(),
         ];

      }/*finally
      {*/
         return response()->json($status, 200);
      //}
      
   }


   public function ReferralLinkUse(Request $request): JsonResponse
   {
      $status = array();

      try
      {
         //get rules from validator class:
         /*$reqRules = $this->referralLinkUseRules();

         //validate here:
         $validator = Validator::make($request->all(), $reqRules);

         if($validator->fails())
         {
            throw new \Exception("Access Error, Not logged in yet!");
         }*/

         //this should return in chunks or paginate:
         $bonus_has_recorded = $this->BuyerReferralLinkUseService($unique_buyer_id);
         if($bonus_has_recorded)
         {
           //redirect to our homepage:

         }

         /*$status = [
            'code' => 1,
            'serverStatus' => 'Referral Links Formed!',
            'referral_link' => $links_has_formed
         ];*/

      }catch(\Exception $ex)
      {

         /*$status = [
            'code' => 0,
            'serverStatus' => 'Link Formation Error!',
            'short_description' => $ex->getMessage(),
         ];*/

      }finally
      {
         //return response()->json($status, 200);
         //redirect to our homepage:

      }
      
   }


}