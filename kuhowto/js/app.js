/* show loading bar when click or submit */
['turbo:click', 'turbo:submit-start'].forEach(function(e) {
	window.addEventListener(e, function(){
		Turbo.navigator.delegate.adapter.showProgressBar();     
	});
});

/* disable form input & button when submitted */
document.addEventListener("turbo:submit-start", ({ target }) => {
	for (const field of target.elements) {
		field.disabled = true
	}
});

document.addEventListener("turbo:load", function() {
	/* load script after turbolink loaded page */

	var base_url = $("meta[name='base_url']").attr('content'),
	current_url = $("meta[name='current_url']").attr('content'),
	is_page = $("meta[name='is_page']").attr('content');

	/* footer collapse */
	var footerCollapse = false;
	if (!footerCollapse) {
		$("#footerToggle").html('<i class="bi bi-plus-square"></i>');		
		$("#footerToggle").on("click", function() {
			var button = $(this),
			collapseFooter = $("#collapseFooter");
			if (collapseFooter.hasClass('d-none')) {
				collapseFooter.removeClass('d-none');
				button.html('<i class="bi bi-dash-square"></i>');
			}else{
				collapseFooter.addClass('d-none');
				button.html('<i class="bi bi-plus-square"></i>');
			}      
		});     
		footerCollapse = true;
	}


	/* run on page topic */
	if (is_page == 'topic') { 

		/* Table of content show hide  */
		$(".toc_toggle").on("click",function(){
			var active_text = $(this).text();
			$(this).text($(this).data('text'));
			$(this).data('text', active_text);
		})	

		/* imagezoom */
		imageZoom({
			selector: '#post-content img'
		});			

		/* hljs */
		hljs.addPlugin(new CopyButtonPlugin());
		hljs.highlightAll();
		hljs.initLineNumbersOnLoad();

		/* section */
		if ($(".sidepost-inner").length > 0) { 

			var stickySidebar = new StickySidebar('.sidepost-inner', {
				topSpacing: 0,
				bottomSpacing: 10
			});

			/* clone section */
			var sectionHasClone = false;
			$(".section-mobile").on("click", function(){
				if (!sectionHasClone) {
					$(".section-copy").html($(".topic-section").clone());
					sectionHasClone = true;
				}
			})
		}

		/* load disqus */
		disqusLoad();	 
	}	    	

}); 

function disqusLoad(){
	let postContent = $("#post-content"), commenthasLoaded = 0;
	if (postContent.length != 0) {	
		$(window).on("scroll", function() {
			var height = postContent.outerHeight();
			if(($(window).scrollTop() + $(window).height()) >= height && height != 0 && !commenthasLoaded) {

				/* set hasLoaded > prevent call duplicate */
				commenthasLoaded = 1;

				/* reset disqus if has loaded */
				if (typeof DISQUS != 'undefined') {
					$("#disqus_spinner").remove();
					DISQUS.reset({
						reload: true,
						config: function () {  
							this.page.identifier = topic_url;  
							this.page.url = topic_url;
						}
					});
				}else{		
					/* disqus comment */
					$.ajax({
						type: "GET",
						url: "https://kurteyki.disqus.com/embed.js",
						dataType: "script",
						cache: true,
						success: function(output) {	
							$("#disqus_spinner").remove();
						}
					});
				}


			}
		});						
	}
}

/* spinner */
var xsetting = {
	spinner : ` <div class="spinner-border spinner-border-sm button-spinner" role="status"></div>`
}

function ShowToast(message, autohide, delay, append) {

	var config = '';

	if (typeof autohide == "boolean") {
		config += `data-bs-autohide="${autohide}"`;
	}

	if (typeof delay == "number") {
		config += `data-bs-delay="${delay}"`;
	}

	var html = '';

	if (!append) {
		html += `<div class="toast-container position-fixed bottom-0 start-0 p-3" style="z-index: 10000">
		`;
	}

	html += `
	<div class="livetoast toast align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" ${config}>
	<div class="d-flex">
	<div class="toast-body">${message}</div>
	<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
	</div>
	</div>
	`;

	if (!append) {
		html += `
		</div>`
	}

	if (typeof append == "boolean" && append == true) {
		$(".toast-container").append(html);
	}else{
		$("#fortoast").html(html);
	}

	$(".livetoast").toast("show");
}

function removeToast(){
	$("#fortoast").html('');
}

function copyThis(data, mess) {
	$("body").append(`<textarea id="gocopy">${data}</textarea>`);
	$("#gocopy").select();
	document.execCommand('copy');
	$("#gocopy").remove();
	ShowToast(lang.copyed + mess, true, 1000);
}
