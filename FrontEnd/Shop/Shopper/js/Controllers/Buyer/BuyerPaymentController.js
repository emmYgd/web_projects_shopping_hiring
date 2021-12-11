import AbstractModel from "./../../Models/AbstractModel.js";
	
	const BuyerPayment = 
	{	
		//admin token:
		buyer_id:null,
		current_to_clear_cart_id:null,

		//values:
		serverSyncModel:"",
		total_price:"",

		
		//states:
		pay_init:false,
		transact_success:false,
		clicked_state:false,

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
				this.Init();
				//console.log('Cool Right')
				this.clicked_state = true;
				this.LoadingUI();

				//collect info:
				this.Collectibles();

				//first call the Sync Model:
				this.SyncMakePaymentModel().then((serverModel)=>
				{
					this.clicked_state = false;
					this.LoadingUI();
					
					//sync model:
					this.serverSyncModel = serverModel;

					//now start conditionals:
					if( 
						(this.serverSyncModel.code === 1) &&
						(this.serverSyncModel.serverStatus === 'TransactionSuccess!')
					)
					{
						console.log("Success");
						//fetch state:
						this.transact_success = true;
						//call reactors:
						this.TransactUI();
					}
					else if
					( 
						(this.serverSyncModel.code === 0) &&
						(this.serverSyncModel.serverStatus === 'TransactionError!')
					)
					{
						console.log("Error");
						//fetch state:
						this.transact_success = false;
						//call reactors:
						this.TransactUI();
					}
				});

			});
		},

		Init()
		{
			//console.log("Onto Fetching Things")
			this.buyer_id = window.localStorage.getItem('buyerID');
			this.current_to_clear_cart_id = window.localStorage.getItem('currentDisplayedPendingCartID');

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
			this.total_price = $('span#dispTotalPendingCost').val();
			console.log('Collected Total Pending Cost! ', this.total_price);
		},
		
		SyncMakePaymentModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/make/payment';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
				'unique_cart_id' : this.current_to_clear_cart_id
				//'purchase_price' : this.total_price,
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
		
		TransactUI()
		{
			if(this.transact_success)
			{
				$('div#eachPendingCartDetails').hide();

				$('div#transact_success').show();
				$('div#transact_success').text('');
				$('div#transact_success').append(`
					<div class="w3-center w3-card-4 w3-green w3-padding w3-margin w3-round"><b>Transaction Successful!</b></div> 
					<br/>
					<div class="w3-center w3-large">
                       	<b>ID: <span>${this.serverSyncModel.transDetails.unique_cart_id}</span></b><br/><br/>
                    </div>
                    <p class="w3-myfont w3-medium"><b>Purchase Currency:<br/>
                        <span>${this.serverSyncModel.transDetails.purchase_currency}</span></b>
                    </p>
                    <hr/>
                    <p class="w3-myfont w3-medium"><b>Purchase Price:<br/>
                        <span>${this.serverSyncModel.transDetails.purchase_price}</span></b>
                    </p>
                    <hr/>
                   	<p class="w3-myfont w3-medium"><b>Discount(Referral Bonus):<br/>
                        <span>${this.serverSyncModel.transDetails.discount === null ? 0 : this.serverSyncModel.transDetails.discount}</span></b>
                    </p>
				`)
			}
			else if(!this.transact_success)
			{
				$('div#ensurePaymentIntent').hide();

				$('div#settleCartPay').show();
				$('div#notifyWithIcon').show();
				$('div#paymentLoadingIcon').hide();

				$('div#errorSuccessNotifyPayment').show();
				$('div#fetchSuccessPayment').text();
				$('div#fetchErrorPayment').text();
				$('div#fetchErrorDetailsPayment').text();

				$('div#fetchErrorPayment').text("Transaction Unsuccessful!");
				$('div#fetchErrorDetailsPayment').text(`${this.serverSyncModel.short_description}`);
			}	
				
		},

	}
		

export default BuyerPayment;
	
	
	