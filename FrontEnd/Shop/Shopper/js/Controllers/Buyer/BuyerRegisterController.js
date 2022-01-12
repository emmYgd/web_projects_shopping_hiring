import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerRegister = 
	{	
		//values:
		serverSyncModel:null,
		buyer_first_name: "",
		buyer_middle_name: "",
		buyer_last_name: "",
	 	buyer_phone_number:"",
	 	buyer_email:"",
	 	buyer_password:"",

	 	reset_email:"",
	 	reset_password:"",
	 	confirm_password:"",

		//states:
		pass_reset:false,
		pass_confirm_check:false,

		is_all_null:false,
		clicked_state:false,
		update_success:false,
		reset_clicked:false,
		show_pass:false,
		
		RegisterBuyer(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				this.Collectibles();
				event.preventDefault();

				if(
					this.buyer_first_name == "" ||
					this.buyer_last_name == "" ||
	 				this.buyer_email == "" ||
	 				this.buyer_password == ""
				)
				{
					/*console.log(this.buyer_first_name)
					console.log(this.buyer_last_name)
					console.log(this.buyer_country)
					console.log(this.buyer_city_or_town)
					console.log(this.buyer_street_or_close)
					console.log(this.buyer_home_apartment_suite_unit)
					console.log(this.buyer_email)
					console.log(this.buyer_password)*/

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
					this.LoadingUI();

					//call the server sync:
					this.SyncRegisterModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'RegEntriesSaved!')
						)
						{
							console.log("Success");
							//update state:
							this.update_success = true;
							//call reactors:
							this.UpdateUI();
						}
						else if
						( 
							(this.serverSyncModel.code === 0) &&
							(this.serverSyncModel.serverStatus === 'RegEntriesNotSaved!')
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

		ShowForgotPassUI(targetClickElem)
		{
			$('form#resetPassForm').hide();
			$(targetClickElem).click((event)=>
			{
				//first call init:
				this.show_pass = true;
				this.Init();
			});
		},

		HideForgotPassUI(targetClickElem)
		{
			$(targetClickElem).click((event)=>
			{
				console.log("Hello there");
				event.preventDefault();
				//first call init:
				this.show_pass = false;
				this.Init();
			}); 
		},

		ForgotPassword(targetClickElem)
		{
			this.reset_clicked = false;
			this.LoadingUI();

			$(targetClickElem).click((event) => 
			{ 
				//event.preventDefault();

				//get collectibles:
				this.Collectibles();

				if
				(
					this.reset_email == "" ||
					this.reset_password == "" ||
					this.confirm_password == "" 
				)
				{
					//use default error message:
					/*console.log("Hello Cutie!");
					console.log(this.reset_email);
					console.log(this.reset_password);
					console.log(this.confirm_password);*/
				}
				else 
				{
					if
					(
						this.reset_password !== this.confirm_password
					)
					{
						event.preventDefault();
						//console.log("Not Cool")
						this.pass_confirm_check = true; 
						this.UpdateConfirmPassUI();
					}
					else
					{
						event.preventDefault();
						
						this.pass_confirm_check = false;
						this.UpdateConfirmPassUI();

						this.reset_clicked = true;
						this.LoadingUI();	

						this.SyncForgotPasswordModel().then((serverModel)=>{
							//console.log(serverModel);
							//sync model:
							this.serverSyncModel = serverModel;

							this.reset_clicked = false;
							this.LoadingUI();	

							//now start conditionals:
							if( 
								(this.serverSyncModel.code === 1) &&
								(this.serverSyncModel.serverStatus === 'PassUpdateSuccess!')
							)
							{
								console.log("Success");
								//update state:
								this.pass_reset = true;
								//call reactors:
								this.UpdateResetUI();
							}
							else if
							( 
								(this.serverSyncModel.code === 0) &&
								(this.serverSyncModel.serverStatus === 'PassUpdateFailed!')
							)
							{
								console.log("Error");
								//update state:
								this.pass_reset = false;
								//call reactors:
								this.UpdateResetUI();
							}
						});
					}
				}
			});
		},

		Init()
		{
			//hide loading icon:
			$('div#registerLoadingIcon').hide();
			$('div#errorSuccessNotifyBuyerRegister').hide();

			//hide forgot password form:
			if(this.show_pass)
			{
				$('form#loginForm').hide();
				$('form#resetPassForm').show();
			}
			else if(!this.show_pass)
			{
				$('form#loginForm').show();
				$('form#resetPassForm').hide();
			}
		},

		Collectibles()
		{
			this.buyer_first_name = $('input#register_first_name').val();
			this.buyer_middle_name = $('input#register_middle_name').val();
	 		this.buyer_last_name = $('input#register_middle_name').val();
	 		this.buyer_phone_number = $('input#register_phone_number').val();
	 		this.buyer_email = $('input#register_email').val();
	 		this.buyer_password = $('input#register_password').val();

	 		//for reset password:
	 		this.reset_email = $('input#reset_email').val();
	 		this.reset_password = $('input#reset_password').val();
	 		this.confirm_password = $('input#confirm_password').val();

	 		console.log(this.reset_email);
			console.log(this.reset_password);
			console.log(this.confirm_password);
		},
			
		SyncRegisterModel()
		{
			let method = "POST";
			let updateServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/auth/register';
		
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'buyer_first_name' : this.buyer_first_name, 
				'buyer_middle_name' : this.buyer_middle_name, 
	 			'buyer_last_name' : this.buyer_last_name,
	 			'buyer_phone_number' : this.buyer_phone_number,
	 			'buyer_email' : this.buyer_email,
	 			'buyer_password' : this.buyer_password,
			}

			let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		SyncForgotPasswordModel()
		{
			let method = "POST";
			let updateServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/auth/reset/password';
		
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				buyer_email : this.reset_email,
	 			new_password : this.reset_password,
			}

			let serverModel = AbstractModel(method, updateServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		UpdateIsAllNullUI()
		{
			if(this.is_all_null)
			{
				$('div#errorSuccessNotifyBuyerRegister').show();
				$('div#registerFetchSuccess').text('');
				$('div#registerFetchError').text('');
				$('div#registerFetchErrorDetails').text('');

				$('div#registerFetchError').text('Registration Error!');
				$('div#registerFetchErrorDetails').text('Please fill up all non-optional fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#errorSuccessNotifyBuyerRegister').hide();
			}
		},

		LoadingUI()
		{

			if(this.reset_pass_error)
			{
				$('button#buyerRegisterBtn').hide();
				$('div#registerLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#registerLoadingIcon').hide();
				$('button#buyerRegisterBtn').show();
			}
			if(this.reset_clicked)
			{
				$('button#resetPassBtn').hide();
				$('div#resetPassLoadingIcon').show();	
			}
			else if(!this.clicked_state)
			{
				$('div#resetPassLoadingIcon').hide();
				$('button#resetPassBtn').show();
			}

		},
		
		UpdateUI()
		{	
			if(this.update_success)
			{
				//clear all forms:
				$('form#registerForm').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyBuyerRegister').show();
				$('div#registerFetchSuccess').text('');
				$('div#registerFetchError').text('');
				$('div#registerFetchErrorDetails').text('');
				//Update Success Message:
				$('div#registerFetchSuccess').html("Details Saved! <br/> <i class='icon-long-arrow-left'></i> Continue to Login!");
			}
			else if(!this.update_success)
			{
				//clear first:
				$('div#errorSuccessNotifyBuyerRegister').show();
				$('div#registerFetchSuccess').text('');
				$('div#registerFetchError').text('');
				$('div#registerFetchErrorDetails').text('');
				//Update Error Message:
				$('div#registerFetchError').text("Registration Error!");
				if(this.serverSyncModel.warning !== undefined)
				{
					$('div#registerFetchErrorDetails').text(this.serverSyncModel.warning);
				}
				else
				{
					$('div#registerFetchErrorDetails').text(this.serverSyncModel.short_description);
				}
			}
		},

		UpdateConfirmPassUI()
		{
			if(this.pass_confirm_check)
			{
				$('div#errorSuccessResetPass').show();
				$('div#resetPassSuccess').text('');
				$('div#resetPassError').text('');
				$('div#resetPassErrorDetails').text('');

				$('div#resetPassError').text('Reset Error!');
				$('div#resetPassErrorDetails').text('Password not the same as Confirm Password');
			}
			else if(!this.pass_confirm_check)
			{
				$('div#resetPassSuccess').text('');
				$('div#resetPassError').text('');
				$('div#resetPassErrorDetails').text('');
				$('div#errorSuccessResetPass').hide();
			}
		},

		UpdateResetUI()
		{ 
			if(this.pass_reset)
			{
				$('form#resetPassForm').trigger('reset');
				$('div#errorSuccessResetPass').show();
				$('div#resetPassSuccess').text('');
				$('div#resetPassError').text('');
				$('div#resetPassErrorDetails').text('');

				$('div#resetPassSuccess').text('Password Reset Successful!');
			}
			else if(!this.pass_reset)
			{
				$('div#errorSuccessResetPass').show();
				$('div#resetPassSuccess').text('');
				$('div#resetPassError').text('');
				$('div#resetPassErrorDetails').text('');

				$('div#resetPassError').text('Password Reset Error!');
				$('div#resetPassErrorDetails').text(this.serverSyncModel.short_description);
			}
		}

	}
		

export default BuyerRegister;     