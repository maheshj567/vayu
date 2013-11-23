( function($) {
	var DummyView = Backbone.View.extend({
		el : $("#board-form"),
		
		_sup : this,
		
		initialize : function()
		{
			console.log(this._sup);
		},

		events : {
			"submit" : "formSubmitted"
		},

		formSubmitted : function(e) {
			var value = $("#board-form #board-name").val();
			if(value != "")
			{
				window.boards_view.createBoard(value);
				$("#board-form #board-name").val("");
			}
			return false;
		}
	});
	
	var dummy = new DummyView();
}(jQuery));