define(["models/vtodo-item"], function(VtodoItem)
{
	//vtodo collection
	var Vtodos = Backbone.Collection.extend({
		model : VtodoItem,

		url : function() {
			return '/vtodos';
		},
		
		createVtodo : function(vtodotitle, boarId, cardId)
		{
			var date = new Date();
			var tid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			var vtodo = new VtodoItem({
                lid : tid,
                bid : boarId,
                cid : cardId,
				title : vtodotitle
			});

			vtodo.save({}, {success: function(model, response, options)
			{
				console.log("success saving vtodo...")
			}, error: function(model, xhr, options)
			{
				alert("there was a problem saving the vtodo \"" + model.get('name') + "\"");
			}});
			
			return vtodo;
		},
		
		createPlaceHolderModel : function()
		{
			var vtodo = new VtodoItem({
				lid : "new",
				title : "&lt;!-- New todo --&gt;"
			});
			return vtodo;
		}
	});
	
	return Vtodos;
});