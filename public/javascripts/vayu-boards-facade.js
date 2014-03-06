define(["vayu-prereqs",
		"models/vayu-boards-app",
		"collections/boards",
		"collections/cards",
		"collections/vtodos",
		"views/new-board-form",
		"views/new-card-form",
		"views/boards-view",
		"views/cards-view",
		"views/vtodos-view"], function(VayuPrereqs, VayuApp, Boards, Cards, Vtodos, NewBoardFormView, NewCardFormView, BoardsView, CardsView, VtodosView) {

	// TODO: make storageManager asynchronous so that it is compatible with remoteStorageManager
	var storageManager = {
		getBoards : function() {
			var vayu_boards = this.getBoardsFromLocal();
            //FIXME: had to do this check because localStorage.removeItem is setting the value as undefined!
			if (vayu_boards === "undefined" || !vayu_boards) {
				vayu_boards = new Boards();
			} else {
				vayu_boards = new Boards(JSON.parse(vayu_boards));
			}
			return vayu_boards;
		},

		getBoardsFromLocal : function() {
			var vayu_boards = localStorage.getItem("vayu_boards");
            if (vayu_boards) {
				return vayu_boards;
			}
			return null;
		},

		storeBoards : function() {
			localStorage.setItem("vayu_boards", this.encodeBoardsForStorage());
		},

		clearBoards : function() {
			localStorage.removeItem("vayu_boards");
		},

		encodeBoardsForStorage : function() {
			if (window.boards_coll === null) {
				return;
			}
			return JSON.stringify(window.boards_coll.models);
		},

		getCards : function() {
			var vayu_cards = this.getCardsFromLocal();
			if (vayu_cards === "undefined" || !vayu_cards) {
				vayu_cards = new Cards();
			} else {
				vayu_cards = new Cards(JSON.parse(vayu_cards));
			}
			return vayu_cards;
		},

		getCardsFromLocal : function() {
			var vayu_cards = localStorage.getItem("vayu_cards");
			if (vayu_cards) {
				return vayu_cards;
			}
			return null;
		},

		storeCards : function() {
			localStorage.setItem("vayu_cards", this.encodeCardsForStorage());
		},

		clearCards : function() {
			localStorage.removeItem("vayu_cards");
		},

		encodeCardsForStorage : function() {
			if (window.all_cards === null) {
				return;
			}
			return JSON.stringify(window.all_cards.models);
		},

		getVtodos : function() {
			var vayu_todos = this.getVtodosFromLocal();
			if (vayu_todos === "undefined" || !vayu_todos) {
				vayu_todos = new Vtodos();
			} else {
				vayu_todos = new Vtodos(JSON.parse(vayu_todos));
			}
			return vayu_todos;
		},

		getVtodosFromLocal : function() {
			var vayu_todos = localStorage.getItem("vayu_todos");
			if (vayu_todos) {
				return vayu_todos;
			}
			return null;
		},

		storeVtodos : function() {
			localStorage.setItem("vayu_todos", this.encodeVtodosForStorage());
		},

		clearVtodos : function() {
			localStorage.removeItem("vayu_todos");
		},

		encodeVtodosForStorage : function() {
			if (window.all_vtodos === null) {
				return;
			}
			return JSON.stringify(window.all_vtodos.models);
		},

		saveAll : function() {
			this.storeBoards();
			this.storeCards();
			this.storeVtodos();
		},

		clearAll : function() {
			this.clearBoards();
			this.clearCards();
			this.clearVtodos();

			window.boards_coll = null;
			window.all_cards = null;
			window.all_vtodos = null;
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

		$(window).resize(function() {
			refreshDimensions();
		});

		$("#logo-small").mouseenter(function()
		{
			//FIXME: absolute value being used. Won't work for responsive layout
			$("#logo-small").animate({
				'padding-left': 25
			}, 150)
		});

		$("#logo-small").mouseleave(function()
		{
			$("#logo-small").animate({
				'padding-left': 250
			}, 150)
		});

		/*$(window).unload(function() {
			storageManager.saveAll();
		});*/
		
		vayu_app = new VayuApp();

		//TODO: see if we can remove these from window
		window.boards_coll = new Boards();
		window.cards_coll = new Cards();
		window.vtodos_coll = new Vtodos();

		card_form_view = new NewCardFormView();
		board_form_view = new NewBoardFormView();
		boards_view = new BoardsView();
	};

	var refreshDimensions = function() {
		//TODO: better way?
		$("#toolbar").css('width', $(document).width() - 310);
		$(".grid-bg").css('width', $(document).width() - 341);
		$(".grid-bg").addClass('container-shadow');
	};
	
	window.appFacade = {
		initialize : initialize,
		refreshDimensions : refreshDimensions
	};
});