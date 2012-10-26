define(["models/card-item"], function(CardItem)
{
	//card collection
	var Cards = Backbone.Collection.extend({
		model : CardItem,
		
		createCard : function(cardname)
		{
			var date = new Date();
			var cid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			var card = new CardItem({
				id : cid,
				name : cardname,
				dodos : []
			});
			
			return card;
		}
	});
	
	return Cards;
});