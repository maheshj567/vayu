require.config({
  paths: {
    templates: '../templates'
  }
});

require(['dodo-boards-facade'], function(facade)
{
	$(document).ready(function(){
		appFacade.initialize();
	});
});