<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Services\Traits\ModelCRUD\ProductCRUD;
use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;
use App\Services\Traits\ModelAbstraction\BuyerProductAbstraction;

use App\Services\Traits\Utilities\ComputeUniqueIDService;

trait BuyerCartAbstraction
{
	//inherits all their methods:
	use ProductCRUD;
	use CartCRUD;
	use BuyerCRUD;
	use BuyerProductAbstraction;

	use ComputeUniqueIDService;

	public function BuyerSavePendingCartDetailsService(Request $request)
	{ 
		//first compute the unique cart id:
		$unique_cart_id = $this->genUniqueAlphaNumID();
		//now add this to the incoming request:
		$request['unique_cart_id'] = $unique_cart_id;

		//persist in database:
		$is_cart_created = $this->CartCreateAllService($request->all());
		return $is_cart_created;
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
		$all_cart_product_summaries = $cart_model->attached_goods_ids;
		//now use these obtained ids to get the product info from the corresponding Product table:
		if(empty($all_cart_product_summaries))
		{
			$this->DeleteEmptyPendingCarts($request);
			throw new \Exception("This is an invalid Cart! Pending Cart goods content cannot be empty!");
		}

		//Also, return all products so that frontend can query:
		$all_product_model = $this->BuyerFetchAvailableProductsService();

		//first start by plucking all keys and values:
		/*$all_product_ids = $all_cart_product_summaries->pluck('key');
		foreach ($all_product_ids as $each_product_id) 
		{
			$queryKeysValues = ['product_token_id' => $each_product_id];
			$product_model = $this->ProductReadSpecificService($queryKeysValues);
			$product_ = $product_model->product_title 
			'product_price', 'product_shipping_cost']);
		}*/
	
		//begin to prepare the return array:
		$cart_model['all_product_models'] = $all_product_model;
		$cart_model['cart_created_at'] = $cart_model->created_at;
		$cart_model['cart_updated_at'] = $cart_model->updated_at;

		//$cart_model['cart_summary'] = $product_model_specific;

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