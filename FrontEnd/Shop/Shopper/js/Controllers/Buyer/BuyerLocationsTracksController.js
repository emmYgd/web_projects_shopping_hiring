import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerLocationsTracks = 
	{	
		//admin token:
		buyer_id:null,

		//values:
		serverSyncModel:"",
		cartID:"",
		cartStatus:"",
	 	cartCurrentCountry:"",
	 	cartCurrentState:"",
	 	cartCurrentCityOrTown:"",
	 	cartCurrentStreet:"",
	 	cartShippedDate:"",
	 	cartExpectedDeliveryDate:"",

		//states:
		fetch_success:false,
		clicked_state:false,
		upload_success:false,
		is_all_null:false,

		FetchCartLocation()
		{
			//console.log("Onto Fetching Things");
			//initialize:
			this.Init();
			$('button#trackCartLocation').click((event)=>
			{
				//run Collectibles:
				this.Collectibles();
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
			});
		},

		Init()
		{
			//first get admin id:
			this.buyer_id = window.localStorage.getItem('buyerID');
			//hide loading icon:
			$('div#cartLocUploadLoadingIcon').hide();
			//clear text:
			$('div#cartLocUploadSuccess').text('');
			$('div#cartLocUploadError').text('');
			$('div#cartLocUploadErrorDetails').text('');

			$('div#refreshLocationIcon').hide();
			/*$('div#refreshAdminBankDetails').hide();
			$('div#dispAdminBankDetails').hide();
		
			$('div#showLoadingBankDetails').show();*/

		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.cartID = $('input#cartID').val();
			this.cartStatus = $('select#clearedCartStatus').val();
	 		this.cartCurrentCountry = $('input#clearedCartCountry').val();
	 		this.cartCurrentState = $('input#clearedCartState').val();
	 		this.cartCurrentCityOrTown = $('input#clearedCartTownCity').val();
	 		this.cartCurrentStreet = $('input#clearedCartStreet').val();
	 		this.cartShippedDate = $('input#clearedCartShippedDate').val();
	 		this.cartExpectedDeliveryDate = $('input#clearedCartExpectedDeliveryDate').val();

	 		console.log(this.cartID);
		},

		SyncFetchBankDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/cleared/cart/location';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
				'unique_cart_id' : this.cartID
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#updateCartLocationBtn').hide();
				$('div#cartLocUploadLoadingIcon').show();

				$('div#errorSuccessNotify').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#cartLocUploadLoadingIcon').hide();
				$('button#updateCartLocationBtn').show();

				$('div#errorSuccessNotify').show();
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#dispLocationDetails').show();

				$('div#errorSuccessNotify').show();
				$('div#cartLocFetchSuccess').text('');
				$('div#cartLocFetchError').text('');
				$('div#cartLocFetchErrorDetails').text('');

				$('div#cartLocFetchSuccess').text('Fetch Success!');

				//console.log(this.serverSyncModel);
				//begin insert:
				$('span#suppliedCartID').text('');
				$('span#suppliedCartID').text(this.serverSyncModel.locationDetails.unique_cart_id);

				$('span#cartStatus').text('');
				$('span#cartStatus').text(this.serverSyncModel.locationDetails.cart_status);

				$('span#cartPurchaseCurrency').text('');
				$('span#cartPurchaseCurrency').text(this.serverSyncModel.locationDetails.purchase_currency);

				$('span#cartPurchasePrice').text('');
				$('span#cartPurchasePrice').text(this.serverSyncModel.locationDetails.purchase_price);

				$('span#dispCartCurrentCountry').text('');
				$('span#dispCartCurrentCountry').text(this.serverSyncModel.locationDetails.current_country);

				$('span#dispCartCurrentState').text('');
				$('span#dispCartCurrentState').text(this.serverSyncModel.locationDetails.current_state);

				$('span#dispCartCurrentCityOrTown').text('');
				$('span#dispCartCurrentCityOrTown').text(this.serverSyncModel.locationDetails.current_city_or_town);

				$('span#dispCartCurrentStreet').text('');
				$('span#dispCartCurrentStreet').text(this.serverSyncModel.locationDetails.current_street);

				$('span#dispCartShippedDate').text('');
				$('span#dispCartShippedDate').text(this.serverSyncModel.locationDetails.shipped_date);

				$('span#dispCartExpectedDeliveryDate').text('');
				$('span#dispCartExpectedDeliveryDate').text(this.serverSyncModel.locationDetails.expected_delivery_date);
				
			}
			else if(!this.fetch_success)
			{
				$('div#dispLocationDetails').hide();

				$('div#errorSuccessNotify').show();
				$('div#cartLocFetchSuccess').text('');
				$('div#cartLocFetchError').text('');
				$('div#cartLocFetchErrorDetails').text('');

				$('div#cartLocFetchError').text('Fetch Error!');
				$('div#cartLocFetchErrorDetails').text(this.serverSyncModel.short_description);
				
			}
		},
	}
		

export default BuyerLocationsTracks;
	
	
	