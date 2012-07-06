/**
 * editMe! - Just another edit-in-place plugin
 * Works for IE9, FF13, Chrome19, Opera 12
 * By: Chonla
 * Create Date: 6 July 2012
 * URL: http://blog.chonla.com
 */
(function($) {
	$.fn.editme = function(options) {
		var defaults = {
			type : 'text',	// text, textarea
			onSave : false,
			fluid : false,
			minWidth : 50,
			maxWidth : 1000,
			minHeight : 24,
			maxHeight : 1000,
			comfortZone : 20
		};
		options = $.extend(defaults, options);

		var txt_obj = $('<input type="text" class="x_edit_me">');
		var txtarea_obj = $('<textarea class="x_edit_me"></textarea>');

		$(this).live('click', function(e){
			if(e.target != this){
				return true;
			}
			e.stopPropagation();
			e.preventDefault();
			var base_o = $(this);
			if (base_o.attr('x_edit') == 1) return;
			switch (options.type)
			{
				case 'text':
					var o_data = base_o.attr('x_edit',1).text();

					// attach event
					txt_obj
						.blur(function(){
							var o = $(this);
							var n_data = o.val();
							var p = o.parent();
							var emode = (p.attr('x_edit') == 1);

							if (emode) {
								p.removeAttr('x_edit').text(n_data);
								if ($.isFunction(options.onSave)) {
									options.onSave(base_o.get(0), o_data, n_data);
								}
							} else {
								p.text(p.data('content')); // restore data
							}
						})
						.keydown(function(e){
							switch (e.keyCode)
							{
								case 13: // Enter
									$(this).blur();
									break;
								case 27:
									$(this).parent().removeAttr('x_edit');
									$(this).blur();
									break;
								default:
							}
						})
						.val(o_data);

					if (options.fluid) {
						// attach auto-size to textbox
						// code is ported from http://stackoverflow.com/questions/1288297/jquery-auto-size-text-input-not-textarea
						var minWidth = options.minWidth || txt_obj.width(),
								val = txt_obj.val(),
								tester = $('<tester/>').css({
									position:'absolute',
									top:-9999,
									left:-9999,
									width:'auto',
									fontSize:txt_obj.css('fontSize'),
									fontFamily:txt_obj.css('fontFamily'),
									fontWeight:txt_obj.css('fontWeight'),
									letterSpacing:txt_obj.css('letterSpacing'),
									whiteSpace:'nowrap'
								}).appendTo('body'),
								flex = function() {
									var obj = $(this);
									val = obj.val();
									var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
									tester.html(escaped);
									var testerWidth = tester.width(),
											newWidth = (testerWidth + options.comfortZone) >= minWidth ? testerWidth + options.comfortZone : minWidth,
											currentWidth = obj.width(),
											isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
																						|| (newWidth > minWidth && newWidth < options.maxWidth);
									if (isValidWidthChange) {
										obj.width(newWidth);
									}
								};

						txt_obj.bind('keyup keydown update focus', flex);
					}

					// insert editor
					base_o.data('content', o_data).html(txt_obj);
					txt_obj.focus();
					break;
				case 'textarea':
					var o_data = base_o.attr('x_edit',1).html().replace(/<br>/g,"\n");

					// attach event
					txtarea_obj
						.blur(function(){
							var o = $(this);
							var n_data = o.val();
							var p = o.parent();
							var emode = (p.attr('x_edit') == 1);

							if (emode) {
								p.removeAttr('x_edit').html(n_data.replace(/\n/g,'<br>'));
								if ($.isFunction(options.onSave)) {
									options.onSave(base_o.get(0), o_data, n_data);
								}
							} else {
								p.html(p.data('content').replace(/\n/g,'<br>')); // restore data
							}
						})
						.keydown(function(e){
							switch (e.keyCode)
							{
								case 13: // Enter
									if (!e.shiftKey) {
										$(this).blur();
									}
									break;
								case 27:
									$(this).parent().removeAttr('x_edit');
									$(this).blur();
									break;
								default:
							}
						})
						.css({overflow:"auto",resize:"none"})
						.val(o_data);

					if (options.fluid) {
						// attach auto-size to textbox
						// code is ported from http://stackoverflow.com/questions/1288297/jquery-auto-size-text-input-not-textarea
						var minWidth = options.minWidth || txtarea_obj.width(),
								minHeight = options.minHeight || txtarea_obj.height(),
								val = txtarea_obj.val(),
								tester = $('<tester_area/>').css({
									position:'absolute',
									top:-9999,
									left:-9999,
									width:'auto',
									height:'auto',
									fontSize:txtarea_obj.css('fontSize'),
									fontFamily:txtarea_obj.css('fontFamily'),
									fontWeight:txtarea_obj.css('fontWeight'),
									letterSpacing:txtarea_obj.css('letterSpacing'),
									lineSpacing:txtarea_obj.css('lineSpacing'),
									whiteSpace:'nowrap'
								}).appendTo('body'),
								flex = function() {
									var obj = $(this);
									val = obj.val();
									var escaped = val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,'<br>').replace(/\s/g,' ');
									tester.html(escaped);
									var testerWidth = tester.width(),
											newWidth = (testerWidth + options.comfortZone) >= minWidth ? testerWidth + options.comfortZone : minWidth,
											currentWidth = obj.width(),
											isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
																						|| (newWidth > minWidth && newWidth < options.maxWidth),
											testerHeight = tester.height(),
											newHeight = (testerHeight + options.comfortZone) >= minHeight ? testerHeight + options.comfortZone : minHeight,
											currentHeight = obj.height(),
											isValidHeightChange = (newHeight < currentHeight && newHeight >= minHeight)
																						|| (newHeight > minHeight && newHeight < options.maxHeight);
							if (isValidWidthChange) {
								obj.width(newWidth);
							}
							if (isValidHeightChange) {
								obj.height(newHeight);
							}
						};

						txtarea_obj.bind('keyup keydown update focus', flex);
					}

					// insert editor
					base_o.data('content', o_data).html(txtarea_obj);
					txtarea_obj.focus();
					break;
			}
		});
	}
})(jQuery);