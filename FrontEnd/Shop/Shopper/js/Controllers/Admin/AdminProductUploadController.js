import AbstractModel from "./../../Models/AbstractModel.js";
import AbstractFileModel from "./../../Models/AbstractFileModel.js";
	
	const AdminProductUpload = 
	{	
		//admin token:
		admin_id:null,

		//values:
		serverSyncModel:null,
		formData:null,

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

	 		console.log(this.productMainImage1);
	 		console.log(this.productMainImage2);
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

		LoadingUI()
		{
			if(this.clicked_state)
			{
				$('button#saveProductDetails').hide();
				$('div#uploadLoadingIcon').show();
			}
			else if(!this.clicked_state)
			{
				$('div#uploadLoadingIcon').hide();
				$('button#saveProductDetails').show();
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
	}
		

export default AdminProductUpload;
	
	
	