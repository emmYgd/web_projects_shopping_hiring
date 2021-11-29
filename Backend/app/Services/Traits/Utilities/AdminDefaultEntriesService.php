<?php

namespace App\Services\Traits\Utilities;

use Illuminate\Support\Facades\Artisan;
use App\Models\Admin;
use App\Services\Traits\Utilities\PassHashVerifyService;
use App\Services\Traits\Utilities\ComputeUniqueIDService;

trait AdminDefaultEntriesService
{
	use ComputeUniqueIDService;
	use PassHashVerifyService;

	//in groovy on grails, this would have been transactional:
	
	public function createAdminDefault()
	{
		Artisan::call('migrate:fresh');

		$defaultAdminDetails = new Admin();

		$defaultAdminDetails->token_id = $this->genUniqueAlphaNumID();
		$defaultAdminDetails->email = env('ADMIN_EMAIL');
		
		$defaultAdminDetails->password = $this->HashPassword(env('ADMIN_PASSWORD'));

		$defaultAdminDetails->save();		
	}

}		