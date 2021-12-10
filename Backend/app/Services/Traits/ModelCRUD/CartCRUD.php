<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\Cart;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\LazyCollection;

trait CartCRUD
{
	//CRUD for services:
	protected function CartCreateAllService(array $paramsToBeSaved): bool
	{ 
		Cart::create($paramsToBeSaved);
		return true;		
	}

	protected function CartReadSpecificService(array $queryKeysValues): Cart | null
	{	
		$readModel = Cart::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function CartReadAllLazyService(): LazyCollection 
	{
		//load this in chunk to avoid memory hang:
		$readAllModel = Cart::lazy();
		return $readAllModel;
	}

	protected function CartReadAllLazySpecificService(array $queryKeysValues): LazyCollection
	{
		$allCartPosted = Cart::where($queryKeysValues)->lazy();
		return $allCartPosted;
	}


	protected function CartReadSpecificAllService(array $queryKeysValues): Collection
	{
		$readSpecificAllModel = Cart::where($queryKeysValues)->get();
		return $readSpecificAllModel;
	}


	protected function CartUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		Cart::where($queryKeysValues)->update($newKeysValues);
		return true;
	}


	protected function CartDeleteSpecificService(array $deleteKeysValues): bool
	{
		Cart::where($deleteKeysValues)->delete();
		return true;
	}

}

?>