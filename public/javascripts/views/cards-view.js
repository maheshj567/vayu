define(["views/card-item-view"], function(CardItemView)
{
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
			var card = this.collection.createCard(cardname);
			this.collection.add(card, {
				"at" : 0
			});
			window.all_cards.add(card, {
				"at" : 0
			});
		},
	});
	
	return CardsView;
});