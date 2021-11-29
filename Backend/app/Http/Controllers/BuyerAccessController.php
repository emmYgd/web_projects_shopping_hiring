<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Validators\BuyerAccessRequestRules;

use App\Services\Interfaces\BuyerAccessInterface;
use App\Services\Traits\ModelAbstraction\BuyerAccessAbstraction;
use App\Services\Traits\Utilities\ComputeUniqueIDService;
use App\Services\Traits\Utilities\PassHashVerifyService;


final class BuyerAccessController extends Controller //implements BuyerAccessInterface
{
    use BuyerAccessRequestRules;
    use BuyerAccessAbstraction;
    use ComputeUniqueIDService;
    use PassHashVerifyService;
    

    public function __construct()
    {
        //initialize Buyer Object:
        //public $Buyer = new Buyer;
    }
    

    public function Register(Request $request): JsonResponse 
    {
        $status = array();
        try
        {
            //get rules from validator class:
            $reqRules = $this->registerRules();

            //first validate the requests:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                //throw Exception:
                throw new \Exception("Invalid Input provided!");
            }

            //pass the validated value to the Model Abstraction Service: 
            $is_details_saved = $this->BuyerRegisterService($request);

            if(!$is_details_saved)
            {
                //delete the formerlly saved data:
                /*$deleteKeysValues = ['buyer_email' => $request->buyer_email];
                $this->BuyerDeleteSpecificService($deleteKeysValues);*/

                throw new \Exception("Your details could not be registered. Please try again!"); 
            }

            //since password can't be saved through mass assignment, so save specific:
            $hashedPass = $this->BuyerTransformPassService($request->buyer_password);
            //$this->HashPassword($request->password);

            //unique id can't be saved through mass assignment, so save specific:
            $uniqueID = $this->genUniqueAlphaNumID();

            $queryKeysValues = [
                'buyer_email' => $request->buyer_email
            ];

            $newKeysValues = [ 
                'buyer_password' => $hashedPass, 
                'unique_buyer_id' => $uniqueID 
            ];

            $are_pass_id_saved = $this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);

            if(!$are_pass_id_saved)
            {
                //delete the formerlly saved data:
                /*$deleteKeysValues = ['buyer_email' => $request->buyer_email];
                $this->BuyerDeleteSpecificService($deleteKeysValues);*/

                //then, throw exception: 
                throw new \Exception("Your details could not be registered. Please try again!"); 
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'RegEntriesSaved!',
            ];

        }
        catch(\Exception $ex)
        {

            /*$duplicationWarning1 = "Integrity constraint violation";
            $duplicationWarning2 = "SQLSTATE[23000]";*/
            $duplicationWarning = '1062 Duplicate entry';

            $status = [
                'code' => 0,
                'serverStatus' => 'RegEntriesNotSaved!',
                'short_description' => $ex->getMessage()
            ];

            if( 
                str_contains($status['short_description'], $duplicationWarning) 
            )
            {
                $status['warning'] = 'Either Your Email, Password or Phone Number have been used! Try Another.';
            }

        }
        finally
        {
            return response()->json($status, 200);
        }
    }


    public function LoginDashboard(Request $request): JsonResponse
    {

        $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->loginRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Invalid Input provided!");
            }

            $detailsFound = $this->BuyerDetailsFoundService($request);
            if(!$detailsFound)
            {
                throw new \Exception("Failed login attempt. Invalid Email Provided!");
            }

            //verify password against the hashed password in the database:
            //$is_pass_verified = password_verify($request->buyer_password, $detailsFound['buyer_password']);

            $hashedReqPass = $this->BuyerTransformPassService($request->buyer_password);
            $hashedStoredPass = $detailsFound['buyer_password'];
                
            if($hashedReqPass !== $hashedStoredPass)
            {
                throw new \Exception("Failed login attempt. Invalid Password Provided!");
            }

            //now start to prepare to update login status:
            //set query:
            $uniqueToken = $detailsFound['unique_buyer_id'];
            $queryKeysValues = ['unique_buyer_id' => $uniqueToken];
            //set the is_logged_in status as true:
            $newKeysValues = ['is_logged_in' => true];

            $change_login_status = $this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);

            if(!$change_login_status)
            {
                throw new \Exception("Failed login attempt. Please try again!");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'Found!',
                'uniqueToken' => $uniqueToken
            ];

        }
        catch(\Exception $ex)
        {

            $status = [
                'code' => 0,
                'serverStatus' => 'NotFound!',
                'short_description' => $ex->getMessage()
            ];

        }//finally{
            return response()->json($status, 200);
        //}
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

            $has_logged_in = $this->BuyerConfirmLoginStateService($request);
            if(!$has_logged_in)
            {
                throw new \Exception("Not logged in yet!");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'LoggedIn!',
            ];

        }
        catch(\Exception $ex)
        {
            $status = [
                'code' => 0,
                'serverStatus' => 'NotLoggedIn!',
                'short_description' => $ex->getMessage(),
            ];

        }
        /*finally
        {}*/
            return response()->json($status, 200);
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

            $has_updated = $this->BuyerUpdatePasswordService($request);

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
    
    //this might include payment details of this user..
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
            $is_details_saved = $this->BuyerUpdateEachService($request);
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


    //buyers can update their images if they so wish
    public function editImage(Request $request):  JsonResponse
    {
        $status = array();

        try{

            //get rules from validator class:
            $reqRules = $this->imagesRules();

            //validate here:
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails()){
                throw new \Exception("Invalid Input provided!");
            }

            //create without mass assignment:
            $files_has_saved = $this->BuyerSaveFilesService($request);
            if(!$files_has_saved/*false*/){
                throw new \Exception("File Details not saved!");
            }

             $status = [
                'code' => 1,
                'serverStatus' => 'filesSaved',
                //'requestLists' => $request->all()
            ];

        }catch(\Exception $ex){

             $status = [
                'code' => 0,
                'serverStatus' => 'filesNotSaved',
                'short_description' => $ex->getMessage()
            ];

        }finally{
            return response()->json($status, 200);
        }

    }


    public function Logout(Request $request):  JsonResponse
    {
         $status = array();

        try
        {
            //get rules from validator class:
            $reqRules = $this->logoutRules();

            //validate here:'new_pass'
            $validator = Validator::make($request->all(), $reqRules);

            if($validator->fails())
            {
                throw new \Exception("Access denied, not logged in!");
            }

            $has_logged_out = $this->BuyerLogoutService($request);
            if(!$has_logged_out/*false*/)
            {
                throw new \Exception("Not logged out yet!");
            }

            $status = [
                'code' => 1,
                'serverStatus' => 'LoggedOut!',
            ];

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
