import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerLoginLogout = 
	{	
		//values:
		serverSyncModel:null,
		buyer_email: "",
		buyer_password: "",

		//for pending cart:
		globalCartModel:"",
		totalPrice:"",
		allProductModels:"",
		cartCurrencyOfPayment:"",

		//states:
		clicked_state:false,
		is_all_null:false,
		update_success:false,
		
		LoginDashboard(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				this.Collectibles();
				event.preventDefault();
				if(
	 				this.buyer_email == "" ||
	 				this.buyer_password == ""
				)
				{
					//should handle default here but implemented this because of the optional fields
					console.log("Empty Fields!");
					this.is_all_null = true;
					this.UpdateIsAllNullUI();
				}
				else
				{
					this.is_all_null = false;
					this.UpdateIsAllNullUI();

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

							//use this token together with user cart details to create cart:
							this.PersistPendingCartToBackend();

							//now, redirect:
							//this.RedirectToDashboard();
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
				console.log("Logout Clicked!");

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
			$('div#redirectLoginNotify').hide();
			$('div#loginLoadingIcon').hide();
		},

		Collectibles()
		{
			this.buyer_email = $('input#login_email').val();
	 		this.buyer_password = $('input#login_password').val();
	 		/*console.log(buyerEmail);
	 		console.log(buyerPass);*/
		},
			
		SyncLoginModel()
		{
			let method = "POST";
			let updateServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/auth/login/dashboard';
			//console.log("My email", this.buyer_email);
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'buyer_email' : this.buyer_email,
				'buyer_password' : this.buyer_password,
			}

			let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		SyncLogoutModel()
		{
			let method = "POST";
			let updateServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/auth/logout';

			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : window.localStorage.getItem('buyerID')
			}

			let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		SyncPendingCartDetails()
		{
			let method = 'POST';
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/save/pending/cart/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.serverSyncModel.uniqueToken,	
				'attached_goods_ids' : this.globalCartModel,
				'purchase_currency' : this.cartCurrencyOfPayment,
				'purchase_price' : this.totalPrice,
				'payment_status' : 'pending',
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},


		UpdateIsAllNullUI()
		{
			if(this.is_all_null)
			{
				$('div#errorSuccessNotifyBuyerLogin').show();
				$('div#loginFetchSuccess').text('');
				$('div#loginFetchError').text('');
				$('div#loginFetchErrorDetails').text('');

				$('div#loginFetchError').text('Login Error!');
				$('div#loginFetchErrorDetails').text('Please fill up all fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#errorSuccessNotifyBuyerLogin').hide();
			}
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#buyerLoginBtn').hide();
				$('div#loginLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#loginLoadingIcon').hide();
				$('button#buyerLoginBtn').show();
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
				$('div#redirectLoginNotify').show();
				$('div#redirectIcon').show();

				$('div#redirectMessage').text("");
				$('div#redirectMessage').text("Found! Logging In...");
			}
			else if(!this.update_success)
			{
				//clear first:
				$('div#redirectLoginNotify').hide();

				$('div#errorSuccessNotifyBuyerLogin').show()
				$('div#loginFetchSuccess').text("");
				$('div#loginFetchError').text("");
				$('div#loginFetchErrorDetails').text("");
				//Update Error Message:
				$('div#loginFetchError').text("Login Error!");
				$('div#loginFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		PersistTokenLocal()
		{
			let buyerToken = this.serverSyncModel.uniqueToken;
			window.localStorage.setItem('buyerID', buyerToken);
		},

		DeleteTokenLocal()
		{
			window.localStorage.clear();
		},

		PersistPendingCartToBackend()
		{
			this.globalCartModel = JSON.parse(window.localStorage.getItem('globalCartModel'));
			this.totalPrice = window.localStorage.getItem('totalPrice');
			this.cartCurrencyOfPayment = window.localStorage.getItem('cartCurrencyOfPayment');

			if((this.globalCartModel!==undefined || this.globalCartModel!==null || this.globalCartModel!=="") && 
				(this.totalPrice!==undefined || this.totalPrice!==null || this.totalPrice !==""))
			{
				//persist to database silently:
				this.SyncPendingCartDetails();
			}
			/*else
			{
				//continue:
			}*/

		},
		
		RedirectToDashboard()
		{
			//redirect to dashboard after waiting for 5secs:
			setTimeout(
				window.location.replace('buyerDashboard.html'), 5000
			);
		},

		RedirectToLogin()
		{
			//redirect to login :
			window.location.replace('buyerShopCategory.html');
		
		},
	}
		

export default BuyerLoginLogout;
	
	
	