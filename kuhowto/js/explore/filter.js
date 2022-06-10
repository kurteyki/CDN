
$("#filter-topik").on("click",function(e){

	const button = $(this);

	ShowToast(lang.readFilter, false);

	$.getJSON(base_url + `explore/filter`)
	.done(function(read){

		if (!read.status) {
			ShowToast(read.response, false);
			return false;
		}

		removeToast()

		let html = '';
		if (read.response.length < 1) {
			html += `
			Tidak ada kategori yang bisa dimunculkan
			`;
		}else{			
			html += `<div class='row g-3'>`;
			$.each(read.response,function(idx,val){
				html += `
				<div class="col-auto">
				<a class="btn btn-outline-primary border w-100" href="${base_url + "explore?c=" + val}">${val}</a>
				</div>
				`;
			})
			html += `</div>`;
		}


		var dialog = bootbox.dialog({
			title: `Filter berdasarkan kategori`,
			message: html,
			centerVertical: true,
			closeButton: true,
			size: 'medium',
			onShown : function(){
			}
		});		

	})
	.fail(function(xhr, statusText, errorThrown) {
		ShowToast(statusText, false);                    
	}); 
})	