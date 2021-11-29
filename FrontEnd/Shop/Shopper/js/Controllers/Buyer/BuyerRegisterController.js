import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerRegister = 
	{	
		//values:
		serverSyncModel:null,
		buyer_first_name: "",
		buyer_middle_name: "",
		buyer_last_name: "",
		buyer_country:"",
	 	buyer_state:"",
	 	buyer_city_or_town:"",
	 	buyer_street_or_close:"",
	 	buyer_home_apartment_suite_unit:"",
	 	buyer_phone_number:"",
	 	buyer_email:"",
	 	buyer_password:"",

		//states:
		is_all_null:false,
		clicked_state:false,
		update_success:false,
		
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
					this.buyer_country == "" ||
	 				this.buyer_state == ""|| 
	 				this.buyer_city_or_town == "" ||
	 				this.buyer_street_or_close == "" ||
	 				this.buyer_home_apartment_suite_unit == "" ||
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

		Init()
		{
			//hide loading icon:
			$('div#registerLoadingIcon').hide();
			$('div#errorSuccessNotifyBuyerRegister').hide();
		},

		Collectibles()
		{
			this.buyer_first_name = $('input#register_first_name').val();
			this.buyer_middle_name = $('input#register_middle_name').val();
	 		this.buyer_last_name = $('input#register_middle_name').val();
			this.buyer_country = $('input#register_country').val();
	 		this.buyer_state = $('input#register_state ').val();
	 		this.buyer_city_or_town = $('input#register_city_or_town ').val();
	 		this.buyer_street_or_close = $('textarea#register_street_or_close ').val();
	 		this.buyer_home_apartment_suite_unit = $('textarea#register_home_apartment_suite_unit').val();
	 		this.buyer_phone_number = $('input#register_phone_number').val();
	 		this.buyer_email = $('input#register_email').val();
	 		this.buyer_password = $('input#register_password').val();
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
				'buyer_country' : this.buyer_country,
	 			'buyer_state' : this.buyer_state,
	 			'buyer_city_or_town' : this.buyer_city_or_town,
	 			'buyer_street_or_close' : this.buyer_street_or_close,
	 			'buyer_home_apartment_suite_unit' : this.buyer_home_apartment_suite_unit,
	 			'buyer_phone_number' : this.buyer_phone_number,
	 			'buyer_email' : this.buyer_email,
	 			'buyer_password' : this.buyer_password,
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
			if(this.clicked_state)
			{
				$('button#buyerRegisterBtn').hide();
				$('div#registerLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#registerLoadingIcon').hide();
				$('button#buyerRegisterBtn').show();
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

	}
		

export default BuyerRegister;
	
	
	