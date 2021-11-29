<?php
namespace App\Services\Interfaces;

interface EmployerExtrasInterface {

	public function outsourceRecruitment(): json;
	public function reportInterns(): json;
	public function genUniqueUrl(): json;

}

?>