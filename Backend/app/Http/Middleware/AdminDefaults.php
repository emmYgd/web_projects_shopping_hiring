<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
//use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;
use Closure;

use App\Services\Traits\Utilities\AdminDefaultEntriesService;

class AdminDefaults 
{
	use AdminDefaultEntriesService;
	//in groovy on grails, this would have been transactional:

	public function handle(Request $request, Closure $next){

		//create Admin Defaults in database:
		$this->createAdminDefault();

		return $next($request);
	}

}
