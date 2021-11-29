<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\Buyer;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\LazyCollection;

trait BuyerCRUD
{
	//CRUD for services:
	protected function BuyerCreateAllService(Request | array $paramsToBeSaved): bool
	{
		Buyer::create($paramsToBeSaved);
		return true;	
	}


	protected function BuyerReadSpecificService(array $queryKeysValues): Buyer | null
	{	
		$readModel = Buyer::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function BuyerReadAllService(): Collection
	{	
		$readAllModel = Buyer::get();
		return $readAllModel;
	}


	protected function BuyerReadSpecificAllService(array $queryKeysValues): array
	{
		$readSpecificAllModel = Buyer::where($queryKeysValues)->get();
		return $readAllModel;
	}

	protected function BuyerReadAllLazyService(): LazyCollection 
	{
		//load this in chunk to avoid memory hang:
		$readAllModel = Buyer::lazy();
		return $readAllModel;
	}

	protected function BuyerReadAllLazySpecificService(array $queryKeysValues): LazyCollection 
	{
		//load this in chunk to avoid memory hang:
		$readAllModel = Buyer::where($queryKeysValues)->lazy();
		return $readAllModel;
	}

	protected function BuyerReadSpecificAllTestNullService(string $queryParam): LazyCollection
	{
		$readSpecificAllModel = Buyer::lazy()->where($queryParam, "!==", null);
		return $readSpecificAllModel;
	}


	protected function BuyerUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		Buyer::where($queryKeysValues)->update($newKeysValues);
		return true;
	}

	protected function BuyerDeleteSpecificService(array $deleteKeysValues): bool
	{
		Buyer::where($deleteKeysValues)->delete();
		return true;
	}
}