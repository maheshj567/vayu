require.config({
  paths: {
    templates: '../templates'
  }
});

require(['dodo-boards'], function(dodo)
{
	$(document).ready(function(){
		dodoBoards.initialize();
	});
});