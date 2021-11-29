$(document).ready(function(){
	$('#adminLoginBtn').click((event)=>{
		event.preventDefault();
	 	let adminEmail = $('#adminLoginEmail').val();
	 	let adminPass = $('#adminLoginPassword').val();
	 	console.log(adminEmail);
	 	console.log(adminPass);
	});
})

