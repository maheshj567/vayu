define([],function()
{
	//Override jQuery addclass to dispatch custom event
	var originalAddClassMethod = jQuery.fn.addClass;

	jQuery.fn.addClass = function() {
		var result = originalAddClassMethod.apply(this, arguments);
		$(this).trigger("CSSClassChanged", arguments[0]);
		return result;
	};
    
	//change templating characters for underscore
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};
	
	return {};
});