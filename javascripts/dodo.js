( function($) {

		//Override jQuery addclass to dispatch custom event
		var originalAddClassMethod = jQuery.fn.addClass;

		jQuery.fn.addClass = function() {
			var result = originalAddClassMethod.apply(this, arguments);
			$(this).trigger("CSSClassChanged", arguments[0]);
			return result;
		}
		//change templating characters for underscore
		_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g
		};

		//the app model
		var DodoApp = Backbone.Model.extend({
			defaults : {
				selectedboard : null
			}
		});

		//board item model
		var BoardItem = Backbone.Model.extend({
			defaults : {
				id : "-",
				name : "-",
				cards : []
			}
		});

		//board collection
		var Boards = Backbone.Collection.extend({
			model : BoardItem
		});

		//card item model
		var CardItem = Backbone.Model.extend({
			defaults : {
				id : "-",
				name : "-",
				dodos : []
			}
		});

		//card collection
		var Cards = Backbone.Collection.extend({
			model : CardItem
		});

		//dodo item model
		var DodoItem = Backbone.Model.extend({
			defaults : {
				id : "-",
				title : "-",
				done : false
			}
		});

		//dodo collection
		var Dodos = Backbone.Collection.extend({
			model : DodoItem
		});

		var NewBoardFormView = Backbone.View.extend({
			el : $("#board-form"),

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

		var NewCardFormView = Backbone.View.extend({
			el : $("#card-form"),

			events : {
				"submit" : "formSubmitted"
			},

			formSubmitted : function(e) {
				var value = $("#card-form #card-name").val();
				if(value != "")
				{
					window.cards_view.createCard($("#card-form #card-name").val());
					$("#card-form #card-name").val("")
				}
				return false;
			}
		});

		var BoardItemView = Backbone.View.extend({
			tagName : "li",
			template : _.template($("#board-template").html()),

			events : {
				"CSSClassChanged" : "updateCurrentBoard"
			},

			updateCurrentBoard : function() {
				if ($(this.$el).hasClass("selected")) {
					window.dodo_app.set("selectedboard", this.model);
					$("#selected-board").html(this.model.get("name"));

					var cardids = this.model.get("cards");
					var tempcards = [];
					var item;
					_.each(cardids, function(id) {
						item = _.find(window.all_cards.models, function(item) {
							return item.get("id") == id;
						});
						if (item) {
							tempcards.push(item);
						}
						item = null;
					});
					window.cards_coll.reset(tempcards);
				}
			},

			switchTo : function(s) {
				$(this.$el).trigger("click");
			},

			render : function() {
				this.$el.html(this.template(this.model.toJSON()));
				$(this.$el).attr("id", "board_" + this.model.get("id"));

				return this;
			}
		});

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
				
				if(this.collection.length != 0)
				{
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
				if(this.collection.length == 0)
				{
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
				var date = new Date();
				var bid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
				var board = new BoardItem({
					id : bid,
					name : boardname,
					cards : []
				});
				this.collection.add(board);
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

		var CardItemView = Backbone.View.extend({
			tagName : "div",
			className : "card",
			template : _.template($("#card-template").html()),

			initialize : function() {
				this.dodos_coll = new Dodos();
				this.dodos_coll.on("add", this.handleDodoAdded, this);

				if (window.boards_view) {
					window.boards_view.addCardToCurrentBoard(this.model.get("id"));
				}
			},

			render : function() {
				this.$el.html(this.template(this.model.toJSON()));
				$(this.$el).attr("id", "card_" + this.model.get("id"));

				var list = $(this.$el).find(".dodo-list")[0];
				$(list).attr("id", "dodos_" + this.model.get("id"));

				return this;
			},

			renderDodos : function() {
				var dodoids = this.model.get("dodos");
				var tempdodos = [];
				var item;
				_.each(dodoids, function(id) {
					item = _.find(window.all_dodos.models, function(item) {
						return item.get("id") == id;
					});
					if (item) {
						tempdodos.push(item);
					}
					item = null;
				});
				this.dodos_coll.reset(tempdodos);
				if (!this.dodos_view) {
					this.dodos_view = new DodosView({
						el : $("#dodos_" + this.model.get("id")),
						collection : this.dodos_coll
					});
				}
			},

			handleDodoAdded : function() {
				var item = arguments[0];
				var dodos = this.model.get("dodos");
				dodos.push(item.get("id"));
				this.model.set("dodos", dodos);
			}
		});

		var CardsView = Backbone.View.extend({
			el : $("#cards"),

			initialize : function() {
				this.collection = window.cards_coll;

				this.collection.on("reset", this.renderCards, this);
				this.collection.on("add", this.addCard, this);

				this.renderCards();
			},

			renderCards : function() {
				this.$el.find("div").remove();

				_.each(this.collection.models, function(item) {
					var view = this.renderCardItem(item);
				}, this);
			},

			addCard : function() {
				this.renderCardItem(arguments[0], true);
				refreshDimensions();
			},

			renderCardItem : function(item, switchTo) {
				var cardItemView = new CardItemView({
					model : item
				});
				var view = cardItemView.render();
				this.$el.prepend(view.el);
				view.renderDodos();
				return view;
			},

			createCard : function(cardname) {
				var date = new Date();
				var cid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
				var card = new CardItem({
					id : cid,
					name : cardname,
					dodos : []
				});
				this.collection.add(card, {"at":0});
				window.all_cards.add(card, {"at":0});
			},
		});

		var DodoItemView = Backbone.View.extend({
			tagName : "li",
			className : "dodo",
			template : _.template($("#dodo-template").html()),

			events : {
				"click" : "toggleDone",
				"keydown a" : "handleNewDodo",
				"click a" : "handleAFocusIn",
				"focusout a" : "handleAFocusOut"
			},

			initialize : function() {

			},

			render : function() {
				this.$el.html(this.template(this.model.toJSON()));
				$(this.$el).attr("id", "dodo_" + this.model.get("id"));

				if (this.model.get("done") == true) {
					$(this.$el).addClass("done-dodo");
				}

				return this;
			},

			toggleDone : function(e) {
				if (!$(this.$el).hasClass("new-dodo")) {
					$(this.$el).toggleClass("done-dodo");
					this.model.set("done", !this.model.get("done"));
				}
				return false;
			},

			handleAFocusIn : function(e) {
				
				//TODO clean this up with a static const declaration of the "New Do-do" string
				if (e.currentTarget.innerHTML == "&lt;!-- New Do-do --&gt;") {
					e.currentTarget.innerHTML = "";
					$(e.currentTarget).focus();
				}
			},

			handleAFocusOut : function(e) {
				if (e.currentTarget.innerHTML == "") {
					e.currentTarget.innerHTML = "&lt;!-- New Do-do --&gt;";
				}
			},

			handleNewDodo : function(e) {
				var esc = event.which == 27;
				var ent = event.which == 13;
				if (esc) {
					// restore state
					document.execCommand('undo');
					e.currentTarget.blur();
				} else if (ent) {
					var title = $(e.currentTarget).html();
					this.model.set("title", title);
					document.execCommand('undo');
					e.currentTarget.blur();
					event.preventDefault();
				}
			}
		});

		var DodosView = Backbone.View.extend({

			initialize : function() {

				this.collection.on("reset", this.renderDodos, this);
				this.collection.on("add", this.addDodo, this);

				this.renderDodos();
			},

			renderDodos : function() {
				this.$el.find("li").remove();

				_.each(this.collection.models, function(item) {
					this.renderDodoItem(item);
				}, this);

				this.renderNewDodoHolder();
			},

			addDodo : function() {
				this.removeNewDodoHolder();
				this.renderDodoItem(arguments[0]);
				this.renderNewDodoHolder(true);
				refreshDimensions();
			},

			renderDodoItem : function(item) {
				var dodoItemView = new DodoItemView({
					model : item
				});
				var view = dodoItemView.render();
				this.$el.append(view.el);
				return view;
			},

			renderNewDodoHolder : function(focus) {
				var newdodo = new DodoItem({
					id : "new",
					title : "&lt;!-- New Do-do --&gt;"
				});
				var root = this;
				newdodo.on("change", function() {
					root.createDodo(this.get("title"));
				});
				var view = this.renderDodoItem(newdodo);
				$(view.$el).addClass("new-dodo");
				$(view.$el).find("a").attr("contenteditable", true);
				
				if(focus)
				{
					$(view.$el).find("a").click();
				}
			},

			removeNewDodoHolder : function() {
				$(this.$el).find("#dodo_new").remove();
			},

			createDodo : function(dodotitle) {
				var date = new Date();
				var did = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
				var dodo = new DodoItem({
					id : did,
					title : dodotitle
				});
				this.collection.add(dodo);
				window.all_dodos.add(dodo);
			},

			addDodoToCardCollection : function(did) {
				var cardmodel = _.find(this.collection.models, function(item) {
					return item.get("id") == bid;
				});

				var cards = boardmodel.get("cards");
				if (cards.indexOf(cid) == -1) {
					cards.push(cid);
					boardmodel.set("cards", cards);
				}
			}
		});
		
		var storageManager = {
			
			getBoards : function()
			{
				var dodo_boards = this.getBoardsFromLocal();
				if(!dodo_boards)
				{
					dodo_boards = new Boards(); 
				}else{
					dodo_boards = new Boards(eval(dodo_boards));
				}
				return dodo_boards;
			},
			
			getBoardsFromLocal : function()
			{
				var dodo_boards = localStorage.getItem("dodo_boards");
				if(dodo_boards)
				{
					return dodo_boards;
				}
				return null;
			},
			
			storeBoards : function()
			{
				localStorage.setItem("dodo_boards", this.encodeBoardsForStorage());
			},
			
			clearBoards : function()
			{
				localStorage.removeItem("dodo_boards");
			},
			
			encodeBoardsForStorage : function()
			{
				if(window.boards_coll == null)
				{
					return;
				}
				var boardsstr = "[";
				_.each(window.boards_coll.models, function(item)
				{
					boardsstr += '{"id":"' + item.get("id") + '","name":"' + item.get("name") + '","cards":[';
					var carddis = item.get("cards");
					_.each(carddis, function(id){
						boardsstr += '"' + id + '",';
					});
					if(carddis.length != 0)
					{
						boardsstr = boardsstr.substring(0, boardsstr.length-1);	
					}
					boardsstr += "]}," 
				});
				if(window.boards_coll.length != 0)
				{
					boardsstr = boardsstr.substring(0, boardsstr.length-1);	
				}
				boardsstr += "]";
				return boardsstr;
			},
			
			getCards : function()
			{
				var dodo_cards = this.getCardsFromLocal();
				if(!dodo_cards)
				{
					dodo_cards = new Cards(); 
				}else{
					dodo_cards = new Cards(eval(dodo_cards));
				}
				return dodo_cards;
			},
			
			
			getCardsFromLocal : function()
			{
				var dodo_cards = localStorage.getItem("dodo_cards");
				if(dodo_cards)
				{
					return dodo_cards;
				}
				return null;
			},
			
			storeCards : function()
			{
				localStorage.setItem("dodo_cards", this.encodeCardsForStorage());
			},
			
			clearCards : function()
			{
				localStorage.removeItem("dodo_cards");
			},
			
			encodeCardsForStorage : function()
			{
				if(window.all_cards == null)
				{
					return;
				}
				var cardsstr = "[";
				_.each(window.all_cards.models, function(item)
				{
					cardsstr += '{"id":"' + item.get("id") + '","name":"' + item.get("name") + '","dodos":[';
					var dodoids = item.get("dodos");
					_.each(dodoids, function(id){
						cardsstr += '"' + id + '",';
					});
					if(dodoids.length != 0)
					{
						cardsstr = cardsstr.substring(0, cardsstr.length-1);	
					}
					cardsstr += "]}," 
				});
				if(window.all_cards.length != 0)
				{
					cardsstr = cardsstr.substring(0, cardsstr.length-1);
				}
				cardsstr += "]";
				return cardsstr;
			},
			
			getDodos : function()
			{
				var dodo_dodos = this.getDodosFromLocal();
				if(!dodo_dodos)
				{
					dodo_dodos = new Dodos(); 
				}else{
					dodo_dodos = new Dodos(eval(dodo_dodos));
				}
				return dodo_dodos;
			},
			
			
			getDodosFromLocal : function()
			{
				var dodo_dodos = localStorage.getItem("dodo_dodos");
				if(dodo_dodos)
				{
					return dodo_dodos;
				}
				return null;
			},
			
			storeDodos : function()
			{
				localStorage.setItem("dodo_dodos", this.encodeDodosForStorage());
			},
			
			clearDodos : function()
			{
				localStorage.removeItem("dodo_dodos");
			},
			
			encodeDodosForStorage : function()
			{
				if(window.all_dodos == null)
				{
					return;
				}
				var dodosstr = "[";
				_.each(window.all_dodos.models, function(item)
				{
					dodosstr += '{"id":"' + item.get("id") + '","title":"' + item.get("title") + '","done":' + item.get("done") + '},';
				});
				if(all_dodos.length != 0)
				{
					dodosstr = dodosstr.substring(0, dodosstr.length-1);	
				}
				dodosstr += "]";
				return dodosstr;
			},
			
			saveAll : function()
			{
				this.storeBoards();
				this.storeCards();
				this.storeDodos();
			},
			
			clearAll : function()
			{
				this.clearBoards();
				this.clearCards();
				this.clearDodos();
				
				window.boards_coll = null;
				window.all_cards = null;
				window.all_dodos = null;
			}
		} 
		
		dodo_app = new DodoApp();
		
		boards_coll = storageManager.getBoards();

		card_form_view = new NewCardFormView();
		board_form_view = new NewBoardFormView();
		boards_view = new BoardsView();

		//TODO - move this into an AppView class
		refreshDimensions();
		initialize();
		
		$('#add-btn').popbox();
		$('#add-card-btn').popbox({
			'position' : 'br'
		});
		
		$('#reset-btn').click(function()
		{
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
		
		function initialize()
		{
			$("#selected-board").click(function()
			{
				$("body").scrollTop(0);
			});
		}

		function refreshDimensions() {
			// $("#sidebar").css('height', 10);
			// if ($(window).height() > $(document).height()) {
				// $("#sidebar").css('height', $(window).height());
			// } else {
				// $("#sidebar").css('height', $(document).height());
			// }
			$("#right-toolbar").css('width', 10);
			$("#right-toolbar").css('width', $(document).width() - 452);
		}

	}(jQuery));
