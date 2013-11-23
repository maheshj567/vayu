define(["models/dodo-item"], function(DodoItem)
{
	//dodo collection
	var Dodos = Backbone.Collection.extend({
		model : DodoItem,
		
		createDodo : function(dodotitle)
		{
			var dodo = new DodoItem({
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