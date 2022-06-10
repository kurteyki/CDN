/**
 * Create Section Button
 */
 $("#create-section").on("click",function(e){

 	const button = $(this);

	// build form create
	let html = '';
	html += `
	<form id="form-section">

	<div class="mb-3">
	<label class="form-label">Bagian</label>
	<input required="" name="title" type="text" class="form-control" placeholder="masukan nama bagian">
	</div>

	<div class="mb-3">
	<label class="form-label">Jenis</label>
	<div class="form-check">
	<input value='Single' class="form-check-input" type="radio" name="type" id="inlineRadio1">
	<label class="form-check-label" for="inlineRadio1">Single</label>
	</div>
	<div class="form-check">
	<input value='Part' class="form-check-input" type="radio" name="type" id="inlineRadio2" checked>
	<label class="form-check-label text-nowrap" for="inlineRadio2">Part</label>
	</div>								    
	</div>

	<div class="mb-3">
	<label class="form-label d-flex justify-content-between">

	<div>
	Ilustrasi
	</div>

	<div>
	<div class="form-check form-check-inline">
	<input required value="icon" class="form-check-input" type="radio" name="ilustrator_select" id="status-icon" checked>
	<label class="form-check-label" for="status-icon">Icon</label>
	</div>
	<div class="form-check form-check-inline">
	<input required value="image" class="form-check-input" type="radio" name="ilustrator_select" id="status-image">
	<label class="form-check-label text-nowrap" for="status-image">Image</label>
	</div>
	</div>

	</label>

	<div class="input-group input-icon-ilustrator">
	<div class="input-group-prepend">
	<span class="input-group-text h-100 selected-icon"></span>
	</div>
	<input type="text" class="form-control iconpicker" name="ilustrator_icon"/>
	</div>
	</div>

	<div class="mb-3 input-image-ilustrator d-none">
	<input name="ilustrator_image" type="text" class="form-control" placeholder="https://...">
	</div>	

	<button class="btn btn-primary btn-submit" type="submit">Simpan</button>

	</div>

	</form>
	`;

	var dialog = bootbox.dialog({
		title: `Membuat bagian <b>Baru</b>`,
		message: html,
		centerVertical: true,
		size: 'small',	
		onShown : function(){
			$("input[name=title]", $("#form-section")).focus();
			$("input[name=ilustrator_select]").click(function() {
				if ($(this).val() == 'image') {
					$(".input-icon-ilustrator").addClass('d-none');
					$(".input-image-ilustrator").removeClass('d-none');
				}else{
					$(".input-icon-ilustrator").removeClass('d-none');
					$(".input-image-ilustrator").addClass('d-none');
				}
			});
			formCreateSection(dialog);
			createPicker();
		}
	})
	
})	

 function formCreateSection(dialog)
 {
 	let form = $("#form-section");

 	form.on("submit",function(e){		 		

 		e.preventDefault();

		// animation
		$("input", form).prop("readonly",true);	
		$(".btn-submit").prop("disabled",true);	
		$(".btn-submit").html($(".btn-submit").html() + xsetting.spinner);
		$(".bootbox-close-button").hide();
		let buttonspinner = $(".button-spinner");		

		$.post(current_url + 'section-create', form.serialize() , {}, 'json')
		.done(function(data){

			if (data.status) {
				dialog.modal('hide');
				refreshContent();
			}else{
				// animation
				$("input", form).prop("readonly",false);	
				$(".btn-submit").prop("disabled",false);
				$(".bootbox-close-button").show();	
				buttonspinner.remove();				
			}

			ShowToast(data.response, true, 5000);
		})
		.fail(function(xhr, statusText, errorThrown) {
			let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
			ShowToast(err_message, true, 3000);   
			// animation
			$("input", form).prop("readonly",false);	
			$(".btn-submit").prop("disabled",false);
			$(".bootbox-close-button").show();	
			buttonspinner.remove();
		});

	});	 		

 }