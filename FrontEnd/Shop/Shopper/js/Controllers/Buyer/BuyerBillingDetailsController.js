import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerBillingDetails = 
	{	
		//buyer token:
		buyer_id:null,

		//values:
		serverSyncModel:null,
		userName : "",
	 	companyName : "",
	 	billingCountry : "",
	 	billingState : "",
	 	billingCityOrTown : "",
	 	billingStreetOrClose : "",
	 	billingApartmentSuiteOrUnit : "",
	 	billingPhoneNumber : "",
	 	billingEmail : "",
	 		
		//states:
		fetch_success:false,
		clicked_state:false,
		upload_success:false,
		is_all_null:false,

		RefreshBillingDetails()
		{
			$('a#refreshBillingDetails').click((event)=>
			{
				event.preventDefault();

				//then calls to server:
				this.FetchBillingDetails();
			});
		},


		FetchBillingDetails()
		{
			//initialize:
			this.Init();
			//first call the Sync Model:
			this.SyncFetchBillingDetailsModel().then((serverModel)=>
			{
				//sync model:
				this.serverSyncModel = serverModel;

				//now start conditionals:
				if( 
					(this.serverSyncModel.code === 1) &&
					(this.serverSyncModel.serverStatus === 'FetchSuccess!')
				)
				{
					console.log("Success");
					//fetch state:
					this.fetch_success = true;
					//call reactors:
					this.FetchUI();
				}
				else if
				( 
					(this.serverSyncModel.code === 0) &&
					(this.serverSyncModel.serverStatus === 'FetchError!')
				)
				{
					console.log("Error");
					//fetch state:
					this.fetch_success = false;
					//call reactors:
					this.FetchUI();
				}
			});
		},
		
		UploadBillingDetails(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				
				this.Collectibles();
				event.preventDefault();

				console.log("Billing Clicked")
				console.log(this.userName);
				console.log(this.companyName);
				console.log(this.billingState);
				console.log(this.billingCityOrTown);
				console.log(this.billingStreetOrClose);
				console.log(this.billingPhoneNumber);
				console.log(this.billingEmail);
				if(
					this.userName=="" ||
					this.companyName=="" ||
					this.billingState=="" ||
					this.billingCityOrTown=="" ||
					this.billingStreetOrClose==""  ||
					this.billingPhoneNumber=="" ||
					this.billingEmail==""
				)
				{
					//console.log("Billing Clicked")
					this.is_all_null = true;
					this.UploadIsAllNullUI();
				}
				else
				{
					console.log('I am here?');
					this.is_all_null = false;
					this.UploadIsAllNullUI();

					//set state to true for watchers
					this.clicked_state = true;
					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncUploadBillingDetailsModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'DetailsSaved!')
						)
						{
							console.log("Success");
							//Upload state:
							this.upload_success = true;
							//call reactors:
							this.UploadUI();
						}
						else if
						( 
							(this.serverSyncModel.code === 0) &&
							(this.serverSyncModel.serverStatus === 'DetailsNotSaved!')
						)
						{
							console.log("Error");
							//Upload state:
							this.upload_success = false;
							//call reactors:
							this.UploadUI();
						}
					});
				}
			});
		},

		Init()
		{
			//first get buyer id:
			this.buyer_id = window.localStorage.getItem('buyerID');

			$('div#dispAllBilling').hide()
			$('div#errorSuccessNotifyBillingDetails').hide();
			$('a#refreshBillingDetails').hide();

			$('div#billingViewLoadingIcon').show();


			$('div#billingUploadLoadingIcon').hide();
			$('div#errorSuccessNotifyBillingUploadDetails').hide();
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.userName = $('input#billing_username_edit').val();
	 		this.companyName = $('input#billing_company_edit').val();
	 		this.billingCountry = $('input#billing_country_edit').val();
	 		this.billingState = $('input#billing_state_edit').val();
	 		this.billingCityOrTown = $('input#billing_city_or_town_edit').val();
	 		this.billingStreetOrClose = $('textarea#billing_street_or_close_edit').val();
	 		this.billingApartmentSuiteOrUnit = $('textarea#billing_home_apartment_suite_unit_edit').val()
	 		this.billingPhoneNumber = $('input#billing_phone_number_edit').val();
	 		this.billingEmail = $('input#billing_email_edit').val();
	 		
		},

		SyncFetchBillingDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/fetch/billing/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncUploadBillingDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/upload/billing/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
				'billing_username' : this.userName,
	 			'billing_user_company' : this.companyName,
	 			'billing_country' : this.billingCountry,
	 			'billing_state' : this.billingState,
	 			'billing_city_or_town' : this.billingCityOrTown,
	 			'billing_street_or_close' : this.billingStreetOrClose,
	 			'billing_home_apartment_suite_or_unit' : this.billingApartmentSuiteOrUnit,
	 			'billing_phone_number': this.billingPhoneNumber,
           		'billing_email' : this.billingEmail,
	 		};
				let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
				return serverModel;
				//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#billingUploadDetailsBtn').hide();
				$('div#billingUploadLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#billingUploadLoadingIcon').hide();
				$('button#billingUploadDetailsBtn').show();
			}
		},

		UploadIsAllNullUI()
		{
			if(this.is_all_null)
			{
				//console.log("Here am I!!")
				$('div#errorSuccessNotifyBillingUploadDetails').show();
				$('div#billingUploadFetchSuccess').text('');
				$('div#billingUploadFetchError').text('');
				$('div#billingUploadFetchErrorDetails').text('');

				$('div#billingUploadFetchError').text('Upload Error!');
				$('div#billingUploadFetchErrorDetails').text('Please fill up all non-optional fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#errorSuccessNotifyBillingUploadDetails').hide();
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#billingDetailsUpload').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyBillingUploadDetails').show();
				$('div#billingUploadFetchSuccess').text('');
				$('div#billingUploadFetchError').text('');
				$('div#billingUploadFetchErrorDetails').text('');
				//Upload Success Message:
				$('div#billingUploadFetchSuccess').text("Billing Details Updated Successfully!");
			}
			else if(!this.upload_success)
			{
				//clear first:
				$('div#errorSuccessNotifyBillingUploadDetails').show();
				$('div#billingUploadFetchSuccess').text('');
				$('div#billingUploadFetchError').text('');
				$('div#billingUploadFetchErrorDetails').text('');

				//Upload Error Message:
				$('div#billingUploadFetchError').text("Upload Error!");
				$('div#billingUploadFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#billingViewLoadingIcon').hide();
				$('div#dispAllBilling').show();
				$('div#errorSuccessNotifyBillingDetails').show();
				$('a#refreshBillingDetails').show();


				$('div#billingFetchSuccess').text('');
				$('div#billingFetchError').text('');
				$('div#billingFetchErrorDetails').text('');

				$('div#billingFetchSuccess').text('Fetch Success!');

				//console.log(this.serverSyncModel);
				//begin insert:
				$('span#billingName').text('');
				$('span#billingName').text(this.serverSyncModel.billingDetails.billing_username);

				$('span#billingCompany').text('');
				$('span#billingCompany').text(this.serverSyncModel.billingDetails.billing_user_company);

				$('span#billingCountry').text('');
				$('span#billingCountry').text(this.serverSyncModel.billingDetails.billing_country);

				$('span#billingState').text('');
				$('span#billingState').text(this.serverSyncModel.billingDetails.billing_state);

				$('span#billingCityOrTown').text('');
				$('span#billingCityOrTown').text(this.serverSyncModel.billingDetails.billing_city_or_town);

				$('span#billingStreetOrClose').text('');
				$('span#billingStreetOrClose').text(this.serverSyncModel.billingDetails.billing_street_or_close);

				$('span#billingHomeApartmentSuiteUnit').text('');
				$('span#billingHomeApartmentSuiteUnit').text(this.serverSyncModel.billingDetails.billing_home_apartment_suite_or_unit);

				$('span#billingPhoneNumber').text('Cool');
				$('span#billingPhoneNumber').text(this.serverSyncModel.billingDetails.billing_phone_number);

				$('span#billingEmail').text('');
				$('span#billingEmail').text(this.serverSyncModel.billingDetails.billing_email);
				
			}
			else if(!this.fetch_success)
			{
				$('div#billingViewLoadingIcon').hide();
				$('div#errorSuccessNotifyBillingDetails').show();
				$('a#refreshBillingDetails').show();

				$('div#billingFetchSuccess').text('');
				$('div#billingFetchError').text('');
				$('div#billingFetchErrorDetails').text('');

				$('div#billingFetchError').text('Fetch Error!');
				$('div#billingFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},
	}
		

export default BuyerBillingDetails;
	
	
	