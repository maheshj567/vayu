define(["views/board-item-view",
		"collections/cards",
		"views/cards-view"], function(BoardItemView, Cards, CardsView)
{
	var BoardsView = Backbone.View.extend({
		el : $("#boards-list"),

		events : {
			"click li" : "selectBoard"
		},

		initialize : function() {
			// REF: pass bords_coll to the constructor
			this.collection = window.boards_coll;

			this.collection.on("reset", this.renderBoards, this);
			this.collection.on("add", this.addBoard, this);
			this.collection.on("remove", this.removeBoard, this);

			this.collection.fetch({reset: true});
		},

		renderBoards : function() {
			var boards = this.$el.find("li");
			this.$el.find("li").remove();

			// REF: this should be part of an "AppView" class!
			if (this.collection.length != 0) {
				//TODO clean this up
				$("#add-card-btn").css("display", "inherit");
			}

			_.each(boards_coll.models, function(item) {
				this.renderBoardItem(item, false);
			}, this);

			// check if first load and if yes, select the first board
			// TODO: remember last selected board and select that
			// REF: remove this condition because renderBoards is only called once!
			if(boards.length == 0){
				// window.all_vtodos = storageManager.getVtodos();

				window.cards_coll = new Cards();
				window.cards_view = new CardsView();

				this.selectFirstBoard();
			}
		},

		addBoard : function() {
			this.renderBoardItem(arguments[0], true);
			// REF: cleanup
			$("#add-card-btn").css("display", "inherit");
		},

		removeBoard : function() {
			// TODO: check this when remove board functionality is developed
			// REF: cleanup
			if (this.collection.length == 0) {
				$("#add-card-btn").css("display", "none");
			}
		},

		renderBoardItem : function(item, switchTo) {
			// REF: move this logic into some kind of reusable listmanager class
			var boardItemView = new BoardItemView({
				model : item
			});
			this.$el.append(boardItemView.render().el);
			if (switchTo == true) {
				boardItemView.switchTo();
			}
		},

		selectBoard : function(e) {
			// ref: integrate backbone js router
			var ci = window.vayu_app.get("selectedboard");
			if (ci) {
				// not selecting if board is already selected
				// ref: abstract out
				if('board_' + window.vayu_app.get("selectedboard").get("lid") == $(e.currentTarget).attr('id'))
				{
					return;
				}
				var currentitem = $("#board_" + window.vayu_app.get("selectedboard").get("lid"));
				$(currentitem).removeClass("selected");
			}

			var boarditem = $(e.currentTarget);
			// ref: this class toggling and other UI stuff should be reactive
			$(boarditem).addClass("selected");
			$("body").scrollTop(0);
			e.preventDefault();
		},
		
		selectFirstBoard : function() {
			// ref: instead of changing the view, change the model and react
			var firstitem = $(this.$el).find("li")[0];
			$(firstitem).addClass("selected");
		},

		createBoard : function(boardname) {
			this.collection.add(boards_coll.createBoard(boardname));
		},

		addCardToCurrentBoard : function(cid) {
			// ref: selected board should be part of the board's data logic
			var bid = window.vayu_app.get("selectedboard").get("lid");

			var boardmodel = _.find(this.collection.models, function(item) {
				return item.get("lid") == bid;
			});

			// TODO handling for null board
			var cards = boardmodel.get("cards");
			if (cards.indexOf(cid) == -1) {
				cards.push(cid);
				boardmodel.set("cards", cards);

				// ref: don't like this here. Make some kind of sync manager that handles changes to models. This could be a new backbone middleware
				// TODO: optimize update with patch: true
				boardmodel.save({'cards': cards}, {sucess: function(model, response, options){
					console.log("success saving model...");
				}, error: function(model, xhr, options){
					console.log("error saving model...");
				}}); 
			}
		}
	});
	
	return BoardsView;
});