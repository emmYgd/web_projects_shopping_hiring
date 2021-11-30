<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\BuyerShipping;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

trait BuyerShippingCRUD 
{
	//CRUD for services:
	protected function  BuyerShippingCreateAllService(Request | array $paramsToBeSaved): bool
	{
		BuyerShipping::create($paramsToBeSaved); 	
		return true;		
	}


	protected function  BuyerShippingReadSpecificService(array $queryKeysValues): BuyerShipping | null //Object
	{	
		$readModel = BuyerShipping::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function  BuyerShippingReadAllService(): Collection
	{
		$readAllModel = BuyerShipping::get();
		return $readAllModel;
	}

	protected function  BuyerShippingReadAllLazyService(): array
	{
		$readAllModel = BuyerShipping::lazy();
		return $readAllModel;
	}


	protected function  BuyerShippingReadAllLazySpecificService(array $queryKeysValues): array
	{
		$readAllModel = BuyerShipping::where($queryKeysValues)->lazy();
		return $readAllModel;
	}

	protected function  BuyerShippingReadSpecificAllService(array $queryKeysValues): array 
	{
		$readSpecificAllModel = BuyerShipping::where($queryKeysValues)->get();
		return $readAllModel;
	}


	protected function  BuyerShippingUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		return BuyerShipping::where($queryKeysValues)->update($newKeysValues);
	}

	protected function  BuyerShippingDeleteSpecificService(array $deleteKeysValues): bool
	{
		return BuyerShipping::where($deleteKeysValues)->delete();
	}

}

?>