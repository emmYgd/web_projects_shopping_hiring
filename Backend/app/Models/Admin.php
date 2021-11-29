<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    //hidden from json response:
   	public $hidden = ['id', 'token_id', 'password', 'created_at', 'updated_at'];
    //public $visible = [];

   	//guarded from mass assignment:
    protected $guarded = ['id', 'password','created_at', 'updated_at'];
    //protected $fillable = [];

    protected $casts = [
    	'is_referral_prog_activated' => 'bool',
    	'is_logged_in' => 'bool'
    ];

}
