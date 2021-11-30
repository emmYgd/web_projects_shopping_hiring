<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\BuyerBilling;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

trait BuyerBillingCRUD 
{
	//CRUD for services:
	protected function  BuyerBillingCreateAllService(Request | array $paramsToBeSaved): bool
	{
		BuyerBilling::create($paramsToBeSaved); 	
		return true;		
	}


	protected function  BuyerBillingReadSpecificService(array $queryKeysValues): BuyerBilling | null //Object
	{	
		$readModel = BuyerBilling::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function  BuyerBillingReadAllService(): Collection
	{
		$readAllModel = BuyerBilling::get();
		return $readAllModel;
	}

	protected function  BuyerBillingReadAllLazyService(): array
	{
		$readAllModel = BuyerBilling::lazy();
		return $readAllModel;
	}


	protected function  BuyerBillingReadAllLazySpecificService(array $queryKeysValues): array
	{
		$readAllModel = BuyerBilling::where($queryKeysValues)->lazy();
		return $readAllModel;
	}

	protected function  BuyerBillingReadSpecificAllService(array $queryKeysValues): array 
	{
		$readSpecificAllModel = BuyerBilling::where($queryKeysValues)->get();
		return $readAllModel;
	}


	protected function  BuyerBillingUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		return BuyerBilling::where($queryKeysValues)->update($newKeysValues);
	}

	protected function  BuyerBillingDeleteSpecificService(array $deleteKeysValues): bool
	{
		return BuyerBilling::where($deleteKeysValues)->delete();
	}

}

?>