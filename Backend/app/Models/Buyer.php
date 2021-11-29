<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{
    use HasFactory;
    
    public $hidden = ['id','unique_buyer_id', 'buyer_password', 'buyer_bank_card_number','buyer_bank_card_cvv', 'buyer_bank_expiry_month', 'buyer_bank_expiry_year', 'created_at', 'updated_at'];
    //public $visible = [];

    protected $guarded = ['id', 'unique_buyer_id', 'buyer_password', 'buyer_bank_card_number', 'buyer_bank_card_cvv', 'buyer_bank_expiry_month', 'buyer_bank_expiry_year', 'created_at', 'updated_at'];
    //protected $fillable = [];

}

