define([], function()
{
	//dodo item model
	var DodoItem = Backbone.Model.extend({
		defaults : {
			id : "-",
			title : "-",
			done : false
		}
	});
	
	return DodoItem;
});