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
				window.boards_view.addCardToCurrentBoard(this.model.get("lid"));
			}
		},

		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			$(this.$el).attr("id", "card_" + this.model.get("lid"));

			var list = $(this.$el).find(".dodo-list")[0];
			$(list).attr("id", "dodos_" + this.model.get("lid"));

			return this;
		},

		renderDodos : function() {
			var dodoids = this.model.get("dodos");
			var tempdodos = [];
			var item;
			_.each(dodoids, function(lid) {
				item = _.find(window.vtodos_coll.models, function(item) {
					return item.get("lid") == lid;
				});
				if (item) {
					tempdodos.push(item);
				}
				item = null;
			});
			this.dodos_coll.reset(tempdodos);
			if (!this.dodos_view) {
				this.dodos_view = new VtodosView({
					el : $("#dodos_" + this.model.get("lid")),
					collection : this.dodos_coll,
					cardId : this.model.get("lid")
				});
			}
		},

		handleDodoAdded : function() {
			var item = arguments[0];
			var dodos = this.model.get("dodos");
			dodos.push(item.get("lid"));

			this.model.save({'dodos': dodos}, {success: function(model, response, options){
				console.log("success saving card changes...");
			}, error: function(model, xhr, options){
				console.log("error saving card changes...");
			}}); 
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
                    this.model.save({'name': name}, {success: function(model, response, options){
						console.log("success editing card name...");
					}, error: function(model, xhr, options){
						console.log("error editing card name...");
					}});
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