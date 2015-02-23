define([], function()
{
	//card item model
	var CardItem = Backbone.Model.extend({
		
		defaults : {
			lid : function(){
				var date = new Date();
				var cid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
				return cid;
			}(),
			bid : "",
			name : "-",
			vtodos : []
		},

		urlRoot : function() {
			return '/cards';
		},

		parse: function(response) {

			response.id = response._id;
		    response.name = response.n;

		    delete response.n;

		    return response;
		}
	});
	
	return CardItem;
});