require.config({
  paths: {
    templates: '../templates'
  }
});

require(['vayu-boards-facade'], function(facade)
{
	$(document).ready(function(){
		appFacade.initialize();
	});
});