import AbstractModel from "./../../Models/AbstractModel.js";
	
	const AdminDashboardSecurity = 
	{	
		adminID:null,
		server_confirm_model:null,
		
		SecureDashboard()
		{
			this.EnsureLoginFrontend();
			this.EnsureLoginBackend();
		},

		//By first checking their local storage ID:
		EnsureLoginFrontend()
		{
			this.adminID = window.localStorage.getItem('adminID');
			//if it is empty, redirect to login
			if(
				this.adminID === undefined || 
				this.adminID === null ||
				this.adminID === ""
			)
			{
				window.location.replace('adminLogin.html')
			}

			//if it is not empty->continue...
		},

		async EnsureLoginBackend()
		{
			let method = "POST";
			let confirmServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/auth/confirm/login/state';
				
			let jsonRequestModel = {
				'token_id' : this.adminID,
			};

			//console.log("InitJson", jsonRequestModel);

			let serverModel = await AbstractModel(method,confirmServerUrl,jsonRequestModel);
			console.log("SyncModel", serverModel);

			this.server_confirm_model = serverModel;
			//if it isn't logged in on the server:
			if((this.server_confirm_model.code == 0) &&
				(this.server_confirm_model.serverStatus == "notLoggedIn")
			)
			{
				//redirect again:
				setTimeout(
					window.location.replace('adminLogin.html'), 5000
				);
			}
			//otherwise continue...*/
		},
	}
		

export default AdminDashboardSecurity;
	
	
	