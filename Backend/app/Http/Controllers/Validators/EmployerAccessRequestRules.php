<?php

namespace App\Http\Controllers\Validators;

trait EmployerAccessRequestRules {

	protected function registerRules(): array
	{

		//set validation rules:
        $rules = [
        	'email' => 'required | different:password,company_name', 
            'password' => 'required | alpha_num | min:7 | max:15',
            'company_name' => 'required | different:email,password',
            //'company_logo' => 'nullable',
            'industry' => 'nullable',
            'category' => 'nullable',
            'unit_handling_recruitment' => 'nullable', //HR, Outsourced, or Founder
            'brief_details' => 'nullable | min:5, max:100', //what the company does, aims and objectives(brief)
            'salary_range' => 'nullable | json',
    		'online_presence' => 'nullable | json', //including: website, facebook, twitter, linkedin, etc
        ];

        return $rules;
    }

     protected function loginRules(): array
     {
		//set validation rules:
        $rules = [
            'email' => 'required | different:password | unique:employers',
            'password' => 'required | alpha_num | min:7 | max:15 | different:email | unique:employers'
        ];
        return $rules;
    }

    protected function forgotPassRules():array
    {
        //set validation rules:
        $rules = [
            'email' => 'required | different:new_pass | unique:employers',
            'new_pass' => 'required | alpha_num | min:7 | max:15 | different:email'
        ];
        return $rules;
    }

    //edit important fields after login: all the nullable fields must now be compulsory:
    protected function editRules(): array
    {
        //set validation rules:
        $rules = [
            'employer_id' => 'required | unique:employers',
            'industry' => 'required',
            'category' => 'required',
            'unit_handling_recruitment' => 'required', //HR, Outsourced, or Founder
            'brief_details' => 'required | min:5, max:100', //what the company does, aims and objectives(brief)
            'salary_range' => 'required | json', //from/to - average salary willing to pay interns at this time
    		'online_presence' => 'required | json', //including: website, facebook, twitter, linkedin, etc
        ];
        return $rules;
    }

    protected function filesAndImagesRules(): array{

        //set validation rules:
        $rules = [
            'employer_id' => 'required | unique: employers',
            /*'company_logo' => 'required | image | mimes:jpg,png | dimensions:min_width=100,max_width=200,min_height=200,max_height=400',*/
        ];

        return $rules;
    }

    protected function logoutRules(): array{

        //set validation rules:
        $rules = [
            'employer_id' => 'required | unique: interns',
            'is_logged_in' => 'required | bool'
        ];

        return $rules;
    }

}
