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
			<form id="form-topic">


			<ul class="nav nav-tabs" id="myTab" role="tablist">
			<li class="nav-item" role="presentation">
			<button class="nav-link active" id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab" aria-controls="general" aria-selected="true">
			General
			</button>
			</li>
			<li class="nav-item" role="presentation">
			<button class="nav-link" id="options-tab" data-bs-toggle="tab" data-bs-target="#options" type="button" role="tab" aria-controls="options" aria-selected="false">
			Pengaturan
			</button>
			</li>
			</ul>
			<div class="tab-content" id="myTabContent">

			<div class="tab-pane py-3 show active" id="general" role="tabpanel" aria-labelledby="general-tab">

			<!-- general -->
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
			<label class="form-label d-flex justify-content-between">

			<div>
			Ilustrasi
			</div>

			<div>
			<div class="form-check form-check-inline">
			<input required value="icon" class="form-check-input" type="radio" name="ilustrator_select" id="status-icon" ${(read['response']['ilustrator'].substr(0,2) == 'bi') ? 'checked' : ''}>
			<label class="form-check-label" for="status-icon">Icon</label>
			</div>
			<div class="form-check form-check-inline">
			<input required value="image" class="form-check-input" type="radio" name="ilustrator_select" id="status-image" ${(read['response']['ilustrator'].substr(0,2) != 'bi') ? 'checked' : ''}>
			<label class="form-check-label text-nowrap" for="status-image">Image</label>
			</div>
			</div>

			</label>

			<div class="input-group input-icon-ilustrator ${(read['response']['ilustrator'].substr(0,2) == 'bi') ? '' : 'd-none'}">
			<div class="input-group-prepend">
			<span class="input-group-text h-100 selected-icon"></span>
			</div>
			<input type="text" class="form-control iconpicker" name="ilustrator_icon" value="${(read['response']['ilustrator'].substr(0,2) == 'bi') ? read['response']['ilustrator'] : ''}"/>
			</div>
			</div>

			<div class="mb-3 input-image-ilustrator ${(read['response']['ilustrator'].substr(0,2) != 'bi') ? '' : 'd-none'}">
			<input name="ilustrator_image" type="text" class="form-control" placeholder="https://..." value="${(read['response']['ilustrator'].substr(0,2) != 'bi') ? read['response']['ilustrator'] : ''}">
			</div>	

			<div class="mb-3">
			<label class="form-label">Permalink</label>
			<input required="" name="permalink" type="text" class="form-control" placeholder="insert permalink ?" value="${read['response']['permalink']}">
			</div>			
			<!-- general -->			

			</div><!-- tab-pane -->


			<div class="tab-pane py-3" id="options" role="tabpanel" aria-labelledby="options-tab">

			<!-- options -->
			<div>Nothing...</div>
			<!-- options -->

			</div><!-- tab-pane -->

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

					$("input[name=ilustrator_select]").click(function() {
						if ($(this).val() == 'image') {
							$(".input-icon-ilustrator").addClass('d-none');
							$(".input-image-ilustrator").removeClass('d-none');
						}else{
							$(".input-icon-ilustrator").removeClass('d-none');
							$(".input-image-ilustrator").addClass('d-none');
						}
					});

					formEditTopic(dialog);

					$('input', $("#form-topic")).keypress(function (e) {
						if (e.which == 13) {
							$("#form-topic").submit();
						}
					});		
					
					// init picker
					if (read['response']['ilustrator'].substr(0,2) == 'bi') {						
						createPicker(read['response']['ilustrator']);				
					}else{
						createPicker();
					}				
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

		// animation
		$("input,textarea", form).prop("readonly",true);	
		$(".bootbox-accept, .bootbox-cancel").prop("disabled",true);	
		$(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);

		let buttonspinner = $(".button-spinner");

		e.preventDefault();				

		$.post(current_url + 'topic-update', form.serialize() , {}, 'json')
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