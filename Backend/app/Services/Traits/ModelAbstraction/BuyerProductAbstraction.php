<?php 

namespace App\Services\Traits\ModelAbstraction;

use App\Services\Traits\ModelCRUD\ProductCRUD;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait BuyerProductAbstraction
{   
    //inherits all their methods:
    use ProductCRUD;
    
    protected function BuyerFetchAvailableProductsService()
	{
		$processed_product_details = [];

		$all_product_details = $this->ProductReadAllLazyService();
		
		
		foreach ($all_product_details as $eachProductDetailModel) 
		{

			/*because only the link will be fetched inside the database, 
			we use the links obtained to get the real images:*/
			/*use these obtained db image links to get the images stored locally on the server symbolic link location:*/
			/*Base-64 encode it because of json response:*/
			$eachProductDetailModel->main_image_1 = base64_encode(Storage::get($eachProductDetailModel->main_image_1));
			$eachProductDetailModel->main_image_2 = base64_encode(Storage::get($eachProductDetailModel->main_image_2));
			$eachProductDetailModel->logo_1 = base64_encode(Storage::get($eachProductDetailModel->logo_1));
			$eachProductDetailModel->logo_2 = base64_encode(Storage::get($eachProductDetailModel->logo_2));

			//add all corrections back to the main collection:
			//$init = 0;
			//because Collections count starts from 1, we subtract 1 in order to synchronize it with the array count style which starts from zero:
			//$array_count = $all_product_details->count()-1;
			/*for($init=0; $init<=$array_count; $init++)
			{*/
				array_push($processed_product_details, $eachProductDetailModel);
			//}

			//break;
		}

		return $processed_product_details;
		//return $all_product_details;
    }

}