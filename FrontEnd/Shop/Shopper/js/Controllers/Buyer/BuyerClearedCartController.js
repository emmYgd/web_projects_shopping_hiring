import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerClearedCart = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:"",
		uniqueClearedID:"",
		
		//states:
		fetch_success:false,
		clicked_state:false,
		fetch_each_success:false,

		RefreshClearedCartIDs()
		{
			$('button#refreshClearedCartIDs').click((event)=>
			{
				event.preventDefault();
				this.FetchClearedCartIDs();
			});
			
		},

		FetchClearedCartIDs()
		{
			//console.log("Onto Fetching Things");
			//initialize:
			this.Init();
				//first call the Sync Model:
				this.SyncFetchClearedCartModel().then((serverModel)=>
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
		
		FetchEachClearedCartDetails(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{

				this.Collectibles();

				if(
					this.uniqueClearedID==""
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
					this.SyncFetchEachClearedCartDetailsModel().then((serverModel)=>
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
			
			$('div#allClearedCartIDs').hide();
			$('button#refreshClearedCartIDs').hide();
			$('div#clearedCartViewLoadingIcon').show();
			$('div#errorSuccessNotifyClearedCart').hide();
			
			$('div#eachClearedCartDetails').hide();
			$('div#eachClearedCartLoadingIcon').hide();
			$('div#errorSuccessNotifyEachClearedCart').hide();
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.uniqueClearedID = $('input#uniqueClearedID').val();
	 		console.log(this.uniqueClearedID);
		},

		SyncFetchClearedCartModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/all/cart/ids';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'payment_status': 'cleared',
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
			//console.log("Cleared Model Thingy", serverModel);
		},
			
		SyncFetchEachClearedCartDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/each/cart/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'unique_cart_id' : this.uniqueClearedID,
				'payment_status' : 'cleared',
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#viewClearedCartDetails').hide();
				$('div#eachClearedCartLoadingIcon').show();
				$('div#errorSuccessNotifyEachClearedCart').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#eachClearedCartLoadingIcon').hide();
				$('button#viewClearedCartDetails').show();

				$('div#errorSuccessNotifyEachClearedCart').show();
			}
		},
		
		FetchEachUI()
		{	
			if(this.fetch_each_success)
			{
				//clear all forms:
				$('form#searchCartForm').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyEachClearedCart').show();
				$('div#fetchSuccessEachClearedCart').text("");
				$('div#fetchErrorEachClearedCart').text("");
				$('div#fetchErrorDetailsEachClearedCart').text("");
				//Upload Success Message:
				$('div#fetchSuccessEachClearedCart').text("Cleared Cart Details Found!");

				//show the form:
				$('div#eachClearedCartDetails').show();

				$('span#dispClearedCartID').text('');
				$('span#dispClearedCartID').text(this.uniqueClearedID);

				$('span#dispDateCreated').text('');
				$('span#dispDateCreated').text(this.serverSyncModel.cart_details.cart_created_at);

				$('span#dispDateUpdated').text('');
				$('span#dispDateUpdated').text(this.serverSyncModel.cart_details.cart_updated_at);

				$('span#dispClearedCurrency').text('');
				$('span#dispClearedCurrency').text(this.serverSyncModel.cart_details.purchase_currency);
				
				$('span#dispTotalClearedCost').text('');
				$('span#dispTotalClearedCost').text(this.serverSyncModel.cart_details.purchase_price);

				$('span#dispBuyerID').text('');
				$('span#dispBuyerID').text(this.serverSyncModel.cart_details.unique_buyer_id);

				$('span#dispBuyerEmail').text('');
				$('span#dispBuyerEmail').text(this.serverSyncModel.cart_details.buyer_email);

				$('span#dispBuyerPhoneNumber').text('');
				$('span#dispBuyerPhoneNumber').text(this.serverSyncModel.cart_details.buyer_phone_number);
				
			}
			else if(!this.fetch_each_success)
			{
				//console.log("Cool Right!");
				$('div#eachClearedCartDetails').hide();
				//clear first:
				$('div#errorSuccessNotifyEachClearedCart').show();
				$('div#fetchSuccessEachClearedCart').text("");
				$('div#fetchErrorEachClearedCart').text("");
				$('div#fetchErrorDetailsEachClearedCart').text("");

				//Upload Error Message:
				$('div#fetchErrorEachClearedCart').text("Fetch Error!");
				$('div#fetchErrorDetailsEachClearedCart').text(this.serverSyncModel.short_description);
				//console.log(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#clearedCartViewLoadingIcon').hide();
				$('div#allClearedCartIDs').show();
				$('button#refreshClearedCartIDs').show();

				$('div#allClearedCartIDs').text('');
				$('div#errorSuccessNotifyClearedCart').show();
				$('div#clearedFetchSuccess').text('');
				$('div#clearedFetchError').text('');
				$('div#clearedFetchErrorDetails').text('');

				$('div#clearedFetchSuccess').text('Fetch Success!');

				//get the id details:
				let allClearedCartIDs = this.serverSyncModel.allCartIDs;
				//$('div#cartBuyerIDs').text(allbuyerIDs);
				for(let eachClearedID of allClearedCartIDs)
				{
					console.log(eachClearedID);
					$('div#allClearedCartIDs').append('<span>'+ eachClearedID + '</span><br/>');
				}
				
			}
			else if(!this.fetch_success)
			{
				$('div#clearedCartViewLoadingIcon').hide();
				$('div#allClearedCartIDs').hide();
				$('button#refreshClearedCartIDs').show();

				$('div#errorSuccessNotifyCleared').show();
				$('div#clearedFetchSuccess').text('');
				$('div#clearedFetchError').text('');
				$('div#clearedFetchErrorDetails').text('');

				$('div#clearedFetchError').text('Fetch Error!');
				$('div#clearedFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},
	}
		

export default BuyerClearedCart;
	
	
	