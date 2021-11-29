<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Models\Admin;
use App\Services\Traits\ModelCRUD\AdminCRUD;
use App\Services\Traits\Utilities\ComputeUniqueIDService;
use App\Services\Traits\Utilities\PassHashVerifyService;


trait AdminAccessAbstraction
{	
	//inherits all their methods:
	use AdminCRUD;
	use ComputeUniqueIDService;
	use PassHashVerifyService;

	protected function AdminConfirmLoginStateService(string $token_id) : bool
	{

		$queryKeysValues = ['token_id' => $token_id];
		$detailsFound = $this->AdminReadSpecificService($queryKeysValues);

		//get the login state:
		$login_status = $detailsFound['is_logged_in'];
		return $login_status;
	}


	protected function AdminLogoutService(Request $request): bool
	{
		$queryKeysValues = ['token_id' => $request->token_id];
		$newKeysValues = ['is_logged_in' => false];
		$has_logged_out = $this->AdminUpdateSpecificService($queryKeysValues, $newKeysValues);

		return $has_logged_out;
	}

	protected function AdminDetailsFoundService(Request $request) : Admin | null
	{
		$email = $request->email;
        $pass = $request->password;

        //query KeyValue Pair:
        $queryKeysValues = ['email' => $email];
        //$details_were_found = Admin::where($queryKeysValues)->first();
        $details_were_found = $this->AdminReadSpecificService($queryKeysValues);

		return $details_were_found;
	}


	//update each fields without mass assignment: Specific Logic 
	protected function AdminUpdateEachService(Request $request): bool
	{
		$admin_id = $request->admin_id;

		if($admin_id !== ""){

			$request = $request->except('admin_id');

			foreach($request as $reqKey => $reqValue){

				$queryKeysValues = ['admin_id' => $admin_id];

				if(is_array($reqValue)){
					$newKeysValues = [$reqKey => json_encode($reqValue)];
				}else{
					$newKeysValues = [$reqKey => $reqValue];
				}
				$this->AdminUpdateSpecificService($queryKeysValues, $newKeysValues);
			}
		}
		return true;
	}


	protected function AdminSaveFilesService(Request $request): bool
	{
		/*note: files are to be stored in the database for now...
		this could change in the future to include storing files on disk 
		and remote file storage system */

		$admin_id = $request->admin_id;

		if($admin_id !== ""){
			//query and new Keys and values:
			$queryKeysValues = ['admin_id' => $admin_id];
			$filteredRequest = $request->except('admin_id');
			$newKeysValues = $filteredRequest;

			foreach($newKeysValues as $fileKey => $fileValue){

				while(
					$filteredRequest->hasFile($fileKey) && 
					$filteredRequest->file($fileKey)->isValid()
				)
				{
					$this->AdminUpdateSpecificService($queryKeysValues, $newKeysValues);
				}
			}
		}

		return true;
	}
	
}

?>