define([], function()
{
	//dodo item model
	var DodoItem = Backbone.Model.extend({
		
		defaults : {
			lid : function()
			{
				var date = new Date();
				return date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			}(),
			bid : "-",
			cid : "-",
			title : "-",
			done : false
		},

		url : function() {
			return '/vtodos';
		},

		parse: function(response) {

			response.id = response._id;
		    response.title = response.t;
		    response.done = response.d ? true : false

		    delete response.t;
		    delete response.d;

		    return response;
		}
	});
	
	return DodoItem;
});