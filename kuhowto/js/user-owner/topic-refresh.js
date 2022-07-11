function refreshTopic() {
	const search  = $("input[name=searchtopics]",$('.filter-search')).val();
	const limit = $(".filter-limit").val();
	filterTopic(limit,search);
}