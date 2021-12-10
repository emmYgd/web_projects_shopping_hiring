import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerPayment = 
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
		pay_init:false,
		fetch_success:false,
		clicked_state:false,
		upload_success: false,

		/*RefreshCardDetails()
		{
			$('div#refreshCardDetails').click((event)=>
			{
				event.preventDefault();
				this.FetchCardDetails();
			});
			
		},*/

		EnsurePaymentIntent(targetClickElem)
		{
			console.log('We are here!');
			this.pay_init = false;
			this.Init();

			$(targetClickElem).click((event)=>
			{
				event.preventDefault();
				this.pay_init = true;
				this.Init();
			});

			$('button#declineCartPayBtn').click((event)=>
			{
				event.preventDefault();
				this.pay_init=false;
				this.Init();
			});
		},

		MakePayment()
		{
			$('button#proceedCartPayBtn').click((event)=>
			{
				console.log('Cool Right')
				this.clicked_state = true;
				this.LoadingUI();

				//first call the Sync Model:
				this.SyncMakePaymentModel().then((serverModel)=>
				{
					//sync model:
					this.serverSyncModel = serverModel;

					//now start conditionals:
					if( 
						(this.serverSyncModel.code === 1) &&
						(this.serverSyncModel.serverStatus === 'PaymentSuccess!')
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
						(this.serverSyncModel.serverStatus === 'PaymentError!')
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
			//console.log("Onto Fetching Things")
			this.buyer_id = window.localStorage.getItem('buyerID');

			if(this.pay_init)
			{
				$('div#settleCartPay').hide();
				$('div#ensurePaymentIntent').show();
				//$('div#notifyWithIcon').show();
				/*
				$('div#errorSuccessNotifyCardDetails').hide();
			
				$('div#cardDetailsUploadLoadingIcon').hide();*/
			}
			else if(!this.pay_init)
			{
				$('div#ensurePaymentIntent').hide();
				$('div#settleCartPay').show();
				$('div#notifyWithIcon').hide();
			}

			
		},

		Collectibles()
		{
			//set values:
			this.buyer_card_type = $('select#card_type').val();
			this.buyer_card_number = $('input#card_number_edit').val(),
			this.buyer_card_cvv = $('input#card_cvv_edit').val(),
			this.buyer_card_exp_month = $('input#card_exp_month_edit').val();
			this.buyer_card_exp_year = $('input#card_exp_year_edit').val();
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
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/upload/card/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
				'buyer_bank_card_type' : this.buyer_card_type,
				'buyer_bank_card_number' : this.buyer_card_number,
				'buyer_bank_card_cvv' : this.buyer_card_cvv,
				'buyer_bank_card_expiry_month' : this.buyer_card_exp_month,
				'buyer_bank_card_expiry_year': this.buyer_card_exp_year,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('div#ensurePaymentIntent').hide();

				$('div#notifyWithIcon').show();
				$('div#paymentLoadingIcon').show();
				$('div#errorSuccessNotifyPayment').hide();
			}
			else if(!this.clicked_state)
			{
				$('div#paymentLoadingIcon').hide();

				$('div#notifyWithIcon').show();
				$('div#paymentLoadingIcon').hide();
				$('div#errorSuccessNotifyPayment').show();
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#allCardDetailsUpload').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyUploadCardDetails').show();
				$('div#cardDetailsUploadSuccess').text("");
				$('div#cardDetailsUploadError').text("");
				$('div#cardDetailsUploadErrorDetails').text("");
				//Upload Success Message:
				$('div#cardDetailsUploadSuccess').text("Card Details Uploaded successfully!");
			}
			else if(!this.upload_success)
			{
				//console.log("Cool Right!");
				$('div#eachCardDetailsDetails').hide();
				//clear first:
				$('div#errorSuccessNotifyUploadCardDetails').show();
				$('div#cardDetailsUploadSuccess').text("");
				$('div#cardDetailsUploadError').text("");
				$('div#cardDetailsUploadErrorDetails').text("");

				//Upload Error Message:
				$('div#cardDetailsUploadError').text("Upload Error!");
				$('div#cardDetailsUploadErrorDetails').text(this.serverSyncModel.short_description);
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
				$('div#refreshCardDetails').show();

				$('div#errorSuccessNotifyCardDetails').show();
				$('div#cardDetailsFetchSuccess').text('');
				$('div#cardDetailsFetchError').text('');
				$('div#cardDetailsFetchErrorDetails').text('');

				$('div#cardDetailsFetchError').text('Fetch Error!');
				$('div#cardDetailsFetchErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		FetchIsAllNullUI()
		{
			if(this.is_all_null)
			{
				$('div#errorSuccessNotifyUploadCardDetails').show();
				$('div#cardDetailsUploadSuccess').text('');
				$('div#cardDetailsUploadError').text('');
				$('div#cardDetailsUploadErrorDetails').text('');

				$('div#cardDetailsUploadError').text('Upload Error!');
				$('div#cardDetailsUploadErrorDetails').text('Please fill up all fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#errorSuccessNotifyUploadCardDetails').hide();
			}
		}
	}
		

export default BuyerPayment;
	
	
	