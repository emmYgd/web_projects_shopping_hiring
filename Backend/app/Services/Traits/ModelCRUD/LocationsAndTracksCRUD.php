<?php

namespace App\Services\Traits\ModelCRUD;

use App\Models\LocationsAndTracks;

use Illuminate\Http\Request;

trait LocationsAndTracksCRUD
{
	//CRUD for services:
	protected function LocationsAndTracksCreateAllService(Request | array $paramsToBeSaved): bool
	{ 
		LocationsAndTracks::create($paramsToBeSaved);
		return true;		
	}

	protected function LocationsAndTracksReadSpecificService(array $queryKeysValues): LocationsAndTracks | null
	{	
		$readModel = LocationsAndTracks::where($queryKeysValues)->first();
		return $readModel;
	}


	protected function LocationsAndTracksReadAllLazyService(): array 
	{
		//load this in chunk to avoid memory load:
		$readAllModel = LocationsAndTracks::lazy();
		return $readAllModel;
	}

	protected function LocationsAndTracksReadAllLazySpecificService(array $queryKeysValues): array
	{
		$allLocationsAndTracksPosted = LocationsAndTracks::where($queryKeysValues)->lazy();
		return $allLocationsAndTracksPosted;
	}


	protected function LocationsAndTracksReadSpecificAllService(array $queryKeysValues): array 
	{
		$readSpecificAllModel = LocationsAndTracks::where($queryKeysValues)->get();
		return $readAllModel;
	}


	protected function LocationsAndTracksUpdateSpecificService(array $queryKeysValues, array $newKeysValues): bool
	{
		LocationsAndTracks::where($queryKeysValues)->update($newKeysValues);
		return true;
	}


	protected function LocationsAndTracksDeleteSpecificService(array $deleteKeysValues): bool
	{
		LocationsAndTracks::where($deleteKeysValues)->delete();
		return true;
	}

}

?>