define([], function()
{
	var VayuApp = Backbone.Model.extend({
		defaults : {
			selectedboard : null
		}
	});
	
	return VayuApp;
});