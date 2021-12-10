import AdminLoginLogout from "./Controllers/Admin/AdminLoginLogoutController.js";
import AdminDashboardSecurity from "./Controllers/Admin/AdminDashboardSecurityController.js";

import AdminCartBuyer from "./Controllers/Admin/AdminCartBuyerController.js";
import AdminPendingCart from "./Controllers/Admin/AdminPendingCartController.js";
import AdminClearedCart from "./Controllers/Admin/AdminClearedCartController.js";

import AdminProduct from "./Controllers/Admin/AdminProductController.js";

import AdminBusinessAddress from "./Controllers/Admin/AdminBusinessAddressController.js";
import AdminBankAccount from "./Controllers/Admin/AdminBankAccountController.js";
import AdminLocationsTracks from "./Controllers/Admin/AdminLocationsTracksController.js";
import AdminReferral from "./Controllers/Admin/AdminReferralController.js"; 




import BuyerRegister from "./Controllers/Buyer/BuyerRegisterController.js";
import BuyerLoginLogout from "./Controllers/Buyer/BuyerLoginLogoutController.js";
import BuyerDashboardSecurity from "./Controllers/Buyer/BuyerDashboardSecurityController.js";

import BuyerCardDetails from "./Controllers/Buyer/BuyerCardDetailsController.js";
import BuyerBillingDetails from "./Controllers/Buyer/BuyerBillingDetailsController.js";
import BuyerShippingDetails from "./Controllers/Buyer/BuyerShippingDetailsController.js";

import BuyerAccountDetails from "./Controllers/Buyer/BuyerAccountDetailsController.js";
import BuyerLocationsTracks from "./Controllers/Buyer/BuyerLocationsTracksController.js";

import BuyerReferral from "./Controllers/Buyer/BuyerReferralController.js"; 

import BuyerPendingCart from "./Controllers/Buyer/BuyerPendingCartController.js";
import BuyerClearedCart from "./Controllers/Buyer/BuyerClearedCartController.js";

import BuyerFetchAndSelectProducts from "./Controllers/Buyer/BuyerFetchAllProducts.js";

import BuyerPayment from "./Controllers/Buyer/BuyerPaymentController.js";


//Now start the app with IIFE main():
const main = (()=> {

	$(document).ready(function()
	{	
		//FOR ADMIN: 

		//execute at login;
		if( $('body#adminLoginPage').val() !== undefined ) 
		{
			AdminLoginLogout.LoginDashboard('button#adminLoginBtn');
		}

		//execute on dashboard;
		if( $('body#adminDashboardPage').val() !== undefined )
		{
			AdminDashboardSecurity.SecureDashboard();

			//for Carts:
			AdminCartBuyer.RefreshCartBuyerIDs();
			AdminCartBuyer.FetchCartBuyerIDs();
			AdminCartBuyer.FetchCartBuyerDetails('button#viewEachBuyerDetails');

			//for pending Carts:
			AdminPendingCart.RefreshPendingCartIDs();
			AdminPendingCart.FetchPendingCartIDs();
			AdminPendingCart.FetchEachPendingCartDetails('button#viewPendingCartDetails');

			//for cleared Carts:
			AdminClearedCart.RefreshClearedCartIDs();
			AdminClearedCart.FetchClearedCartIDs();
			AdminClearedCart.FetchEachClearedCartDetails('button#viewClearedCartDetails');

			//Upload Products:
			AdminProduct.UploadProduct('button#saveProductDetails');
			AdminProduct.RefreshProductIDs();
			AdminProduct.FetchProductIDs();
			AdminProduct.FetchEachProductDetails('button#viewProductDetails');
			AdminProduct.DeleteEachProductDetails('button#deleteProduct');

			//Business Address
			AdminBusinessAddress.FetchBusinessAddress();
			AdminBusinessAddress.RefreshFetchBusinessAddress();
			AdminBusinessAddress.UpdateBusinessAddress('button#saveBizDetails');
			//Upload Bank Acc Details:
			AdminBankAccount.FetchBankAccount();
			AdminBankAccount.RefreshFetchBankAccount();
			AdminBankAccount.UpdateBankAccount('button#saveBankAccDetails');

			//Track Bought Goods:
			AdminLocationsTracks.FetchCartLocation();
			AdminLocationsTracks.UpdateCartLocation('button#updateCartLocationBtn');

			//Referral	Program:
			AdminReferral.RefreshFetchReferral();
			AdminReferral.FetchReferral();
			AdminReferral.UpdateReferralInfo('button#uploadReferralInfoBtn');

			AdminLoginLogout.LogoutDashboard('a#signOut');
		}

		
		//FOR BUYERS:
		if( $('body#buyerShopPage').val() !== undefined)
		{
			BuyerRegister.RegisterBuyer('button#buyerRegisterBtn');
			BuyerLoginLogout.LoginDashboard('button#buyerLoginBtn');

			//console.log("About to!");
			//for product listings:
			BuyerFetchAndSelectProducts.RefreshAllProducts();
			BuyerFetchAndSelectProducts.FetchAllProducts();
			BuyerFetchAndSelectProducts.PersistPendingCartDetailsToFront('a#checkoutBtn');
		}

		if($('body#buyerDashboardPage').val() !== undefined )
		{
			BuyerDashboardSecurity.SecureDashboard();
			BuyerLoginLogout.LogoutDashboard('a#signOutLink');

			BuyerCardDetails.FetchCardDetails();
			BuyerCardDetails.RefreshCardDetails();
			BuyerCardDetails.UploadCardDetails('button#uploadCardDetailsBtn');

			BuyerBillingDetails.FetchBillingDetails();
			BuyerBillingDetails.RefreshBillingDetails();
			BuyerBillingDetails.UploadBillingDetails('button#billingUploadDetailsBtn');

			BuyerShippingDetails.FetchShippingDetails();
			BuyerShippingDetails.RefreshShippingDetails();
			BuyerShippingDetails.UploadShippingDetails('button#shippingUploadDetailsBtn');

			BuyerAccountDetails.FetchBasicAccountDetails();
			BuyerAccountDetails.RefreshBasicAccountDetails();
			BuyerAccountDetails.UploadAccountDetails('button#accountUploadDetailsBtn');

			//Track Bought Goods: Use Admin module to avoid repitions:
			BuyerLocationsTracks.FetchCartLocation();

			BuyerReferral.RefreshFetchReferral();
			BuyerReferral.FetchReferralAmount();
			BuyerReferral.GenerateReferralLink("button#genRefLinkBtn");

			//to avoid repitions, use common admin module for user:
			//for pending Carts:
			BuyerPendingCart.RefreshPendingCartIDs();
			BuyerPendingCart.FetchPendingCartIDs();
			BuyerPendingCart.FetchEachPendingCartDetails('button#viewPendingCartDetails');

			//for cleared Carts:
			BuyerClearedCart.RefreshClearedCartIDs();
			BuyerClearedCart.FetchClearedCartIDs();
			BuyerClearedCart.FetchEachClearedCartDetails('button#viewClearedCartDetails');

			BuyerPayment.EnsurePaymentIntent('button#settleCartPayBtn');
			BuyerPayment.MakePayment();

		}

	});
})();