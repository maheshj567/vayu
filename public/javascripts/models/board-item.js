define([], function()
{
	//board item model
	var BoardItem = Backbone.Model.extend({
		defaults : {
			id : "-",
			//'id' changed to '_id' to work with backbone's isNew() functionality for saving new boards
			_id : "",
			name : "-",
			cards : []
		},

		url : function() {
			return '/boards';
		},

		parse: function(response) {
		    response.name = response.n;

		    delete response.n;

		    return response;
		}
	});

	
	return BoardItem;
});