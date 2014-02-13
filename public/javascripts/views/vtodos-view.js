define(["views/dodo-item-view"], function(DodoItemView)
{
	var VTodosView = Backbone.View.extend({

		cardId : "-",

		initialize : function(options) {

			this.collection.on("reset", this.renderDodos, this);
			this.collection.on("add", this.addDodo, this);

			this.options = options;

			this.cardId = this.options.cardId;

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
            $(view.$el).addClass("gen_" + Math.round(Math.random()*10000));
			$(view.$el).find(".dodo-label").attr("contenteditable", true);

			if (focus) {
				$(view.$el).find(".dodo-label").click();
			}
		},

		removeNewDodoHolder : function() {
			$(this.$el).find(".new-dodo").remove();
		},

		createDodo : function(dodotitle) {
			console.log(this);
			var dodo = this.collection.createDodo(dodotitle, window.dodo_app.get("selectedboard").get("lid"), this.cardId);
			this.collection.add(dodo);
			// window.all_dodos.add(dodo);
		}
	});
	
	return VTodosView;
});