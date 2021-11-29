<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\AdminGeneralBusinessDetails;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;

trait AdminGenBizCRUD 
{
	//CRUD for services:
	protected function  AdminGenBizCreateAllService(Request | array $paramsToBeSaved): bool
	{
		AdminGeneralBusinessDetails::create($paramsToBeSaved); 	
		return true;		
	}


	protected function  AdminGenBizReadSpecificService(array $queryKeysValues): AdminGeneralBusinessDetails | null//Object 0r null
	{	
		$readModel = AdminGeneralBusinessDetails::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function  AdminGenBizReadAllService(): Collection
	{
		$readAllModel = AdminGeneralBusinessDetails::get();
		return $readAllModel;
	}

	protected function  AdminGenBizReadAllLazyService(): array
	{
		$readAllModel = AdminGeneralBusinessDetails::lazy();
		return $readAllModel;
	}


	protected function  AdminGenBizReadAllLazySpecificService(array $queryKeysValues): array
	{
		$readAllModel = AdminGeneralBusinessDetails::where($queryKeysValues)->lazy();
		return $readAllModel;
	}

	protected function  AdminGenBizReadSpecificAllService(array $queryKeysValues): array 
	{
		$readSpecificAllModel = AdminGeneralBusinessDetails::where($queryKeysValues)->get();
		return $readAllModel;
	}


	protected function  AdminGenBizUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		AdminGeneralBusinessDetails::where($queryKeysValues)->update($newKeysValues);
		return true;
	}

	protected function  AdminGenBizDeleteSpecificService(array $deleteKeysValues): bool
	{
		AdminGeneralBusinessDetails::where($deleteKeysValues)->delete();
		return true;
	}

}

?>