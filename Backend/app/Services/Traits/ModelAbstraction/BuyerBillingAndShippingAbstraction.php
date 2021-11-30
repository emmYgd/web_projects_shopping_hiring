<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\BuyerBillingCRUD;
use App\Services\Traits\ModelCRUD\BuyerShippingCRUD;


trait BuyerBillingAndShippingAbstraction
{
	use BuyerBillingCRUD;
	use BuyerShippingCRUD;

	protected function BuyerSaveBillingDetailsService(Request $request) //: bool
	{
		$details_saved_status = false;

		//first get if Business Details table is not empty:
		$buyerBillingDetails = $this->BuyerBillingReadAllService();
		if( $buyerBillingDetails->count() !== 0 )
		{
			//return "Cool";
			//now first get the buyer token id:
			//then update thus: 
			$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
			$newKeysValues = $request->except('token_id');

			//call the update function:
			$is_details_saved = $this->BuyerBillingUpdateSpecificService($queryKeysValues, $newKeysValues);

			$details_saved_status = $is_details_saved;
		}
		else
		//if( $buyerBankDetails->count() == 0 )
		{
			//return "Cool Thingy";
			//else:
			$params_to_be_saved = $request->all();
			//save all using mass assignment:
			$is_details_saved = $this->BuyerBillingCreateAllService($params_to_be_saved);

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
		$buyerShippingDetails = $this->BuyerShippingReadAllService();
		if( $buyerShippingDetails->count() !== 0 )
		{
			//return "Cool";
			//now first get the buyer token id:
			//then update thus:
			$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
			$newKeysValues = $request->except('unique_buyer_id');

			//call the update function:
			$is_details_saved = $this->BuyerShippingUpdateSpecificService($queryKeysValues, $newKeysValues);

			$details_saved_status = $is_details_saved;
		}
		else
		//if( $buyerBankDetails->count() == 0 )
		{
			//return "Cool Thingy";
			//else:
			$params_to_be_saved = $request->all();
			//save all using mass assignment:
			$is_details_saved = $this->BuyerShippingCreateAllService($params_to_be_saved);

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