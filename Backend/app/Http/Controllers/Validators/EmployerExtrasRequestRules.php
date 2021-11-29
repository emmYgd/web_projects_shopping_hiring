<?php

namespace App\Http\Controllers\Validators;

trait EmployerExtrasRequestRules {

	protected function outsourceRecruitmentRules(): array
	{

		//set validation rules:
        $rules = [
        	'employer_id' => 'required',
            'payment_id' => 'required',//must have paid before 
            'recriutment_type' => 'required'
        ];

        return $rules;
    }

    protected function unKnown(){

    }
}

?>
