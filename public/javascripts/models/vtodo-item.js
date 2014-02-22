define([], function()
{
	//todo item model
	var VtodoItem = Backbone.Model.extend({
		
		defaults : {
			lid : function()
			{
				var date = new Date();
				return date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			}(),
			bid : "-",
			//TODO rename cid as it is used internally by backbonejs
			cid : "-",
			title : "-",
			done : false
		},

		//using urlRoot instead of url to bring the collection into context (for delete functionality, if only url is defined, the id is not being sent)
		urlRoot : function() {
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
	
	return VtodoItem;
});