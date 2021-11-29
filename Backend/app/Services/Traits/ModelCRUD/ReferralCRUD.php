<?php

namespace App\Services\Traits\ModelCRUD;

use Illuminate\Http\Request;

use App\Models\Referral;

trait ReferralCRUD
{
	//CRUD for services:
	protected function ReferralCreateAllService(Request | array $paramsToBeSaved): bool
	{ 
		Referral::create($paramsToBeSaved);
		return true;		
	}

	protected function ReferralReadSpecificService(array $queryKeysValues): Referral | null
	{	
		$readModel = Referral::where($queryKeysValues)->first();
		return $readModel;
	}

	protected function ReferralReadAllLazyService(): array 
	{
		//load this in chunk to avoid memory load:
		$readAllModel = Referral::lazy();
		return $readAllModel;
	}

	protected function ReferralReadAllLazySpecificService(array $queryKeysValues): array
	{
		$allReferralPosted = Referral::where($queryKeysValues)->lazy();
		return $allReferralPosted;
	}


	protected function ReferralReadSpecificAllService(array $queryKeysValues): array 
	{
		$readSpecificAllModel = Referral::where($queryKeysValues)->get();
		return $readAllModel;
	}


	protected function ReferralUpdateSpecificService($queryKeysValues, $newKeysValues)
	{
		Referral::where($queryKeysValues)->update($newKeysValues);
		return true;
	}

	protected function ReferralDeleteSpecificService($queryKeysValues)
	{
		Referral::where($queryKeysValues)->delete();
		return true;
	}


}