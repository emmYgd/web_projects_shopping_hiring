<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;
//use Illuminate\Database\Eloquent\Collection;

use App\Services\Traits\ModelCRUD\PaymentCRUD;
use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\CommodityCRUD;
use App\Services\Traits\ModelCRUD\ProductCRUD;
use App\Services\Traits\ModelCRUD\AdminGenBizCRUD;

use App\Services\Traits\Utilities\ComputeUniqueIDService;


trait AdminGeneralAbstraction {

	use PaymentCRUD;
	use CartCRUD;
	use CommodityCRUD;
	use ProductCRUD;
	use AdminGenBizCRUD;
	use ComputeUniqueIDService;

	protected function AdminSaveProductDetailsService(Request $request) : array
	{
		//get all requests:
		$to_persist_array = $request->except('token_id');

		//add product unique id to array:
		$to_persist_array['product_token_id'] = $this->genUniqueAlphaNumID();

		//save all using mass assignment:
		$is_details_saved = $this->ProductCreateAllService($to_persist_array);

		return [
			'is_saved' => $is_details_saved,
			'product_token_id' => $to_persist_array['product_token_id']
		];
	}


	protected function AdminSaveProductImageService($request)//: bool
	{
		/*note: files are to be stored in the database for now...
		this could change in the future to include storing files on disk 
		and remote file storage system */

		$product_token_id = $request->product_token_id;

		if($product_token_id !== "")
		{
			//query and new Keys and values:
			$queryKeysValues = ['product_token_id' => $product_token_id];
			//this is the image file uploads:
			//$newKeysValues = $request->except(['token_id', 'product_token_id']);
			$newKeysValues = [
				'main_image_1' => $request->file('main_image_1'),
				'main_image_2' => $request->file('main_image_2'),
				'logo_1' => $request->file('logo_1'),
				'logo_2' => $request->file('logo_2')
			];

			$product_image_has_updated = $this->ProductUpdateSpecificService($queryKeysValues, $newKeysValues);

			if(!$product_image_has_updated)
			{
				throw new \Exception("Could not upload image Successfully!");
			}
		}

		return true;
	}


	protected function AdminSaveBusinessDetailsService(Request $request) //: bool
	{
		$details_saved_status = false;

		//first get if Business Details table is not empty:
		$adminBizDetails = $this->AdminGenBizReadAllService();
		if( $adminBizDetails->count() !== 0)
		{
			//now first get the admin token id:
			$token_id = $request->token_id;

			//then update thus:
			$queryKeysValues = ['token_id' => $token_id];
			$newKeysValues = $request->except('token_id');

			//call the update function:
			$is_details_saved = $this->AdminGenBizUpdateSpecificService($queryKeysValues, $newKeysValues);

			$details_saved_status = $is_details_saved;
		}
		else
		{
			//else:
			$params_to_be_saved = $request->all();
			//save all using mass assignment:
			$is_details_saved = $this->AdminGenBizCreateAllService($params_to_be_saved);

			$details_saved_status = $is_details_saved;
		}

		return $details_saved_status;
	}


	protected function AdminFetchBusinessDetailsService(Request $request)
	{
		$queryKeysValues = ['token_id' => $request->token_id];
		$allBizDetails = $this->AdminGenBizReadSpecificService($queryKeysValues);

		return $allBizDetails;
	}
}

?>