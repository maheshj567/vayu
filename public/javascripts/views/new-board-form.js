define([], function()
{
	var NewBoardFormView = Backbone.View.extend({
		el : $("#board-form"),

		events : {
			"submit" : "formSubmitted"
		},

		formSubmitted : function(e) {
			var value = $("#board-form #board-name").val();
			if (value != "") {
				window.boards_view.createBoard(value);
				$("#board-form #board-name").val("");
			}
			return false;
		}
	});
	
	return NewBoardFormView;
});