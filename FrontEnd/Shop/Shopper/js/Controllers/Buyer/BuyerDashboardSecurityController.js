import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerDashboardSecurity = 
	{	
		buyerID:null,
		server_confirm_model:null,
		
		SecureDashboard()
		{
			this.EnsureLoginFrontend();
			this.EnsureLoginBackend();
		},

		//By first checking their local storage ID:
		EnsureLoginFrontend()
		{
			this.buyerID = window.localStorage.getItem('buyerID');
			//if it is empty, redirect to login
			if(
				this.buyerID === undefined || 
				this.buyerID === null ||
				this.buyerID === ""
			)
			{
				//window.location.replace('buyerShopCategory.html');
			}

			//if it is not empty->continue...
		},

		async EnsureLoginBackend()
		{
			let method = "POST";
			let confirmServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/auth/confirm/login/state';
				
			let jsonRequestModel = {
				'unique_buyer_id' : this.buyerID,
			};

			//console.log("InitJson", jsonRequestModel);

			let serverModel = await AbstractModel(method,confirmServerUrl,jsonRequestModel);
			console.log("SyncModel", serverModel);

			this.server_confirm_model = serverModel;
			//if it isn't logged in on the server:
			if((this.server_confirm_model.code == 0) &&
				(this.server_confirm_model.serverStatus == "NotLoggedIn!")
			)
			{
				//redirect again:
				setTimeout(
					window.location.replace('buyerShopCategory.html'), 5000
				);
			}
			//otherwise continue...*/
		},
	}
		

export default BuyerDashboardSecurity;
	
	
	