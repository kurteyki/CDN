function editTopic()
{
	$(".edit-topic").on("click",function(e){

		const button = $(this),
		data = button.data('hash');

		ShowToast(lang.readTopic, false);

		$.post(current_url + `topic-edit`, {'hash' : data})
		.done(function(read){

			if (!read.status) {
				ShowToast(read.response, false);
				return false;
			}

			removeToast();

			let html = '';
			html += `
			<form id="form-topic" enctype="multipart/form-data">

			<div class="mb-3">
			<label class="form-label">Title</label>
			<input required="" name="title" type="text" class="form-control" placeholder="apa nama topiknya ?" value="${read['response']['title']}">
			</div>

			<div class="mb-3">
			<label class="form-label">Kategori</label>
			<input required="" name="categories" type="text" class="form-control" placeholder="masuk kategori jenis apa ?" value="${read['response']['categories']}">
			</div>

			<div class="mb-3">
			<label class="form-label">Status</label>

			<div class="form-check">
			<input value="Private" class="form-check-input" type="radio" required="" name="status" id="flexRadioDefault1" ${(read['response']['status'] == 'Private') ? 'checked' : ''}>
			<label class="form-check-label" for="flexRadioDefault1">
			Private
			</label>
			</div>
			<div class="form-check">
			<input value="Public" class="form-check-input" type="radio" required="" name="status" id="flexRadioDefault2" ${(read['response']['status'] == 'Public') ? 'checked' : ''}>
			<label class="form-check-label" for="flexRadioDefault2">
			Public
			</label>
			</div>

			</div>

			<div class="mb-3">
			<label class="form-label">Ilustrator</label>
			<input name="ilustrator" type="file" class="form-control">
			</div>			

			<div class="mb-3">
			<label class="form-label">Permalink</label>
			<input required="" name="permalink" type="text" class="form-control" placeholder="insert permalink ?" value="${read['response']['permalink']}">
			</div>			

			<input name="hash" type="hidden" value="${read['response']['hash']}">

			</form>
			`;

			var dialog = bootbox.dialog({
				title: `Edit topik <b>${read['response']['title']}</b>`,
				message: html,
				centerVertical: true,
				closeButton: false,
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

					formEditTopic(dialog);

					$('input', $("#form-topic")).keypress(function (e) {
						if (e.which == 13) {
							$("#form-topic").submit();
						}
					});		

				}
			});

		})
		.fail(function(xhr, statusText, errorThrown) {
			let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
			ShowToast(err_message, true, 3000);     
		});    

	})  
}

editTopic();

function formEditTopic(dialog)
{
	let form = $("#form-topic");

	form.on("submit",function(e){	

		e.preventDefault();		 		

		// get form data with files
		const formdata = new FormData($(this)[0]);
		
		// animation
		$("input,textarea", form).prop("readonly",true);	
		$(".bootbox-accept, .bootbox-cancel").prop("disabled",true);	
		$(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);

		let buttonspinner = $(".button-spinner");

		e.preventDefault();				

		$.ajax({
			url: current_url + 'topic-update',
			type: "POST",
			data: formdata,
			dataType: "json", 
			mimeTypes:"multipart/form-data",
			contentType: false,
			cache: false,
			processData: false,
			success: function(data){
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
			},error: function(xhr, statusText, errorThrown) {
				let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
				ShowToast(err_message, true, 3000); 
				// animation
				$("input,textarea", form).prop("readonly",false);	
				$(".bootbox-accept, .bootbox-cancel").prop("disabled",false);	
				buttonspinner.remove();
			}
		});		

	});		
}