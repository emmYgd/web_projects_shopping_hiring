import AbstractModel from "./../../Models/AbstractModel.js";
	
	const AdminBankAccount = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:null,
		bankAccFirstName:null,
	 	bankAccMiddleName:null,
	 	bankAccLastName:null,
	 	bankAccEmail:null,
	 	bankAccPhoneNum:null,
	 	bankAccPassword:null,
	 	bankAccType:null,
	 	bankAccCountry:null,
	 	bankAccCurrency:null,
	 	bankAccNumber:null,
	 	bankAccAddInfo:null,

		//states:
		fetch_success:false,
		clicked_state:false,
		upload_success:false,

		RefreshFetchBankAccount()
		{
			$('div#refreshAdminBankDetails').click((event)=>
			{
				event.preventDefault();
				$('div#showLoadingBankDetails').show();
				$('div#loadAdminBankAcc').show();
				$('div#dispAdminBankErrorLoad').hide();

				//then calls to server:
				this.FetchBankAccount();
			});
		},

		FetchBankAccount()
		{
			//initialize:
			this.Init();
			//first call the Sync Model:
			this.SyncFetchBankDetailsModel().then((serverModel)=>
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
		
		UpdateBankAccount(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				
				this.Collectibles();

				if(
					this.bankAccFirstName!==null && 
	 				this.bankAccLastName!==null &&
	 				this.bankAccEmail!==null &&
	 				this.bankAccType!==null &&
	 				this.bankAccCountry!==null &&
	 				this.bankAccCurrency!==null &&
	 				this.bankAccNumber!==null 
				)
				{
					event.preventDefault();
					
					//set state to true for watchers
					this.clicked_state = true;
					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncUpdateBankAccDetailsModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'bankDetailsSaved!')
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
							(this.serverSyncModel.serverStatus === 'bankDetailsNotSaved!')
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
			$('div#uploadBankLoadingIcon').hide();
			//clear text:
			$('div#adminBankSuccess').text('');
			$('div#adminBankError').text('');
			$('div#adminBankErrorDetails').text('');

			$('div#dispAdminBankErrorLoad').hide();
			$('div#refreshAdminBankDetails').hide();
			$('div#dispAdminBankDetails').hide();
		
			$('div#showLoadingBankDetails').show();

		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.bankAccFirstName = $('input#bankAccFirstName').val();
	 		this.bankAccMiddleName = $('input#bankAccMiddleName').val();
	 		this.bankAccLastName = $('input#bankAccLastName').val();
	 		this.bankAccEmail = $('input#bankAccEmail').val();
	 		this.bankAccPhoneNum = $('input#bankAccPhoneNum').val();
	 		this.bankAccPassword = $('input#bankAccPassword').val();
	 		this.bankAccType = $('input#bankAccType').val();
	 		this.bankAccCountry = $('input#bankAccCountry').val()
	 		this.bankAccCurrency = $('input#bankAccCurrency').val();
	 		this.bankAccNumber = $('input#bankAccNumber').val();
	 		this.bankAccAddInfo = $('textarea#bankAccAddInfo').val();

	 		console.log(this.bankAccPhoneNum);
		},

		SyncFetchBankDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/bank/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncUpdateBankAccDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/update/bank/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'bank_acc_first_name' : this.bankAccFirstName,
				'bank_acc_middle_name' : this.bankAccMiddleName,
				'bank_acc_last_name' : this.bankAccLastName,
				'bank_acc_email' : this.bankAccEmail,
				'bank_acc_phone_num' : this.bankAccPhoneNum,
				'bank_acc_password' : this.bankAccPassword,
				'bank_acc_phone_num' : this.bankAccPhoneNum,
				'country_of_opening' : this.bankAccCountry,
				'currency_of_operation' : this.bankAccCurrency,
				'bank_account_type' : this.bankAccType,
				'bank_account_number' : this.bankAccNumber,
				'bank_acc_additional_info' : this.bankAccAddInfo
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#saveBankAccDetails').hide();
				$('div#uploadBankLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#uploadBankLoadingIcon').hide();
				$('button#saveBankAccDetails').show();
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#uploadBankDetails').trigger('reset');

				//clear first:
				$('div#adminBankSuccess').text("");
				$('div#adminBankError').text("");
				$('div#adminBankErrorDetails').text("");
				//Upload Success Message:
				$('div#adminBankSuccess').text("Bank Details Updated Successfully!");
			}
			else if(!this.upload_success)
			{
				//clear first:
				$('div#adminBankSuccess').text("");
				$('div#adminBankError').text("");
				$('div#adminBankErrorDetails').text("");

				//Upload Error Message:
				$('div#adminBankError').text("Update Error!");
				$('div#adminBankErrorDetails').text("Ensure you fill all appropriate fields!");
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#showLoadingBankDetails').hide();
				$('div#refreshAdminBankDetails').show();
				$('div#dispAdminBankDetails').show();

				//console.log(this.serverSyncModel);
				//begin insert:
				$('span#disp_firstname').text('');
				$('span#disp_firstname').text(this.serverSyncModel.bankDetails.bank_acc_first_name);

				$('span#disp_middlename').text('');
				$('span#disp_middlename').text(this.serverSyncModel.bankDetails.bank_acc_middle_name);

				$('span#disp_lastname').text('');
				$('span#disp_lastname').text(this.serverSyncModel.bankDetails.bank_acc_last_name);

				$('span#disp_email').text('');
				$('span#disp_email').text(this.serverSyncModel.bankDetails.bank_acc_email);

				$('span#disp_phone_num').text('');
				$('span#disp_phone_num').text(this.serverSyncModel.bankDetails.bank_acc_phone_num);

				$('span#disp_pass').text('');
				$('span#disp_pass').text(this.serverSyncModel.bankDetails.bank_acc_password);

				$('span#disp_account_type').text('');
				$('span#disp_account_type').text(this.serverSyncModel.bankDetails.bank_account_type);

				$('span#disp_country').text('');
				$('span#disp_country').text(this.serverSyncModel.bankDetails.country_of_opening);

				$('span#disp_currency').text('');
				$('span#disp_currency').text(this.serverSyncModel.bankDetails.currency_of_operation);

				$('span#disp_acc_num').text('');
				$('span#disp_acc_num').text(this.serverSyncModel.bankDetails.bank_account_number);

				$('span#disp_add_info').text('');
				$('span#disp_add_info').text(this.serverSyncModel.bankDetails.bank_acc_additional_info);
				
			}
			else if(!this.fetch_success)
			{
				$('div#dispAdminBankDetails').hide();

				$('div#showLoadingBankDetails').show();
				$('div#refreshAdminBankDetails').show();

				$('div#loadAdminBankAcc').hide();
				$('div#dispAdminBankErrorLoad').show();
				
			}
		},
	}
		

export default AdminBankAccount;
	
	
	