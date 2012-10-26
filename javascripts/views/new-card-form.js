define([], function()
{
	var NewCardFormView = Backbone.View.extend({
		el : $("#card-form"),

		events : {
			"submit" : "formSubmitted"
		},

		formSubmitted : function(e) {
			var value = $("#card-form #card-name").val();
			if (value != "") {
				window.cards_view.createCard($("#card-form #card-name").val());
				$("#card-form #card-name").val("")
			}
			return false;
		}
	});
	
	return NewCardFormView;
});