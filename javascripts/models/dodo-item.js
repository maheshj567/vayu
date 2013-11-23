define([], function()
{
	//dodo item model
	var DodoItem = Backbone.Model.extend({
		
		defaults : {
			id : function()
			{
				var date = new Date();
				return date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			}(),
			title : "-",
			done : false
		}
	});
	
	return DodoItem;
});