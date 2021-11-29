<?php
namespace App\Services\Interfaces;

interface PaymentInterface {
	
	public function internPay():json;
	public function employerPay():json;

}

?>