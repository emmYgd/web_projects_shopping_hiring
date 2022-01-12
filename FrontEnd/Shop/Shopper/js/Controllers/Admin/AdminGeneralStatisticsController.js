import AbstractModel from "./../../Models/AbstractModel.js";
	
	const AdminGeneralStatistics = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:"",

		//states:
		fetch_success:false,

		FetchStatistics()
		{
			this.Init();
			console.log("I am Statistics!!!");
				//first call the Sync Model:
				this.SyncFetchGeneralStatisticsModel().then((serverModel)=>
				{
					//sync model:
					this.serverSyncModel = serverModel;

					//now start conditionals:
					if( 
						(this.serverSyncModel.code === 1) &&
						(this.serverSyncModel.serverStatus === 'DetailsFound!')
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
						(this.serverSyncModel.serverStatus === 'DetailsNotFound!')
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

		Init()
		{
			this.admin_id = window.localStorage.getItem('adminID');
		},

		SyncFetchGeneralStatisticsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/general/statistics';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#pending_cart_num').text('');
				$('div#pending_cart_num').text(this.serverSyncModel.statDetails.all_pending_carts);

				$('div#cleared_cart_num').text('');
				$('div#cleared_cart_num').text(this.serverSyncModel.statDetails.all_cleared_carts);

				$('div#in_transit_num').text('');
				$('div#in_transit_num').text(this.serverSyncModel.statDetails.all_tracked_goods);

				$('div#in_transit_num').text('');
				$('div#in_transit_num').text(this.serverSyncModel.statDetails.all_tracked_goods);

				$('span#total_transaction').text('');
				$('span#total_transaction').text(this.serverSyncModel.statDetails.total_transaction);

				$('span#sales_volume_average').text('');
				$('span#sales_volume_average').text(this.serverSyncModel.statDetails.sales_volume_average);

				$('span#gen_firstname').text('');
				$('span#gen_firstname').text(this.serverSyncModel.statDetails.buyer_first_name);

				$('span#gen_lastname').text('');
				$('span#gen_lastname').text(this.serverSyncModel.statDetails.buyer_last_name);


			}
			else if(!this.fetch_success)
			{
				//not expecting any errors here...
				
			}
		},
	}
		

export default AdminGeneralStatistics;
	
	
	