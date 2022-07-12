// filter search
$(".filter-search").on("submit", function(e){
	e.preventDefault();
	const limit = $(".filter-limit").val();
	const search = $("input[name=searchtopics]",$(this)).val();
	filterTopic(limit,search);
});

function debounce(callback, wait) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(function () { callback.apply(this, args); }, wait);
	};
}

$(".filter-input").on("keyup search", debounce(() => {
	$(".filter-search").submit();  
},1000));

// filter limit
$('.filter-limit').on('change', function() {

	const limit = this.value;
	const search  = $("input[name=searchtopics]",$('.filter-search')).val();
	filterTopic(limit,search);
});

function filterTopic(limit,search) {
	$.post(current_url + `/topic-filter?limit=${limit}&search=${search}`)
	.done(function(data){
		if (!data.status) {
			ShowToast(data.response, true, 5000);                    			
		}else{
			$("#list-topic").html(data.response.html);
			$("#profile-topic-count").html(data.response.count);
			// reinit event
			editTopic();
			deleteTopic();
		}
	})
	.fail(function(xhr, statusText, errorThrown) {
		let err_message = (xhr.responseJSON) ? xhr.responseJSON.response : statusText;
		ShowToast(err_message, true, 3000);                    
	}); 
}