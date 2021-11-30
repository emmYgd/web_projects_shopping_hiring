<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Support\Facades\Crypt;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;

trait BuyerPaymentAbstraction
{
	//inherits all their methods:
	use CartCRUD;
	use BuyerCRUD;

	protected function BuyerFetchAllCardDetailsService(Request $request): array | string
	{
		//init:
		$card_details = array();

		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$each_buyer_detail = $this->BuyerReadSpecificService($queryKeysValues);

		//prepare final return:
		$buyer_card_details['card_type'] = $each_buyer_detail->buyer_bank_card_type;
		$buyer_card_details['card_number'] = $each_buyer_detail->buyer_bank_card_number;
		$buyer_card_details['card_cvv'] = $each_buyer_detail->buyer_bank_card_cvv;
		$buyer_card_details['exp_month'] = $each_buyer_detail->buyer_bank_card_expiry_month;
		$buyer_card_details['exp_year'] = $each_buyer_detail->buyer_bank_card_expiry_year;

		//check for null:
		$all_array_values = array_values($buyer_card_details);
		if(is_null(max($all_array_values)))
		{
			$card_details = "Empty!";
		}
		else
		{
			foreach($buyer_card_details as $cardKey => $cardValue)
			{
				$decryptedValue = Crypt::decryptString($cardValue);
				//set decrypted value equivalent:
				$buyer_card_details[$cardKey] = $decryptedValue;
			}
			$card_details = $buyer_card_details;
			//$card_details = Crypt::decryptString($buyer_card_details['card_number']);
		}

		return $card_details;
	}

	protected function BuyerUploadCardDetailsService(Request $request): bool
	{
		$is_card_details_saved = null;

		$buyer_id = $request->unique_buyer_id;
		if($buyer_id !== "")
		{
			$queryKeysValues = ['unique_buyer_id' => $buyer_id];
			$newKeysValues = $request->except('unique_buyer_id');

			foreach($newKeysValues as $cardKey=>$cardValue)
			{
				//encrypt each values:
				$encCardValue = Crypt::encryptString($cardValue);
				$newKeywithEncValue = [$cardKey => $encCardValue];
				//save where:
				$is_card_details_saved = $this->BuyerUpdateSpecificService($queryKeysValues, $newKeywithEncValue);
				$is_card_details_saved = true; 
			}
		}
		
		return $is_card_details_saved;
	}


	private function FetchPendingOrClearedCardDetails(Request $request)
	{
		$queryKeysValues = [
			'unique_cart_id' => $request->unique_cart_id,
			'payment_status' => $request->payment_status
		];

		$each_cart_detail = $this->CardReadSpecificService($queryKeysValues);
		return $each_cart_detail;
	}


	public function BuyerFetchEachCardDetailsService(Request $request)
	{
		$cart_model = $this->FetchPendingOrClearedCardDetails($request);
		if(!$cart_model)
		{
			throw new \Exception("Card Details not found! Ensure that this belongs to appropriate Card Category.");
		}

		//get the buyer id:
		$buyer_id = $cart_model->unique_buyer_id;
		//now use this to get the buyer model:(this is in a bead to get buyer email and phone number)
		$queryKeysValues = ['unique_buyer_id' => $buyer_id];
		$buyer_model = $this->BuyerReadSpecificService($queryKeysValues);
		
		//begin to prepare the return array:
		$cart_model['cart_created_at'] = $cart_model->created_at;
		$cart_model['cart_updated_at'] = $cart_model->updated_at;
		$cart_model['buyer_email'] = $buyer_model->buyer_email;
		$cart_model['buyer_phone_number'] = $buyer_model->buyer_phone_number;

		return $cart_model;
	}	


	protected function BuyerFetchAllCardBuyerIDsService() 
	{
		$all_cart_buyer_details = $this->BuyerReadAllLazyService();
		
		//the above returns a collection: loop through to get only the ids:
		$all_cart_buyer_ids = $all_cart_buyer_details->pluck('unique_buyer_id');
		return $all_cart_buyer_ids;
	}
	
	protected function BuyerFetchAllCardIDsService(Request $request)
	{
	
		//assign:
		$queryKeysValues = ['payment_status' => $request->payment_status];

		$all_carts_found = $this->CardReadAllLazySpecificService($queryKeysValues);

		$all_unique_cart_ids = $all_carts_found->pluck('unique_cart_id');

		return $all_unique_cart_ids;
	}
}