define([], function()
{
	var DodoApp = Backbone.Model.extend({
		defaults : {
			selectedboard : null
		}
	});
	
	return DodoApp;
});