define(["models/board-item"], function(BoardItem)
{
	//board collection
	var Boards = Backbone.Collection.extend({
		model : BoardItem,

		url : function() {
			//FIXME: app routes already has this url. Not great to put it here again
			return '/boards';
		},
		
		createBoard : function(name)
		{
			var date = new Date();
			var bid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			var board = new BoardItem({
				lid : bid,
				name : name,
				cards : []
			});

			//TODO: separate persisting if it makes sense
			//TODO: remove wait once all asynchronous stuff is sorted out
			//FIXME: wait: true doesn't seem to work
			board.save({}, {success: function(model, response, options)
			{
				console.log("success saving board...");
			}, error: function(model, xhr, options)
			{
				// handler for non 200 response
				alert("there was a problem saving the board \"" + model.get('name') + "\"");
			}});

			return board;
		}
	});
	
	return Boards;
});