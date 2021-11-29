<?php
namespace App\Services\Interfaces;

interface EmployerAccessInterface {

	public function register(): json;
	public function loginDashboard():json;
	public function editProfile(): json;
	public function forgotPassword():json;

}

?>