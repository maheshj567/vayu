define([], function()
{
	var BoardItem = Backbone.Model.extend({
		defaults : {
			id : "-",
			name : "-",
			cards : []
		}
	});
	
	return BoardItem;
});