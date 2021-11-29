import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerCardDetails = 
	{	
		//admin token:
		buyer_id:null,

		//values:
		serverSyncModel:"",
		buyer_card_type:"",
		buyer_card_number:"",
		buyer_card_cvv:"",
		buyer_card_exp_month:"",
		buyer_card_exp_year:"",
		
		//states:
		is_all_null:false,
		fetch_success:false,
		clicked_state:false,

		RefreshCardDetails()
		{
			$('div#refreshCardDetails').click((event)=>
			{
				event.preventDefault();
				this.FetchCardDetails();
			});
			
		},

		FetchCardDetails()
		{
			//console.log("Onto Fetching Things");
			//initialize:
			this.Init();
				//first call the Sync Model:
				this.SyncFetchCardDetailsModel().then((serverModel)=>
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
		
		UploadCardDetails(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{

				this.Collectibles();

				if(
					this.uniquePendingID==""
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
					this.SyncUploadCardDetailsModel().then((serverModel)=>
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
			this.buyer_id = window.localStorage.getItem('buyerID');
			
			$('div#allCardDetails').hide();
			$('div#refreshCardDetails').hide();
			$('div#errorSuccessNotifyCardDetails').hide();
			
			/*$('div#eachCardDetailsDetails').hide();
			$('div#eachCardDetailsLoadingIcon').hide();
			$('div#errorSuccessNotifyEachCardDetails').hide();*/
		},

		Collectibles()
		{
			//set values:
			/*this.buyer_card_number = $().val();
			this.buyer_card_cvv:"",
			this.buyer_card_exp_month:"",
			this.buyer_card_exp_year:"",;
	 		console.log(this.uniquePendingID);*/
		},

		SyncFetchCardDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/fetch/card/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncUploadCardDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/each/cart/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'unique_cart_id' : this.uniquePendingID,
				'payment_status' : 'pending',
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#viewCardDetailsDetails').hide();
				$('div#eachCardDetailsLoadingIcon').show();
				$('div#errorSuccessNotifyEachCardDetails').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#eachCardDetailsLoadingIcon').hide();
				$('button#viewCardDetailsDetails').show();

				$('div#errorSuccessNotifyEachCardDetails').show();
			}
		},
		
		FetchEachUI()
		{	
			if(this.fetch_each_success)
			{
				//clear all forms:
				$('form#searchCartForm').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyEachCardDetails').show();
				$('div#fetchSuccessEachCardDetails').text("");
				$('div#fetchErrorEachCardDetails').text("");
				$('div#fetchErrorDetailsEachCardDetails').text("");
				//Upload Success Message:
				$('div#fetchSuccessEachCardDetails').text("Pending Cart Details Found!");

				//show the form:
				$('div#eachCardDetailsDetails').show();

				$('span#dispCardDetailsID').text('');
				$('span#dispCardDetailsID').text(this.uniquePendingID);

				$('span#dispDateCreated').text('');
				$('span#dispDateCreated').text(this.serverSyncModel.cart_details.cart_created_at);

				$('span#dispDateUpdated').text('');
				$('span#dispDateUpdated').text(this.serverSyncModel.cart_details.cart_updated_at);

				$('span#dispPendingCurrency').text('');
				$('span#dispPendingCurrency').text(this.serverSyncModel.cart_details.purchase_currency);
				
				$('span#dispTotalPendingCost').text('');
				$('span#dispTotalPendingCost').text(this.serverSyncModel.cart_details.purchase_price);

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
				$('div#eachCardDetailsDetails').hide();
				//clear first:
				$('div#errorSuccessNotifyEachCardDetails').show();
				$('div#fetchSuccessEachCardDetails').text("");
				$('div#fetchErrorEachCardDetails').text("");
				$('div#fetchErrorDetailsEachCardDetails').text("");

				//Upload Error Message:
				$('div#fetchErrorEachCardDetails').text("Fetch Error!");
				$('div#fetchErrorDetailsEachCardDetails').text(this.serverSyncModel.short_description);
				//console.log(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#cardDetailsViewLoadingIcon').hide();
				$('div#refreshCardDetails').show();

				if(this.serverSyncModel.buyers == "Empty!")
				{
					$('div#errorSuccessNotifyCardDetails').show();
					$('div#cardDetailsFetchSuccess').text('');
					$('div#cardDetailsFetchError').text('');
					$('div#cardDetailsFetchErrorDetails').text('');

					$('div#cardDetailsFetchSuccess').html('Card Details Empty! <br/>Please create new.');
				}
				else
				{
					$('div#errorSuccessNotifyCardDetails').show();
					$('div#cardDetailsFetchSuccess').text('');
					$('div#cardDetailsFetchError').text('');
					$('div#cardDetailsFetchErrorDetails').text('');

					$('div#cardDetailsFetchSuccess').html('Fetch Success!');

					//start displaying the details:
					$('div#allCardDetails').show();

					$('span#card_type').text('');
					$('span#card_type').text(this.serverSyncModel.buyers.card_type);

					$('span#card_number').text('');
					$('span#card_number').text(this.serverSyncModel.buyers.card_number);

					$('span#card_cvv').text('');
					$('span#card_cvv').text(this.serverSyncModel.buyers.card_cvv);

					$('span#card_exp_month').text('');
					$('span#card_exp_month').text(this.serverSyncModel.buyers.exp_month);

					$('span#card_exp_year').text('');
					$('span#card_exp_year').text(this.serverSyncModel.buyers.exp_year);
				}
				
			}
			else if(!this.fetch_success)
			{
				$('div#cardDetailsViewLoadingIcon').hide();
				$('div#allCardDetails').hide();
				$('button#refreshCardDetails').show();

				$('div#errorSuccessNotifyCardDetails').show();
				$('div#cardDetailsFetchSuccess').text('');
				$('div#cardDetailsFetchError').text('');
				$('div#cardDetailsFetchErrorDetails').text('');

				$('div#cardDetailsFetchError').text('Fetch Error!');
				$('div#cardDetailsFetchError').text(this.serverSyncModel.short_description);
			}
		},
	}
		

export default BuyerCardDetails;
	
	
	