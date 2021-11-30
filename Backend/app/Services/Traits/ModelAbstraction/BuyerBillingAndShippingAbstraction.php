<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\BillingCRUD;
use App\Services\Traits\ModelCRUD\ShippingDRUD;


trait BuyerBillingAndShippingAbstraction
{
	use BuyerBillingCRUD;
	use BuyerShippingCRUD;

	protected function BuyerSaveBillingDetailsService(Request $request) //: bool
	{
		$details_saved_status = false;

		//first get if Business Details table is not empty:
		$adminBankDetails = $this->BuyerBillingReadAllService();
		if( $adminBankDetails->count() !== 0 )
		{
			//return "Cool";
			//now first get the admin token id:
			$token_id = $request->token_id;

			//then update thus:
			$queryKeysValues = ['token_id' => $token_id];
			$newKeysValues = $request->except('token_id');

			//call the update function:
			$is_details_saved = $this->BuyerBillingUpdateSpecificService($queryKeysValues, $newKeysValues);

			$details_saved_status = $is_details_saved;
		}
		else
		//if( $adminBankDetails->count() == 0 )
		{
			//return "Cool Thingy";
			//else:
			$params_to_be_saved = $request->all();
			//save all using mass assignment:
			$is_details_saved = $this->BuyerBillingDetailsCreateAllService($params_to_be_saved);

			$details_saved_status = $is_details_saved;
		}

		return $details_saved_status;	
	}


	protected function BuyerFetchBillingDetailsService(Request $request)
	{
		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$allBillingDetails = $this->BuyerBillingReadSpecificService($queryKeysValues);

		return $allBillingDetails;
	}


	protected function BuyerSaveShippingDetailsService(Request $request) //: bool
	{
		$details_saved_status = false;

		//first get if Business Details table is not empty:
		$adminBankDetails = $this->BuyerShippingReadAllService();
		if( $adminBankDetails->count() !== 0 )
		{
			//return "Cool";
			//now first get the admin token id:
			$token_id = $request->token_id;

			//then update thus:
			$queryKeysValues = ['token_id' => $token_id];
			$newKeysValues = $request->except('token_id');

			//call the update function:
			$is_details_saved = $this->BuyerShippingUpdateSpecificService($queryKeysValues, $newKeysValues);

			$details_saved_status = $is_details_saved;
		}
		else
		//if( $adminBankDetails->count() == 0 )
		{
			//return "Cool Thingy";
			//else:
			$params_to_be_saved = $request->all();
			//save all using mass assignment:
			$is_details_saved = $this->BuyerShippingDetailsCreateAllService($params_to_be_saved);

			$details_saved_status = $is_details_saved;
		}

		return $details_saved_status;	
	}


	protected function BuyerFetchShippingDetailsService(Request $request)
	{
		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$allShippingDetails = $this->BuyerShippingReadSpecificService($queryKeysValues);

		return $allShippingDetails;
	}
}

?>