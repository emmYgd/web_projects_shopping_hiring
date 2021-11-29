<?php

namespace App\Http\Controllers\Validators;

trait EmployerRequestRules {

  protected function employerSearchRules(): array{

    //set validation rules: no rules, this is a get request
    $rules = [
      'intern_id' => 'required | alpha_num | unique: interns | size:20',
        /*'employer_id' => 'required | alpha_num | unique:employers | size0',*/
    ];

    return $rules;
  }

  protected function commentRateRules(): array{

        //set validation rules:
        $rules = [
            'intern_id' => 'required | alpha_num | unique: interns | size:20 ',
            'employer_id' => 'required | alpha_num | unique:employers | size:20',
            'comment' => 'nullable | min: 5| max: 1000',
            'rate' => 'nullable | numeric'
        ];

        return $rules;
    }

}