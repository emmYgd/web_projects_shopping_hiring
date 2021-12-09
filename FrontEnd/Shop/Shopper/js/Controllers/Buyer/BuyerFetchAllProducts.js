import AbstractModel from './../../Models/AbstractModel.js';
	
	const BuyerFetchProducts = 
	{	
		//admin token:
		buyer_id:null,

		//values:
		serverSyncModel:'',
		uniquePendingID:'',
		
		//states:
		fetch_success:false,
		clicked_state:false,
		fetch_each_success:false,

		/*RefreshPendingCartIDs()
		{
			$('button#refreshPendingCartIDs').click((event)=>
			{
				event.preventDefault();
				this.FetchPendingCartIDs();
			});
		},*/

		FetchAllProducts()
		{
			//console.log('Onto Fetching Things');
			//initialize:
			this.Init();
				//first call the Sync Model:
				this.SyncFetchAllProductsModel().then((serverModel)=>
				{
					//sync model:
					this.serverSyncModel = serverModel;

					//now start conditionals:
					if( 
						(this.serverSyncModel.code === 1) &&
						(this.serverSyncModel.serverStatus === 'FetchSuccess!')
					)
					{
						console.log('Success');
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
						console.log('Error');
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
					this.uniquePendingID==''
				)
				{
					console.log('Empty!');
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
							console.log('Success');
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
							console.log('Error');
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
			//console.log('Onto Fetching Things')
			
			$('div#dispAllProducts').hide();
			$('button#refreshAllProducts').hide();
			$('div#fetchAllProductsLoadingIcon').show();
			$('nav#navigateIcons').hide();
			$('div#errorSuccessNotifyAllProducts').hide();
			
			/*$('div#eachPendingCartDetails').hide();
			$('div#eachPendingCartLoadingIcon').hide();
			$('div#errorSuccessNotifyEachPendingCart').hide();*/
		},

		Collectibles()
		{
			//set values:
			//console.log( new FormData(this) );
			this.uniquePendingID = $('input#uniquePendingID').val();
	 		console.log(this.uniquePendingID);
		},

		SyncFetchAllProductsModel()
		{
			let method = 'GET';
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/fetch/all/products/details';
			//prepare the JSON model:
			let jsonRequestModel = '';

			let serverModel = AbstractModel(method, UploadServerUrl, jsonRequestModel);
			return serverModel;
			//this.serverSyncModel = serverModel;
		},
			
		SyncFetchEachPendingCartDetailsModel()
		{
			let method = 'POST';
			let UploadServerUrl = 'http://localhost/Hodaviah/Backend/public/api/v1/buyer/dashboard/utils/fetch/each/buyer/cart/details';
			//prepare the JSON model:
			let jsonRequestModel = 
			{
				'unique_buyer_id' : this.buyer_id,
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
				$('div#fetchSuccessEachPendingCart').text('');
				$('div#fetchErrorEachPendingCart').text('');
				$('div#fetchErrorDetailsEachPendingCart').text('');
				//Upload Success Message:
				$('div#fetchSuccessEachPendingCart').text('Pending Cart Details Found!');

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
				//console.log('Cool Right!');
				$('div#eachPendingCartDetails').hide();
				//clear first:
				$('div#errorSuccessNotifyEachPendingCart').show();
				$('div#fetchSuccessEachPendingCart').text('');
				$('div#fetchErrorEachPendingCart').text('');
				$('div#fetchErrorDetailsEachPendingCart').text('');

				//Upload Error Message:
				$('div#fetchErrorEachPendingCart').text('Fetch Error!');
				$('div#fetchErrorDetailsEachPendingCart').text(this.serverSyncModel.short_description);
				//console.log(this.serverSyncModel.short_description);
			}
		},

		FetchUI()
		{
			if(this.fetch_success)
			{
				$('div#dispAllProducts').show();
				$('button#refreshAllProducts').show();
				$('div#fetchAllProductsLoadingIcon').hide();
				$('nav#navigateIcons').show();
				$('div#errorSuccessNotifyAllProducts').show();
				
				$('div#fetchSuccessAllProducts').text('');
				$('div#fetchErrorAllProducts').text('');
				$('div#fetchErrorDetailsAllProducts').text('');

				$('div#fetchSuccessAllProducts').text('Search Success!');

				$('span#totalProductCount').text('');
				$('span#totalProductCount').text(this.serverSyncModel.totalCount);

				//Now display all received products:
				/*for(let eachProductModel in this.serverSyncModel.products)*/
				this.serverSyncModel.products.map(eachProductModel => {
					//display each product:
					$('div#dispAllProducts').append(`

						<div class="product product-list ">
                                    <div class="row">
                                        <div class="col-6 col-lg-3">
                                            <figure class="product-media">
                                                <b>
                                                    <span class="product-label label-new w3-card-4 w3-deep-purple">New</span>
                                                </b>

                                                <a href="product.html">
                                                    <!--<img src="assets/images/products/product-4.jpg" alt="Product image" class="product-image">-->
                                                    <img src="data:image/*;base64, ${eachProductModel.main_image_1}" alt="Product image" class="product-image">
                                                </a>
                                            </figure><!-- End .product-media -->
                                        </div><!-- End .col-sm-6 col-lg-3 -->

                                        <div class="col-6 col-lg-3 order-lg-last">
                                            <div class="product-list-action">
                                                <div class="w3-center product-price">
                                                    <!--<b>$60.00</b>-->
                                                    <b>
                                                    	${
                                                    		(eachProductModel.product_currency_of_payment === "USD")?'<span>$</span>':'<span>'+eachProductModel.product_currency_of_payment+'</span>'
                                                    	}
                                                    	<span>${eachProductModel.product_price}</span>
                                                    </b>
                                                </div><!-- End .product-price -->
                                                <div class="w3-border w3-round-xxlarge w3-black w3-padding w3-margin">
                                                	<b class=" w3-center w3-small">Shipping</b>
                                                    <b class="w3-small w3-right w3-white">
                                                    	${
                                                    		(eachProductModel.product_currency_of_payment === "USD")?'<span>$</span>':'<span>'+eachProductModel.product_currency_of_payment+'</span>'
                                                    	}
                                                    	${
                                                    		(eachProductModel.product_shipping_cost !== "")?'<span>'+eachProductModel.product_shipping_cost+'</span>':'<span></span>'
                                                    	}
                                                    </b>
                                                </div>
                                                <!--<div class="ratings-container">
                                                    <div class="ratings">
                                                        <div class="ratings-val" style="width: 20%;"></div>--><!-- End .ratings-val -->
                                                    <!--</div>--><!-- End .ratings -->
                                                    <!--<span class="ratings-text">( 2 Reviews )</span>
                                                </div>--><!-- End .rating-container -->

                                                <div class="product-action w3-margin-left w3-padding">
                                                    <a href="#overview_customize_modal" data-toggle="modal" class="btn-product btn-quickview" title="Quick view">
                                                    	<span><b class="w3-myfont w3-small">Overview/Customize</b></span></a>
                                                </div><!-- End .product-action -->

                                                <div id="add_${eachProductModel.product_token_id}" class="w3-card w3-deep-purple btn-product btn-cart w3-ripple">
                                                	<span><b class="w3-myfont">add to cart</b></span>
                                                </div>

                                                <div id="remove_${eachProductModel.product_token_id}" class="w3-card w3-deep-purple btn-product btn-cart w3-ripple">
                                                	<span><b class="w3-myfont">remove from cart</b></span>
                                                </div>

                                            </div><!-- End .product-list-action -->
                                        </div><!-- End .col-sm-6 col-lg-3 -->

                                        <div class="col-lg-6">
                                            <div class="w3-border-right product-body product-action-inner">
                                                <a href="#" class="btn-product btn-wishlist" title="Add to wishlist"><span>add to wishlist</span></a>
                                                <div class="product-cat">
                                                    <a href="#" class="w3-myfont">
                                                    	<!--<b class="w3-large">Flavour</b>-->
                                                    	<b class="w3-large">${eachProductModel.product_category}</b>
                                                    </a>
                                                </div><!-- End .product-cat -->
                                                <!--<h3 class="product-title"><a href="#" class="w3-myfont"><b class="w3-medium">Brown paperbag waist pencil skirt</b></a></h3>--><!-- End .product-title -->
                                                <h3 class="product-title"><a href="#" class="w3-myfont"><b class="w3-medium">${eachProductModel.product_title}</b></a></h3><!-- End .product-title -->
                                                <div class="product-content">
                                                    <!--<p class="w3-myfont">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque </p>-->
                                                    <p class="w3-myfont">${eachProductModel.product_summary}</p>
                                                </div><!-- End .product-content -->
                                                
                                                <div class="product-nav product-nav-thumbs">
                                                    <a href="#" class="active">
                                                        <!--<img src="assets/images/products/product-4-thumb.jpg" alt="product desc">-->
                                                        <img src="data:image/*;base64, ${eachProductModel.main_image_2}" alt="product desc">
                                                    </a>
                                                    <a href="#">
                                                        <!--<img src="assets/images/products/product-4-2-thumb.jpg" alt="product desc">-->
                                                        <img src="data:image/*;base64, ${eachProductModel.logo_1}" alt="product desc">
                                                    </a>

                                                    <a href="#">
                                                        <!--<img src="assets/images/products/product-4-3-thumb.jpg" alt="product desc">-->
                                                        <img src="data:image/*;base64, ${eachProductModel.logo_2}" alt="product desc">
                                                    </a>
                                                </div><!-- End .product-nav -->
                                            </div><!-- End .product-body -->
                                        </div><!-- End .col-lg-6 -->
                                    </div><!-- End .row -->
                                </div><!-- End .product -->


                                <!--Modal for exhaustive information about the product and customizing-->
                                <section class="modal fade" id="overview_customize_modal" tabindex="-1" role="page" aria-hidden="true">
        							<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            							<div class="modal-content">
                							<div class="modal-body">
                    							<button type="button" class="close w3-text-red" data-dismiss="modal" aria-label="Close">
                        							<span aria-hidden="true"><i class="icon-close"></i></span>
                    							</button><br/>
                    							 <div class="product-details-tab">
                        <ul class="nav nav-pills justify-content-center" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active w3-myfont" id="product-desc-link" data-toggle="tab" href="#product-desc-tab" role="tab" aria-controls="product-desc-tab" aria-selected="true">Description</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link w3-myfont" id="product-info-link" data-toggle="tab" href="#product-info-tab" role="tab" aria-controls="product-info-tab" aria-selected="false">Additional information</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link w3-myfont" id="product-shipping-link" data-toggle="tab" href="#product-shipping-tab" role="tab" aria-controls="product-shipping-tab" aria-selected="false">Shipping & Returns</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link w3-myfont" id="product-customize-link" data-toggle="tab" href="#product-review-tab" role="tab" aria-controls="product-shipping-tab" aria-selected="false">Customize</a>
                            </li>
                        </ul>

                        <div class="tab-content w3-myfont">

                            <div class="tab-pane fade show active" id="product-desc-tab" role="tabpanel" aria-labelledby="product-desc-link">
                                <div class="product-desc-content">
                                    <h3 class="w3-center w3-myfont"><b>Product Exhaustive Description</b></h3>
                                    <div class="w3-center w3-myfont">${eachProductModel.product_description}</div>
                                </div><!-- End .product-desc-content -->
                            </div><!-- .End .tab-pane -->

                            <div class="tab-pane fade" id="product-info-tab" role="tabpanel" aria-labelledby="product-info-link">
                                <div class="product-desc-content">
                                    <h3 class="w3-center w3-myfont"><b>Product Additional Information</b></h3>
                                    <div class="w3-center w3-myfont">${eachProductModel.product_add_info}</div>
                                </div><!-- End .product-desc-content -->
                            </div><!-- .End .tab-pane -->

                            <div class="tab-pane fade" id="product-shipping-tab" role="tabpanel" aria-labelledby="product-shipping-link">
                                <div class="product-desc-content">
                                    <h3 class="w3-center w3-myfont"><b>Product Delivery, Guarantee & Returns Information</b></h3>
                                    <div class="w3-center w3-myfont">${eachProductModel.product_ship_guarantee_info}</div>
                                </div><!-- End .product-desc-content -->
                            </div><!-- .End .tab-pane -->

                            <div class="tab-pane fade" id="product-review-tab" role="tabpanel" aria-labelledby="product-review-link">
                                <div class="customize">
                                <div class="row">

                <div class="col-6">
                    <figure class="product-media">
                        <a href="product.html">
                            <img src="data:image/*;base64, ${eachProductModel.main_image_1}" alt="Product image">
                        </a>
                    </figure><!-- End .product-media -->
                    <h4 class="product-title w3-myfont w3-small">${eachProductModel.product_summary}</h4><!-- End .product-title -->
                </div><!-- End .col-6 -->

                <div class="col-6 justify-content-end">
                    <div class="product-price">
                        ${
                            (eachProductModel.product_currency_of_payment === "USD")?'<span>$</span>':'<span>'+eachProductModel.product_currency_of_payment+'</span>'
                        }
                        <span>${eachProductModel.product_price}</span>
                    </div><!-- End .product-price --><br/>

                    <div class="product-details-quantity">
                    	<b>Quantity(-ies):</b>
                        <input type="number" id="product_quantity_${eachProductModel.product_token_id}" placeholder="Quantity" class="form-control" value="1" min="1" step="1" data-decimals="0" required>
                    </div><!-- End .product-details-quantity --><br/>

                    <div class="product-details-action">
                        <div id="${eachProductModel.product_token_id}" class="w3-btn w3-ripple w3-deep-purple">
                        	<span class="w3-myfont">
                        		<span class="icon-cart"></span>
                        		<b>Add to Cart</b>
                        	</span>
                        </div>
                    </div><!-- End .product-details-action -->
                </div><!-- End .col-6 -->
            </div><!-- End .row -->
                                </div>
                            </div><!-- .End .tab-pane -->
                        </div><!-- End .tab-content -->
                    </div><!-- End .product-details-tab -->

                    						</div>
                    					</div>
                    				</div>
                    			</section>


					`);

					//immediately, hide each remove button:
					$('input#remove_'+eachProductModel.product_token_id).hide();

					//after all things, monitor event for add to cart
					this.MonitorAddToCart('div#add_'+ eachProductModel.product_token_id,  eachProductModel.product_token_id);
				});
				
				if(this.serverSyncModel.totalCount<4)
				{
					$('li#totalProductCount').text('');
					$('li#totalProductCount').text(1);
				}
				else
				{
					let productPages = this.serverSyncModel.totalCount/4;

					$('li#totalProductCount').text('');
					$('li#totalProductCount').text(productPages);
				}
			}
			else if(!this.fetch_success)
			{
				$('div#dispAllProducts').hide();
				$('button#refreshAllProducts').show();
				$('div#fetchAllProductsLoadingIcon').hide();
				$('nav#navigateIcons').hide();
				$('div#errorSuccessNotifyAllProducts').show();
				
				$('div#fetchSuccessAllProducts').text('');
				$('div#fetchErrorAllProducts').text('');
				$('div#fetchErrorDetailsAllProducts').text('');

				$('div#fetchErrorAllProducts').text('Search Error!');
				$('div#fetchErrorDetailsAllProducts').text(this.serverSyncModel.short_description);
			}
		},

		MonitorAddToCart(addToCartBtn, productTokenID)
		{
			//first set an empty cart representation:
			let currentCart = new Map();

			//When user clicks the "Add to Cart Button":
			$(addToCartBtn).click((event)=>
			{
				event.preventDefault();
				
				//console.log("I have been clicked!");

				//add the product token plus the quantity marked:
				let quantityMarked = $('input#product_quantity_'+productTokenID).val();
				//console.log(quantityMarked);
				currentCart.set(productTokenID, quantityMarked);
				//console.log(currentCart);
				//once this has been added, we show the button to remove from cart:
				$('div#remove')
			});
		}
	}
		

export default BuyerFetchProducts;
	
	
	