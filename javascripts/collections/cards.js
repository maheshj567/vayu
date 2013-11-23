define(["models/card-item"], function(CardItem)
{
	//card collection
	var Cards = Backbone.Collection.extend({
		model : CardItem,
		
		createCard : function(cardname)
		{
			var card = new CardItem({
				name : cardname
			});
			
			return card;
		}
	});
	
	return Cards;
});