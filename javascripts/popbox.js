(function() {

	$.fn.popbox = function(options) {
		var settings = $.extend({
			open : '.open',
			box : '.box',
			arrow : '.arrow',
			arrow_border : '.arrow-border',
			close : '.close',
			content : '.popbox-content',
			position : 'bl'
		}, options);

		var currentopen;

		var methods = {
			open : function(event) {
				event.preventDefault();

				currentopen = "#" + $(this).parent().attr("id");

				var pop = $(this);
				var box = $(this).parent().find(settings['box']);
				var content = $(settings['content']);
				var position = pop.position();

				if (settings['position'] == "br") {
					box.find(settings['arrow']).css({
						'left' : box.width() - pop.width()/2
					});

					box.find(settings['arrow_border']).css({
						'left' : box.width() - pop.width()/2
					});

					if (box.css('display') == 'block') {
						methods.close();
					} else {
						box.css({
							'display' : 'block',
							'top' : 10,
							left : -box.width() + pop.width()
						});
						if (parseInt(content.css('left')) < 0) {
							content.css({
								'left' : 10
							});
						}
						var input = box.find("input")[0];
						$(input).focus();
					}
				} else {
					box.find(settings['arrow']).css({
						'left' : pop.width() / 2
					});

					box.find(settings['arrow_border']).css({
						'left' : pop.width() / 2
					});

					if (box.css('display') == 'block') {
						methods.close();
					} else {
						box.css({
							'display' : 'block',
							'top' : 10,
							left : -pop.width() / 2
						});
						if (parseInt(content.css('left')) < 0) {
							content.css({
								'left' : 10
							});
						}
						var input = box.find("input")[0];
						$(input).focus();
					}
				}
			},

			close : function() {
				$(settings['box'], $(currentopen)).hide();
			}
		};

		$(document).bind('keyup', function(event) {
			if (event.keyCode == 27) {
				methods.close();
			}
		});

		$(document).bind('click', function(event) {
			if (!$(event.target).closest(currentopen).length) {
				methods.close();
			}
		});

		return this.each(function() {
			$(settings['open'], this).bind('click', methods.open);
			$(settings['open'], this).parent().find(settings['close']).bind('click', function(event) {
				event.preventDefault();
				methods.close();
			});
		});
	}
}).call(this);
