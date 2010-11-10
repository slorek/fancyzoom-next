/*
 * FancyZoom jQuery plugin - modified by Steve Lorek
 *
 * Modifications:
 *
 * - Replaced inline styles with external CSS
 * - Fixed z-index
 * - Replaced table & images layout with CSS3
 * - Removed .gif close button - only .png supported.
 * - Added title option
 * - Added background option
 * - Added target option by selector
 * - Improved functionality to move DOM elements rather than duplicating HTML. Allows events to work and avoids numerous problems.
 *
 * TODO: Integrate supersleight for PNG fix
 * TODO: Replace animations with CSS3 transitions?
 */
(function($){
$.fn.fancyZoom = function(options){
	
	var options = options || {};
	
	init();

	var zoom         = $('#fancy_zoom');
	var zoom_close   = $('#fancy_zoom header a');
	var zoom_title   = $('#fancy_zoom header h1');
	var zoom_header  = $('#fancy_zoom header');
	var zoom_content = $('#fancy_zoom #fancy_zoom_content');
	var content 	 = get_content($(this));
	
	this.each(function(i) {
		content.hide();
		$(this).click(show);
	});
	
	return this;
	
		
  	// Initialise the Fancy Zoom DOM elements.
	function init() {
		
		// Check the DOM element doesn't already exist.
		if ($('#fancy_zoom').length == 0) {

			$('body').append('<div id="fancy_zoom"><header><h1></h1><a href="#" title="Close">x</a></header><div id="fancy_zoom_content"></div></div>');

			// Clicking outside the zoom window will close it.
			$('html').click(function(e) {
				if ($(e.target).parents('#fancy_zoom:visible').length == 0) hide();
			});

			// Hitting the Escape key will close the window.
			$(document).keyup(function(event){
			    if (event.keyCode == 27 && $('#fancy_zoom:visible').length > 0) hide();
			});

			// Clicking the close button will close the window.
			$('#fancy_zoom header a').click(hide);
		}
	}
	
	// Determine the content element to display when zoomed.
	function get_content(el) {
		
		if (options.target) {
			return options.target instanceof jQuery ? options.target : $(options.target);
		} else if (el.attr('href')) {
			return $(el.attr('href'));
		} else {
			console.error('No target content found for zoom element.');
		}
	}
	
	// Open the zoom window.
	function show(event) {
		
		// if (zoom.data('zooming') == true) return false
		// zoom.data('zooming', true);
		if (zoom.hasClass('zooming')) return false
		
		// Restore content to its origin if zoom window is already opened.
		if (zoom.data('content_source')) zoom_content.children().appendTo(zoom.data('content_source'));

		var width  = (options.width || content.width());
		var height = (options.height || content.height());

		// ensure that newTop is at least 0 so it doesn't hide close button
		// var newTop    = Math.max(($(window).height()/2) - (height/2), 0);
		// var newLeft   = ($(window).width()/2) - (width/2);

		// zoom.data('originY', event.pageY);
		// zoom.data('originX', event.pageX);
		
		// Populate the content.
		options.title ? zoom_title.html(options.title).show() : zoom_title.hide();

		zoom_content.empty();
		content.children().appendTo(zoom_content);
		zoom_content.css('height', height);
		
		zoom.data('content_source', content);
		
		// Set any custom style class.
		options.styleClass ? zoom.addClass(options.styleClass) : zoom.removeClass();
		
		// Move the zoom window.
		zoom.show().css({
			marginTop: '-' + (height + zoom_header.outerHeight(true))/2 + 'px',
			marginLeft: '-' + width/2 + 'px',
			width: width + 'px',
			height: height + zoom_header.outerHeight(true) + 'px'
		}).addClass('zoom-start');
		
		setTimeout(function() {
			zoom.addClass('zooming').removeClass('zoom-start').addClass('zoom-end');
			setTimeout(function() {
				zoom.removeClass('zooming');
			}, parseFloat(zoom.css('-webkit-transition-duration')) * 1000);
		}, 10);
		
		// Hide elements we don't want to show while zooming
		//zoom_close.hide();
		//options.title ? zoom_title.show() : zoom_title.hide();
		
		// Clicking on the zoom window will close it.
		if (options.closeOnClick) zoom.click(hide);
		
		
		// // Zoom the window open.
		// zoom.animate({
		// 	top     : '50%',
		// 	left    : '50%',
		// 	opacity : "show",
		// 	width   : width,
		// 	height  : height
		// }, 500, null, function() {
		// 	
		// 	// Copy the content into the zoom window.
		// 	content.children().appendTo(zoom_content);
		// 
		// 	if (options.title) zoom_title.html(options.title);
		// 
		// 	zoom_content.css('height', height - zoom_title.height());
		// 		
		// 	//zoom_close.show();
		// 	//zoom.data('zooming', false);
		// });

		return false;
	}

	function hide() {

		if (zoom.hasClass('zooming')) return false

		if (options.closeOnClick) zoom.unbind('click');

		zoom.addClass('zooming').removeClass('zoom-end').addClass('zoom-out')
		setTimeout(function() {
			zoom.removeClass('zooming').removeClass('zoom-out').hide();
			zoom_content.children().appendTo(zoom.data('content_source'));
		}, parseFloat(zoom.css('-webkit-transition-duration')) * 1000);

		//zoom_close.hide();
		//if (options.title) zoom_title.html('');

		// zoom.animate({
		// 	top     : zoom_close.data('curTop') + 'px',
		// 	left    : zoom_close.data('curLeft') + 'px',
		// 	opacity : "hide",
		// 	width   : '1px',
		// 	height  : '1px'
		//     }, 500, null);

		return false;
	}
}
})(jQuery);