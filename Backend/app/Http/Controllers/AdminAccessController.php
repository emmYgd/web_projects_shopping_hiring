<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Validators\AdminAccessRequestRules;

use App\Services\Interfaces\AdminAccessInterface;
use App\Services\Traits\ModelAbstraction\AdminAccessAbstraction;
use App\Services\Traits\Utilities\PassHashVerifyService;

final class AdminAccessController extends Controller /*implements AdminAccessInterface*/
{
    use AdminAccessRequestRules;
    use AdminAccessAbstraction;
    use PassHashVerifyService;
    
    public function __construct()
    {
    }

    public function Login(Request $request): JsonResponse
    {
        $status = array();

        try{

            //get rules from validator class:
            $reqRules = $this->loginRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            $detailsFound = $this->AdminDetailsFoundService($request);
            if(!$detailsFound)
            {
                throw new \Exception("Failed login attempt. Invalid Email Provided!");
            }

            //verify password against the hashed password in the database:
            $is_pass_verified = $this->VerifyPassword($request->password, $detailsFound['password']);
            if(!$is_pass_verified)
            {
                throw new \Exception("Failed login attempt. Invalid Password Provided!");
            }

            //set query:
            $uniqueToken = $detailsFound['token_id'];
            $queryKeysValues = ['token_id' => $uniqueToken];

            //set the is_logged_in status as true:
            $newKeysValues = ['is_logged_in' => true];

            $change_login_status = $this->AdminUpdateSpecificService($queryKeysValues, $newKeysValues);
            if(!$change_login_status)
            {
                throw new \Exception("Failed login attempt. You are not an Admin.");

                //fire an event to send a mail to the admin here to report of this failed attempt..
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'Found!',
                'uniqueID' => $uniqueToken
            ];

        }catch(\Exception $ex){

            $status = [
                'code' => 0,
                'serverStatus' => 'NotFound!',
                'short_description' => $ex->getMessage()
            ];

        }/*finally{*/
            return response()->json($status, 200);
        /*}*/
    }

    public function ConfirmLoginState(Request $request): JsonResponse
    {
         $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->confirmLoginStateRules();

            //validate here:'new_pass'
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            $token_id = $request->token_id;

            $has_logged_in = $this->AdminConfirmLoginStateService($token_id);
            if($has_logged_in == false)
            {
                throw new \Exception("Not logged in yet!");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'loggedIn',
            ];

        }
        catch(\Exception $ex)
        {
            $status = [
                'code' => 0,
                'serverStatus' => 'notLoggedIn',
                'short_description' => $ex->getMessage(),
            ];

        }
        /*finally
        {}*/
            return response()->json($status, 200);
    }
    

    public function editProfile(Request $request): JsonResponse
    {
         $status = array();

        try{

            //get rules from validator class:
            $reqRules = $this->editRules();

            //validate here:'new_pass'
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails()){
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $is_details_saved = $this->AdminUpdateEachService($request);
            if(!$is_details_saved/*false*/){
                throw new \Exception("Details not saved!");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'detailsSaved',
            ];

        }catch(\Exception $ex){

            $status = [
                'code' => 0,
                'serverStatus' => 'detailsNotSaved',
                'short_description' => $ex->getMessage()
            ];

        }finally{
            return response()->json($status, 200);
        }
    }
    
    public function forgotPassword(Request $request): JsonResponse
    {

        $status = array();

        try{

            //get rules from validator class:
            $reqRules = $this->forgotPassRules();

            //validate here:'new_pass'
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails()){
                throw new \Exception("Invalid Input provided!");
            }

            $has_updated = $this->AdminUpdatePasswordService($request);

            if(!$has_updated){
                throw new \Exception("Password could not be changed");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'passUpdated',
            ];

        }catch(\Exception $ex){

            $status = [
                'code' => 0,
                'serverStatus' => 'updateFailed',
                'short_description' => $ex->getMessage()
            ];

        }finally{
            return response()->json($status, 200);
        }
    }
     

    public function Logout(Request $request):  JsonResponse
    {
        $status = array();

        try{

            //get rules from validator class:
            $reqRules = $this->logoutRules();

            //validate here:'new_pass'
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Access denied, not logged in!");
            }

            $has_logged_out = $this->AdminLogoutService($request);
            if(!$has_logged_out)
            {
                throw new \Exception("Not logged out yet!");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'LoggedOut!',
            ];

            //redirect on the frontend on receiving this... 

        }catch(\Exception $ex){

             $status = [
                'code' => 0,
                'serverStatus' => 'NotLoggedOut!',
                'short_description' => $ex->getMessage()
            ];

        }//finally{
            return response()->json($status, 200);
        //}
    }

}

?>
