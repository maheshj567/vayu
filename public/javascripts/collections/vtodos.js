define(["models/dodo-item"], function(VtodoItem)
{
	//dodo collection
	var Vtodos = Backbone.Collection.extend({
		model : VtodoItem,
		
		createDodo : function(vtodotitle)
		{
			var date = new Date();
			var did = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			var vtodo = new VtodoItem({
                id : did,
				title : vtodotitle
			});
			
			return vtodo;
		},
		
		createPlaceHolder : function()
		{
			var vtodo = new VtodoItem({
				id : "new",
				title : "&lt;!-- New todo --&gt;"
			});
			return vtodo;
		}
	});
	
	return Vtodos;
});