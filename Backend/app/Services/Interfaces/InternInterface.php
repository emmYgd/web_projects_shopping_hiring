<?php
namespace App\Services\Interfaces;

use Illuminate\Http\Request;

interface InternInterface {
	
	public function InternSearchEmployers():json;
	//public function searchInterns():json;
	public function CommentRateEmployers(Request $request);
	//public function chatEmployers():json;
	//public function takeSkillsTest():json;
	//public function submitSkillsTest():json;

}

?>