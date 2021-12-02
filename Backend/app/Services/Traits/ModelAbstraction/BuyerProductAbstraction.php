<?php 

namespace App\Services\Traits\ModelAbstraction;

use App\Services\Traits\ModelCRUD\ProductCRUD;

use Illuminate\Http\Request;

trait BuyerProductAbstraction
{   
    //inherits all their methods:
    use ProductCRUD;
    
    protected function BuyerFetchAvailableProductsService()
	{
		$product_details = $this->ProductReadAllLazyService();
		return $product_details;
    }
}