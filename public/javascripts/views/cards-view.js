define(["views/card-item-view"], function(CardItemView)
{
	var CardsView = Backbone.View.extend({
		el : $("#cards"),

		cardViews : [],

		initialize : function() {
			this.collection = window.cards_coll;

			this.collection.on("reset", this.renderCards, this);
			this.collection.on("add", this.addCard, this);

			window.vtodos_coll.on("reset", this.renderVtodos, this);

			this.renderCards();
		},

		renderCards : function() {
			this.$el.find("div").remove();

			cardViews = [];

			_.each(this.collection.models, function(item) {
				var view = this.renderCardItem(item);
				cardViews.push(view);
			}, this);

			this.renderVtodos();
		},

		addCard : function() {
			this.renderCardItem(arguments[0], true).renderVtodos();
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
			for(var i=0; i < cardViews.length; i++)
			{
				cardViews[i].renderVtodos();
			}

			window.refreshDimensions();

			$('.done-vtodo').css("display", "none");
		}
	});
	
	return CardsView;
});