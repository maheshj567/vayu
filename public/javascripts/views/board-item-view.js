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
                window.dodo_app.set("selectedboard", this.model);
                $("#selected-board").html(this.model.get("name"));

                var cardids = this.model.get("cards");
                var tempcards = [];
                var item;

                window.cards_coll.fetch({data:{"bid": this.model.get("lid")}, reset: true});
                window.vtodos_coll.fetch({data:{"bid": this.model.get("lid")}, reset: true});
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
                    this.model.set("name", name);
                    $("#selected-board").html(name);
                } else {
                    document.execCommand('undo');
                }
            }

            if (esc || ent) {
                e.currentTarget.blur();
                event.preventDefault();
            }
        }
    });

    return BoardItemView;
});