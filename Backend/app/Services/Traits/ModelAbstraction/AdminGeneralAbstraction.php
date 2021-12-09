<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Services\Traits\ModelCRUD\PaymentCRUD;
use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\CommodityCRUD;
use App\Services\Traits\ModelCRUD\ProductCRUD;
use App\Services\Traits\ModelCRUD\AdminGenBizCRUD;

use App\Services\Traits\Utilities\ComputeUniqueIDService;


trait AdminGeneralAbstraction {

	use PaymentCRUD;
	use CartCRUD;
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

			//Images in laravel will be stored in a storage folder while their pointer path will be stored in a database:

			//first store these images in a storage location on server:
			//probably stored in: ../storage/app/public/uploads first
			$main_image_1_rep = $request->file('main_image_1')->store('uploads');
			$main_image_2_rep = $request->file('main_image_2')->store('uploads');
			$logo_1_rep = $request->file('logo_1')->store('uploads');
			$logo_2_rep = $request->file('logo_2')->store('uploads');

			//Now store their respective links in the database:
			$newKeysValues = [
				'main_image_1' => $main_image_1_rep,
				'main_image_2' => $main_image_2_rep,
				'logo_1' => $logo_1_rep,
				'logo_2' => $logo_2_rep
			];

			$product_image_has_updated = $this->ProductUpdateSpecificService($queryKeysValues, $newKeysValues);

			if(!$product_image_has_updated)
			{
				throw new \Exception("Could not upload image Successfully!");
			}
		}

		return true;
	}

	protected function AdminFetchAllProductIDsService($request)
	{
		$allProductDetails = $this->ProductReadAllLazyService();
		
		//the above returns a collection: loop through to get only the ids:
		$allProductIDs = $allProductDetails->pluck('product_token_id');
		return $allProductIDs;
	}

	protected function AdminFetchEachProductDetailsService($request)
	{
		$queryKeysValues = [
			'product_token_id' => $request->product_token_id,
		];

		$each_product_detail = $this->ProductReadSpecificService($queryKeysValues);
		if(!$each_product_detail)
		{
			throw new \Exception("Product Details not found! Ensure you have created this cart as approriate.");
		}

		//get the buyer id:
		//now use this to get the buyer model:(this is in a bead to get buyer email and phone number)

		//begin to prepare the return array:
		
		//for images, fetch images whose db link is in the model:
		$each_product_detail->main_image_1 = base64_encode(Storage::get($each_product_detail->main_image_1));
		$each_product_detail->main_image_2 = base64_encode(Storage::get($each_product_detail->main_image_2));
		$each_product_detail->logo_1 = base64_encode(Storage::get($each_product_detail->logo_1));
		$each_product_detail->logo_2 = base64_encode(Storage::get($each_product_detail->logo_2));

		//get the date created because the feature is hidden:
		$each_product_detail['product_created_at'] = $each_product_detail->created_at;

		return $each_product_detail;
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