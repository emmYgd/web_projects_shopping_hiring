<?php

namespace App\Observers;

use App\Models\Buyer;

class BuyerObserver
{
    /**
     * Handle the Buyer "created" event.
     *
     * @param  \App\Models\Buyer  $buyer
     * @return void
     */
    public function created(Buyer $buyer)
    {
        //send mail: 
        $mail_from = env('ADMIN_EMAIL');

        //start sending mail:
        $mail_header = "From:".  $mail_from;
        $mail_to = $buyer->buyer_email;
        $mail_subject = "You Just Signed Up with Us!";
        $mail_message = "KUDOS! You have just created your Account with Us. Dont stop there - Select our products, clear your cart, and keep enjoying our amazing offers. Best Regards!";
        
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
     * Handle the Buyer "updated" event.
     *
     * @param  \App\Models\Buyer  $buyer
     * @return void
     */
    public function updated(Buyer $buyer)
    {
        $buyer_email = $buyer->buyer_email

        //send mail: //NOTE: In a cart just created, the default value is pending:
        $mail_from = env('ADMIN_EMAIL');
        $mail_header = "From:".  $mail_from;
        $mail_to = $buyer_email;
        $mail_subject = "A recent change!";
        $mail_message = "A recent change was just made to your account! If that was not you, reply to this email confirming and explaining the assertion. Best Regards!";
        
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
     * Handle the Buyer "deleted" event.
     *
     * @param  \App\Models\Buyer  $buyer
     * @return void
     */
    public function deleted(Buyer $buyer)
    {
        //
    }

    /**
     * Handle the Buyer "restored" event.
     *
     * @param  \App\Models\Buyer  $buyer
     * @return void
     */
    public function restored(Buyer $buyer)
    {
        //
    }

    /**
     * Handle the Buyer "force deleted" event.
     *
     * @param  \App\Models\Buyer  $buyer
     * @return void
     */
    public function forceDeleted(Buyer $buyer)
    {
        //
    }
}
