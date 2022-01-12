<?php

namespace App\Services\Traits\ModelAbstraction;

use App\Models\Buyer;
use App\Services\Traits\ModelCRUD\BuyerCRUD;
use App\Services\Traits\Utilities\PassHashVerifyService;
use App\Services\Traits\Utilities\ComputeUniqueIDService;

use Illuminate\Http\Request;

trait BuyerAccessAbstraction
{	
	//inherits all their methods:
	use BuyerCRUD;
	use ComputeUniqueIDService;
	use PassHashVerifyService;

	protected function BuyerConfirmLoginStateService(Request $request) : bool
	{

		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$detailsFound = $this->BuyerReadSpecificService($queryKeysValues);

		//get the login state:
		$login_status = $detailsFound['is_logged_in'];
		return $login_status;
	}

	protected function BuyerLogoutService(Request $request): bool
	{
		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$newKeysValues = ['is_logged_in' => false];
		$has_logged_out = $this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);

		return $has_logged_out;
	}

	protected function BuyerRegisterService(Request $request): bool
	{
		$newKeyValues = $request->all();
		//create new buyer:
		$is_details_saved = $this->BuyerCreateAllService($newKeyValues);
		return $is_details_saved;
	}

	protected function BuyerDeleteSpecificService($deleteKeysValues): bool
	{
		$is_details_deleted = $this->BuyerDeleteSpecificService($deleteKeysValues);
		return $is_details_deleted;
	}

	protected function BuyerDetailsFoundService(Request $request) : Buyer | null
	{
		$buyer_email = $request->buyer_email;

        //query KeyValue Pair:
        $queryKeysValues = ['buyer_email' => $buyer_email];
        $detailsFound = $this->BuyerReadSpecificService($queryKeysValues);
        return $detailsFound;
    }

    protected function BuyerTransformPassService(string $reqPass): string
    {
    	$returnValueOrState = null;

    	$firstPass = md5(md5($reqPass));
    	$secondPass = md5(md5($reqPass));
    	$finalHashedPass = md5($firstPass . $secondPass);

    	return $finalHashedPass;
    }

    protected function BuyerDeleteAllNullService($deleteKeysValues): bool
    {
    	//get all null valued collections:
    	$this->BuyerDeleteSpecificService($deleteKeysValues);
    	return true;
    }

	protected function BuyerUpdatePasswordService(Request $request): bool
	{
		$email = $request->input('buyer_email');
        $new_pass = $request->input('new_password');

		//hash password before save:
        $hashedPass = $this->BuyerTransformPassService($new_pass);

        //query KeyValue Pair:
        $queryKeysValues = ['buyer_email' => $email];
		
		$newKeysValues = ['buyer_password' => $hashedPass];

		//attempt at email, then password:
        $is_pass_updated = $this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);

        return $is_pass_updated;
	}


	//update each fields without mass assignment: Specific Logic 
	protected function BuyerUpdateEachService(Request $request): bool
	{
		$buyer_id = $request->buyer_id;

		if($buyer_id !== ""){

			$request = $request->except('buyer_id');

			foreach($request as $reqKey => $reqValue){

				$queryKeysValues = ['buyer_id' => $buyer_id];

				if(is_array($reqValue)){
					$newKeysValues = [$reqKey => json_encode($reqValue)];
				}else{
					$newKeysValues = [$reqKey => $reqValue];
				}
				$this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);
			}
		}
		return true;
	}
}

?>