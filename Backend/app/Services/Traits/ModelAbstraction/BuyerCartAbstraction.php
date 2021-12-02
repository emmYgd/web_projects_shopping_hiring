<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\ProductCRUD;
use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;

trait BuyerCartAbstraction
{
	//inherits all their methods:
	use ProductCRUD;
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

	private function DeleteEmptyPendingCarts(Request $request)
	{
		$deleteKeysValues = [
			'unique_cart_id' => $request->unique_cart_id,
			'payment_status' => 'pending'
		];

		$is_cart_deleted = $this->CartDeleteSpecificService($deleteKeysValues);
		return $is_cart_deleted;
	}


	public function BuyerFetchEachCartDetailsService(Request $request)
	{
		$cart_model = $this->FetchPendingOrClearedCartDetails($request);
		if(!$cart_model)
		{

			throw new \Exception("Cart Details not found! Ensure that this belongs to appropriate Cart Category.");
		}

		//get the attached goods is:
		$array_all_product_ids = $cart_model->attached_goods_ids;
		//now use these obtained ids to get the product info from the corresponding Product table:
		if(empty($array_all_product_ids))
		{
			$this->DeleteEmptyPendingCarts($request);
			throw new \Exception("This is an invalid Cart! Panding Cart goods content cannot be empty!");
		}
		foreach ($array_all_product_ids as $each_product_id) 
		{
			$queryKeysValues = ['product_token_id' => $each_product_id];
			$product_model = $this->ProductReadAllLazySpecificService($queryKeysValues);
			$product_model_specific = $product_model->pluck(['product_title', 'product_currency_of_payment', 'product_price', 'product_shipping_cost']);
		}
	
		//begin to prepare the return array:
		$cart_model['cart_created_at'] = $cart_model->created_at;
		$cart_model['cart_updated_at'] = $cart_model->updated_at;

		$cart_model['assoc_products_summary'] = $product_model_specific;

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