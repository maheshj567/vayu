define(["views/vtodo-item-view"], function(VtodoItemView)
{
	var VTodosView = Backbone.View.extend({

		cardId : "-",

		initialize : function(options) {

			this.collection.on("reset", this.renderVtodos, this);
			this.collection.on("add", this.addVtodo, this);

			this.options = options;

			this.cardId = this.options.cardId;

			this.renderVtodos();
		},

		renderVtodos : function() {
			this.$el.find("li").remove();

			_.each(this.collection.models, function(item) {
				this.renderVtodoItem(item);
			}, this);

			this.renderNewVtodoHolder();
		},

		addVtodo : function() {
			this.removeNewVtodoHolder();
			this.renderVtodoItem(arguments[0]);
			this.renderNewVtodoHolder(true);
			refreshDimensions();
		},

		renderVtodoItem : function(item) {
			var vtodoItemView = new VtodoItemView({
				model : item
			});
			var view = vtodoItemView.render();
			this.$el.append(view.el);
			return view;
		},

		renderNewVtodoHolder : function(focus) {
			var newvtodo = this.collection.createPlaceHolderModel();
			var root = this;
			newvtodo.on("change", function() {
				root.createVtodo(this.get("title"));
				this.off("change");
			});
			var view = this.renderVtodoItem(newvtodo);
            $(view.$el).addClass("new-dodo");
            $(view.$el).addClass("gen_" + Math.round(Math.random()*10000));
			$(view.$el).find(".vtodo-label").attr("contenteditable", true);

			if (focus) {
				$(view.$el).find(".vtodo-label").click();
			}
		},

		removeNewVtodoHolder : function() {
			$(this.$el).find(".new-dodo").remove();
		},/*

		editVtodo : function() {
			
		},*/

		createVtodo : function(dodotitle) {
			var vtodo = this.collection.createVtodo(dodotitle, window.dodo_app.get("selectedboard").get("lid"), this.cardId);
			this.collection.add(vtodo);

			/*var root = this;
			vtodo.on("change", function(){
				root.editVtodo(this);
			});*/
		}
	});
	
	return VTodosView;
});