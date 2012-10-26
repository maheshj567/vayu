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
			this.collection = window.boards_coll;

			this.collection.on("reset", this.renderBoards, this);
			this.collection.on("add", this.addBoard, this);
			this.collection.on("remove", this.removeBoard, this);

			this.renderBoards();

			window.all_dodos = storageManager.getDodos();
			window.all_cards = storageManager.getCards();

			window.cards_coll = new Cards();
			window.cards_view = new CardsView();
			this.selectFirstBoard();
		},

		renderBoards : function() {
			this.$el.find("li").remove();

			if (this.collection.length != 0) {
				//TODO clean this up
				$("#right-toolbar").css("visibility", "visible");
				$("#paper-fold").css("visibility", "visible");
			}

			_.each(boards_coll.models, function(item) {
				this.renderBoardItem(item);
			}, this);
		},

		addBoard : function() {
			this.renderBoardItem(arguments[0], true);

			$("#right-toolbar").css("visibility", "visible");
			$("#paper-fold").css("visibility", "visible");
		},

		removeBoard : function() {
			if (this.collection.length == 0) {
				$("#right-toolbar").css("visibility", "hidden");
				$("#paper-fold").css("visibility", "hidden");
			}
		},

		renderBoardItem : function(item, switchTo) {
			var boardItemView = new BoardItemView({
				model : item
			});
			this.$el.append(boardItemView.render().el);
			if (switchTo == true) {
				boardItemView.switchTo();
			}
		},

		selectBoard : function(e) {
			var ci = window.dodo_app.get("selectedboard");
			if (ci) {
				var currentitem = $("#board_" + window.dodo_app.get("selectedboard").get("id"));
				$(currentitem).removeClass("selected");
			}

			var boarditem = $(e.currentTarget);
			$(boarditem).addClass("selected");
			$("body").scrollTop(0);
			e.preventDefault();
		},
		selectFirstBoard : function() {
			var firstitem = $(this.$el).find("li")[0];
			$(firstitem).addClass("selected");
		},
		createBoard : function(boardname) {
			this.collection.add(boards_coll.createBoard(boardname));
		},
		addCardToCurrentBoard : function(cid) {
			var bid = window.dodo_app.get("selectedboard").get("id");

			var boardmodel = _.find(this.collection.models, function(item) {
				return item.get("id") == bid;
			});

			//TODO handling for null board
			var cards = boardmodel.get("cards");
			if (cards.indexOf(cid) == -1) {
				cards.push(cid);
				boardmodel.set("cards", cards);
			}
		}
	});
	
	return BoardsView;
});