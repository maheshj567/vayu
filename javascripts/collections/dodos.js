define(["models/dodo"], function(DodoItem)
{
	//dodo collection
	var Dodos = Backbone.Collection.extend({
		model : DodoItem,
		
		createDodo : function(dodotitle)
		{
			var date = new Date();
			var did = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			var dodo = new DodoItem({
				id : did,
				title : dodotitle
			});
			
			return dodo;
		},
		
		createPlaceHolder : function()
		{
			var dodo = new DodoItem({
				id : "new",
				title : "&lt;!-- New Do-do --&gt;"
			});
			return dodo;
		}
	});
	
	return Dodos;
});