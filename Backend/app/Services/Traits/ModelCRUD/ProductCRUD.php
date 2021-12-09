<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\Product;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\LazyCollection;

trait ProductCRUD 
{
	//CRUD for services:
	protected function ProductCreateAllService(Request | array $paramsToBeSaved): bool
	{
		Product::create($paramsToBeSaved); 	
		return true;		
	}


	protected function ProductReadSpecificService(array $queryKeysValues): Product | null 
	{	
		$readModel = Product::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function ProductReadAllService(): array
	{
		$readAllModel = Product::get();
		return $readAllModel;
	}

	protected function ProductReadAllLazyService(): LazyCollection
	{
		$readAllModel = Product::lazy();
		return $readAllModel;
	}


	protected function ProductReadAllLazySpecificService(array $queryKeysValues): LazyCollection
	{
		$readAllModel = Product::where($queryKeysValues)->lazy();
		return $readAllModel;
	}

	protected function ProductReadSpecificAllService(array $queryKeysValues): array 
	{
		$readSpecificAllModel = Product::where($queryKeysValues)->get();
		return $readAllModel;
	}


	protected function ProductUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		$product_has_updated = Product::where($queryKeysValues)->update($newKeysValues);
		return $product_has_updated;
	}

	protected function ProductDeleteSpecificService(array $deleteKeysValues): bool
	{
		Product::where($deleteKeysValues)->delete();
		return true;
	}

}

?>