<?php

namespace App\Http\Controllers\Validators;

trait AdminAccessRequestRules {

    protected function loginRules(): array
    {
		//set validation rules:
        $rules = [
            /*'email' => 'required | unique:admins | different:password',
            'password' => 'required | min:7 | different:email'*/
        ];

        return $rules;
    }

    protected function confirmLoginStateRules(): array
    {
        $rules =  [
            'token_id'=>'required | exists:admins',
        ];
        return $rules;
    }

    protected function forgotPassRules(): array
    {
        //set validation rules:
        $rules = [
            'email_or_username' => 'required | different:new_pass',
            'new_pass' => 'required | min:7 | different:email_or_username'
        ];

        return $rules;
    }

    protected function editRules(): array
    {
        //set validation rules:
        $rules = [
            'admin_id' => 'required | unique:admins',
            'admin_org' => 'nullable | string | min:5 | max:1000',
            'vision' => 'nullable | string | different:admin_org',
            'mission' => 'nullable | string | different:vision,admin_org',
            'year_of_establishment' => 'nullable | numeric',
            'industry' => 'nullable',
        ];

        return $rules;
    }

    protected function filesAndImagesRules(): array
    {
        //set validation rules:
        $rules = [
            'admin_id' => 'required | unique: admins',
            'logo' => 'nullable | image | mimes:jpg,png | dimensions:min_width=100,max_width=200,min_height=200,max_height=400',
        ];

        return $rules;
    }


    protected function logoutRules(): array
    {
        //set validation rules:
        $rules = [
            'token_id' => 'required' //| exists: admins',
        ];

        return $rules;
    }

    

}

?>