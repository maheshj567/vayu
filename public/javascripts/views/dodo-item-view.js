define(["text!templates/dodo-template.html"], function(DodoTemplate)
{
	var DodoItemView = Backbone.View.extend({
		tagName : "li",
		className : "dodo",
		template : _.template(DodoTemplate),

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
	
	return DodoItemView;
});