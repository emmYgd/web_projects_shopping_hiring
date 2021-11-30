<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;
//use Illuminate\Database\Eloquent\Collection;

use App\Services\Traits\ModelCRUD\PaymentCRUD;
use App\Services\Traits\ModelCRUD\BillingCRUD;
use App\Services\Traits\ModelCRUD\ShippingDRUD;


trait AdminBankandPaymentAbstraction
{
	use PaymentCRUD;
	use AdminBankDetailsCRUD;

	protected function AdminSaveBankDetailsService(Request $request) //: bool
	{
		$details_saved_status = false;

		//first get if Business Details table is not empty:
		$adminBankDetails = $this->AdminBankDetailsReadAllService();
		if( $adminBankDetails->count() !== 0 )
		{
			//return "Cool";
			//now first get the admin token id:
			$token_id = $request->token_id;

			//then update thus:
			$queryKeysValues = ['token_id' => $token_id];
			$newKeysValues = $request->except('token_id');

			//call the update function:
			$is_details_saved = $this->AdminBankDetailsUpdateSpecificService($queryKeysValues, $newKeysValues);

			$details_saved_status = $is_details_saved;
		}
		else
		//if( $adminBankDetails->count() == 0 )
		{
			//return "Cool Thingy";
			//else:
			$params_to_be_saved = $request->all();
			//save all using mass assignment:
			$is_details_saved = $this->AdminBankDetailsCreateAllService($params_to_be_saved);

			$details_saved_status = $is_details_saved;
		}

		return $details_saved_status;	
	}


	protected function AdminFetchBankDetailsService(Request $request)
	{
		$queryKeysValues = ['token_id' => $request->token_id];
		$allBizDetails = $this->AdminBankDetailsReadSpecificService($queryKeysValues);

		return $allBizDetails;
	}
}

?>