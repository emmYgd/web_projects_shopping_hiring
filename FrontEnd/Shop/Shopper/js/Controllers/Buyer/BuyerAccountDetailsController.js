import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerAccountDetails = 
	{	
		//buyer token:
		buyer_id:null,

		//values:
		serverSyncModel:null,
	 	accountFirstName : "",
	 	accountMiddleName : "",
	 	accountLastName : "",
	 	accountPhoneNumber : "",
	 	accountEmail : "",
	 	accountPassword : "",
	 	
	 		
		//states:
		fetch_success:false,
		clicked_state:false,
		upload_success:false,
		is_all_null:false,

		RefreshBasicAccountDetails()
		{
			$('div#refreshAccountDetails').click((event)=>
			{
				event.preventDefault();

				//then calls to server:
				this.FetchBasicAccountDetails();
			});
		},


		FetchBasicAccountDetails()
		{
			//initialize:
			this.Init();
			//first call the Sync Model:
			this.SyncFetchBasicAccountDetailsModel().then((serverModel)=>
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
		
		UploadAccountDetails(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				
				this.Collectibles();
				event.preventDefault();

				console.log("Account Clicked")

				if(
					this.accountFirstName == "" ||
	 				this.accountLastName == ""
				)
				{
					//console.log("Account Clicked")
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
					this.SyncUploadAccountDetailsModel().then((serverModel)=>
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

			$('div#dispAllAccount').hide()
			$('div#errorSuccessNotifyAccountDetails').hide();
			$('div#refreshAccountDetails').hide();

			$('div#accountViewLoadingIcon').show();


			$('div#accountUploadLoadingIcon').hide();
			$('div#errorSuccessNotifyAccountUploadDetails').hide();
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
	 		this.accountFirstName = $('input#account_firstname_edit').val();
	 		this.accountMiddleName = $('input#account_middlename_edit').val();
	 		this.accountLastName = $('input#account_lastname_edit').val();
	 		this.accountPhoneNumber = $('input#account_phonenumber_edit').val();
	 		this.accountEmail = $('input#account_email_edit').val()
	 		this.accountPassword = $('input#account_password_edit').val();
		},

		SyncFetchBasicAccountDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/fetch/account/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncUploadAccountDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/upload/account/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
				'buyer_first_name' : this.accountFirstName,
	 			'buyer_middle_name' : this.accountMiddleName,
	 			'buyer_last_name' : this.accountLastName,
	 			'buyer_phone_number' : this.accountPhoneNumber,
	 			'buyer_email' : this.accountEmail,
	 			'buyer_password' : this.accountPassword,
	 		};
			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#accountUploadDetailsBtn').hide();
				$('div#accountUploadLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#accountUploadLoadingIcon').hide();
				$('button#accountUploadDetailsBtn').show();
			}
		},

		UploadIsAllNullUI()
		{
			if(this.is_all_null)
			{
				//console.log("Here am I!!")
				$('div#errorSuccessNotifyAccountUploadDetails').show();
				$('div#accountUploadFetchSuccess').text('');
				$('div#accountUploadFetchError').text('');
				$('div#accountUploadFetchErrorDetails').text('');

				$('div#accountUploadFetchError').text('Upload Error!');
				$('div#accountUploadFetchErrorDetails').text('Please fill up all non-optional fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#errorSuccessNotifyAccountUploadDetails').hide();
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#accountDetailsUpload').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyAccountUploadDetails').show();
				$('div#accountUploadFetchSuccess').text('');
				$('div#accountUploadFetchError').text('');
				$('div#accountUploadFetchErrorDetails').text('');
				//Upload Success Message:
				$('div#accountUploadFetchSuccess').text("Account Details Updated Successfully!");
			}
			else if(!this.upload_success)
			{
				//clear first:
				$('div#errorSuccessNotifyAccountUploadDetails').show();
				$('div#accountUploadFetchSuccess').text('');
				$('div#accountUploadFetchError').text('');
				$('div#accountUploadFetchErrorDetails').text('');

				//Upload Error Message:
				$('div#accountUploadFetchError').text("Upload Error!");
				$('div#accountUploadFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#accountViewLoadingIcon').hide();
				$('div#dispAllAccount').show();
				$('div#errorSuccessNotifyAccountDetails').show();
				$('div#refreshAccountDetails').show();


				$('div#accountFetchSuccess').text('');
				$('div#accountFetchError').text('');
				$('div#accountFetchErrorDetails').text('');

				$('div#accountFetchSuccess').text('Fetch Success!');

				//console.log(this.serverSyncModel);
				//begin insert:
				$('span#dispAccFirstName').text('');
				$('span#dispAccFirstName').text(this.serverSyncModel.accountDetails.buyer_first_name);

				$('span#dispAccMiddleName').text('');
				$('span#dispAccMiddleName').text(this.serverSyncModel.accountDetails.buyer_middle_name);

				$('span#dispAccLastName').text('');
				$('span#dispAccLastName').text(this.serverSyncModel.accountDetails.buyer_last_name);

				$('span#dispAccPhoneNum').text('');
				$('span#dispAccPhoneNum').text(this.serverSyncModel.accountDetails.buyer_phone_number);

				$('span#dispAccEmail').text('');
				$('span#dispAccEmail').text(this.serverSyncModel.accountDetails.buyer_email);
				
			}
			else if(!this.fetch_success)
			{
				$('div#accountViewLoadingIcon').hide();
				$('div#errorSuccessNotifyAccountDetails').show();
				$('a#refreshAccountDetails').show();

				$('div#accountFetchSuccess').text('');
				$('div#accountFetchError').text('');
				$('div#accountFetchErrorDetails').text('');

				$('div#accountFetchError').text('Fetch Error!');
				$('div#accountFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},
	}
		

export default BuyerAccountDetails;
	
	
	