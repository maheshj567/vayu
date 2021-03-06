define(["text!templates/vtodo-template.html"], function(VtodoTemplate)
{
	var VtodoItemView = Backbone.View.extend({
		tagName : "li",
		className : "vtodo",
		template : _.template(VtodoTemplate),

		events : {
            "mouseenter .vtodo-label" : "handleMouseOver",
            "mouseleave" : "handleMouseOut",
			"keydown .vtodo-title-input" : "handleVtodoKeyDown",
			"click .vtodo-title-input" : "handleAFocusIn",
			"click .vtodo-label": "handleClick",
			"focusout .vtodo-title-input" : "handleAFocusOut",
            "click .vtodo-more-btn" : "handleMore",
            "click .edit-btn" : "handleEdit",
            "click .delete-btn" : "handleDelete"
		},

		initialize : function() {
			// ref: redundant...happening at a lot of places
			this.model.on("destroy", function(){
				$(this.$el).remove();
			}, this);
		},

		render : function() {
			// ref: rendering logic is also similar in a few places
			this.$el.html(this.template(this.model.toJSON()));
			$(this.$el).attr("id", "vtodo_" + this.model.get("lid"));

			if (this.model.get("done") === true) {
				$(this.$el).addClass("done-vtodo");
			}

			return this;
		},
        
        handleMouseOver : function(e) {
            if(!this.$el.hasClass("new-vtodo"))
            {
                $(this.$el).find(".edit-menu").show();
            }
        },
        
        handleMouseOut : function(e) {
            this.hideEditMenu();
        },

		handleAFocusIn : function(e) {
			// ref: clean this up with a static const declaration of the "New todo" string
			if($(e.currentTarget).val() == "// New todo")
            {
                $(e.currentTarget).val("");
                $(e.currentTarget).focus();
            }
			return false;
		},

		handleClick : function(e) {
			$(this.$el).toggleClass("done-vtodo");

            var done = !this.model.get("done");
            // ref: UI and business logic at same place!
            this.model.save({'done': done}, {success: function(model, response, options){
				console.log("success saving vtodo changes...");
			}, error: function(model, xhr, options){
				console.log("error saving vtodo changes...");
			}});
			return false;
		},

		handleAFocusOut : function(e) {
			if ($(this.$el).hasClass("new-vtodo")) {
				if ($(e.currentTarget).val() === "") {
					$(e.currentTarget).val("// New todo");
				}
			}else{
				document.execCommand('undo');
				this.hideEditForm();
			}
		},
        
        handleMore : function(e) {
            return false;
        },

        handleEdit : function(e) {
        	this.showEditForm();
            return false;
        },

        handleDelete : function(e) {
        	// ref: UI and business logic at same place!
        	this.model.destroy({success: function(model, response, options){
				console.log("success deleting vtodo...");
			}, error: function(model, xhr, options){
				console.log("error deleting vtodo...");
			}});
        	return false;
        },

        handleVtodoKeyDown : function(e) {
        	if ($(this.$el).hasClass("new-vtodo")) {
    			this.handleNewVtodo(e);
    		}else{
    			this.handleVtodoEdit(e);
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
				var title = $(e.currentTarget).val();
				if(title.trim() === '')
				{
					event.preventDefault();
					return;
				}
				this.model.set("title", title);
                
                // document.execCommand('undo');
				e.currentTarget.blur();
                
                //required, if not, browser changes content to wrap it in a div
				event.preventDefault();
			}
		},

		handleVtodoEdit : function(e) {
			var esc = event.which == 27;
			var ent = event.which == 13;
			if (esc) {
				// restore state
				document.execCommand('undo');
				e.currentTarget.blur();
				this.hideEditForm();
			} else if (ent) {

				// $(e.currentTarget).removeAttr("contenteditable");

				var title = $(e.currentTarget).val();
				this.model.set("title", title);

				$('.vtodo-label', this.$el).html(title);
                
                // document.execCommand('undo');
				e.currentTarget.blur();

				// ref: UI and business logic at same place!
				this.model.save({'title': title}, {success: function(model, response, options){
					console.log("success saving vtodo changes...");
				}, error: function(model, xhr, options){
					console.log("error saving vtodo changes...");
				}});
                
                //required, if not, browser changes content to wrap it in a div
				// event.preventDefault();
			}
		},

		hideEditMenu: function() {
			$(".edit-menu", this.$el).hide();
		},

		showEditForm: function(dontFocus) {
			$(".vtodo-title-input", this.$el).val(this.model.get("title"));
			$(".vtodo-title-input", this.$el).css("z-index", 'auto');
			$(".vtodo-title-input", this.$el).autosize().show().trigger('autosize.resize');
			$(".vtodo-label", this.$el).hide();
			if(!dontFocus) {
				$(".vtodo-title-input", this.$el).focus();
			}
			this.hideEditMenu();
		},

		hideEditForm: function() {
			$(".vtodo-title-input", this.$el).hide();
			$(".vtodo-title-input", this.$el).trigger('autosize.destroy');
			$(".vtodo-label", this.$el).show();
			$(".vtodo-title-input", this.$el).css("z-index", '-1');
		},

		setupPostRender: function() {
			if(this.$el.hasClass("new-vtodo")) {
				this.showEditForm(true);
			}
		}
	});
	
	return VtodoItemView;
});