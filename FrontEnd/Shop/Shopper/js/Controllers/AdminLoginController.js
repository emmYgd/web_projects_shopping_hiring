import AbstractModel from "./../Models/AbstractModel.js";
	
	const AdminLogin = 
	{	
		//values:
		adminEmail: null,
		adminPass: null,
		serverSyncModel:null,

		//states:
		clicked_state:false,
		is_logged_in:false,
		update_success:false,

		Collectibles()
		{
			let adminEmail = $('#adminLoginEmail').val();
	 		let adminPass = $('#adminLoginPassword').val();
	 		/*console.log(adminEmail);
	 		console.log(adminPass);*/
	 		//set values:
	 		this.adminEmail = adminEmail;
	 		this.adminPass = adminPass;
		},
		
		LoginDashboard(targetClickElem)
		{
			$(targetClickElem).click((event)=>
			{
				if(this.adminEmail!=='' && this.adminPass!=='')
				{
					event.preventDefault();
					this.Collectibles();
					
					/*console.log(this.adminEmail);
					console.log(this.adminPassword);*/
					
					//set state to true for watchers
					this.clicked_state = true;
					
					//call the server sync:
					this.SyncLoginModel().then(()=>
					{
						//now start conditionals:
						if( 
							(this.serverSyncModel.code === 1) &&
							(this.serverSyncModel.serverStatus === 'Found!')
						)
						{
							//update state:
							this.update_success = true;
							//call reactors:
							this.UpdateUIsuccess();
							//save received token:
							this.PersistReceivedToken();
							//redirect:
							this.RedirectToDashboard();
						}
						else if
						( 
							(this.serverSyncModel.code === 0) &&
							(this.serverSyncModel.serverStatus === 'NotFound!')
						)
						{
							//update state:
							this.update_success = false;
							//call reactors:
							this.UpdateUIerror();
						}
					});
				}
			});
		},
			
		SyncLoginModel()
		{
			let method = "POST";
			let updateServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/auth/login';
				
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'email' : this.adminEmail,
				'password' : this.adminPass,
			}

			let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
			console.log(serverModel);
			this.serverSyncModel = serverModel;
		},
		
			
		UpdateUIsuccess()
		{	
			if(this.update_success)
			{
				//clear all forms:
				$('form').trigger('reset');
				//clear first:
				$('#LoginSuccess').text("");
				$('#LoginError').text("");
				//Update Success Message:
				$('#LoginSuccess').text("Found! Logging In...");

			}
				
		},
			
		UpdateUIerror()
		{	
			if(!this.update_success)
			{
					//clear first:
					$('#AdminLoginSuccess').text("");
					$('#AdminLoginError').text("");
					
					//Update Error Message:
					$('#AdminLoginError').text("Login Error!");
				}
			},
			
		},
	}

/*$(document).ready(function(){
	//console.log("Login Email:", $('#adminLoginEmail').val());
	AdminLogin.LoginDashboard('#adminLoginBtn');
})*/

export default AdminLogin
	
	
	