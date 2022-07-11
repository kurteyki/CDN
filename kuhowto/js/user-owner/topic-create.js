/**
* Create Topic Button
*/
$("#create-topic").on("click",function(e){

	const button = $(this);

	let html = '';
	html += `
	<form id="form-topic">

	<div class="mb-3">
	<label class="form-label">Title</label>
	<input required="" name="title" type="text" class="form-control" placeholder="apa nama topiknya ?">
	</div>

	<div class="mb-3">
	<label class="form-label">Kategori</label>
	<input required="" name="categories" type="text" class="form-control" placeholder="masuk kategori jenis apa ?">
	</div>

	</form>
	`;

	var dialog = bootbox.dialog({
		title: `Membuat topik <b>Baru</b>`,
		message: html,
		centerVertical: true,
		closeButton: false,
		size: 'medium',
		buttons: {
			cancel: {
				label: "Batal",
				className: 'btn-danger'
			},
			confirm: {
				label: "Simpan",
				className: 'btn-primary',
				callback: function(){
					$("#form-topic").submit();
					return false;
				}
			}
		},
		onShown : function(){

			$("input[name=title]",$("#form-topic")).focus();
			
			formCreateTopic(dialog);

			// on enter
			$('input', $("#form-topic")).keypress(function (e) {
				if (e.which == 13) {
					$("#form-topic").submit();
				}
			});
		}
	});
})	

function formCreateTopic(dialog)
{
	let form = $("#form-topic");

	form.on("submit",function(e){	

		e.preventDefault();		 		

		// animation
		$("input,textarea", form).prop("readonly",true);	
		$(".bootbox-accept, .bootbox-cancel").prop("disabled",true);	
		$(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);

		let buttonspinner = $(".button-spinner");			

		$.post(current_url + 'topic-create', form.serialize() , {}, 'json')
		.done(function(data){

			if (data.status) {
				dialog.modal('hide');
				refreshTopic();
			}else{
				// animation
				$("input,textarea", form).prop("readonly",false);	
				$(".bootbox-accept, .bootbox-cancel").prop("disabled",false);	
				buttonspinner.remove();				
			}

			ShowToast(data.response, true, 5000);
		})
		.fail(function(xhr, statusText, errorThrown) {
			let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
			ShowToast(err_message, true, 3000); 
			// animation
			$("input,textarea", form).prop("readonly",false);	
			$(".bootbox-accept, .bootbox-cancel").prop("disabled",false);	
			buttonspinner.remove();
		});

	});		
}