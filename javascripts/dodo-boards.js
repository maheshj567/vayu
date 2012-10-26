define(["dodo-prereqs",
		"models/dodo-boards-app",
		"collections/boards",
		"collections/cards",
		"collections/dodos",
		"views/new-board-form",
		"views/new-card-form",
		"views/boards-view",
		"views/cards-view",
		"views/dodos-view"], function(DodoPrereqs, DodoApp, Boards, Cards, Dodos, NewBoardFormView, NewCardFormView, BoardsView, CardsView, DodosView) {

	var storageManager = {

		getBoards : function() {
			var dodo_boards = this.getBoardsFromLocal();
			if (!dodo_boards) {
				dodo_boards = new Boards();
			} else {
				dodo_boards = new Boards(eval(dodo_boards));
			}
			return dodo_boards;
		},

		getBoardsFromLocal : function() {
			var dodo_boards = localStorage.getItem("dodo_boards");
			if (dodo_boards) {
				return dodo_boards;
			}
			return null;
		},

		storeBoards : function() {
			localStorage.setItem("dodo_boards", this.encodeBoardsForStorage());
		},

		clearBoards : function() {
			localStorage.removeItem("dodo_boards");
		},

		encodeBoardsForStorage : function() {
			if (window.boards_coll == null) {
				return;
			}
			var boardsstr = "[";
			_.each(window.boards_coll.models, function(item) {
				boardsstr += '{"id":"' + item.get("id") + '","name":"' + item.get("name") + '","cards":[';
				var carddis = item.get("cards");
				_.each(carddis, function(id) {
					boardsstr += '"' + id + '",';
				});
				if (carddis.length != 0) {
					boardsstr = boardsstr.substring(0, boardsstr.length - 1);
				}
				boardsstr += "]},"
			});
			if (window.boards_coll.length != 0) {
				boardsstr = boardsstr.substring(0, boardsstr.length - 1);
			}
			boardsstr += "]";
			return boardsstr;
		},

		getCards : function() {
			var dodo_cards = this.getCardsFromLocal();
			if (!dodo_cards) {
				dodo_cards = new Cards();
			} else {
				dodo_cards = new Cards(eval(dodo_cards));
			}
			return dodo_cards;
		},

		getCardsFromLocal : function() {
			var dodo_cards = localStorage.getItem("dodo_cards");
			if (dodo_cards) {
				return dodo_cards;
			}
			return null;
		},

		storeCards : function() {
			localStorage.setItem("dodo_cards", this.encodeCardsForStorage());
		},

		clearCards : function() {
			localStorage.removeItem("dodo_cards");
		},

		encodeCardsForStorage : function() {
			if (window.all_cards == null) {
				return;
			}
			var cardsstr = "[";
			_.each(window.all_cards.models, function(item) {
				cardsstr += '{"id":"' + item.get("id") + '","name":"' + item.get("name") + '","dodos":[';
				var dodoids = item.get("dodos");
				_.each(dodoids, function(id) {
					cardsstr += '"' + id + '",';
				});
				if (dodoids.length != 0) {
					cardsstr = cardsstr.substring(0, cardsstr.length - 1);
				}
				cardsstr += "]},"
			});
			if (window.all_cards.length != 0) {
				cardsstr = cardsstr.substring(0, cardsstr.length - 1);
			}
			cardsstr += "]";
			return cardsstr;
		},

		getDodos : function() {
			var dodo_dodos = this.getDodosFromLocal();
			if (!dodo_dodos) {
				dodo_dodos = new Dodos();
			} else {
				dodo_dodos = new Dodos(eval(dodo_dodos));
			}
			return dodo_dodos;
		},

		getDodosFromLocal : function() {
			var dodo_dodos = localStorage.getItem("dodo_dodos");
			if (dodo_dodos) {
				return dodo_dodos;
			}
			return null;
		},

		storeDodos : function() {
			localStorage.setItem("dodo_dodos", this.encodeDodosForStorage());
		},

		clearDodos : function() {
			localStorage.removeItem("dodo_dodos");
		},

		encodeDodosForStorage : function() {
			if (window.all_dodos == null) {
				return;
			}
			var dodosstr = "[";
			_.each(window.all_dodos.models, function(item) {
				dodosstr += '{"id":"' + item.get("id") + '","title":"' + item.get("title") + '","done":' + item.get("done") + '},';
			});
			if (all_dodos.length != 0) {
				dodosstr = dodosstr.substring(0, dodosstr.length - 1);
			}
			dodosstr += "]";
			return dodosstr;
		},

		saveAll : function() {
			this.storeBoards();
			this.storeCards();
			this.storeDodos();
		},

		clearAll : function() {
			this.clearBoards();
			this.clearCards();
			this.clearDodos();

			window.boards_coll = null;
			window.all_cards = null;
			window.all_dodos = null;
		}
	}

	var initialize = function() {
		$("#selected-board").click(function() {
			$("body").scrollTop(0);
		});
		
		window.storageManager = storageManager;
		window.refreshDimensions = refreshDimensions;
		
		dodo_app = new DodoApp();

		boards_coll = storageManager.getBoards();

		card_form_view = new NewCardFormView();
		board_form_view = new NewBoardFormView();
		boards_view = new BoardsView();

		refreshDimensions();

		$('#add-btn').popbox();
		$('#add-card-btn').popbox({
			'position' : 'br'
		});

		$('#reset-btn').click(function() {
			storageManager.clearAll();
			window.location.reload();
			return false;
		});

		$(window).resize(function() {
			refreshDimensions();
		});

		$(window).unload(function() {
			storageManager.saveAll();
		});
	}

	var refreshDimensions = function() {
		// $("#sidebar").css('height', 10);
		// if ($(window).height() > $(document).height()) {
		// $("#sidebar").css('height', $(window).height());
		// } else {
		// $("#sidebar").css('height', $(document).height());
		// }
		$("#right-toolbar").css('width', 10);
		$("#right-toolbar").css('width', $(document).width() - 452);
	}
	
	window.dodoBoards = {
		initialize : initialize,
		refreshDimensions : refreshDimensions
	} 

});