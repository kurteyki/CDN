$("#edit-profile").on("click",function(e){

	const button = $(this);

	ShowToast(lang.readProfile, false);

	$.post(current_url + `/edit`)
	.done(function(read){

		if (!read.status) {
			ShowToast(read.response, false);
			return false;
		}

		removeToast();

		// build form create
		let html = '';
		html += `

		<form autocomplete="off" id="form-profile" enctype="multipart/form-data">

		<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li class="nav-item" role="presentation">
		<button class="nav-link active" id="basic-tab" data-bs-toggle="tab" data-bs-target="#basic" type="button" role="tab" aria-controls="basic" aria-selected="true">
		Dasar
		</button>
		</li>
		<li class="nav-item" role="presentation">
		<button class="nav-link" id="social-tab" data-bs-toggle="tab" data-bs-target="#social" type="button" role="tab" aria-controls="social" aria-selected="false">
		Sosial
		</button>
		</li>
		<li class="nav-item" role="presentation">
		<button class="nav-link" id="donate-tab" data-bs-toggle="tab" data-bs-target="#donate" type="button" role="tab" aria-controls="social" aria-selected="false">
		Donate
		</button>
		</li>		
		<li class="nav-item" role="presentation">
		<button class="nav-link" id="security-tab" data-bs-toggle="tab" data-bs-target="#security" type="button" role="tab" aria-controls="security" aria-selected="false">
		Keamanan
		</button>
		</li>
		</ul>
		<div class="tab-content" id="myTabContent">

		<div class="tab-pane py-3 show active" id="basic" role="tabpanel" aria-labelledby="basic-tab">

		<div class="mb-3">
		<label class="form-label">New Photo</label>
		<input name="photo" type="file" class="form-control">
		</div>	

		<div class="mb-3">
		<label class="form-label">Intro</label>
		<textarea name="intro" maxlength="200" class="form-control" rows="3" placeholder="saya adalah...">${read['response']['intro']}</textarea>
		<div class="form-text">
		limit karakter 
		<span class="countstr">${read['response']['intro'].length}</span>/200
		</div>
		</div>

		</div><!-- tab-pane -->

		<div class="tab-pane py-3" id="social" role="tabpanel" aria-labelledby="social-tab">

		<div class="mb-3 main-social">
		<label class="form-label">Sosial Media</label>
		
		`;

		let social_list_serve = [],iconform = '';
		$.each(read['response']['social'],function(key,value){
			iconform = key;
			html += `
			<div class="input-group mb-3">
			<span class="input-group-text">
			<i class='bi bi-${iconform}'></i>
			</span>
			<input autocomplete="off" name="social_media[${key}]" type="url" class="form-control" placeholder="${key} url" value="${value}"/>
			<span class="input-group-text social-remove" data-social="${key}">
			<i class="bi bi-x"></i>
			</span>
			</div>
			`;
			social_list_serve.push(key);
		})

		html += `</div>
		<div class="dropdown">
		<button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownsocial" data-bs-toggle="dropdown" aria-expanded="false">
		Social Lainnya
		</button>
		<ul class="dropdown-menu social-list" aria-labelledby="dropdownsocial">
		`;

		var social_list = ['facebook', 'twitter', 'instagram', 'discord', 'tiktok', 'telegram','github','linkedin'], icon = '';
		$.each(social_list,function(key,value){
			if ($.inArray(value,social_list_serve) == -1) {
				icon = value;
				html += `
				<li><a data-social="${value}" data-icon="${icon}" class="dropdown-item social-add" href="javascript:;">${capitalizeFirstLetter(value)}</a></li>
				`;
			}
		})

		html += `
		</ul>
		</div>
		</div><!-- tab-pane -->

		<div class="tab-pane py-3" id="donate" role="tabpanel" aria-labelledby="donate-tab">

		<div class="mb-3">
		<label class="form-label">Kata-Kata Donasi</label>
		<textarea name="donate" class="form-control" rows="3" placeholder="">${read['response']['donate']}</textarea>
		</div>

		</div><!-- tab-pane -->		

		<div class="tab-pane py-3" id="security" role="tabpanel" aria-labelledby="security-tab">

		<div class="mb-3">
		<label class="form-label">Masukan Password Baru</label>
		<input autocomplete="new-password" name="pwnew" type="password" class="form-control" placeholder="*****">
		</div>

		<div class="mb-3">
		<label class="form-label">Konfirmasi Password Baru</label>
		<input autocomplete="new-password" name="pwnewconfirm" type="password" class="form-control" placeholder="*****">
		</div>		

		</div><!-- tab-pane -->
		</div>	

		</form>	
		`;

		let dialog = bootbox.dialog({
			title: `Edit Profile <b>Saya</b>`,
			message: html,
			centerVertical: true,
			size: 'medium',
			buttons: {
				cancel: {
					label: "Batal",
					className: 'btn-danger',
				},
				confirm: {
					label: "Simpan",
					className: 'btn-primary',
					callback: function(){
						$("#form-profile").submit();
						return false;
					}
				}
			},
			onShown : function(){

				formProfileEdit(dialog);

				// init textarea max length
				$('textarea[maxlength]').on('keyup blur', function() {
					var maxlength = $(this).attr('maxlength');
					var val = $(this).val();

					$(".countstr").html(val.length);
				});		

				// social dynamic				
				SocialAdd();
				SocialRemove();
			}
		});

	})
.fail(function(xhr, statusText, errorThrown) {
	let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
	ShowToast(err_message, true, 3000);        
});    

});

function SocialAdd(){
	$(".social-add").on("click",function(){
		var html = `
		<div class="input-group mb-3">
		<span class="input-group-text">
		<i class='bi bi-${$(this).data('icon')}'></i>
		</span>
		<input autocomplete="off" name="social_media[${$(this).data('social')}]" type="url" class="form-control" placeholder="${$(this).data('social')} url"/>
		<span class="input-group-text social-remove" data-social="${$(this).data('social')}">
		<i class="bi bi-x"></i>
		</span>
		</div>
		`;

		$(".main-social").append(html);
		$(this).remove();
		$('.social-remove').unbind();
		SocialRemove();
	})	
}	

function SocialRemove(){
	$(".social-remove").on("click",function(){
		let iconremove = $(this).data("social");
		var html = `
		<li><a data-social="${$(this).data("social")}" data-icon="${iconremove}" class="dropdown-item social-add" href="javascript:;">${capitalizeFirstLetter($(this).data("social"))}</a></li>
		`;
		$(".social-list").append(html);
		$(this).parent().remove();	
		$('.social-add').unbind();
		SocialAdd();	
	});
}

function formProfileEdit(dialog)
{
	let form = $("#form-profile");

	form.on("submit",function(e){	

		e.preventDefault();

		// get form data with files
		const formdata = new FormData($(this)[0]);

		// animation
		$("input,textarea", form).prop("readonly",true);	
		$(".bootbox-accept, .bootbox-cancel").prop("disabled",true);	
		$(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);

		let buttonspinner = $(".button-spinner");			

		$.ajax({
			url: current_url + `/save`,
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

					if (data.profile.photo) {						
						(data.profile.photo !== '') ? $(".profile-image").attr("src",base_url + `storage/users/` + data.profile.photo) : '';
					}

					$(".profile-intro").html(data.profile.intro);

					// build profile social html
					var socialhtml = '';
					$.each(data.profile.social, function(index, value){					
						if (value) {
							socialhtml += `
							<li class="list-inline-item">
							<a target="_blank" rel="noopener noreferrer nofollow" href="${value}">
							<i class="bi bi-${index}"></i>
							${capitalizeFirstLetter(index)}
							</a>
							</li>	
							`;
						}
					});

					$(".profile-social").html(socialhtml);
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

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}