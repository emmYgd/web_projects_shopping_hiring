import AbstractModel from "./../../Models/AbstractModel.js";
	
	const AdminBusinessAddress = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:null,
		businessName:null,
	 	companyName:null,
	 	businessCountry:null,
	 	businessState:null,
	 	businessCityOrTown:null,
	 	businessStreetOrClose:null,
	 	businessApartmentSuiteOrUnit:null,
	 	businessPhoneNumber:null,
	 	businessEmail:null,

		//states:
		fetch_success:false,
		clicked_state:false,
		upload_success:false,

		RefreshFetchBusinessAddress()
		{
			$('a#biz_details_refresh').click((event)=>
			{
				event.preventDefault();

				//first show loading icon:
				$('div#load_biz_details').show();

				//then calls to server:
				this.FetchBusinessAddress();
			});
		},


		FetchBusinessAddress()
		{
			//initialize:
			this.Init();
			//first call the Sync Model:
			this.SyncFetchBusinessDetailsModel().then((serverModel)=>
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
		
		UpdateBusinessAddress(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				
				this.Collectibles();

				if(
					this.businessName!==null &&
					this.companyName!==null &&
					this.businessCountry!==null &&
					this.businessState!==null &&
					this.businessCityOrTown!==null &&
					this.businessStreetOrClose!==null &&
					this.businessApartmentSuiteOrUnit!==null &&
					this.businessPhoneNumber!==null &&
					this.businessEmail!==null
				)
				{
					event.preventDefault();
					
					//set state to true for watchers
					this.clicked_state = true;
					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncUpdateBusinessDetailsModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'bizDetailsSaved!')
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
							(this.serverSyncModel.serverStatus === 'bizDetailsNotSaved!')
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
			//first get admin id:
			this.admin_id = window.localStorage.getItem('adminID');
			//hide loading icon:
			$('div#uploadBizLoadingIcon').hide();
			//clear text:
			$('div#adminBizSuccess').text('');
			$('div#adminBizError').text('');
			$('div#adminBizErrorDetails').text('');

			$('b#biz_details_show').hide();
			$('div#biz_disp_message').hide();
			$('a#biz_details_refresh').hide();
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.businessName = $('input#biz_name').val();
	 		this.companyName = $('input#comp_name').val();
	 		this.businessCountry = $('input#biz_country').val();
	 		this.businessState = $('input#biz_state').val();
	 		this.businessCityOrTown = $('input#biz_city_town').val();
	 		this.businessStreetOrClose = $('textarea#biz_street_close').val();
	 		this.businessApartmentSuiteOrUnit = $('textarea#biz_apartment_suite_unit').val()
	 		this.businessPhoneNumber = $('input#biz_phone_number').val();
	 		this.businessEmail = $('input#biz_email').val();
	 		console.log(this.businessEmail);
		},

		SyncFetchBusinessDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/business/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncUpdateBusinessDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/update/business/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'business_name' : this.businessName,
				'company_name' : this.companyName,
				'business_country' : this.businessCountry,
				'business_state' : this.businessState,
				'business_city_or_town' : this.businessCityOrTown,
				'business_street_or_close' : this.businessStreetOrClose,
				'business_apartment_suite_or_unit' : this.businessApartmentSuiteOrUnit,
				'business_phone_number' : this.businessPhoneNumber,
				'business_email' : this.businessEmail
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#saveBizDetails').hide();
				$('div#uploadBizLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#uploadBizLoadingIcon').hide();
				$('button#saveBizDetails').show();
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#biz_info_upload').trigger('reset');

				//clear first:
				$('div#adminBizSuccess').text("");
				$('div#adminBizError').text("");
				$('div#adminBizErrorDetails').text("");
				//Upload Success Message:
				$('div#adminBizSuccess').text("Business Details Updated Successfully!");
			}
			else if(!this.upload_success)
			{
				//clear first:
				$('div#adminBizSuccess').text("");
				$('div#adminBizError').text("");
				$('div#adminBizErrorDetails').text("");

				//Upload Error Message:
				$('div#adminBizError').text("Update Error!");
				$('div#adminBizErrorDetails').text("Ensure you fill all apprpriate fields!");
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#biz_disp_message').hide();
				$('div#load_biz_details').hide();

				$('b#biz_details_show').show();
				$('a#biz_details_refresh').show();

				//console.log(this.serverSyncModel);
				//begin insert:
				$('span#admin_biz_name').text('');
				$('span#admin_biz_name').text(this.serverSyncModel.bizDetails.company_name);

				$('span#admin_biz_company').text('');
				$('span#admin_biz_company').text(this.serverSyncModel.bizDetails.business_name);

				$('span#admin_biz_street_or_close').text('');
				$('span#admin_biz_street_or_close').text(this.serverSyncModel.bizDetails.business_street_or_close);

				$('span#admin_biz_suite_unit').text('');
				$('span#admin_biz_suite_unit').text(this.serverSyncModel.bizDetails.business_apartment_suite_or_unit);

				$('span#admin_biz_country').text('');
				$('span#admin_biz_country').text(this.serverSyncModel.bizDetails.business_country);

				$('span#admin_biz_state').text('');
				$('span#admin_biz_state').text(this.serverSyncModel.bizDetails.business_state);

				$('span#admin_biz_city_town').text('');
				$('span#admin_biz_city_town').text(this.serverSyncModel.bizDetails.business_city_or_town);

				$('span#admin_biz_phone_num').text('Cool');
				$('span#admin_biz_phone_num').text(this.serverSyncModel.bizDetails.business_phone_number);

				$('span#admin_biz_email').text('');
				$('span#admin_biz_email').text(this.serverSyncModel.bizDetails.business_email);
				
			}
			else if(!this.fetch_success)
			{
				$('b#biz_details_show').hide();
				$('div#load_biz_details').hide();

				$('div#biz_disp_message').show();
				$('a#biz_details_refresh').show();
			}
		},
	}
		

export default AdminBusinessAddress;
	
	
	