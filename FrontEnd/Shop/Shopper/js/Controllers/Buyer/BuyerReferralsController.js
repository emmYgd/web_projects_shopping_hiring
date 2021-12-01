import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerReferral = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:"",
		isReferralActivated: false, 
		referralBonusCurrency: null, 
	 	referralBonusPerClick: null,

		//states:
		fetch_success:false,
		clicked_state:false,
		upload_success:false,
		is_all_null:false,

		/*RefreshFetchReferral()
		{
			$('div#refreshRefDetails').click((event)=>
			{
				//console.log("Hello");
				event.preventDefault();

				//then calls to server:
				this.ExecuteFetch();
			});
		},

		FetchReferral()
		{
			//console.log("Onto Fetching Things");
			this.Init();

			this.ExecuteFetch();
				
		},*/

		/*ExecuteFetch()
		{
			//first call the Sync Model:
				this.SyncFetchReferralModel().then((serverModel)=>
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
						if(this.serverSyncModel.referral_details.is_ref_active)
						{
							//fetch state:
							this.fetch_success = true;
							//call reactors:
							this.FetchUI();
						}
						else
						{
							$('div#dispStatus').text('');
							$('div#dispStatus').text('Disabled!');
						}
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
		},*/
		
		GenerateReferralLink(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				this.Collectibles();
				event.preventDefault();

				if(
					this.referralBonusCurrency == null  ||
	 				this.referralBonusPerClick == ""
	 			)
				{
					console.log("Empty");
					this.is_all_null = true;
					this.LoadingUI();
				}
				else
				{	
					//set state to true for watchers
					this.is_all_null = false;
					this.clicked_state = true;

					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncReferralModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'referralDetailsSaved!')
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
							(this.serverSyncModel.serverStatus === 'referralDetailsNotSaved!')
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
			//hide certain elements:
			$('div#referralSettings').hide();
			$('div#uploadReferralLoadingIcon').hide();

			//this.SyncDeActivateReferralModel();

			//now check conditionals:
			$('input#isReferralActivated').click(function()
			{

				if($(this).prop('checked'))
				{
					//show UI:
					$('div#referralSettings').show();
				}
				else 
				{
					//show UI:
					$('div#referralSettings').hide();

					//write all logic here:

					let method = "POST";
					let disableRefServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/disable/referral';
					//prepare the JSON model:
					let jsonRequestModel = 
					{
						'token_id' : window.localStorage.getItem('adminID'),
					}

					AbstractModel(method, disableRefServerUrl, jsonRequestModel).then((serverModel)=>
					{
						if( 
							(serverModel.code === 1) &&
							(serverModel.serverStatus === 'referralDisabled!')
						)
						{
							console.log("Success");
							$('div#dispStatus').text('');
							$('div#dispStatus').text('Disabled!');
						}
						else if
						( 
							(serverModel.code === 0) &&
							(serverModel.serverStatus === 'referralNotDisabled!')
						)
						{
							console.log("Error");
							$('div#dispStatus').text('');
							$('div#dispStatus').text('Active!');
						}
					});
				}
			});
		},

		Collectibles()
		{
			console.log('Activation Status:', this.isReferralActivated);
			this.isReferralActivated = true;
			this.referralBonusCurrency = $('select#referralBonusCurrency').val();
	 		this.referralBonusPerClick = $('input#referralBonusPerClick').val();

	 		console.log(this.referralBonusCurrency);
		},

		SyncFetchReferralModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/referral/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncReferralModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/update/referral/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'is_referral_prog_activated' : this.isReferralActivated,
				'referral_bonus' : this.referralBonusPerClick,
				'referral_bonus_currency' : this.referralBonusCurrency
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		/*SyncDeActivateReferralModel()
		{
			console.log("Deactivation");
		},*/

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#uploadReferralInfoBtn').hide();
				$('div#uploadReferralLoadingIcon').show();

				$('div#errorSuccessNotify').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#uploadReferralLoadingIcon').hide();
				$('button#uploadReferralInfoBtn').show();

				$('div#errorSuccessNotify').show();
			}

			if(this.is_all_null)
			{
				$('div#errorSuccessNotify').show();

				$('div#refUploadSuccess').text('');
				$('div#refUploadError').text('');
				$('div#refUploadErrorDetails').text('');

				$('div#refUploadError').text('Upload Error!');
				$('div#refUploadErrorDetails').text('Please fill all fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#refUploadSuccess').text('');
				$('div#refUploadError').text('');
				$('div#refUploadErrorDetails').text('');
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#uploadRefDetails').trigger('reset');

				//clear first:
				$('div#errorSuccessNotify').show();
				$('div#refUploadSuccess').text("");
				$('div#refUploadError').text("");
				$('div#refUploadErrorDetails').text("");
				$('div#dispStatus').text('');
				
				//Sync Success Message:
				$('div#dispStatus').text('Active!');
				$('div#refUploadSuccess').text("Referral Details Updated Successfully!");
			}
			else if(!this.upload_success)
			{
				//console.log("Cool Right!");
				//clear first:
				$('div#errorSuccessNotify').show();
				$('div#refUploadSuccess').text("");
				$('div#refUploadError').text("");
				$('div#refUploadErrorDetails').text("");

				//Upload Error Message:
				$('div#refUploadError').text("Update Error!");
				$('div#refUploadErrorDetails').text(this.serverSyncModel.short_description);
				//console.log(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				console.log("Update Here:", this.serverSyncModel)
				//begin insert:
				$('span#referralLinksTotal').text('');
				$('span#referralLinksTotal').text(this.serverSyncModel.referral_details.ref_links_total);

				$('span#referralBonusCurrency').text('');
				$('span#referralBonusCurrency').text(this.serverSyncModel.referral_details.ref_bonus_currency);

				$('span#referralBonus').text('');
				$('span#referralBonus').text(this.serverSyncModel.referral_details.ref_bonus);

				$('div#dispStatus').text('');
				$('div#dispStatus').text('Active!');

			}
			else if(!this.fetch_success)
			{
				$('div#dispLocationDetails').hide();

				$('div#errorSuccessNotify').show();
				$('div#refFetchSuccess').text('');
				$('div#refFetchError').text('');
				$('div#refFetchErrorDetails').text('');

				$('div#refFetchError').text('Fetch Error!');
				$('div#refFetchErrorDetails').text(this.serverSyncModel.short_description);
				
			}
		},
	}
		

export default BuyerReferral;
	
	
	