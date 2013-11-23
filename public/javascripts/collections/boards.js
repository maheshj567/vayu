define(["models/board-item"], function(BoardItem)
{
	//board collection
	var Boards = Backbone.Collection.extend({
		model : BoardItem,
		
		createBoard : function(name)
		{
			var date = new Date();
			var bid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			var board = new BoardItem({
				id : bid,
				name : name
			});
			return board;
		}
	});
	
	return Boards;
});