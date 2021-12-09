import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerReferral = 
	{	
		//admin token:
		buyer_id:null,

		//values:
		serverSyncModel:"",

		isReferralActivated: false, 
		referralBonusCurrency: null, 
	 	referralBonusPerClick: null,

	 	totalReferralBonusGenerated: "",

		//states:
		fetch_success:false,
		clicked_state:false,
		gen_link_success:false,

		RefreshFetchReferral()
		{
			$('button#refreshRefDetails').click((event)=>
			{
				//console.log("Hello");
				event.preventDefault();

				//then calls to server:
				this.FetchReferralAmount();
			});
		},

		FetchReferralAmount()
		{
			//first call the Sync Model:
				this.SyncFetchReferralAmountModel().then((serverModel)=>
				{
					//sync model:
					this.serverSyncModel = serverModel;

					//now start conditionals:
					if( 
						(this.serverSyncModel.code === 1) &&
						(this.serverSyncModel.serverStatus === 'FetchSuccess!') 
					)
					{
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
		
		GenerateReferralLink(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				event.preventDefault();

					this.clicked_state = true;

					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncGenLinkModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'RefLinkFormed!')
						)
						{
							console.log("Success");
							//Upload state:
							this.gen_link_success = true;
							//call reactors:
							this.GenLinkUI();
						}
						else if
						( 
							(this.serverSyncModel.code === 0) &&
							(this.serverSyncModel.serverStatus === 'RefLinkNotFormed!')
						)
						{
							console.log("Error");
							//Upload state:
							this.gen_link_success = false;
							//call reactors:
							this.GenLinkUI();
						}
					});
			});
		},

		Init()
		{
			//first get admin id:
			this.buyer_id = window.localStorage.getItem('buyerID');
			//hide certain elements:
			$('div#dispUniqueRefLinkHere').text('');
			$('div#errorSuccessNotifyReferralDetails').hide();
			$('div#referralViewLoadingIcon').hide();

			//this.SyncDeActivateReferralModel();
		},

		SyncFetchReferralAmountModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/fetch/referral/bonus';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncGenLinkModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/generate/unique/referral/link';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#genRefLinkBtn').hide();
				$('div#referralViewLoadingIcon').show();

				$('div#errorSuccessNotifyReferralDetails').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#referralViewLoadingIcon').hide();
				$('button#genRefLinkBtn').show();

				$('div#errorSuccessNotifyReferralDetails').show();
			}
		},

		GenLinkUI()
		{
			if(this.gen_link_success)
			{
				$('div#errorSuccessNotifyReferralDetails').show();

				$('div#dispUniqueRefLinkHere').text('');
				$('div#referralFetchSuccess').text('');
				$('div#referralFetchError').text('');
				$('div#referralFetchErrorDetails').text('');

				$('div#referralFetchSuccess').text('Link Generated Successfully!');
				$('div#dispUniqueRefLinkHere').html(this.serverSyncModel.referral_link);
			}
			else if(!this.gen_link_success)
			{
				console.log("I am here!");
				$('div#errorSuccessNotifyReferralDetails').show();

				$('div#dispUniqueRefLinkHere').text('');
				$('div#referralFetchSuccess').text('');
				$('div#referralFetchError').text('');
				$('div#referralFetchErrorDetails').text('');

				$('div#referralFetchError').text('Link Generation Failed!');
				$('div#referralFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				console.log("Update Here:", this.serverSyncModel)
				//begin insert:
				$('span#ref_bonus_currency').text('');
				$('span#ref_bonus_currency').text(this.serverSyncModel.referral_bonus_details.ref_bonus_currency);

				let ref_bonus = this.serverSyncModel.referral_bonus_details.ref_bonus_amount
				$('span#ref_bonus_amount').text('');
				$('span#ref_bonus_amount').text( (ref_bonus === null) ? 0 : ref_bonus );
			}
			else if(!this.fetch_success)
			{
				$('div#errorSuccessNotifyReferralDetails').show();
				$('div#referralFetchSuccess').text('');
				$('div#referralFetchError').text('');
				$('div#referralFetchErrorDetails').text('');

				$('div#referralFetchError').text('Fetch Error!');
				$('div#referralFetchErrorDetails').text(this.serverSyncModel.short_description);
				
			}
		},
	}
		

export default BuyerReferral;
	
	
	