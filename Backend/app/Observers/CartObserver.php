<?php

namespace App\Observers;

use App\Models\Cart;
use App\Services\Traits\ModelCRUD\CartCRUD;
use App\Services\Traits\ModelCRUD\BuyerCRUD;

final class CartObserver
{
    use CartCRUD;
    use BuyerCRUD;
    /**
     * Handle the Cart "created" event.
     *
     * @param  \App\Models\Cart  $cart
     * @return void
     */
    public function created(Cart $cart_model)
    {
        //use buyer model to get buyer email:
        $queryKeysValues = ['unique_buyer_id' => $cart_model->unique_buyer_id];
        $buyer_model = $this->BuyerReadSpecificService($queryKeysValues);
        $buyer_email = $buyer_model->buyer_email;

        //send mail: //NOTE: In a cart just created, the default value is pending:
        $mail_from = env('ADMIN_EMAIL');
        $mail_header = "From:".  $mail_from;
        $mail_to = $buyer_email;
        $mail_subject = "Just Created Your Cart!";
        $mail_message = "KUDOS! You have just created your Cart comprising our amazing product(s). Ensure you clear your cart soon and enjoy our amazing offers. Best Regards!";
        
        $mail_was_sent = mail($mail_to, $mail_subject, $mail_message, $mail_header);
        if($mail_was_sent)
        {
            echo "Mail was sent!";

        }else
        {
            echo "Mail was not sent!";
        }
    }

    /**
     * Handle the Cart "updated" event.
     *
     * @param  \App\Models\Cart  $cart
     * @return void
     */
    public function updated(Cart $cart)
    {
        if($cart->payment_Status == "cleared")
        {
             //use buyer model to get buyer email:
            $queryKeysValues = ['unique_buyer_id' => $cart_model->unique_buyer_id];
            $buyer_model = $this->BuyerReadSpecificService($queryKeysValues);
            $buyer_email = $buyer_model->buyer_email;

            //send mail: //NOTE: In a cart just created, the default value is pending:
            $mail_from = env('ADMIN_EMAIL');
            $mail_header = "From:".  $mail_from;
            $mail_to = $buyer_email;
            $mail_subject = "Just Cleared Your Cart!";
            $mail_message = "KUDOS! You have just cleared your Cart comprising our amazing product(s). We hope you visit us soon and enjoy our other amazing offers. Best Regards!";
        
            $send_mail = mail($mail_to, $mail_subject, $mail_message, $mail_header);
        }
        
    }

    /**
     * Handle the Cart "deleted" event.
     *
     * @param  \App\Models\Cart  $cart
     * @return void
     */
    public function deleted(Cart $cart)
    {
        //
    }

    /**
     * Handle the Cart "restored" event.
     *
     * @param  \App\Models\Cart  $cart
     * @return void
     */
    public function restored(Cart $cart)
    {
        //
    }

    /**
     * Handle the Cart "force deleted" event.
     *
     * @param  \App\Models\Cart  $cart
     * @return void
     */
    public function forceDeleted(Cart $cart)
    {
        //
    }
}
