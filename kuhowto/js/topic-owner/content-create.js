function createContent()
{
	$(".create-content").on("click",function(e){

		const button = $(this),
		title = button.data('title');		
		hash = button.data('hash');

		let html = '';
		html += `
		<form id="form-content">

		<textarea id="summernote" name="article" placeholder="Tulis Konten..."></textarea>

		<input type="hidden" name="title" value=""/>
		<input type="hidden" name="title_section" value=""/>				
		<input type="hidden" name="description" value=""/>		
		<textarea class="d-none" name="tips"></textarea>
		<textarea class="d-none" name="faq"></textarea>		
		<textarea class="d-none" name="reference"></textarea>
		<input type="hidden" name="status" value="Draft"/> 
		<input type="hidden" name="password" value=""/>
		<input type="hidden" name="robots" value=""/>						
		<input type="hidden" name="permalink" value=""/>		
		<input type="hidden" value="${hash}" name="hash"/>

		</form>
		`;

		var dialog = bootbox.dialog({
			title: `<div class="row g-3 align-items-center justify-content-between">
			<div class="col-12">
			Membuat konten <b>Baru</b> dibagian <b>${title}</b>
			</div>

			<div class="col-auto text-center">
			<button data-toggle="tooltip" data-placement="bottom" title="Edit Title" class="btn btn-light border do-title"><i class="bi bi-newspaper"></i></button>
			<button data-toggle="tooltip" data-placement="bottom" title="Edit Deskripsi" class="btn btn-light border do-description"><i class="bi bi-card-text"></i></button>
			<button data-toggle="tooltip" data-placement="bottom" title="Edit Permalink" class="btn btn-light border do-permalink"><i class="bi bi-link-45deg"></i></button>			
			<button data-toggle="tooltip" data-placement="bottom" title="Edit Robots" class="btn btn-light border do-robots"><i class="bi bi-sliders"></i></button>						
			</div>

			<div class="col-auto">

			<div class="form-check form-check-inline">
			<input value="Draft" class="form-check-input" type="radio" name="status_h" id="status-draft" checked>
			<label class="form-check-label" for="status-draft">Draft</label>
			</div>
			<div class="form-check form-check-inline">
			<input value="Published" class="form-check-input" type="radio" name="status_h" id="status-published">
			<label class="form-check-label text-nowrap" for="status-published">Published</label>
			</div>

			<button data-toggle="tooltip" data-placement="bottom" title="Edit Title Bagian" class="btn btn-light border do-title-section"><i class="bi bi-layout-sidebar-inset-reverse"></i></button>
			<button data-toggle="tooltip" data-placement="bottom" title="Tambah Tips" class="btn btn-light border do-tips">Tips</button>
			<button data-toggle="tooltip" data-placement="bottom" title="Tambah FAQ" class="btn btn-light border do-faq">FAQ</button>			
			<button data-toggle="tooltip" data-placement="bottom" title="Tambah Referensi" class="btn btn-light border do-reference">Referensi</button>
			<button data-toggle="tooltip" data-placement="bottom" title="Proteksi Konten" class="btn btn-light border do-password"><i class="bi bi-key"></i></button>			

			</div><!--//col-auto-->

			</div>`,
			message: html,
			centerVertical: true,
			closeButton: false,
			size: 'large',  
			buttons: {
				countword: {
					label: "0",
					className: 'text-start col total-words',
					callback: function(){
						return false;
					}
				},
				cancel: {
					label: "Batal",
					className: 'btn-danger col-auto',
					callback: function(){
						$(window).unbind('beforeunload');
					}
				},
				confirm: {
					label: "Simpan",
					className: 'btn-primary col-auto',
					callback: function(){
						$("#form-content").submit();
						return false;
					}
				}
			}
		});

		dialog.init(function() {  		

			dialog.find('.modal-dialog').addClass('modal-fullscreen');
			dialog.find('.modal-header').addClass('d-block border-0');		
			dialog.find('.modal-body').addClass('p-0'); 
			dialog.find('.modal-footer').addClass('row'); 	

			$(window).bind('beforeunload', function(){
				return 'Are you sure you want to leave?';
			});

			$("input[name=status_h]").click(function() {
				$("input[name=status]").val($(this).val());
			});

			$(function () {
				$('[data-toggle="tooltip"]').tooltip()
			}) 			

			initSummernote();
			formCreateContent(dialog);
			doActionContent();
			doTitle(); 			
			doDescription();
			doPermalink();
			doRobots();
			doPassword();
		});

	})		
}

createContent();

function initSummernote(content = '')
{

	$('#summernote').summernote({
		inheritPlaceholder: true,
		// height: "50vh",
		tabDisable: true,
		disableDragAndDrop: true,
		blockquoteBreakingLevel: 2,
		codeviewFilter: true, 
		codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi, 
		codeviewIframeFilter: true, 
		codeviewIframeWhitelistSrc: [], 
		codeviewIframeWhitelistSrcBase: [ 
		'www.youtube.com', 
		'www.youtube-nocookie.com', 
		'www.facebook.com', 
		'vine.co', 
		'instagram.com', 
		'player.vimeo.com', 
		'www.dailymotion.com', 
		'player.youku.com', 
		'v.qq.com', 
		], 
		toolbar: [
		['style', [/* 'undo','redo', */'style']],
		['format', [
		'bold', 
		'italic', 
		'underline', 
		'strikethrough', 
		// 'superscript', 
		// 'subscript',
		'clear']
		],
		// ['font', ['fontname','fontsize', 'height']],
		['color', ['color']],
		['para', ['ul', 'ol', 'paragraph']],
		['table', ['table']],
		['insert', [/*'link',*/ 'advLink', 'picture', 'video', 'hr']], 		
		['view', ['fullscreen', 'codeview', 'help']],
		], 		
		popover: {
			image: [
			['custom', ['imageTitle']],
			['imagesize', ['resizeFull','resizeHalf','resizeQuarter','resizeNone']],
			['float', ['floatLeft', 'floatRight', 'floatNone']],
			['remove', ['removeMedia']]
			],
			// link: [['link', ['linkDialogShow', 'unlink']]]
			link: [['link', ['editAdvLink', 'unlink']]]
		},	
		imageTitle: {
			OpttitleField: false,
		},
		callbacks: {
			onInit: function() {
				setTimeout(function(){
					$('#summernote').summernote('focus');

					let characters = $('#summernote').summernote('code').replace(/(<([^>]+)>)/ig, " ").replace(/\s+/g, ' ').trim();
					let totalCharacters = characters.split(" ").length;
					$(".total-words").text(`${totalCharacters} Kata`);					

				},50)
			},
			onChange: function(e) {
				let characters = $('#summernote').summernote('code').replace(/(<([^>]+)>)/ig, " ").replace(/\s+/g, ' ').trim();
				let totalCharacters = characters.split(" ").length;
				$(".total-words").text(`${totalCharacters} Kata`);				
			}
		}
	}); 

	if (content) {
		$("#summernote").summernote('code', content);
	}else{
		$("#summernote").summernote('code', '<h1><br/></h1>');
	}

}

function formCreateContent(dialog)
{

	let form = $("#form-content");

	form.on("submit",function(e){	

		e.preventDefault();		

		if ($('#summernote').summernote('isEmpty')) {
			alert('konten masih kosong');
			return false;
		}
		
		$("input", form).prop("readonly",true);	
		$(".bootbox-accept, .bootbox-cancel").prop("disabled",true);	
		$(".bootbox-accept").html($(".bootbox-accept").html() + xsetting.spinner);

		let buttonspinner = $(".button-spinner");		

		$.post(current_url + '/content-create', form.serialize() , {}, 'json')
		.done(function(data){

			if (data.status) {
				dialog.modal('hide');
				refreshContent(true);
				$(window).unbind('beforeunload');
			}else{				
				$("input", form).prop("readonly",false);	
				$(".bootbox-accept, .bootbox-cancel").prop("disabled",false);	
				buttonspinner.remove();		

				$('#summernote').summernote('focus')		
			}

			ShowToast(data.response, true, 5000);
		})
		.fail(function(xhr, statusText, errorThrown) {
			let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
			ShowToast(err_message, true, 3000);                     

			$("input", form).prop("readonly",false);	
			$(".bootbox-accept, .bootbox-cancel").prop("disabled",false);	
			buttonspinner.remove();
		});

	});				
}

function doSave(act){

	let form = $("#form-content");

	$("input", form).prop("readonly",true); 
	$(".bootbox-accept, .bootbox-cancel, .bootbox-save").prop("disabled",true);    
	$(".bootbox-save").html($(".bootbox-save").html() + xsetting.spinner);
	let buttonspinner = $(".button-spinner");    

	$.post(current_url + '/' + act, form.serialize() , {}, 'json')
	.done(function(data){
		ShowToast(data.response, true, 5000);

		// refresh editor
		$("#summernote").summernote('code', data.content);

		$("input", form).prop("readonly",false);    
		$(".bootbox-accept, .bootbox-cancel, .bootbox-save").prop("disabled",false);   
		buttonspinner.remove();        
	})
	.fail(function(xhr, statusText, errorThrown) {
		ShowToast(statusText, false)

		$("input", form).prop("readonly",false);    
		$(".bootbox-accept, .bootbox-cancel, .bootbox-save").prop("disabled",false);   
		buttonspinner.remove(); 
	});
}

function doActionContent()
{
	$(".do-tips").on("click",function(){
		var dialogtips = bootbox.dialog({
			title: "Tambah Tips",
			message: `<textarea id="editortips" placeholder="masukan tips"></textarea>`,
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
					callback: function () {
						let tipshtml = $("#editortips").val();
						$("textarea[name=tips]",$("#form-content")).val(tipshtml);
					}
				}
			}
		});

		dialogtips.init(function() { 
			$('#editortips').summernote({
				inheritPlaceholder: true,
				minHeight: 200,
				maxHeight: 200,
				tabDisable: true,
				removeModule: 'autolink',
				toolbar: [
				['para', ['ul']]
				],
				callbacks: {
					onInit: function() {
						setTimeout(function(){
							$('#editortips').summernote('focus')
						},50)
					}
				}
			}); 

			$("#editortips").summernote("removeModule", "autoLink");

			if ($("textarea[name=tips]",$("#form-content")).val().length < 1) {
				$("#editortips").summernote('code', '<ul><li></li></ul>');
			}else{
				$("#editortips").summernote('code', $("textarea[name=tips]",$("#form-content")).val());
			}		
		});


	})

	$(".do-faq").on("click",function(){
		let dialogfaq = bootbox.dialog({
			title: "Tambah FAQ",
			message: `<textarea id="editorfaq" placeholder="masukan pertanyaan dan jawabannya"></textarea>`,
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
					callback: function () {
						let faqhtml = $("#editorfaq").val();
						$("textarea[name=faq]",$("#form-content")).val(faqhtml);
					}
				}
			}
		});

		dialogfaq.init(function() { 

			var table_faq = `<table>
			<thead>
			<tr>
			<th>
			Pertanyaan
			</th>
			<th>
			Jawaban
			</th>
			</tr>
			</thead>
			<tbody>
			<tr>
			<td>xxxxxx</td>
			<td>xxxxxx</td>
			</tr>
			</tbody>
			</table>`;

			var faqButton = function (context) {
				var ui = $.summernote.ui;

				var button = ui.button({
					contents: 'FAQ',
					container: '.note-btn-group.note-button',
					tooltip: 'Table FAQ',
					click: function () {
						if (confirm('yakin akan membuat table faq baru ?')) {
							$('#editorfaq').summernote('code', table_faq);
						}
					}
				});

				return button.render(); 
			}

			$('#editorfaq').summernote({
				inheritPlaceholder: true,
				minHeight: 200,
				maxHeight: 200,
				tabDisable: true,
				shortcuts: false,
				toolbar: [
				['font', ['bold', 'underline', 'clear']],
				['button', ['advLink','ul','faq','fullscreen', 'codeview']]
				],
				buttons: {
					faq: faqButton
				},
				callbacks: {
					onInit: function() {
						setTimeout(function(){
							$('#editorfaq').summernote('focus');
						},50)
					}
				}
			}); 		

			if ($("textarea[name=faq]",$("#form-content")).val().length < 1) {
				$("#editorfaq").summernote('code', table_faq);
			}else{
				console.info($("textarea[name=faq]",$("#form-content")).val());
				$("#editorfaq").summernote('code', $("textarea[name=faq]",$("#form-content")).val());
			}
		});
	})		

	$(".do-reference").on("click",function(){
		let dialogreference = bootbox.dialog({
			title: "Tambah Referensi",
			message: `<textarea id="editorreference" placeholder="masukan referensi"></textarea>`,
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
					callback: function () {
						let referencehtml = $("#editorreference").val();
						$("textarea[name=reference]",$("#form-content")).val(referencehtml);
					}
				}
			}
		});

		dialogreference.init(function() { 
			$('#editorreference').summernote({
				inheritPlaceholder: true,
				minHeight: 200,
				maxHeight: 200,
				tabDisable: true,
				shortcuts: false,
				toolbar: [
				['para', ['ul']]
				],
				callbacks: {
					onInit: function() {
						setTimeout(function(){
							$('#editorreference').summernote('focus');
						},50)
					}
				}
			}); 

			// $("#editorreference").summernote("removeModule", "autoLink");

			if ($("textarea[name=reference]",$("#form-content")).val().length < 1) {
				$("#editorreference").summernote('code', '<ul><li></li></ul>');
			}else{
				$("#editorreference").summernote('code', $("textarea[name=reference]",$("#form-content")).val());
			}
		});
	})	
}

function doTitle(){
	$(".do-title").on("click",function(){

		let title_value = $("input[name=title]",$("#form-content")).val();

		let dialogtitle = bootbox.dialog({
			title: "Edit Title",
			message: `
			<div class="my-3">
			<label class="form-label">Skor SEO : <span class="title-seo">-</span></label>
			<input required="" name="title_input" type="text" class="form-control" placeholder="masukan title" value="${title_value}">
			<div class="form-text title-pixel"></div>
			<span style="font-family: arial, sans-serif;font-size: 20px!important;position:absolute;white-space:nowrap;visibility:hidden" class="title-sizer">${title_value}</span>			
			</div>            

			`,
			centerVertical: true,
			closeButton: true,
			buttons: {
				confirm: {
					label: "Simpan",
					className: 'btn-primary',
					callback: function () {
						let value = $("input[name=title_input]").val();
						$("input[name=title]",$("#form-content")).val(value);
					}
				}
			},
			onShown : function(){

				$('input[name=title_input]').focus();

				function titleSEO(){
					$(".title-sizer").text($("input[name=title_input]").val());

					if($(".title-sizer").width() < 250){
						$(".title-seo").html(`<span class='badge bg-warning'>Kurang</span>`);
					}else if($(".title-sizer").width() <= 580 && $(".title-sizer").width() >= 250 ){
						$(".title-seo").html(`<span class='badge bg-success'>Bagus</span>`);
					}else {
						$(".title-seo").html(`<span class='badge bg-danger'>Melebihi Batas</span>`);
					}

					$('.title-pixel').text(`Judul Halaman memiliki ukuran ${parseInt($(".title-sizer").width())} pixel(s)`);
				}

				titleSEO();

				$("input[name=title_input]").on("keyup",function(){
					titleSEO();
				})

			}
		});
	});

	$(".do-title-section").on("click",function(){

		let title_section_value = $("input[name=title_section]",$("#form-content")).val();

		let dialogtitle_section = bootbox.dialog({
			title: "Edit Title Bagian",
			message: `
			<div class="my-3">
			<input required="" name="title_section_input" type="text" class="form-control" placeholder="masukan title bagian" value="${title_section_value}">
			</div>            
			`,
			centerVertical: true,
			closeButton: true,
			buttons: {
				confirm: {
					label: "Simpan",
					className: 'btn-primary',
					callback: function () {
						let value = $("input[name=title_section_input]").val();
						$("input[name=title_section]",$("#form-content")).val(value);
					}
				}
			},
			onShown : function(){
				$('input[name=title_section_input]').focus();
			}
		});
	})	
}

function doDescription(){
	$(".do-description").on("click",function(){

		let description_value = $("input[name=description]",$("#form-content")).val();

		let dialogdescription = bootbox.dialog({
			title: "Edit description",
			message: `
			<label class="form-label">Skor SEO : <span class="description-seo">-</span></label>
			<textarea rows="5" name="description_input" maxlength="150" class="form-control" placeholder="masukan deskripsi">${description_value}</textarea>	
			<div class="form-text description-pixel"></div>
			<span style="font-family: arial, sans-serif;font-size:13px;position:absolute;visibility:hidden;white-space:nowrap;" class="description-sizer">${description_value}</span>			
			<div class="form-text">
			limit karakter
			<span class="countstr">${description_value.length}</span>/150
			</div>
			`,
			centerVertical: true,
			closeButton: true,
			buttons: {
				confirm: {
					label: "Simpan",
					className: 'btn-primary',
					callback: function () {
						let value = $("textarea[name=description_input]").val();
						$("input[name=description]",$("#form-content")).val(value);
					}
				}
			},
			onShown : function(){
				$('textarea[name=description_input]').focus();

				$('textarea[maxlength]').on('keyup blur', function() {
					var maxlength = $(this).attr('maxlength');
					var val = $(this).val();

					$(".countstr").html(val.length);
				});    

				function descriptionSEO(){
					$(".description-sizer").text($("textarea[name=description_input]").val());

					if($(".description-sizer").width() < 400){
						$(".description-seo").html(`<span class='badge bg-warning'>Kurang</span>`);
					}else if($(".description-sizer").width() <= 920 && $(".description-sizer").width() >= 400 ){
						$(".description-seo").html(`<span class='badge bg-success'>Bagus</span>`);
					}else {
						$(".description-seo").html(`<span class='badge bg-danger'>Melebihi Batas</span>`);
					}

					$('.description-pixel').text(`Deskripsi Halaman memiliki ukuran ${parseInt($(".description-sizer").width())} pixel(s)`);
				}

				descriptionSEO();

				$("textarea[name=description_input]").on("keyup",function(){
					descriptionSEO();
				})				
			}
		});
	})
}

function doPermalink(){
	$(".do-permalink").on("click",function(){

		let permalink_value = $("input[name=permalink]",$("#form-content")).val();

		let dialogpermalink = bootbox.dialog({
			title: "Edit Permalink",
			message: `
			<div class="my-3">
			<input required="" name="permalink_input" type="text" class="form-control" placeholder="masukan permalink" value="${permalink_value}">
			</div>            
			`,
			centerVertical: true,
			closeButton: true,
			buttons: {
				confirm: {
					label: "Simpan",
					className: 'btn-primary',
					callback: function () {
						let value = $("input[name=permalink_input]").val();
						$("input[name=permalink]",$("#form-content")).val(value);
					}
				}
			},
			onShown : function(){
				$('input[name=permalink_input]').focus();
			}
		});
	})
}

function doRobots(){
	$(".do-robots").on("click",function(){

		let robots_value = $("input[name=robots]",$("#form-content")).val();
		(robots_value !== null) ? robots_value.split(',') : null;

		let dialogrobots = bootbox.dialog({
			title: "Edit robots",
			message: `
			<div class="form-check">
			<input name="robots_input" value="noindex" class="form-check-input" type="checkbox" id="checknoindex">
			<label class="form-check-label" for="checknoindex">
			noindex
			</label>
			</div>	
			<div class="form-check">
			<input name="robots_input" value="nofollow" class="form-check-input" type="checkbox" id="checknofollow">
			<label class="form-check-label" for="checknofollow">
			nofollow
			</label>
			</div>       
			`,
			centerVertical: true,
			closeButton: true,
			buttons: {
				confirm: {
					label: "Simpan",
					className: 'btn-primary',
					callback: function () {
						let value = [];
						$("input[name=robots_input]:checked").each(function(){
							value.push($(this).val());
						});
						$("input[name=robots]",$("#form-content")).val(value.join(','));
					}
				}
			},
			onShown : function(){
				$("input[name=robots_input]").each(function(){
					let value = $(this).val();
					if (robots_value.length  > 0 && robots_value.includes(value)) {
						$(this).prop('checked', true);
					}
				});
			}
		});
	})
}

function doPassword(){
	$(".do-password").on("click",function(){

		let password_value = $("input[name=password]",$("#form-content")).val();

		let dialogpassword = bootbox.dialog({
			title: "Edit password",
			message: `
			<div class="my-3">
			<input required="" name="password_input" type="text" class="form-control" placeholder="masukan password" value="${password_value}">
			</div>            
			`,
			centerVertical: true,
			closeButton: true,
			buttons: {
				confirm: {
					label: "Simpan",
					className: 'btn-primary',
					callback: function () {
						let value = $("input[name=password_input]").val();
						$("input[name=password]",$("#form-content")).val(value);
					}
				}
			},
			onShown : function(){
				$('input[name=password_input]').focus();
			}
		});
	})
}