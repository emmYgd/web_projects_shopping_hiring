<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;

use Closure;
use App\Models\Buyer;

class BuyerDeleteAllNull
{
	//use BuyerAccessAbstraction;

	public function handle(Request $request, Closure $next)
	{
		$response = $next($request);
		//delete all collections where unique_buyer_id and buyer_password == null;
        $deleteKeysValues = [
            'unique_buyer_id' => null,
            'buyer_password' => null
        ];
	
      	Buyer::where($deleteKeysValues)->delete();
        return $response;
	}
	
}