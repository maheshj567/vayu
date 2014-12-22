define(["views/card-item-view"], function(CardItemView)
{
	var CardsView = Backbone.View.extend({
		el : $("#cards"),

		cardViews : [],

		initialize : function() {
			// REF: pass cards_coll to the constructor
			this.collection = window.cards_coll;

			this.collection.on("reset", this.renderCards, this);
			this.collection.on("add", this.addCard, this);

			// ref: not a great place for this. CardsView should only manage cards 
			window.vtodos_coll.on("reset", this.renderVtodos, this);

			this.renderCards();
		},

		renderCards : function() {
			this.$el.find("div").remove();

			// ref: cardViews shouldn't be needed
			cardViews = [];

			// ref: listManager
			_.each(this.collection.models, function(item) {
				var view = this.renderCardItem(item);
				cardViews.push(view);
			}, this);

			this.renderVtodos();
		},

		addCard : function() {
			this.renderCardItem(arguments[0], true).renderVtodos();
			// refereshDimensions should be part of app logic
			refreshDimensions();
		},

		renderCardItem : function(item, switchTo) {
			var cardItemView = new CardItemView({
				model : item
			});
			var view = cardItemView.render();
			this.$el.prepend(view.el);
			return view;
		},

		createCard : function(cardname, boardId) {
			var card = this.collection.createCard(cardname, boardId);
			this.collection.add(card, {
				"at" : 0
			});
		},

		renderVtodos : function() {
			// ref: this should be handled by vtodos list
			for(var i=0; i < cardViews.length; i++)
			{
				cardViews[i].renderVtodos();
			}

			// ref: this should be in a more central location, may be as part of a handler for an event
			window.refreshDimensions();
		}
	});
	
	return CardsView;
});