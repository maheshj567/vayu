define(["collections/vtodos",
		"views/vtodos-view",
		"text!templates/card-template.html"], function(Vtodos, VtodosView, CardTemplate)
{
	var CardItemView = Backbone.View.extend({
		tagName : "div",
		className : "card",
		template : _.template(CardTemplate),
        
        events : {
			"keydown .card-title" : "handleCardNameEdit",
			"mouseover .card-title" : "handleMouseOver",
			"mouseout .card-title" : "handleMouseOut",
			"click .edit-btn" : "handleEdit",
            "click .delete-btn" : "handleDelete"
		},

		initialize : function() {
			this.vtodos_coll = new Vtodos();
			this.vtodos_coll.on("add", this.handleVtodoAdded, this);
			this.vtodos_coll.on("remove", this.handleVtodoRemoved, this);

			this.model.on("destroy", function(){
				$(this.$el).remove();
			}, this);

			if (window.boards_view) {
				window.boards_view.addCardToCurrentBoard(this.model.get("lid"));
			}
		},

		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			$(this.$el).attr("id", "card_" + this.model.get("lid"));

			var list = $(this.$el).find(".vtodo-list")[0];
			$(list).attr("id", "vtodos_" + this.model.get("lid"));

			return this;
		},

		handleMouseOver : function(e) {
            $(".edit-menu", this.$el).first().show();
        },
        
        handleMouseOut : function(e) {
            $(this.$el).find(".edit-menu").first().hide();
        },

        handleEdit : function(e) {
        	$(".card-title", this.$el).attr("contenteditable", true);
        	$(".card-title", this.$el).focus();
            return false;
        },

        handleDelete : function(e) {
        	this.model.destroy({success: function(model, response, options){
				console.log("success deleting card...");
			}, error: function(model, xhr, options){
				console.log("error deleting card...");
			}});
        	return false;
        },

		renderVtodos : function() {
			var vtodoids = this.model.get("vtodos");
			var tempvtodos = [];
			var donevtodos = [];
			var item;
			_.each(vtodoids, function(lid) {
				item = _.find(window.vtodos_coll.models, function(item) {
					return item.get("lid") == lid;
				});
				if (item) {
					if(item.get('done') == true)
					{
						donevtodos.push(item);
					}else{
						tempvtodos.push(item);
					}
				}
				item = null;
			});
			tempvtodos = tempvtodos.concat(donevtodos);
			this.vtodos_coll.reset(tempvtodos);
			if (!this.vtodos_view) {
				this.vtodos_view = new VtodosView({
					el : $("#vtodos_" + this.model.get("lid")),
					collection : this.vtodos_coll,
					cardId : this.model.get("lid")
				});
			}
		},

		handleVtodoAdded : function() {
			var item = arguments[0];
			var vtodos = this.model.get("vtodos");
			vtodos.push(item.get("lid"));

			this.model.save({'vtodos': vtodos}, {success: function(model, response, options){
				console.log("success saving card changes...");
			}, error: function(model, xhr, options){
				console.log("error saving card changes...");
			}}); 
		},

		handleVtodoRemoved : function(model, collection, options) {
			var vtodos = this.model.get("vtodos");
			vtodos = _.without(vtodos, model.get("lid"));

			this.model.save({'vtodos': vtodos}, {success: function(mod, response, options){
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