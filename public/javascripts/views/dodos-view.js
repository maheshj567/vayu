define(["views/dodo-item-view"], function(DodoItemView)
{
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
			var newdodo = this.collection.createPlaceHolder();
			var root = this;
			newdodo.on("change", function() {
				root.createDodo(this.get("title"));
			});
			var view = this.renderDodoItem(newdodo);
			$(view.$el).addClass("new-dodo");
			$(view.$el).find("a").attr("contenteditable", true);

			if (focus) {
				$(view.$el).find("a").click();
			}
		},

		removeNewDodoHolder : function() {
			$(this.$el).find("#dodo_new").remove();
		},

		createDodo : function(dodotitle) {
			var dodo = this.collection.createDodo(dodotitle);
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
	
	return DodosView;
});