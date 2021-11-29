<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\Commodity;

use Illuminate\Http\Request;

trait CommodityCRUD
{	
	//CRUD for services:
	protected function CommodityCreateAllService(Request | array $paramsToBeSaved)
	{
		Commodity::create($anyParam); 	
		return true;		
	}


	protected function CommodityReadSpecificService(array $queryKeysValues): array
	{	
		$readModel = Commodity::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function CommodityReadAllService(): array
	{
		$readAllModel = Commodity::get();
		return $readAllModel;
	}


	protected function CommodityReadSpecificAllService(array $queryKeysValues): array
	{
		$readSpecificAllModel = Commodity::where($queryKeysValues)->get();
		return $readAllModel;
	}

	protected function CommodityReadAllLazyService(): array
	{
		//all applications:
		$details = Commodity::lazy();
		return $details;//use hidden and visible to guard this..
	}


	protected function CommodityReadSpecificAllLazyService(array $queryKeysValues): array
	{
		//all applications:
		$details = Commodity::where($queryKeysValues)->lazy();
		return $details;//use hidden and visible to guard this..
	}


	protected function CommodityUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		Commodity::where($queryKeysValues)->update($newKeysValues);
		return true;
	}

	protected function CommodityDeleteSpecificService(array $deleteKeysValues): bool
	{
		Commodity::where($deleteKeysValues)->delete();
		return true;
	}

}

?>