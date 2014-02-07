define(["collections/vtodos",
		"views/vtodos-view",
		"text!templates/card-template.html"], function(Vtodos, VtodosView, CardTemplate)
{
	var CardItemView = Backbone.View.extend({
		tagName : "div",
		className : "card",
		template : _.template(CardTemplate),
        
        events : {
			"keydown .card-title" : "handleCardNameEdit"
		},

		initialize : function() {
			this.dodos_coll = new Vtodos();
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
				this.dodos_view = new VtodosView({
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
		},
        
        handleCardNameEdit : function(e) {
            var esc = event.which == 27;
			var ent = event.which == 13;
			if (esc) {
				// restore state
				document.execCommand('undo');
			} else if (ent) {
				var name = $(e.currentTarget).html();
                if(name !== '')
                {
                    this.model.set("name", name);
                }else{
                    document.execCommand('undo');
                }
			}
            
            if(esc || ent)
            {
                e.currentTarget.blur();
                event.preventDefault();
            }
		}
	});
	
	return CardItemView;
});