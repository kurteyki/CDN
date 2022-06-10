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
 	<label class="form-label">Deskripsi</label>
 	<textarea required="" name="description" maxlength="150" class="form-control" rows="3" placeholder="jelasin singkat tentang topiknya"></textarea>
 	<div class="form-text">
 	limit karakter
 	<span class="countstr">0</span>/150
 	</div>
 	</div>

 	<div class="mb-3">
 	<label class="form-label">Kategori</label>
 	<input required="" name="categories" type="text" class="form-control" placeholder="masuk kategori jenis apa ?">
 	</div>

 	<div class="mb-3">
 	<label class="form-label">Status</label>

 	<div class="form-check">
 	<input value="Private" class="form-check-input" type="radio" required="" name="status" id="flexRadioDefault1" checked>
 	<label class="form-check-label" for="flexRadioDefault1">
 	Private
 	</label>
 	</div>
 	<div class="form-check">
 	<input value="Public" class="form-check-input" type="radio" required="" name="status" id="flexRadioDefault2">
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

 			$("input[name=ilustrator_select]").click(function() {
 				if ($(this).val() == 'image') {
 					$(".input-icon-ilustrator").addClass('d-none');
 					$(".input-image-ilustrator").removeClass('d-none');
 				}else{
 					$(".input-icon-ilustrator").removeClass('d-none');
 					$(".input-image-ilustrator").addClass('d-none');
 				}
 			});
 			
 			formCreateTopic(dialog);

			// on enter
			$('input', $("#form-topic")).keypress(function (e) {
				if (e.which == 13) {
					$("#form-topic").submit();
				}
			});

			// init textarea max length
			$('textarea[maxlength]').on('keyup blur', function() {
				var maxlength = $(this).attr('maxlength');
				var val = $(this).val();

				$(".countstr").html(val.length);
			});  
			
			// init picker
			createPicker();
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