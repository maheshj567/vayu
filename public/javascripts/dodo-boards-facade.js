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
            //FIXME: had to do this check because localStorage.removeItem is setting the value as undefined!
			if (dodo_boards === "undefined" || !dodo_boards) {
				dodo_boards = new Boards();
			} else {
				dodo_boards = new Boards(JSON.parse(dodo_boards));
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
			if (window.boards_coll === null) {
				return;
			}
			return JSON.stringify(window.boards_coll.models);
		},

		getCards : function() {
			var dodo_cards = this.getCardsFromLocal();
			if (dodo_cards === "undefined" || !dodo_cards) {
				dodo_cards = new Cards();
			} else {
				dodo_cards = new Cards(JSON.parse(dodo_cards));
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
			if (window.all_cards === null) {
				return;
			}
			return JSON.stringify(window.all_cards.models);
		},

		getDodos : function() {
			var dodo_dodos = this.getDodosFromLocal();
			if (dodo_dodos === "undefined" || !dodo_dodos) {
				dodo_dodos = new Dodos();
			} else {
				dodo_dodos = new Dodos(JSON.parse(dodo_dodos));
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
			if (window.all_dodos === null) {
				return;
			}
			return JSON.stringify(window.all_dodos.models);
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
	};

	var initialize = function() {
		$("#selected-board").click(function() {
			$("body").scrollTop(0);
		});
		
		window.storageManager = storageManager;
		window.refreshDimensions = refreshDimensions;

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
		
		dodo_app = new DodoApp();

		boards_coll = storageManager.getBoards();

		card_form_view = new NewCardFormView();
		board_form_view = new NewBoardFormView();
		boards_view = new BoardsView();
	};

	var refreshDimensions = function() {
		$("#right-toolbar").css('width', 10);
		$("#right-toolbar").css('width', $(document).width() - 452);
	};
	
	window.appFacade = {
		initialize : initialize,
		refreshDimensions : refreshDimensions
	};
});