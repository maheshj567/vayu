define(["text!templates/vtodo-template.html"], function(VtodoTemplate)
{
	var DodoItemView = Backbone.View.extend({
		tagName : "li",
		className : "dodo",
		template : _.template(VtodoTemplate),

		events : {
            "mouseover" : "handleMouseOver",
            "mouseout" : "handleMouseOut",
			"keydown .vtodo-label" : "handleVTodoKeyDown",
			"click .vtodo-label" : "handleAFocusIn",
			"focusout a" : "handleAFocusOut",
            "click .dodo-more-btn" : "handleMore",
            "click .edit-btn" : "handleEdit",
            "click .delete-btn" : "handleDelete"
		},

		initialize : function() {
			this.model.on("destroy", function(){
				$(this.$el).remove();
			}, this);
		},

		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			$(this.$el).attr("id", "dodo_" + this.model.get("lid"));

			if (this.model.get("done") === true) {
				$(this.$el).addClass("done-dodo");
			}

			return this;
		},
        
        handleMouseOver : function(e) {
            if(!$(this.$el).hasClass("new-dodo"))
            {
                $(this.$el).find(".edit-menu").show();
            }
        },
        
        handleMouseOut : function(e) {
            $(this.$el).find(".edit-menu").hide();
        },

		handleAFocusIn : function(e) {
			//TODO clean this up with a static const declaration of the "New todo" string
			if ($(this.$el).hasClass("new-dodo")) {
                if(e.currentTarget.innerHTML === "&lt;!-- New todo --&gt;")
                {
                    e.currentTarget.innerHTML = "";
                    $(e.currentTarget).focus();
                }
			}else{
				if($(".vtodo-label", this.$el).attr("contenteditable"))
				{
					return false;
				}
                $(this.$el).toggleClass("done-dodo");

                var done = !this.model.get("done");

                this.model.save({'done': done}, {success: function(model, response, options){
					console.log("success saving vtodo changes...");
				}, error: function(model, xhr, options){
					console.log("error saving vtodo changes...");
				}});
            }
			return false;
		},

		handleAFocusOut : function(e) {
			if ($(this.$el).hasClass("new-dodo")) {
				if (e.currentTarget.innerHTML === "") {
					e.currentTarget.innerHTML = "&lt;!-- New todo --&gt;";
				}
			}else{
				if($(".vtodo-label", this.$el).is("[contenteditable]"))
				{
					document.execCommand('undo');
					e.currentTarget.blur();
					$(e.currentTarget).removeAttr("contenteditable");
				}
			}
		},
        
        handleMore : function(e) {
            return false;
        },

        handleEdit : function(e) {
        	$(".vtodo-label", this.$el).attr("contenteditable", true);
        	$(".vtodo-label", this.$el).focus();
            return false;
        },

        handleDelete : function(e) {
        	this.model.destroy({success: function(model, response, options){
				console.log("success deleting vtodo...");
			}, error: function(model, xhr, options){
				console.log("error deleting vtodo...");
			}});
        	return false;
        },

        handleVTodoKeyDown : function(e) {
        	if ($(this.$el).hasClass("new-dodo")) {
    			this.handleNewVtodo(e);
    		}else{
    			this.handleVTodoEdit(e);
    		}
        },

		handleNewVtodo : function(e) {
            var esc = event.which == 27;
			var ent = event.which == 13;
			if (esc) {
				// restore state
				document.execCommand('undo');
				e.currentTarget.blur();
			} else if (ent) {
				var title = $(e.currentTarget).html();
				this.model.set("title", title);
                
                // document.execCommand('undo');
				e.currentTarget.blur();
                
                //required, if not, browser changes content to wrap it in a div
				event.preventDefault();
			}
		},

		handleVTodoEdit : function(e) {
			var esc = event.which == 27;
			var ent = event.which == 13;
			if (esc) {
				// restore state
				document.execCommand('undo');
				e.currentTarget.blur();
			} else if (ent) {

				$(e.currentTarget).removeAttr("contenteditable");

				var title = $(e.currentTarget).html();
				this.model.set("title", title);
                
                // document.execCommand('undo');
				e.currentTarget.blur();

				this.model.save({'title': title}, {success: function(model, response, options){
					console.log("success saving vtodo changes...");
				}, error: function(model, xhr, options){
					console.log("error saving vtodo changes...");
				}});
                
                //required, if not, browser changes content to wrap it in a div
				event.preventDefault();
			}
		}
	});
	
	return DodoItemView;
});