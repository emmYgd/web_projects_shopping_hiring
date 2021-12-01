<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\BuyerCRUD;
use App\Services\Traits\ModelAbstraction\BuyerAccessAbstraction;

trait BuyerAccountAbstraction
{
	//BuyerAccessAbstraction imports BuyerCRUD by default
	//use BuyerCRUD;
	use BuyerAccessAbstraction;

	protected function BuyerSaveAccountDetailsService(Request $request) //: bool
	{
		$is_details_saved = false;
		//then update thus:
		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$filteredKeysValues = $request->except(['unique_buyer_id', 'buyer_password']);
		foreach ($filteredKeysValues as $reqKey => $reqVal) {
			if($reqVal !== "")
			{
				//save if not empty
				$newKeysValues = [$reqKey => $reqVal];
				$is_details_saved = $this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);
			}
		}

		if($request->buyer_password !== "")
		{
			if($is_details_saved)
			{
				//save received password as a hash
				$hashedNewPass = $this->BuyerTransformPassService($request->buyer_password);
				$newKeysValues = ['buyer_password' => $hashedNewPass];

				$is_details_saved = $this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);
			}
		}

		return $is_details_saved;
	}


	protected function BuyerFetchAccountDetailsService(Request $request)
	{
		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$allAccountDetails = $this->BuyerReadSpecificService($queryKeysValues);

		/*$basic_account_details = $allAccountDetails->include(['buyer_first_name', 'buyer_middle_name', 'buyer_last_name', 'buyer_phone_number', 'buyer_email']);*/
		$basic_account_details = [
			'buyer_first_name' => $allAccountDetails->buyer_first_name,
			'buyer_middle_name' => $allAccountDetails->buyer_middle_name,
			'buyer_last_name' => $allAccountDetails->buyer_last_name,
			'buyer_phone_number' => $allAccountDetails->buyer_phone_number,
			'buyer_email' => $allAccountDetails->buyer_email,
		];
		return $basic_account_details;
	}
}

?>