define(["text!templates/dodo-template.html"], function(DodoTemplate)
{
	var DodoItemView = Backbone.View.extend({
		tagName : "li",
		className : "dodo",
		template : _.template(DodoTemplate),

		events : {
            "mouseover" : "handleMouseOver",
            "mouseout" : "handleMouseOut",
			"keydown .dodo-label" : "handleNewDodo",
			"click .dodo-label" : "handleAFocusIn",
			"focusout a" : "handleAFocusOut",
            "click .dodo-more-btn" : "handleMore"
		},

		initialize : function() {

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
                // $(this.$el).find(".dodo-more-btn").show();
            }
        },
        
        handleMouseOut : function(e) {
            $(this.$el).find(".dodo-more-btn").hide();
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
                $(this.$el).toggleClass("done-dodo");

                var done = !this.model.get("done");

                this.model.save({'done': done}, {success: function(model, response, options){
					console.log("success saving card changes...");
				}, error: function(model, xhr, options){
					console.log("error saving card changes...");
				}});
            }
			return false;
		},

		handleAFocusOut : function(e) {
			if (e.currentTarget.innerHTML === "") {
				e.currentTarget.innerHTML = "&lt;!-- New todo --&gt;";
			}
		},
        
        handleMore : function(e) {
            return false;
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
                
                // document.execCommand('undo');
				e.currentTarget.blur();
                
                //required, if not, browser changes content to wrap it in a div
				event.preventDefault();
			}
		}
	});
	
	return DodoItemView;
});