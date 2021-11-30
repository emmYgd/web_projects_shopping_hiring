import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerShippingDetails = 
	{	
		//buyer token:
		buyer_id:null,

		//values:
		serverSyncModel:null,
		userName : "",
	 	companyName : "",
	 	shippingCountry : "",
	 	shippingState : "",
	 	shippingCityOrTown : "",
	 	shippingStreetOrClose : "",
	 	shippingApartmentSuiteOrUnit : "",
	 	shippingPhoneNumber : "",
	 	shippingEmail : "",
	 		
		//states:
		fetch_success:false,
		clicked_state:false,
		upload_success:false,
		is_all_null:false,

		RefreshShippingDetails()
		{
			$('a#refreshShippingDetails').click((event)=>
			{
				event.preventDefault();

				//then calls to server:
				this.FetchShippingDetails();
			});
		},


		FetchShippingDetails()
		{
			//initialize:
			this.Init();
			//first call the Sync Model:
			this.SyncFetchShippingDetailsModel().then((serverModel)=>
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
		
		UploadShippingDetails(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				
				this.Collectibles();
				event.preventDefault();

				console.log("Shipping Clicked")
				console.log(this.userName);
				console.log(this.companyName);
				console.log(this.shippingState);
				console.log(this.shippingCityOrTown);
				console.log(this.shippingStreetOrClose);
				console.log(this.shippingPhoneNumber);
				console.log(this.shippingEmail);
				if(
					this.userName=="" ||
					this.companyName=="" ||
					this.shippingState=="" ||
					this.shippingCityOrTown=="" ||
					this.shippingStreetOrClose==""  ||
					this.shippingPhoneNumber=="" ||
					this.shippingEmail==""
				)
				{
					//console.log("Shipping Clicked")
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
					this.SyncUploadShippingDetailsModel().then((serverModel)=>
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

			$('div#dispAllShipping').hide()
			$('div#errorSuccessNotifyShippingDetails').hide();
			$('a#refreshShippingDetails').hide();

			$('div#shippingViewLoadingIcon').show();


			$('div#shippingUploadLoadingIcon').hide();
			$('div#errorSuccessNotifyShippingUploadDetails').hide();
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.userName = $('input#shipping_username_edit').val();
	 		this.companyName = $('input#shipping_company_edit').val();
	 		this.shippingCountry = $('input#shipping_country_edit').val();
	 		this.shippingState = $('input#shipping_state_edit').val();
	 		this.shippingCityOrTown = $('input#shipping_city_or_town_edit').val();
	 		this.shippingStreetOrClose = $('textarea#shipping_street_or_close_edit').val();
	 		this.shippingApartmentSuiteOrUnit = $('textarea#shipping_home_apartment_suite_unit_edit').val()
	 		this.shippingPhoneNumber = $('input#shipping_phone_number_edit').val();
	 		this.shippingEmail = $('input#shipping_email_edit').val();
	 		
		},

		SyncFetchShippingDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/fetch/shipping/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncUploadShippingDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/upload/shipping/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
				'shipping_username' : this.userName,
	 			'shipping_user_company' : this.companyName,
	 			'shipping_country' : this.shippingCountry,
	 			'shipping_state' : this.shippingState,
	 			'shipping_city_or_town' : this.shippingCityOrTown,
	 			'shipping_street_or_close' : this.shippingStreetOrClose,
	 			'shipping_home_apartment_suite_or_unit' : this.shippingApartmentSuiteOrUnit,
	 			'shipping_phone_number': this.shippingPhoneNumber,
           		'shipping_email' : this.shippingEmail,
	 		};
				let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
				return serverModel;
				//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#shippingUploadDetailsBtn').hide();
				$('div#shippingUploadLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#shippingUploadLoadingIcon').hide();
				$('button#shippingUploadDetailsBtn').show();
			}
		},

		UploadIsAllNullUI()
		{
			if(this.is_all_null)
			{
				//console.log("Here am I!!")
				$('div#errorSuccessNotifyShippingUploadDetails').show();
				$('div#shippingUploadFetchSuccess').text('');
				$('div#shippingUploadFetchError').text('');
				$('div#shippingUploadFetchErrorDetails').text('');

				$('div#shippingUploadFetchError').text('Upload Error!');
				$('div#shippingUploadFetchErrorDetails').text('Please fill up all non-optional fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#errorSuccessNotifyShippingUploadDetails').hide();
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#shippingDetailsUpload').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyShippingUploadDetails').show();
				$('div#shippingUploadFetchSuccess').text('');
				$('div#shippingUploadFetchError').text('');
				$('div#shippingUploadFetchErrorDetails').text('');
				//Upload Success Message:
				$('div#shippingUploadFetchSuccess').text("Shipping Details Updated Successfully!");
			}
			else if(!this.upload_success)
			{
				//clear first:
				$('div#errorSuccessNotifyShippingUploadDetails').show();
				$('div#shippingUploadFetchSuccess').text('');
				$('div#shippingUploadFetchError').text('');
				$('div#shippingUploadFetchErrorDetails').text('');

				//Upload Error Message:
				$('div#shippingUploadFetchError').text("Upload Error!");
				$('div#shippingUploadFetchErrorDetails').text(this.short_description.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#shippingViewLoadingIcon').hide();
				$('div#dispAllShipping').show();
				$('div#errorSuccessNotifyShippingDetails').show();
				$('a#refreshShippingDetails').show();


				$('div#shippingFetchSuccess').text('');
				$('div#shippingFetchError').text('');
				$('div#shippingFetchErrorDetails').text('');

				$('div#shippingFetchSuccess').text('Fetch Success!');

				//console.log(this.serverSyncModel);
				//begin insert:
				$('span#shippingName').text('');
				$('span#shippingName').text(this.serverSyncModel.shippingDetails.shipping_username);

				$('span#shippingCompany').text('');
				$('span#shippingCompany').text(this.serverSyncModel.shippingDetails.shipping_user_company);

				$('span#shippingCountry').text('');
				$('span#shippingCountry').text(this.serverSyncModel.shippingDetails.shipping_country);

				$('span#shippingState').text('');
				$('span#shippingState').text(this.serverSyncModel.shippingDetails.shipping_state);

				$('span#shippingCityOrTown').text('');
				$('span#shippingCityOrTown').text(this.serverSyncModel.shippingDetails.shipping_city_or_town);

				$('span#shippingStreetOrClose').text('');
				$('span#shippingStreetOrClose').text(this.serverSyncModel.shippingDetails.shipping_street_or_close);

				$('span#shippingHomeApartmentSuiteUnit').text('');
				$('span#shippingHomeApartmentSuiteUnit').text(this.serverSyncModel.shippingDetails.shipping_home_apartment_suite_or_unit);

				$('span#shippingPhoneNumber').text('Cool');
				$('span#shippingPhoneNumber').text(this.serverSyncModel.shippingDetails.shipping_phone_number);

				$('span#shippingEmail').text('');
				$('span#shippingEmail').text(this.serverSyncModel.shippingDetails.shipping_email);
				
			}
			else if(!this.fetch_success)
			{
				$('div#shippingViewLoadingIcon').hide();
				$('div#errorSuccessNotifyShippingDetails').show();
				$('a#refreshShippingDetails').show();

				$('div#shippingFetchSuccess').text('');
				$('div#shippingFetchError').text('');
				$('div#shippingFetchErrorDetails').text('');

				$('div#shippingFetchError').text('Fetch Error!');
				$('div#shippingFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},
	}
		

export default BuyerShippingDetails;
	
	
	