<?php

namespace Database\Factories;

use App\Models\Cart;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartFactory extends Factory
{

    protected $model = Cart::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'unique_cart_id' => $this->faker->uuid,
            'unique_buyer_id' => $this->faker->uuid,
            'attached_goods_ids' => $this->faker->optional->pass_through(json_encode([
                "eeeettt", "ooooovy","pppphp"
            ])),
            'purchase_currency' => 'USD',
            'purchase_price' => $this->faker->numberBetween($min=10, $max=500),
            'payment_status' => 'pending',
        ];
    }
}
