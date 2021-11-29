<?php
namespace App\Services\Interfaces;

use Illuminate\Http\Request;

interface InternAccessInterface {

	public function register(Request $request);
	public function loginDashboard(Request $request);
	public function forgotPassword(Request $request);
	public function editProfile(Request $request);
	//public function editFilesAndImages(Request $request);
	public function logout(Request $request);

}

?>