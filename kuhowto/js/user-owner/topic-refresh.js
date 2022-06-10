function refreshTopic()
{
	// check if filter is off
	const search  = $("input[name=searchtopics]",$('.filter-search')).val();
	const limit = $(".filter-limit").val();

	filterTopic(limit,search);
}