import AbstractModel from "./../../Models/AbstractModel.js";
	
	const AdminLoginLogout = 
	{	
		//values:
		adminEmail: null,
		adminPass: null,
		serverSyncModel:null,

		//states:
		clicked_state:false,
		update_success:false,
		
		LoginDashboard(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				this.Collectibles();

				if(this.adminEmail!==null && this.adminPass!==null)
				{
					event.preventDefault();
					//set state to true for watchers
					this.clicked_state = true;
					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncLoginModel().then((serverModel)=>
					{
						//sync model:
						this.serverSyncModel = serverModel;
						//set state for watchers
						this.clicked_state = false;
						//UI loading function:
						this.LoadingUI();

						//now start conditionals:
						if( 
							(this.serverSyncModel.code === 1) &&
							(this.serverSyncModel.serverStatus === 'Found!')
						)
						{
							console.log("Success");
							//update state:
							this.update_success = true;
							//call reactors:
							this.UpdateUI();

							//save Token Received to Local Storage:
							this.PersistTokenLocal(); 

							//now, redirect:
							this.RedirectToDashboard();
						}
						else if
						( 
							(this.serverSyncModel.code === 0) &&
							(this.serverSyncModel.serverStatus === 'NotFound!')
						)
						{
							console.log("Error");
							//update state:
							this.update_success = false;
							//call reactors:
							this.UpdateUI();
						}
					});
				}
			});
		},

		LogoutDashboard(targetClickElem)
		{
			$(targetClickElem).click((event)=>
			{
				event.preventDefault();

				//call the server sync:
				this.SyncLogoutModel().then((serverModel)=>
				{
					//sync model:
					this.serverSyncModel = serverModel;

					//now start conditionals:
					if( 
						(this.serverSyncModel.code === 1) &&
						(this.serverSyncModel.serverStatus === 'LoggedOut!')
					)
					{
						console.log("Success");
						
						//save Token Received to Local Storage:
						this.DeleteTokenLocal(); 

						//now, redirect:
						this.RedirectToLogin();
					}
					else if
					( 
						(this.serverSyncModel.code === 0) &&
						(this.serverSyncModel.serverStatus === 'NotLoggedOut!')
					)
					{
						//user is not expecting any error for their own logout...
						console.log("Error");
						
					}
				});
			});
		},

		Init()
		{
			//hide loading icon:
			$('div#redirectIcon').hide();
			$('div#loginLoadingIcon').hide();
		},

		Collectibles()
		{
			let adminEmail = $('input#adminLoginEmail').val();
	 		let adminPass = $('input#adminLoginPassword').val();
	 		/*console.log(adminEmail);
	 		console.log(adminPass);*/
	 		//set values:
	 		this.adminEmail = adminEmail;
	 		this.adminPass = adminPass;
		},
			
		SyncLoginModel()
		{
			let method = "POST";
			let updateServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/auth/login';
			console.log("My email", this.adminEmail);
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'email' : this.adminEmail,
				'password' : this.adminPass,
			}

			let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		SyncLogoutModel()
		{
			let method = "POST";
			let updateServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/auth/logout';

			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : window.localStorage.getItem('adminID')
			}

			let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#adminLoginBtn').hide();
				$('div#loginLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#loginLoadingIcon').hide();
				$('button#adminLoginBtn').show();
			}
		},
		
		UpdateUI()
		{	
			if(this.update_success)
			{
				//clear all forms:
				$('form#loginForm').trigger('reset');
				$('form#loginForm').hide();

				//clear first:
				$('div#adminLoginSuccess').text("");
				$('div#adminLoginError').text("");
				//Update Success Message:
				$('div#adminLoginSuccess').text("Found! Logging In...");
				$('div#redirectIcon').show();
			}
			else if(!this.update_success)
			{
				//clear first:
				$('#adminLoginSuccess').text("");
				$('#adminLoginError').text("");
				$('#adminLoginErrorDetails').text("");
				//Update Error Message:
				$('#adminLoginError').text("Login Error!");
				$('#adminLoginErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		PersistTokenLocal()
		{
			let adminToken = this.serverSyncModel.uniqueID;
			window.localStorage.setItem('adminID', adminToken);
		},

		DeleteTokenLocal()
		{
			window.localStorage.clear();
		},
		
		RedirectToDashboard()
		{
			//redirect to dashboard after waiting for 5secs:
			setTimeout(
				window.location.replace('adminDashboard.html'), 5000
			);
		},

		RedirectToLogin()
		{
			//redirect to login :
			window.location.replace('adminLogin.html')
		
		},
	}
		

export default AdminLoginLogout;
	
	
	