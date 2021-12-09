import AbstractModel from "./../../Models/AbstractModel.js";
import AbstractFileModel from "./../../Models/AbstractFileModel.js";
	
	const AdminProduct = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:null,
		formData:null,

		//for uploads:
		eachUniqueProductID:"",

		productMainImage1:null,
		productMainImage2:null,
		productLogo1:null,
		productLogo2:null,

		productCategory:null,
		currencyOfTransaction:null,
		productTitle:"",
		productSummary:"",
		productDescription:"",
		productPrice:"",
		productShippingCost:"",
		productAddInfo:"",
		productShipGuaranteeInfo:"",

		//states:
		is_all_null:false,
		clicked_state:false,
		upload_success:false,
		fetch_success:false,
		fetch_each_success:false,
		
		UploadProduct(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{
				
				this.Collectibles();
				event.preventDefault();

				if(
					this.productCategory==null ||
					this.currencyOfTransaction==null ||
					this.productTitle=="" ||
					this.productSummary=="" ||
					this.productDescription=="" ||
					this.productPrice==""||
					this.productShippingCost=="" ||
					this.productAddInfo=="" ||
					this.productShipGuaranteeInfo==""
				)
				{
					//event.preventDefault();
					console.log("Empty")
					this.is_all_null = true;
					this.IsAllNullUI();
				}
				else
				{
					this.is_all_null = false;
					this.IsAllNullUI();

					//set state to true for watchers
					this.clicked_state = true;
					//UI loading function:
					this.LoadingUI();

					//call the server sync:
					this.SyncUploadTextDetailsModel().then((serverModel)=>
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
							(this.serverSyncModel.serverStatus === 'textDetailsSaved!')
						)
						{
							//Now call the product image upload function:
							this.SyncUploadImageDetailsModel().then((serverModel)=> 
							{
								//sync server Model: 
								this.serverSyncModel = serverModel; 
								if( 
									(this.serverSyncModel.code === 1) &&
									(this.serverSyncModel.serverStatus === 'imageDetailsSaved!')
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
									(this.serverSyncModel.serverStatus === 'imageDetailsNotSaved!')
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
						else if
						( 
							(this.serverSyncModel.code === 0) &&
							(this.serverSyncModel.serverStatus === 'textDetailsNotSaved!')
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

		RefreshProductIDs()
		{
			$('button#refreshProductIDs').click((event)=>
			{
				event.preventDefault();
				this.FetchProductIDs();
			});
			
		},

		FetchProductIDs()
		{
			//console.log("Onto Fetching Things");
			//initialize:
			this.Init();
				//first call the Sync Model:
				this.SyncFetchAllProductIDsModel().then((serverModel)=>
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

		FetchEachProductDetails(targetClickElem)
		{
			//initialize:
			this.Init();

			$(targetClickElem).click((event)=>
			{

				this.Collectibles();

				if(
					this.eachUniqueProductID===""
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
					this.SyncFetchEachProductDetailsModel().then((serverModel)=>
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
			//first get admin id:
			this.admin_id = window.localStorage.getItem('adminID');
			//hide loading icon:
			$('div#uploadLoadingIcon').hide();
			//clear text:
			$('div#adminUploadSuccess').text('');
			$('div#adminUploadError').text('');
			$('div#adminUploadErrorDetails').text('');

			//for fetching all IDs:
			$('span#allProductIDs').text('');
			$('span#errorSuccessNotifyAllProduct').hide();
			$('button#refreshProductDetails').hide();

			//for fetching each product details
			$('div#eachProductLoadingIcon').hide();
			$('div#eachProductDetails').hide();
			$('div#errorSuccessNotifyEachProduct').hide();
		},

		Collectibles()
		{
			//create new form data:
			this.form_data = new FormData();
			//set image values:
			this.productMainImage1 = $('input#pro_image_main')[0].files;
	 		this.productMainImage2 = $('input#pro_image_main_2')[0].files;
	 		this.productLogo1 = $('input#pro_image_logo_1')[0].files;
	 		this.productLogo2 = $('input#pro_image_logo_2')[0].files;
	 		//attach all the above to the FormData object:
	 		if(this.productMainImage1.length > 0 || this.productMainImage2.length > 0
	 			|| this.productLogo1.length > 0 || this.productLogo2.length > 0)
	 		{
	 			this.form_data.append('main_image_1', this.productMainImage1[0]);
	 			this.form_data.append('main_image_2', this.productMainImage2[0]);
	 			this.form_data.append('logo_1', this.productLogo1[0]);
	 			this.form_data.append('logo_2', this.productLogo2[0]);
	 		}
	 		
	 		//set text values:
	 		this.productCategory = $('select#selected_category').val();
	 		this.currencyOfTransaction = $('select#selected_currency').val();
	 		this.productTitle = $('input#product_title').val();
	 		this.productSummary = $('textarea#product_summary').val();
	 		this.productDescription = $('textarea#product_description').val();
	 		this.productPrice = $('input#product_price').val();
	 		this.productShippingCost = $('input#product_shipping_cost').val();
	 		this.productAddInfo = $('textarea#product_add_info').val();
	 		this.productShipGuaranteeInfo = $('textarea#product_ship_guarantee_info').val();

	 		//this is for the fetch function:
	 		this.eachUniqueProductID = $('input#uniqueProductID').val(); 

	 		console.log(this.productMainImage1[0]);
	 		console.log(this.productMainImage2[0]);
	 		console.log(this.productLogo1[0]);
	 		console.log(this.productLogo2[0]);
		},

		IsAllNullUI()
		{
			if(this.is_all_null)
			{
				$('div#adminUploadSuccess').text('');
				$('div#adminUploadError').text('');
				$('div#adminUploadErrorDetails').text('');

				$('div#adminUploadError').text('Upload Error!');
				$('div#adminUploadErrorDetails').text('Please fill up all fields!');
			}
			else if(!this.is_all_null)
			{
				$('div#adminUploadSuccess').text('');
				$('div#adminUploadError').text('');
				$('div#adminUploadErrorDetails').text('');
			}
		},
			
		SyncUploadTextDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/upload/product/details/texts';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'product_category' : this.productCategory,
				'product_title' : this.productTitle,
				'product_summary' : this.productSummary,
				'product_description' : this.productDescription,
				'product_currency_of_payment' : this.currencyOfTransaction,
				'product_price' : this.productPrice,
				'product_shipping_cost' : this.productShippingCost,
				'product_add_info' : this.productAddInfo,
				'product_ship_guarantee_info' : this.productShipGuaranteeInfo
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		SyncUploadImageDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/upload/product/details/images';
			
			//append other data to the form data:
			this.form_data.append('token_id', this.admin_id);
			this.form_data.append('product_token_id', this.serverSyncModel.product_token_id);

			 
			//prepare the JSON model:
			let jsonRequestModel = this.form_data;
			console.log("About to Transport:", this.form_data);
			let serverModel = AbstractFileModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},

		SyncFetchAllProductIDsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/all/product/ids';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
			//console.log("Cleared Model Thingy", serverModel);
		},

		SyncFetchEachProductDetailsModel()
		{
			let method = "POST";
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/admin/dashboard/utils/fetch/each/product/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'token_id' : this.admin_id,
				'product_token_id' : this.eachUniqueProductID
			}

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
			//console.log("Cleared Model Thingy", serverModel);
		},

		LoadingUI()
		{
			if(this.clicked_state)
			{
				//for uploads:
				$('button#saveProductDetails').hide();
				$('div#uploadLoadingIcon').show();

				//for search each:
				$('button#viewProductDetails').hide();
				$('div#eachProductLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				//for uploads:
				$('div#uploadLoadingIcon').hide();
				$('button#saveProductDetails').show();

				//for search each:
				$('div#eachProductLoadingIcon').hide();
				$('button#viewProductDetails').show();
				
			}
		},
		
		UploadUI()
		{	
			if(this.upload_success)
			{
				//clear all forms:
				$('form#productInfoUpload').trigger('reset');

				//clear first:
				$('div#adminUploadSuccess').text("");
				$('div#adminUploadError').text("");
				$('div#adminUploadErrorDetails').text("");
				//Upload Success Message:
				$('div#adminUploadSuccess').text("Product Saved Successfully!");
			}
			else if(!this.upload_success)
			{
				//clear first:
				$('div#adminUploadSuccess').text("");
				$('div#adminUploadError').text("");
				$('div#adminUploadErrorDetails').text("");

				//Upload Error Message:
				$('div#adminUploadError').text("Upload Error!");
				$('div#adminUploadErrorDetails').text(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#allProductLoadingIcon').hide();
				$('span#allClearedCartIDs').text('');
				$('button#refreshProductIDs').show();

				$('div#errorSuccessNotifyAllProduct').show();
				$('div#fetchSuccessAllProduct').text('');
				$('div#fetchErrorAllProduct').text('');
				$('div#fetchErrorDetailsAllProduct').text('');

				$('div#fetchSuccessAllProduct').text('Fetch Success!');

				//get the id details://we could use map features:
				let allProductIDs = this.serverSyncModel.productDetails;

				//$('div#cartBuyerIDs').text(allbuyerIDs);
				for(let eachProductID of allProductIDs)
				{
					console.log(eachProductID);
					$('span#allProductIDs').append('<span>'+ eachProductID + '</span><br/>');
				}
				
			}
			else if(!this.fetch_success)
			{
				$('div#allProductLoadingIcon').hide();
				$('span#allClearedCartIDs').text('');
				$('button#refreshProductIDs').show();

				$('div#errorSuccessNotifyAllProduct').show();
				$('div#fetchSuccessAllProduct').text('');
				$('div#fetchErrorAllProduct').text('');
				$('div#fetchErrorDetailsAllProduct').text('');

				$('div#fetchErrorAllProduct').text('Fetch Error!');
				$('div#fetchSuccessAllProduct').text(this.serverSyncModel.short_description);
			}
		},
		FetchEachUI()
		{
			if(this.fetch_each_success)
			{
				//clear all forms:
				$('form#searchProductForm').trigger('reset');

				//clear first:
				$('div#errorSuccessNotifyEachProduct').show();
				$('div#fetchSuccessEachProduct').text("");
				$('div#fetchErrorEachProduct').text("");
				$('div#fetchErrorDetailsEachProduct').text("");

				//Upload Success Message:
				$('div#fetchSuccessEachProduct').text("Product Details Found!");

				//show the form:
				$('div#eachProductDetails').show();

				$('span#dispProductID').text('');
				$('span#dispProductID').text(this.eachUniqueProductID);

				$('span#dispDateCreated').text('');
				$('span#dispDateCreated').text(this.serverSyncModel.productDetails.product_created_at);

				$('figure#dispMainImage1').text('');
				$('figure#dispMainImage1').html(`<img src="data:image/*;base64, ${this.serverSyncModel.productDetails.main_image_1}" alt="Product Main Image"></img>`);

				$('figure#dispMainImage2').text('');
				$('figure#dispMainImage2').html(`<img src="data:image/*;base64, ${this.serverSyncModel.productDetails.main_image_2}" alt="Product Main Image"></img>`);
				
				$('figure#dispLogo1').text('');
				$('figure#dispLogo1').html(`<img src="data:image/*;base64, ${this.serverSyncModel.productDetails.logo_1}" alt="Product Main Image"></img>`);

				$('figure#dispLogo2').text('');
				$('figure#dispLogo2').html(`<img src="data:image/*;base64, ${this.serverSyncModel.productDetails.logo_2}" alt="Product Main Image"></img>`);

				$('span#dispProductCategory').text('');
				$('span#dispProductCategory').text(this.serverSyncModel.productDetails.product_category);

				$('span#dispProductTitle').text('');
				$('span#dispProductTitle').text(this.serverSyncModel.productDetails.product_title);

				$('span#dispShortDisc').text('');
				$('span#dispShortDisc').text(this.serverSyncModel.productDetails.product_summary);

				$('span#dispDetailedDisc').text('');
				$('span#dispDetailedDisc').text(this.serverSyncModel.productDetails.product_description);

				$('span#dispProductCurrency').text('');
				$('span#dispProductCurrency').text(this.serverSyncModel.productDetails.product_currency_of_payment);

				$('span#dispProductPrice').text('');
				$('span#dispProductPrice').text(this.serverSyncModel.productDetails.product_price);

				$('span#dispProductShippingCost').text('');
				$('span#dispProductShippingCost').text(this.serverSyncModel.productDetails.product_shipping_cost);

				$('span#dispAddInfo').text('');
				$('span#dispAddInfo').text(this.serverSyncModel.productDetails.product_add_info);

				$('span#dispShipGuarantee').text('');
				$('span#dispShipGuarantee').text(this.serverSyncModel.productDetails.product_ship_guarantee_info);


			}
			else if(!this.fetch_each_success)
			{
				//console.log("Cool Right!");
				$('div#eachProductDetails').hide();
				//clear first:
				$('div#errorSuccessNotifyEachProduct').show();
				$('div#fetchSuccessEachProduct').text("");
				$('div#fetchErrorEachProduct').text("");
				$('div#fetchErrorDetailsEachProduct').text("");

				//Upload Error Message:
				$('div#fetchErrorEachProduct').text("Fetch Error!");
				$('div#fetchErrorDetailsEachProduct').text(this.serverSyncModel.short_description);
				//console.log(this.serverSyncModel.short_description);
			}
		}
	}
		

export default AdminProduct;
	
	
	