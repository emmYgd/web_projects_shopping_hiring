<?php

namespace App\Services\Traits\Utilities;

trait PassHashVerifyService
{

	protected function HashPassword(/*string*/ $password) /*: string*/
	{
		$passHash = password_hash($password, PASSWORD_DEFAULT);
		return $passHash;
	}


	protected function VerifyPassword(/*string*/ $password, /*string*/ $hash) /*: bool*/
	{
		$passVerify = password_verify($password, $hash);
		return $passVerify;
	}

}