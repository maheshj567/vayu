define(["collections/dodos",
		"views/dodos-view",
		"text!templates/card-template.html"], function(Dodos, DodosView, CardTemplate)
{
	var CardItemView = Backbone.View.extend({
		tagName : "div",
		className : "card",
		template : _.template(CardTemplate),

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
	
	return CardItemView;
});