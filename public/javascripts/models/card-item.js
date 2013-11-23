define([], function()
{
	//card item model
	var CardItem = Backbone.Model.extend({
		
		defaults : {
			id : function(){
				var date = new Date();
				var cid = date.getYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
				return cid;
			}(),
			name : "-",
			dodos : []
		}
	});
	
	return CardItem;
});