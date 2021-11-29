import AbstractModel from "./../../Models/AbstractModel.js";
	
	const AdminCartBuyer = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:"",
		uniqueBuyerID: "",
		
		//states:
		fetch_success:false,
		clicked_state:false,
		fetch_each_success:false,

		RefreshCartBuyerIDs()
		{
			$('button#refreshCartBuyersIDs').click((event)=>
			{
				event.preventDefault();
				this.FetchCartBuyerIDs();
			});
			
		},

		FetchCartBuyerIDs()
		{
			//console.log("Onto Fetching Things");
			//initialize:
			this.Init();
				//first call the Sync Model:
				this.SyncFetchCartBuyerModel().then((serverModel)=>
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
		
		FetchCartBuyerDetails(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{

				this.Collectibles();

				if(
					this.uniqueBuyerID==""
				){
					console.log("Empty!");
					//lets the default handle this...
				}
				else
				{
					event.preventDefault();
					//set state to true for watchers
					this.clicked_state = true;

					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncFetchEachBuyerDetailsModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'FetchSuccess!')
						)
						{
							console.log("Success");
							//Upload state:
							this.fetch_each_success = true;
							//call reactors:
							this.FetchEachUI();
						}
						else if
						( 
							(this.serverSyncModel.code === 0) &&
							(this.serverSyncModel.serverStatus === 'FetchError!')
						)
						{
							console.log("Error");
							//Upload state:
							this.fetch_each_success = false;
							//call reactors:
							this.FetchEachUI();
						}
					});
				}
			});
		},

		Init()
		{
			//console.log("Onto Fetching Things")
			//first get admin id:
			this.admin_id = window.localStorage.getItem('adminID');
			
			$('div#allCartBuyerIDs').hide();
			$('button#refreshCartBuyersIDs').hide();
			$('div#buyerCartViewLoadingIcon').show();
			$('div#errorSuccessNotifyBuyer').hide();
			
			$('div#eachBuyerDetails').hide();
			$('div#eachBuyerLoadingIcon').hide();
			$('div#errorSuccessNotifyEachBuyer').hide();
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.uniqueBuyerID = $('input#uniqueBuyerID').val();
	 		console.log(this.uniqueBuyerID);
		},

		SyncFetchCartBuyerModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/all/cart/buyer/ids';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncFetchEachBuyerDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/each/buyer/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'unique_buyer_id' : this.uniqueBuyerID,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#viewEachBuyerDetails').hide();
				$('div#eachBuyerLoadingIcon').show();

				$('div#errorSuccessNotifyEachBuyer').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#eachBuyerLoadingIcon').hide();
				$('button#viewEachBuyerDetails').show();

				$('div#errorSuccessNotifyEachBuyer').show();
			}
		},
		
		FetchEachUI()
		{	
			if(this.fetch_each_success)
			{
				//clear all forms:
				$('form#searchBuyerForm').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyEachBuyer').show();
				$('div#fetchSuccessEachBuyer').text("");
				$('div#fetchErrorEachBuyer').text("");
				$('div#fetchErrorDetailsEachBuyer').text("");
				//Upload Success Message:
				$('div#fetchSuccessEachBuyer').text("Buyer Details Found!");

				//show the form:
				$('div#eachBuyerDetails').show();

				$('span#dispBuyerID').text('');
				$('span#dispBuyerID').text(this.admin_id);

				$('span#dispBuyerFirstName').text('');
				$('span#dispBuyerFirstName').text(this.serverSyncModel.buyer_details.buyer_first_name);
				
				$('span#dispBuyerMiddleName').text('');
				$('span#dispBuyerMiddleName').text(this.serverSyncModel.buyer_details.buyer_middle_name);

				$('span#dispBuyerLastName').text('');
				$('span#dispBuyerLastName').text(this.serverSyncModel.buyer_details.buyer_last_name);

				//to display all associated cart ids:
				let allAssocCartIDs = this.serverSyncModel.buyer_details.assoc_cart_ids;
				$('div#dispAllAssocCartIDs').text('');
				for(let eachCartID of allAssocCartIDs)
				{
					$('div#dispAllAssocCartIDs').append('<span>'+ eachCartID + '</span><br/>');
				}
				
				$('span#dispTotalPurchase').text('');
				$('span#dispTotalPurchase').text(this.serverSyncModel.buyer_details.total_purchase_made);

				$('span#dispBuyerEmail').text('');
				$('span#dispBuyerEmail').text(this.serverSyncModel.buyer_details.buyer_email);

				$('span#dispBuyerPhoneNumber').text('');
				$('span#dispBuyerPhoneNumber').text(this.serverSyncModel.buyer_details.buyer_phone_number);

				/*let billingAddress = this.serverSyncModel.buyer_details.buyer_billing_address;
				for(let eachBillingAddressInfo of billingAddress)
				{
					$('span#dispBuyerBillingAddress').text('');
					$('span#dispBuyerBillingAddress').append(eachBillingAddressInfo);
				}
				
				let shippingAddress = this.serverSyncModel.buyer_details.buyer_shipping_address;
				for(let eachShippingAddressInfo of shippingAddress)
				{
					$('span#dispBuyerShippingAddress').text('');
					$('span#dispBuyerShippingAddress').append(eachShippingAddressInfo);
				}*/

				$('span#dispBuyerReferralLink').text('');
				$('span#dispBuyerReferralLink').text(this.serverSyncModel.buyer_details.buyer_referral_link);

				/*$('span#dispBuyerReferralBonus').text('');
				$('span#dispBuyerReferralBonus').text(this.serverSyncModel.buyer_details.buyer_referral_bonus);*/
			}
			else if(!this.fetch_each_success)
			{
				//console.log("Cool Right!");
				//clear first:
				$('div#errorSuccessNotifyEachBuyer').show();
				$('div#fetchSuccessEachBuyer').text("");
				$('div#fetchErrorEachBuyer').text("");
				$('div#fetchErrorDetailsEachBuyer').text("");

				//Upload Error Message:
				$('div#fetchErrorEachBuyer').text("Update Error!");
				$('div#fetchErrorDetailsEachBuyer').text(this.serverSyncModel.short_description);
				//console.log(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#buyerCartViewLoadingIcon').hide();
				$('div#allCartBuyerIDs').show();
				$('button#refreshCartBuyersIDs').show();

				$('div#allCartBuyerIDs').text('');
				$('div#errorSuccessNotifyBuyer').show();
				$('div#buyerFetchSuccess').text('');
				$('div#buyerFetchError').text('');
				$('div#buyerFetchErrorDetails').text('');

				$('div#buyerFetchSuccess').text('Fetch Success!');

				//get the id details:
				let allbuyerIDs = this.serverSyncModel.buyers;
				//$('div#cartBuyerIDs').text(allbuyerIDs);
				for(let eachID of allbuyerIDs)
				{
					console.log(eachID);
					$('div#allCartBuyerIDs').append('<span>'+ eachID + '</span><br/>');
				}
				
			}
			else if(!this.fetch_success)
			{
				$('div#buyerCartViewLoadingIcon').hide();
				$('div#allCartBuyerIDs').hide();
				$('button#refreshCartBuyersIDs').show();

				$('div#errorSuccessNotifyBuyer').show();
				$('div#buyerFetchSuccess').text('');
				$('div#buyerFetchError').text('');
				$('div#buyerFetchErrorDetails').text('');

				$('div#buyerFetchError').text('Fetch Error!');
				$('div#buyerFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},
	}
		

export default AdminCartBuyer;
	
	
	