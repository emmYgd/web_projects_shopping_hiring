<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    public $hidden = ['id', 'created_at', 'updated_at'];
    //public $visible = [];

    protected $guarded = ['id', 'created_at', 'updated_at'];
    //protected $fillable = [];

    protected $casts = ['attached_goods_ids' => 'object'];//casted to and from JSON.
}

