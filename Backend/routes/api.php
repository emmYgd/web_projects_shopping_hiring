<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

/*Route::get('/', function() {
    //return Route::app->version();
    return "Hello World";
});

Route::get('cool', function() {
    //return Route::app->version();
    return "Cool Things";
});*/

//Buyer Group:
Route::group(['prefix' => 'v1/buyer/', /*'middleware' => ''*/], function(){

	//when a new user clicks the unique referral link generated:
		Route::get('referral/{unique_buyer_id}', [
			//'as' => '', 
			//'middleware' => 'init',
    		'uses' => 'BuyerReferralController@ReferralLinkUse'
		]);

	Route::group(['prefix' => 'auth/', /*'middleware' => ''*/], function() 
	{
		Route::post('register', [
    		//'as' => 'register',
    		'middleware' => 'deleteAllNullRecords',
    		'uses' => 'BuyerAccessController@Register'
		]);

		Route::post('login/dashboard', [
    		//'as' => 'login',
    		'middleware' => 'deleteAllNullRecords',
    		'uses' => 'BuyerAccessController@LoginDashboard'
		]);

		Route::post('confirm/login/state', [
			//'as' => 'forgot_password',
    		//'middleware' => 'init',
    		'uses' => 'BuyerAccessController@ConfirmLoginState'
		]);

		Route::post('forgot/password', [
    		//'as' => 'forgot_password',
    		//'middleware' => 'init',
    		'uses' => 'BuyerAccessController@ForgotPassword'
		]);

		//this might include payment details like credit card info..
		Route::post('edit/profile', [
    		//'as' => 'forgot_password',
    		//'middleware' => 'init',
    		'uses' => 'BuyerAccessController@EditProfile'
		]);

		//optional pictures:
		Route::post('edit/image', [
    		//'as' => 'forgot_password',
    		//'middleware' => 'init',
    		'uses' => 'BuyerAccessController@EditImage'
		]);

		Route::post('logout', [
    		//'as' => 'logout',
    		//'middleware' => 'init',
    		'uses' => 'BuyerAccessController@Logout'
		]);

	});


	Route::group(['prefix' => 'dashboard/utils/', /*'middleware' => ''*/], function() {

		Route::post('fetch/card/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerPaymentController@FetchAllCardDetails'
		]);

		Route::post('upload/card/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerPaymentController@UploadCardDetails'
		]);

		Route::post('fetch/billing/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerBillingAndShippingController@FetchBillingDetails'
		]);

		Route::post('upload/billing/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerBillingAndShippingController@UploadBillingDetails'
		]);

		Route::post('fetch/shipping/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerBillingAndShippingController@FetchShippingDetails'
		]);

		Route::post('upload/shipping/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerBillingAndShippingController@UploadShippingDetails'
		]);


		Route::post('fetch/account/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerAccountController@FetchAccountDetails'
		]);

		Route::post('upload/account/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerAccountController@UploadAccountDetails'
		]);


		Route::post('fetch/all/buyer/cart/ids', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerCartController@FetchAllBuyerCartIDs'
		]);

		Route::post('fetch/each/buyer/cart/details', [
			//'as' => 'init', 
			//'middleware' => 'init',
    		'uses' => 'BuyerCartController@FetchEachBuyerCartDetails'
		]);


		//this will include their pricing with or without shipping...
		Route::get('fetch/all/products/details', [
			'as' => 'goods_for_sale', 
			//'middleware' => 'init',
    		'uses' => 'BuyerProductController@FetchAvailableProducts'
		]);

		//this is for when the buyer searches for details of the goods that he already has the summary...
		//use json for loop in the frontend-JS...
		Route::get('view/specific/goods/by/id', [
			'as' => 'goods_by_id', 
			//'middleware' => 'init',
    		'uses' => 'BuyerGoodsController@ViewAvailableByID'
		]);

		Route::post('add/goods/to/cart', [
			'as' => 'add_to_cart', 
			//'middleware' => 'init',
    		'uses' => 'BuyerCartController@AddGoodsToCart'
		]);

		//all goods cleared from the cart(payment has been made)
		Route::get('view/all/pending/cleared/carts/summary', [
			'as' => 'all_cleared_carts_summary', 
			//'middleware' => 'init',
    		'uses' => 'BuyerCartController@ViewCartsByCategory'//Pending or Cleared
		]);

		Route::get('edit/pending/carts', [
			//'as' => 'edit_pending_carts', 
			//'middleware' => 'init',
    		'uses' => 'BuyerCartController@EditPendingCartGoods'//Pending or Cleared
		]);

		Route::get('delete/pending/carts', [
			//'as' => 'delete_pending_carts', 
			//'middleware' => 'init',
    		'uses' => 'BuyerCartController@DeletePendingCart'//Pending or Cleared
		]);

		//use guzzlehttp to connect to external API to make payment:
		/*Buyer's Credit Card or other details of means of payment ....
		note:this should be encrypted...*/
		Route::post('make/payment', [
			//'as' => 'make_payment',
			//'middleware' => 'init',
    		'uses' => 'BuyerPaymentController@MakePayment'
		]);

		/*Buyer's Credit Card or other details of means of payment ....
		note:this should be encrypted...*/
		Route::get('view/all/payment/means', [
			'as' => 'payment_means',
			//'middleware' => 'init',
    		'uses' => 'BuyerPaymentController@ViewPaymentMeans'
		]);


		Route::get('view/all/payment/history', [
			'as' => 'payment_history',
			//'middleware' => 'init',
    		'uses' => 'BuyerPaymentController@ViewPaymentHistory'
		]);
		
		//real time location of the goods as updated by the admin:
		//note: it is assumed that the business runs a delivery service...
		//note -- if this is a USA company, their is already a mailing system..

		Route::post('track/all/goods/bought', [
			'as' => 'track_goods', 
			//'middleware' => 'init',
    		'uses' => 'BuyerExtrasController@TrackGoods'
		]);

		Route::post('confirm/goods/delivered', [
			//'as' => 'confirm_goods_delivered', 
			//'middleware' => 'init',
    		'uses' => 'BuyerExtrasController@ConfirmDelivery'
		]);

		Route::post('comment/or/rate/experience', [
			'as' => 'comment_rate', 
			//'middleware' => 'init',
    		'uses' => 'BuyerExtrasController@CommentRate'
		]);

		Route::post('view/others/comment/or/rate/experience/', [
			'as' => 'comment_rate_others', 
			//'middleware' => 'init',
    		'uses' => 'BuyerExtrasController@ViewOtherCommentsRates'
		]);

		//first check if referral program has been activated by the admin before proceeding:
		Route::post('generate/unique/referral/link', [
			'as' => 'referral_link', 
			//'middleware' => 'init',
    		'uses' => 'BuyerReferralController@GenUniqueReferralLink'
		]);

		//first check if referral program has been activated by the admin before proceeding:
		Route::post('fetch/referral/bonus', [
			//'as' => 'referral_bonus', 
			//'middleware' => 'init',
    		'uses' => 'BuyerReferralController@ReferralBonus'
		]);

		

	});

});


//admin group:
Route::group(['prefix' => 'v1/admin', /*'middleware' => ''*/], function()
{
	Route::group(['prefix' => 'auth/', /*'middleware' => ''*/], function()
	{
		Route::post('login', [
    		'as' => 'login',
    		//'middleware' => 'init',
    		'uses' => 'AdminAccessController@Login'
		]);

		Route::post('logout', [
    		//'as' => 'logout',
    		//'middleware' => 'init',
    		'uses' => 'AdminAccessController@Logout'
		]);

		Route::post('forgot/password', [
    		//'as' => 'forgot_password',
    		//'middleware' => 'init',
    		'uses' => 'AdminAccessController@ForgotPassword'
		]);

		Route::post('confirm/login/state', [
			//'as' => 'forgot_password',
    		//'middleware' => 'init',
    		'uses' => 'AdminAccessController@ConfirmLoginState'
		]);

	});


	Route::group(['prefix' => 'dashboard/utils/', /*'middleware' => ''*/],function() 
	{

		Route::post('upload/product/details/texts', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@UploadProductTextDetails'
		]);

		Route::post('upload/product/details/images', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@UploadProductDetailsImage'
		]);

		Route::post('fetch/all/product/ids', [
			'as' => '', 
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@FetchAllProductIDs'
		]);

		Route::post('fetch/each/product/details', [
			'as' => '', 
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@FetchEachProductDetails'
		]);

		Route::post('delete/each/product/details', [
			'as' => '', 
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@DeleteEachProductDetails'
		]);


		Route::post('fetch/each/buyer/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminCartController@FetchEachBuyerDetails'
		]);

		Route::post('fetch/all/cart/buyer/ids', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminCartController@FetchAllCartBuyerIDs'
		]);

		Route::post('fetch/each/cart/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminCartController@FetchEachCartDetails'
		]);

		Route::post('fetch/all/cart/ids', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminCartController@FetchAllCartIDs'
		]);

		Route::post('update/business/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@UpdateBusinessDetails'
		]);

		Route::post('fetch/business/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@FetchBusinessDetails'
		]);

		Route::post('update/bank/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminBankAndPaymentController@UpdateBankDetails'
		]);

		Route::post('fetch/bank/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminBankAndPaymentController@FetchBankDetails'
		]);

		Route::post('update/cleared/cart/location', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminLocationsAndTracksController@UpdateLocationDetails'
		]);

		Route::post('fetch/cleared/cart/location', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminLocationsAndTracksController@FetchLocationDetails'
		]);

		Route::post('update/referral/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminExtrasController@UpdateReferralDetails'
		]);

		Route::post('fetch/referral/details', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminExtrasController@FetchReferralDetails'
		]);

		Route::post('disable/referral', [
			'as' => '',
			//'middleware' => 'init',
    		'uses' => 'AdminExtrasController@DisableReferral'
		]);
		
		/*some of these data will be used for plotting charts on the frontend:
			include - month, total payment made*/
		Route::get('sales/chart/data', [
			'as' => 'sales_data', 
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@GetSalesData'
		]);

		Route::get('view/frequently/bought/goods', [
			'as' => 'frequently_bought', 
			//'middleware' => 'init',
    		'uses' => 'AdminGeneralController@ViewFrequent'
		]);

		//not yet purchased goods..
		Route::post('view/all/pending/or/cleared/cart/goods/', [
			'as' => 'pending_or_cleared_cart_goods', 
    		'uses' => 'AdminCartController@ViewCartsByCategory'
		]);

		//send messages as reminders to the owner of these goods to complete their purchases:
		Route::post('remind/cart/owners', [
			//'as' => 'remind_cart_owners', 
    		'uses' => 'AdminCartController@RemindPendingCartOwners'
		]);

		//view all goods in motion and their respective locations:
		Route::post('view/all/tracked/goods', [
			//'as' => 'all_tracked_goods', 
    		'uses' => 'AdminTrackController@ViewTrackedGoods'
		]);

		//update tracking details:
		Route::post('update/tracking/details', [
			//'as' => 'update_tracking', 
    		'uses' => 'AdminTrackController@UpdateTrackingLocation'
		]);

		//activate or deactivate referral program 
		Route::post('(de-)activate/referral/program', [
			'as' => 'referral_program', 
    		'uses' => 'AdminExtrasController@ReferralProgram'
		]);

		//set bonus amount per click:
		Route::post('set/referral/bonus', [
			'as' => 'referral_bonus', 
    		'uses' => 'AdminExtrasController@ReferralBonus'
		]);

		Route::get('view/all/referral/links/and/owners', [
			//'as' => 'view_all_referral_links', 
    		'uses' => 'AdminExtrasController@ViewAllReferralLinks'
		]);

	});

});
