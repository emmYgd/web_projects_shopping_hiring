import AbstractModel from "./../../Models/AbstractModel.js";
	
	const AdminPendingCart = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:"",
		uniquePendingID:"",

		remind_email:"",
		
		//states:
		fetch_success:false,
		clicked_state:false,
		fetch_each_success:false,
		remind_clicked:false,
		remind_success:false,

		RefreshPendingCartIDs()
		{
			$('button#refreshPendingCartIDs').click((event)=>
			{
				event.preventDefault();
				this.FetchPendingCartIDs();
			});
			
		},

		FetchPendingCartIDs()
		{
			//console.log("Onto Fetching Things");
			//initialize:
			this.Init();
				//first call the Sync Model:
				this.SyncFetchPendingCartModel().then((serverModel)=>
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
		
		FetchEachPendingCartDetails(targetClickElem)
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
					this.SyncFetchEachPendingCartDetailsModel().then((serverModel)=>
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

		RemindBuyer(targetClickElem)
		{
			//set up the initial flows:
			this.remind_clicked = false;
			this.RemindUIinit();

			$(targetClickElem).click((event)=>
			{
				//event.preventDefault();
				console.log("Hello Cutie");

				this.remind_clicked = true;
				this.RemindUIinit();

				//get the present user email:
				//due to the UI flow, the user email is still in the serverSyncModel:
				this.remind_email = this.serverSyncModel.cart_details.buyer_email
				
				this.SyncRemindPendingBuyer().then((serverModel) => 
				{
					//use the serverModel locally here:

						this.remind_clicked = false;
						this.RemindUIinit();

						//now start conditionals:
						if( 
							(serverModel.code === 1) &&
							(serverModel.serverStatus === 'RemindSuccess!')
						)
						{
							console.log("Success");
							//Upload state:
							this.remind_success = true;
							//call reactors:
							this.RemindUIsync();
						}
						else if
						( 
							(serverModel.code === 0) &&
							(serverModel.serverStatus === 'RemindError!')
						)
						{
							console.log("Error");
							//Upload state:
							//Upload state:
							this.remind_success = false;
							//call reactors:
							this.RemindUIsync();
						}
				});
			});
		},

		Init()
		{
			//console.log("Onto Fetching Things")
			//first get admin id:
			this.admin_id = window.localStorage.getItem('adminID');
			
			$('div#allPendingCartIDs').hide();
			$('button#refreshPendingCartIDs').hide();
			$('div#pendingCartViewLoadingIcon').show();
			$('div#errorSuccessNotifyPendingCart').hide();
			
			$('div#eachPendingCartDetails').hide();
			$('div#eachPendingCartLoadingIcon').hide();
			$('div#errorSuccessNotifyEachPendingCart').hide();
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.uniquePendingID = $('input#uniquePendingID').val();
	 		console.log(this.uniquePendingID);
		},

		SyncFetchPendingCartModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/all/cart/ids';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'payment_status': 'pending',
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncFetchEachPendingCartDetailsModel()
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

		SyncRemindPendingBuyer()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/remind/pending/buyer';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'buyer_email' : this.remind_email,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#viewPendingCartDetails').hide();
				$('div#eachPendingCartLoadingIcon').show();
				$('div#errorSuccessNotifyEachPendingCart').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#eachPendingCartLoadingIcon').hide();
				$('button#viewPendingCartDetails').show();

				$('div#errorSuccessNotifyEachPendingCart').show();
			}
		},
		
		FetchEachUI()
		{	
			if(this.fetch_each_success)
			{
				//clear all forms:
				$('form#searchCartForm').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyEachPendingCart').show();
				$('div#fetchSuccessEachPendingCart').text("");
				$('div#fetchErrorEachPendingCart').text("");
				$('div#fetchErrorDetailsEachPendingCart').text("");
				//Upload Success Message:
				$('div#fetchSuccessEachPendingCart').text("Pending Cart Details Found!");

				//show the form:
				$('div#eachPendingCartDetails').show();

				$('span#dispPendingCartID').text('');
				$('span#dispPendingCartID').text(this.uniquePendingID);

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
				$('div#eachPendingCartDetails').hide();
				//clear first:
				$('div#errorSuccessNotifyEachPendingCart').show();
				$('div#fetchSuccessEachPendingCart').text("");
				$('div#fetchErrorEachPendingCart').text("");
				$('div#fetchErrorDetailsEachPendingCart').text("");

				//Upload Error Message:
				$('div#fetchErrorEachPendingCart').text("Fetch Error!");
				$('div#fetchErrorDetailsEachPendingCart').text(this.serverSyncModel.short_description);
				//console.log(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#pendingCartViewLoadingIcon').hide();
				$('div#allPendingCartIDs').show();
				$('button#refreshPendingCartIDs').show();

				$('div#allPendingCartIDs').text('');
				$('div#errorSuccessNotifyPendingCart').show();
				$('div#pendingFetchSuccess').text('');
				$('div#pendingFetchError').text('');
				$('div#pendingFetchErrorDetails').text('');

				$('div#pendingFetchSuccess').text('Fetch Success!');

				//get the id details:
				let allCartIDs = this.serverSyncModel.allCartIDs;
				//$('div#cartBuyerIDs').text(allbuyerIDs);
				for(let eachPendingID of allCartIDs)
				{
					console.log(eachPendingID);
					$('div#allPendingCartIDs').append('<span>'+ eachPendingID + '</span><br/>');
				}
				
			}
			else if(!this.fetch_success)
			{
				$('div#pendingCartViewLoadingIcon').hide();
				$('div#allPendingCartIDs').hide();
				$('button#refreshPendingCartIDs').show();

				$('div#errorSuccessNotifyPending').show();
				$('div#pendingFetchSuccess').text('');
				$('div#pendingFetchError').text('');
				$('div#pendingFetchErrorDetails').text('');

				$('div#pendingFetchError').text('Fetch Error!');
				$('div#pendingFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		RemindUIinit()
		{
			if(this.remind_clicked)
			{
				$('button#remindBuyerMail').hide();
				$('div#remindLoadingIcon').show();
			}
			else if(!this.remind_clicked)
			{
				$('div#errorSuccessNotifyRemindPending').hide();
				$('div#remindLoadingIcon').hide();
			}
		},

		RemindUIsync()
		{
			if(this.remind_success)
			{
				$('div#remindLoadingIcon').hide();
				$('button#remindBuyerMail').show();
				$('div#errorSuccessNotifyRemindPending').show()
 
				$('div#remindSuccess').text('');
				$('div#remindError').text('');
				$('div#remindErrorDetails').text('');

				$('div#remindSuccess').text('Pending Buyer Successfully Reminded!');
			}
			else if(!this.remind_success)
			{
				$('div#remindLoadingIcon').hide();
				$('button#remindBuyerMail').show();
				$('div#errorSuccessNotifyRemindPending').show()

				$('div#remindSuccess').text('');
				$('div#remindError').text('');
				$('div#remindErrorDetails').text('');

				$('div#remindError').text('Pending Buyer Reminding Error! Please try again!');
			}	
		}

	}
		

export default AdminPendingCart;
	
	
	