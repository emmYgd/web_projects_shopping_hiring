import AdminLoginLogout from "./Controllers/Admin/AdminLoginLogoutController.js";
import AdminDashboardSecurity from "./Controllers/Admin/AdminDashboardSecurityController.js";

import AdminCartBuyer from "./Controllers/Admin/AdminCartBuyerController.js";
import AdminPendingCart from "./Controllers/Admin/AdminPendingCartController.js";
import AdminClearedCart from "./Controllers/Admin/AdminClearedCartController.js";

import AdminProductUpload from "./Controllers/Admin/AdminProductUploadController.js";
import AdminBusinessAddress from "./Controllers/Admin/AdminBusinessAddressController.js";
import AdminBankAccount from "./Controllers/Admin/AdminBankAccountController.js";
import AdminLocationsTracks from "./Controllers/Admin/AdminLocationsTracksController.js";
import AdminReferral from "./Controllers/Admin/AdminReferralController.js"; 

import BuyerRegister from "./Controllers/Buyer/BuyerRegisterController.js";
import BuyerLoginLogout from "./Controllers/Buyer/BuyerLoginLogoutController.js";
import BuyerDashboardSecurity from "./Controllers/Buyer/BuyerDashboardSecurityController.js";

import BuyerCardDetails from "./Controllers/Buyer/BuyerCardDetailsController.js";
import BuyerBillingDetails from "./Controllers/Buyer/BuyerBillingDetailsController.js";
//import BuyerShippingDetails from "./Controllers/Buyer/BuyerShippingDetailsController.js";

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
			AdminProductUpload.UploadProduct('button#saveProductDetails');

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
		}

		if($('body#buyerDashboardPage').val() !== undefined )
		{
			BuyerDashboardSecurity.SecureDashboard();
			BuyerLoginLogout.LogoutDashboard('a#signOutLink');

			BuyerCardDetails.FetchCardDetails();
			BuyerCardDetails.RefreshCardDetails();
			BuyerCardDetails.UploadCardDetails('button#uploadCardDetailsBtn');

			BuyerBillingDetails.FetchBillingDetails();
			//BuyerCardDetails.RefreshBillingDetails();
			//BuyerCardDetails.UploadBillingDetails('button#uploadBillingDetailsBtn');
		}

	});
})();