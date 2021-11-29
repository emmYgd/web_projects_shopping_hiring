<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;

use App\Models\Buyer;

use App\Services\ModelCRUD\BuyerCRUD;
use App\Services\ModelCRUD\CartCRUD;
use App\Services\ModelCRUD\CommodityCRUD;

use App\Services\Utilities\ComputeUniqueIDService;

trait BuyerCartAbstraction
{
	//inherits all their methods:
	use CommodityCRUD;
	use BuyerCRUD;
	use CartCRUD;
	use ComputeUniqueIDService;

	protected function BuyerViewAvailableGoodsService(Request $request): array
	{
		$all_goods_Found = $this->CommodityReadAllLazyService();
		return $all_goods_Found;
	}

	protected function BuyerAddGoodsToCartService(Request $request) : array 
	{
		//extract the new array:
		$newKeysValues = [
			'carts_id' => $this->genUniqueNumericId(),
			'goods_total_number' => $request->goods_total_number,
			'goods_total_cost' => $request->goods_total_cost,
			//'created_at'=> $request->created_at,//there's no need for this as eloquent returns "created_at" field by default...
			'buyer_id' => $request->buyer_id,
			//this is currently in json, cast this into array before save
			'commodity_ids' => $request->commodity_ids,
			'is_paid_for' => $request->is_paid_for,//defaults to false
		];

		//save:
		$cart_is_created = $this->CartCreateAllService($newKeysValues);
		return $cart_is_created;
	}


	protected function BuyerViewPendingCartGoodsService(Request $request)
	{
		//init:
		$queryKeysValues = array();
		$this_cart_commodity_details = array();

		//assign:
		$buyer_id = $request->buyer_id; 
		$cart_id = $request->cart_id;
		$queryKeysValues = [
			'buyer_id' => $buyer_id,
			'cart_id' => $cart_id,
			//'is_cleared' => false
		];

		//first get all the commodity_ids associated with this cart:
		$thisCartDetails =  $this->CartReadSpecificService($queryKeysValues);
		$commodity_ids = $thisCartDetails->commodity_ids;//this should return in array(it's now casted)

		//now, loop through this: 
		foreach ($commodity_ids as $comm_id_key => $comm_id_value) 
		{
			//use each commodity_id value to obtain details of the commodity associated with this Cart:
			$queryKeysValues =  ['commodity_id' => $comm_id_value];
			$all_details_found = $this->CommodityReadSpecificService($queryKeysValues);

			//add this details to the array:

		}
	}
	

	protected function BuyerViewCartByCategoryService(Request $request) : array
	{	
		//init:
		$cart_by_category_summary = array();
		//assign:
		$buyer_id = $request->buyer_id; 
		$is_cleared = $request->is_cleared;
		$queryKeysValues = [
			'buyer_id' => $buyer_id,
			'is_cleared' => $is_cleared
		];

		$all_carts_found =  $this->CartReadAllLazySpecificService($queryKeysValues);

		//set the status:
		if($is_cleared === false)
		{
			$cart_by_category_summary->status = 'pending';
		}else{
			$cart_by_category_summary->status = 'cleared';
		}

		//set the number of carts found:
		$cart_by_category_summary->carts_total = $all_carts_found->count();

		//set all the results from db:
		$cart_by_category_summary->carts_summary = $all_carts_found

		return $cart_by_category_summary;
	}


	protected function BuyerEditCartGoodsService(Request $request) : array 
	{
		$buyer_id = $request->buyer_id;
		$cart_id = $request->cart_id;

		$request = $request->except('buyer_id', 'cart_id');

		foreach($request as $reqKey => $reqValue){

				$queryKeysValues = [
					'buyer_id' => $buyer_id
					'cart_id' => $cart_id
					'is_cleared' => false
				];

				if(is_array($reqValue)){
					$newKeysValues = [$reqKey => json_encode($reqValue)];
				}else{
					$newKeysValues = [$reqKey => $reqValue];
				}
				$this->BuyerUpdateSpecificService($queryKeysValues, $newKeysValues);
			}

		return true;
	}


	protected function BuyerDeletePendingCartService(Request $request): array
	{
		$deleteKeysValues = [
			'buyer_id' => $request->buyer_id,
			'cart_id' => $request->cart_id,
		];
		$cart_has_deleted = $this->CartDeleteSpecificService($deleteKeysValues);
		return $cart_has_deleted;
	}	

}