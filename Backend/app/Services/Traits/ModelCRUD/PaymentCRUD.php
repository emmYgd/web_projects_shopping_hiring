<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\Payment;

use Illuminate\Http\Request;

trait PaymentCRUD 
{
	//CRUD for services:
	protected function PaymentCreateAllService(Request | array $paramsToBeSaved): bool
	{
		Payment::create($validatedRequest); 	
		return true;		
	}


	protected function PaymentReadSpecificService(array $queryKeysValues): array 
	{	
		$readModel = Payment::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function PaymentReadAllService(): array
	{
		$readAllModel = Payment::get();
		return $readAllModel;
	}

	protected function PaymentReadAllLazyService(): array
	{
		$readAllModel = Payment::lazy();
		return $readAllModel;
	}


	protected function PaymentReadAllLazySpecificService(array $queryKeysValues): array
	{
		$readAllModel = Payment::where($queryKeysValues)->lazy();
		return $readAllModel;
	}

	protected function PaymentReadSpecificAllService(array $queryKeysValues): array 
	{
		$readSpecificAllModel = Payment::where($queryKeysValues)->get();
		return $readAllModel;
	}


	protected function PaymentUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		Payment::where($queryKeysValues)->update($newKeysValues);
		return true;
	}

	protected function PaymentDeleteSpecificService(array $deleteKeysValues): bool
	{
		Payment::where($deleteKeysValues)->delete();
		return true;
	}

}

?>