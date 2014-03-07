define(["models/card-item"], function(CardItem)
{
	//card collection
	var Cards = Backbone.Collection.extend({
		model : CardItem,

		url : function() {
			return '/cards';
		},
		
		createCard : function(cardname, boardId)
		{
            var date = new Date();
			var cid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			var card = new CardItem({
                lid : cid,
                bid : boardId,
				name : cardname,
                vtodos : []
			});

			card.save({}, {success: function(model, response, options)
			{
				console.log("success saving card...")
			}, error: function(model, xhr, options)
			{
				// handler for non 200 response
				alert("there was a problem saving the board \"" + model.get('name') + "\"");
			}});
			
			return card;
		}
	});
	
	return Cards;
});