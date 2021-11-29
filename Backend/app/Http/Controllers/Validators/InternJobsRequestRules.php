<?php

namespace App\Http\Controllers\Validators;

trait InternJobsRequestRules {


	protected function jobSearchRules(): array
	{
		//set validation rules:
        $rules = [
        	'employer_id' => 'required | unique:interns | size:20', 
        ];

        return $rules;   
    }


    protected function jobApplyRules(): array
    {

        $rules = [
		      //set validation rules:
            'job_id' => 'required | unique:jobs'
            'intern_id' => 'required | unique:employers | size:20', 

            'job_cover_letter' => 'nullable ',//if this is null, the default(intern profile) will be displayed to the employer..

            'apply_status' => 'required | bool', 

            'available_interview_dates' => 'nullable',

            'available_interview_times' => 'nullable',

            'is_delayed' => 'nullable | bool'//employer shouldn't see it yet
        ];

        return $rules;

    }


    protected function viewAllJobsAppliedRequestRules(): array
    {
        //set validation rules:
        $rules = [
            'intern_id' => 'required | unique:interns | size:20',
        ];

        return $rules;
    }

    
    protected function changeJobApplyStatusRequestRules(): array
    {
        //set validation rules:
        $rules = [
            'intern_id' => 'required | unique:interns | size:20',
            'job_id' => 'required | unique:jobs',
            'is_delayed' => 'required | bool'
        ];

        return $rules;
    }

    
    protected function deleteJobApplyRules(): array
    {
        //set validation rules:
        $rules = [
            'intern_id' => 'required | unique:interns | size:20',
            'job_id' => 'required | unique:jobs',
        ];

        return $rules;
    }



}