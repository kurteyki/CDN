function refreshContent(sort = false)
{
	$.getJSON(current_url + 'refresh')
	.done(function(data){
		if (data.status) {
			$("#list-content").html(data.response);

			// re init DOM when loaded
			editSection();
			deleteSection();

			createContent();
			editContent();
			deleteContent();
		}else{
			ShowToast(data.response, false);                    			
		}
	})
	.fail(function(xhr, statusText, errorThrown) {
		let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
		ShowToast(err_message, true, 3000);                       
	});    
}