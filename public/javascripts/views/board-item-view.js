define(["text!templates/board-template.html",
  "controllers/board-item-controller"], function (BoardTemplate, BoardItemController) {
    var BoardItemView = Backbone.View.extend({
        tagName: "li",
        template: _.template(BoardTemplate),

        events: {
            "keydown a": "handleBoardNameEdit",
            "CSSClassChanged": "updateCurrentBoard"
        },

        initialize: function () {
            // this.constructor.__super__.initialize.apply(this, arguments);
        },

        updateCurrentBoard: function () {
            if ($(this.$el).hasClass("selected")) {
                window.vayu_app.set("selectedboard", this.model);
                $("#selected-board").html(this.model.get("name"));

                var cardids = this.model.get("cards");
                var tempcards = [];
                var item;

                window.cards_coll.reset();
                window.vtodos_coll.reset();

                window.cards_coll.fetch({data:{"bid": this.model.get("lid")}, reset: true});
                window.vtodos_coll.fetch({data:{"bid": this.model.get("lid")}, reset: true});

                window.cards_coll.on("remove", this.handleCardRemoved, this);
            }
        },

        switchTo: function (s) {
            $(this.$el).trigger("click");
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            $(this.$el).attr("id", "board_" + this.model.get("lid"));

            return this;
        },

        handleBoardNameEdit: function (e) {
            var esc = event.which == 27;
            var ent = event.which == 13;
            if (esc) {
                // restore state
                document.execCommand('undo');
            } else if (ent) {
                var name = $(e.currentTarget).html();
                if (name !== '') {
                    this.model.save({'name': name}, {success: function(model, response, options){
                        console.log("success editing board name...");
                    }, error: function(model, xhr, options){
                        console.log("error editing boarding name...");
                    }});
                    $("#selected-board").html(name);
                } else {
                    document.execCommand('undo');
                }
            }

            if (esc || ent) {
                e.currentTarget.blur();
                event.preventDefault();
            }
        },

        handleCardRemoved: function(model, collection, options) {
            var cards = this.model.get("cards");
            cards = _.without(cards, model.get("lid"));

            this.model.save({'cards': cards}, {success: function(mod, response, options){
                console.log("success saving board changes...");
            }, error: function(model, xhr, options){
                console.log("error saving board changes...");
            }}); 
        }
    });

    return BoardItemView;
});