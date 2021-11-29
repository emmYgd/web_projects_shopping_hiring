<?php

namespace App\Services\Traits\Utilities;

trait ComputeUniqueIDService
{

	//unique ids :

	//unique alpha-numeric ids:
	protected function genUniqueAlphaNumID() : string {

		//generate a random number alpha numeric number:
		$strBase1 = "0123456789";
		$strBase2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$strBase3 = "abcdefghijklmnopqrstuvwxyz";
		//$strBase4 = random_strings(10);

		$strCombine = $strBase1 . $strBase2 . $strBase3;

		$firstPass = substr(str_shuffle($strCombine), 0, 10);
		$secondPass = substr( md5(time()), 0, 10);
		$thirdPass = $firstPass . $secondPass;

		$uniqueID = str_shuffle($firstPass);
		return $uniqueID;
	}
	

	//unique numeric ids:
	protected function genUniqueNumericId() : string {

		//generate purely random numbers:
		$strBase = "0123456789@#$%^&*";
		$strShuffle1 = str_shuffle($strBase);
		$strShuffle2 = str_shuffle($strBase);

		$strCombine = $strShuffle1 . $strShuffle2;

		$uniqueID = str_shuffle(substr( $strCombine, 0, 15));
		return $uniqueID;
	}

}

?>