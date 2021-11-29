<?php
namespace App\Services\Interfaces;

interface AdminAccessInterface {

	public function loginDashboard(): json;
	public function forgotPassword(): json;
	public function updateAdminDetails(): json;
	
}

?>