<?php

namespace App\Services\Traits\ModelAbstraction;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

use App\Models\Buyer;
use App\Services\ModelCRUD\BuyerCRUD;
use App\Services\ModelCRUD\BuyersCRUD;
use App\Services\ModelCRUD\CartCRUD;
use App\Services\ModelAbstraction\CommentRateAbstraction;
use App\Services\Utilities\PassHashVerifyService;
use App\Services\Utilities\ComputeUniqueIDService;

trait BuyerGeneralAbstraction
{	
	//inherits all their methods:
	use BuyerCRUD;
	use CartCRUD;
	use ComputeUniqueIDService;
	use CommentRateAbstraction;

	private function BuyerEncryptDetails(string $paramToEncrypt) : string
	{
		return Crypt::encryptString($paramToEncrypt);
		
	}

	private function BuyerDecryptDetails(string $paramToDecrypt) : string
	{
		return Crypt::decryptString($paramToEncrypt);
	} //catch(DecryptException $ex) in the main Controller implementing this facade...


	protected function BuyerSearchAllBuyersService() : array
	{
		$queryKeysValues = ['owner' => 'buyer'];
		$allBuyers = $this->BuyerReadAllBuyersLazyService($queryKeysValues);
		return $allBuyers;
	} 

	protected function BuyerCommentRateBuyersService(Request $request): bool
	{
		$buyer_id = $request->buyer_id;
		$buyers_id = $request->buyers_id;
		$comment = $request->comment;
		$rate = $request->rate;
		
		//first generate a unique comment_rate_id:
		$comment_rate_id = $this->genUniqueNumericId();

		$toBeSavedParams = [
			'comment_rate_id' => $comment_rate_id,
			'owner' => 'buyer',
			'buyer_id' => $buyer_id,//buyer that was rated,  
			'buyer_id' => $buyer_id, //buyer that rated/commented, gotten from the search function.
			'comment' => $comment,
			'rate' => $rate
		];

		//now save first in the comment_rate_table:
		$this->BuyerCommentRateCreateAllService($toBeSavedParams);
		return true;
	}


}
