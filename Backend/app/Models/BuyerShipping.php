<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyerShipping extends Model
{
    use HasFactory;
     //hidden from json response:
   	public $hidden = ['id', 'unique_buyer_id', 'created_at', 'updated_at'];
    //public $visible = [];

   	//guarded from mass assignment:
    protected $guarded = ['id', 'created_at', 'updated_at'];
    //protected $fillable = [];
}
