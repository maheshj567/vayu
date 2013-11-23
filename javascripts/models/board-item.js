define([], function()
{
	//board item model
	var BoardItem = Backbone.Model.extend({
		defaults : {
			id : "-",
			name : "-",
			cards : []
		}
	});
	
	return BoardItem;
});