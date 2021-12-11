<?php

namespace App\Services\Hooks;

use Illuminate\Http\Request;

trait StripePaymentHook
{
	//inherits all their methods:

	protected function  CallStripeService(array $userCardDetails): bool 
	{
		//init:
		//call our payment hooks that will interact with the API:
		$buyer_card_type = $userCardDetails['buyer_card_type'];
		$buyer_card_number = $userCardDetails['buyer_card_number'];
		$buyer_card_cvv = $userCardDetails['buyer_card_cvv'];
		$buyer_card_exp_year =  $userCardDetails['buyer_card_exp_year'];
		$buyer_card_exp_month = $userCardDetails['buyer_card_exp_month'];

		$cart_purchase_price = $userCardDetails['cart_purchase_price'];
		$buyer_total_referral_bonus = $userCardDetails['buyer_total_referral_bonus'];

		return true;
	}

}