<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;

trait BuyerCartAbstraction
{
	//inherits all their methods:
	use CartCRUD;
	use BuyerCRUD;

	private function FetchPendingOrClearedCartDetails(Request $request)
	{
		$queryKeysValues = [
			'unique_cart_id' => $request->unique_cart_id,
			'payment_status' => $request->payment_status
		];

		$each_cart_detail = $this->CartReadSpecificService($queryKeysValues);
		return $each_cart_detail;
	}


	public function BuyerFetchEachCartDetailsService(Request $request)
	{
		$cart_model = $this->FetchPendingOrClearedCartDetails($request);
		if(!$cart_model)
		{
			throw new \Exception("Cart Details not found! Ensure that this belongs to appropriate Cart Category.");
		}

		//get the buyer id:
		$buyer_id = $cart_model->unique_buyer_id;
		
		//begin to prepare the return array:
		$cart_model['cart_created_at'] = $cart_model->created_at;
		$cart_model['cart_updated_at'] = $cart_model->updated_at;

		return $cart_model;
	}	

	protected function BuyerFetchAllCartIDsService(Request $request)
	{
	
		//assign:
		$queryKeysValues = [
			'unique_buyer_id' => $request->unique_buyer_id,
			'payment_status' => $request->payment_status
		];

		$all_carts_found = $this->CartReadAllLazySpecificService($queryKeysValues);

		$all_unique_cart_ids = $all_carts_found->pluck('unique_cart_id');

		return $all_unique_cart_ids;
	}
}