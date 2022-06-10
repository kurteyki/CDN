function processLogin(){
	let form = $("#form-login");

	// animation
	$("input", form).prop("readonly",true);	
	$(".submit-button").prop("disabled",true);	
	$(".submit-button",form).html($(".submit-button",form).html() + xsetting.spinner);

	let buttonspinner = $(".button-spinner");	

	console.info(base_url + 'auth/login');

	$.post(base_url + 'auth/login', form.serialize() , {}, 'json')
	.done(function(data){

		if (data.status) {

			ShowToast(data.response, true, 1000);

			setTimeout(() => {
				window.location.href = data.redirect
			},1000);

		}else{

			// animation
			$("input", form).prop("readonly",false);	
			$(".submit-button").prop("disabled",false);	
			buttonspinner.remove();
			ShowToast(data.response, false);
		}

	})
	.fail(function(xhr, statusText, errorThrown) {
		ShowToast(statusText, false);

		// animation
		$("input", form).prop("readonly",false);	
		$(".submit-button").prop("disabled",false);	
		buttonspinner.remove();
	})

}

function processRegister(){
	let form = $("#form-register");

	// animation
	$("input", form).prop("readonly",true);	
	$(".submit-button").prop("disabled",true);	
	$(".submit-button",form).html($(".submit-button",form).html() + xsetting.spinner);

	let buttonspinner = $(".button-spinner");	

	$.post(base_url + 'auth/register', form.serialize() , {}, 'json')
	.done(function(data){

		if (data.status) {

			ShowToast(data.response, true, 1000);

			setTimeout(() => {
				window.location.href = data.redirect
			},1000);

		}else{

			// animation
			$("input", form).prop("readonly",false);	
			$(".submit-button").prop("disabled",false);	
			buttonspinner.remove();
			ShowToast(data.response, false);
		}

	})
	.fail(function(xhr, statusText, errorThrown) {

		ShowToast(statusText, false);

		// animation
		$("input", form).prop("readonly",false);	
		$(".submit-button").prop("disabled",false);	
		buttonspinner.remove();
	})
}

$("#form-login").on("submit", (e) => {
	e.preventDefault();
	processLogin();
})

$("#form-register").on("submit", (e) => {
	e.preventDefault();
	processRegister();
})