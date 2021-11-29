<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;

trait AdminCartAbstraction
{
	//inherits all their methods:
	use CartCRUD;
	use BuyerCRUD;

	protected function AdminFetchEachBuyerDetailsService(Request $request)
	{
		$queryKeysValues = ['unique_buyer_id' => $request->unique_buyer_id];
		$each_buyer_detail = $this->BuyerReadSpecificService($queryKeysValues);

		//obtain associated cart_ids
		$assoc_cart_details = $this->CartReadAllLazySpecificService($queryKeysValues);
		$assoc_cart_ids = $assoc_cart_details->pluck('unique_cart_id');

		//obtain total purchase price made(plus shipping)
		$total_price_purchased = $assoc_cart_details->pluck('purchase_price')->sum();

		//obtain associated billing address

		//obtain associated shipping address  

		//prepare final return:
		$each_buyer_detail['assoc_cart_ids'] = $assoc_cart_ids;//->toArray();
		$each_buyer_detail['total_purchase_made'] = $total_price_purchased;

		return $each_buyer_detail;
	}


	private function FetchPendingOrClearedCartDetails(Request $request)
	{
		$queryKeysValues = [
			'unique_cart_id' => $request->unique_cart_id,
			'payment_status' => $request->payment_status
		];

		$each_cart_detail = $this->CartReadSpecificService($queryKeysValues);
		return $each_cart_detail;
	}


	public function AdminFetchEachCartDetailsService(Request $request)
	{
		$cart_model = $this->FetchPendingOrClearedCartDetails($request);
		if(!$cart_model)
		{
			throw new \Exception("Cart Details not found! Ensure that this belongs to appropriate Cart Category.");
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


	protected function AdminFetchAllCartBuyerIDsService() 
	{
		$all_cart_buyer_details = $this->BuyerReadAllLazyService();
		
		//the above returns a collection: loop through to get only the ids:
		$all_cart_buyer_ids = $all_cart_buyer_details->pluck('unique_buyer_id');
		return $all_cart_buyer_ids;
	}
	
	protected function AdminFetchAllCartIDsService(Request $request)
	{
	
		//assign:
		$queryKeysValues = ['payment_status' => $request->payment_status];

		$all_carts_found = $this->CartReadAllLazySpecificService($queryKeysValues);

		$all_unique_cart_ids = $all_carts_found->pluck('unique_cart_id');

		return $all_unique_cart_ids;
	}
}