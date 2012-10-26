define([], function()
{
	//card item model
	var CardItem = Backbone.Model.extend({
		defaults : {
			id : "-",
			name : "-",
			dodos : []
		}
	});
	
	return CardItem;
});