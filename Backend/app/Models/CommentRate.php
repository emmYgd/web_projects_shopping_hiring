<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentRate extends Model
{
    use HasFactory;
    //belongsTo Buyers


    public function setRatingAttribute($new_value){
        $current_db_rating = $this->rating;
        $new_average_value = ($current_db_rating + $new_value)/2;

        //set this new value in the database:
        $this->attributes['rating'] = $new_average_value;
    }
    
}
