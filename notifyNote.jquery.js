(function( $ ) {

	var methods = {
		init : function(options) { 
			var settings = $.extend({
		      'horizontal'       : 'right',
		      'vertical' 		 : 'top',
		      'id'			 	 : 'notificationBar',
		      'width'			 : '250px',
		      'max-height'		 : '100px',
		      'z-index'			 : '999',
		      'margin'			 : '0',
		      'prefix'			 : 'notification_',
		      'mouseDrag'		 : true,
		      'hideOnClick'		 : true,
		      'replaceOnMatch'	 : true,
		      'closeButton'		 : true,
		      'debug'			 : true
		    }, options),
		    transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
		    functionalStyle = 'overflow:hidden;-webkit-transition: all 0.5s ease-in-out;-webkit-transform: translateX(110%);-moz-transition: all 0.5s ease-in-out;-moz-transform: translateX(110%);-ms-transition: all 0.5s ease-in-out;-ms-transform: translateX(110%);-o-transition: all 0.5s ease-in-out;-o-transform: translateX(110%);transition: all 0.5s ease-in-out;transform: translateX(110%);';

		 	id = '#'+settings.id
		 	if(!settings.debug){
		 		errorLog = function(){}
		 	}
		 	else{
		 		errorLog = $.error
		 	}
	  	 	if($(id).length==0){
				$('body').append('<ul id="'+settings.id+'"></ul>')
				$(id).css({
					'position': 'fixed',
					'list-style': 'none',
					'z-index': settings['z-index'],
					'margin': settings.margin,
					'padding': '0'
				})
				if(settings['horizontal']=='left'){
					$(id).css('left', '0px')
					functionalStyle = functionalStyle.replace(/translateX\(+/g, 'translateX(-')
				}
				else if(settings['horizontal']=='right'){
					$(id).css('right', '0px')
				}
				else{
					errorLog('notifyNote: '+settings['horizontal'] + ' is not valid property for horizontal option');
				}
				if(settings['vertical']=='top'){
					$(id).css('top', '0px')
				}
				else if(settings['vertical']=='bottom'){
					$(id).css('bottom', '0px')
				}
				else{
					errorLog('notifyNote: '+settings['vertical'] + ' is not valid property for vertical option');
				}
				$('head').append('<style type="text/css" id="notifyNoteStyles">#'+settings.id+' li{'+functionalStyle+'width: '+settings.width+'; max-height: '+settings["max-height"]+';} #'+settings.id+' li span{position: absolute;top: 10px;right: 7px;-webkit-transform: rotate(45deg);line-height: 0;font-size: 20px; cursor:pointer; display:none;}</style>')
				if(settings.closeButton){
					$('#notifyNoteStyles').text($('#notifyNoteStyles').text().replace('display:none;}', ''))
				}
			}
			notifyNote = {
				notification: function(type, text, idCome){
					if(typeof idCome == 'undefined' || idCome == null){
						errorLog('notifyNote: id is not defined in notification method')
						return false;
					}
					notificationContext = '<li class="notification '+type+'" id='+(settings.prefix+idCome)+'><span>+</span><p>'+text+'<br></p></li>'
					if(!settings.replaceOnMatch){
						if($('#'+settings.prefix+idCome).length==0){
							append()
						}
						else{
							errorLog('notifyNote: notification with same id already exists')
						}
					}
					else{
						if($('#'+settings.prefix+idCome).length!=0){
							$('#'+settings.prefix+idCome+' p').html(text)
						}
						else{
							append()
						}
					}
					if(settings.mouseDrag){
						$('#'+settings.prefix+idCome).bind('mousedown', function(evt){
							var isDrag = true,
								el = $(this);
							setTimeout(function(){
								if(isDrag){
									var base = evt.pageX
									$('body').css('user-select', 'none')
									el.css({
										'transition-duration': '0s',
										'user-select': 'none'
									})
									$(document).bind('mousemove', function(e){
										var moveXC = (base-e.pageX)*-1,
											moveX = 0;
										if(moveXC > -30 ){
											moveX = moveXC/2
										}
										else if(moveXC < -30){
											moveX = moveXC/4
										}
										else if(moveXC < -40){
											moveX = moveXC/6
										}
										else if(moveXC < -50){
											moveX = moveXC/8
										}
										$(el).css('transform', 'translateX('+moveX+'px)')
									})
									$(document).bind('mouseup', function(){
										$('body').css('user-select', '')
										$(document).unbind('mousemove')
										if(typeof settings.beforeHide!='undefined' && settings.beforeHide !=null ){
											if(typeof settings.beforeHide == 'function'){
												settings.beforeHide($('#'+settings.prefix+idCome) ,settings.prefix+idCome)
											}
											else{
												errorLog('notifyNote: beforeHide event callback is not a function')
											}
										}
										$(el).css({
												'transition-duration': '',
												'transform': ''
										}).one(transitionEnd, function(){
											$(el).css({
												'margin': '0',
												'padding': '0',
												'max-height': '0',
												'min-height': '0'
											}).one(transitionEnd, function(){
												$(el).remove()
												if(settings.afterHide!='undefined' && settings.afterHide!=null){
													if(typeof settings.afterHide == 'function'){
														settings.afterHide($('#'+settings.prefix+idCome) ,settings.prefix+idCome)
													}
													else{
														errorLog('notifyNote: afterHide event callback is not a function')
													}
												}
											})
										})
									})
								}
							}, 150)
							$(this).bind('mouseup', function(){
								isDrag = false
								$(this).unbind('mousemove')
								$('body').css('user-select', '')
							})
						})
					}

					if(settings.hideOnClick){
						$('#'+settings.prefix+idCome).click(function(e){
							console.log($(e.target).parents('p'))
							if(e.target.nodeName!='P' && $(e.target).parents('p').length==0){
								notifyNote.hideNotification(idCome)
							}
						})
					}

					if(settings.closeButton){
						$('#'+settings.prefix+idCome+' span').click(function(){
							notifyNote.hideNotification(idCome)
						})
					}

					function append(){
						$(id).append(notificationContext)
							setTimeout(function(){
								if(settings.beforeShow!='undefined' && settings.beforeShow!=null){
									if(typeof settings.beforeShow == 'function'){
										settings.beforeShow($('#'+settings.prefix+idCome), settings.prefix+idCome)
									}
									else{
										errorLog('notifyNote: beforeShow event callback is not a function')
									}
								}
								$('#'+settings.prefix+idCome).css('transform', 'translateX(0px)').one(transitionEnd, function(){
									if(settings.afterShow!='undefined' && settings.afterShow!=null){
										if(typeof settings.afterShow == 'function'){
											settings.afterShow($('#'+settings.prefix+idCome), settings.prefix+idCome)
										}
										else{
											errorLog('notifyNote: afterShow event callback is not a function')
										}
									}
								})
							}, 100)
					}
				},

				hideNotification: function(idCome){
					if(typeof id == 'undefined' || id == null){
						errorLog('notifyNote: id is not defined in hideNotification method')
						return false;
					}
					if(settings.beforeHide!='undefined' && settings.beforeHide!=null){
						if(typeof settings.beforeHide == 'function'){
							settings.beforeHide($('#'+settings.prefix+idCome), settings.prefix+idCome)
						}
						else{
							errorLog('notifyNote: beforeHide event callback is not a function')
						}
					}
					$('#'+settings.prefix+idCome).css('transform', '').one(transitionEnd, function(){
						$(this).css({
							'margin': '0',
							'padding': '0',
							'max-height': '0',
							'min-height': '0'
						}).one(transitionEnd, function(){
							$(this).remove()
							if(settings.afterHide!='undefined' && settings.afterHide!=null){
								if(typeof settings.afterHide == 'function'){
									settings.afterHide($('#'+settings.prefix+idCome), settings.prefix+idCome)
								}
								else{
									errorLog('notifyNote: afterHide event callback is not a function')
								}
							}
						})
					})
				},

				hideNotifications: function(){
					var objArr = $(id).children(),
						idArr = [];
					objArr.each(function(){
						idArr.push($(this).attr('id'))
					})
					if(settings.beforeHideAll!='undefined' && settings.beforeHideAll!=null){
						if(typeof settings.beforeHideAll == 'function'){
							settings.beforeHideAll(objArr, idArr)
						}
						else{
							errorLog('notifyNote: beforeHideAll event callback is not a function')
						}
					}
					objArr.css('transform', '').one(transitionEnd, function(){
						$(this).remove()
						if(settings.afterHideAll!='undefined' && settings.afterHideAll!=null){
							if(typeof settings.afterHideAll == 'function'){
								settings.afterHideAll(objArr, idArr)
							}
							else{
								errorLog('notifyNote: afterHideAll event callback is not a function')
							}
						}
					})
				},

				addTextNotification: function(message, idCome){
					if(typeof id == 'undefined' || id == null){
						errorLog('notifyNote: id is not defined in hideNotification method')
						return false;
					}
					$('#'+settings.prefix+idCome+' p').html($('#'+settings.prefix+idCome+' p').html()+'<br>'+message+'<br>')
					if(settings.textAdd!='undefined' && settings.textAdd!=null){
						if(typeof settings.textAdd == 'function'){
							settings.textAdd($('#'+settings.prefix+idCome+' p'), settings.prefix+idCome, message)
						}
						else{
							errorLog('notifyNote: textAdd event callback is not a function')
						}
					}
				},

				replaceTextNotification: function(message, idCome){
					if(typeof idCome == 'undefined' || idCome == null){
						errorLog('notifyNote: id is not defined in hideNotification method')
						return false;
					}
					$('#'+settings.prefix+idCome+' p').html(message+'<br>')
					if(settings.textReplace!='undefined' && settings.textReplace!=null){
						if(typeof settings.textReplace == 'function'){
							settings.textReplace($('#'+settings.prefix+idCome+' p'), settings.prefix+idCome, message)
						}
						else{
							errorLog('notifyNote: textReplace event callback is not a function')
						}
					}
				},
				destroy: function(){
					if(typeof settings.beforeDestroy!='undefined' && settings.beforeDestroy!=null){
						if(typeof settings.beforeDestroy == 'function'){
							settings.beforeDestroy($(id))
						}
						else{
							errorLog('notifyNote: beforeDestroy event callback is not a function')
						}
					}
					$(id).remove()
					$('#notifyNoteStyles').remove()
					settings = {}
					id = null
					functionalStyle = null
				}
			}
		}
  	};

  $.fn.notifyNote = function(method) {
	 var oldOptions = arguments;
  	 return this.each(function() {
  		if (methods[method]){
			return methods[ method ].apply(this, oldOptions);
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, oldOptions );
		} else {
			errorLog('No such method ' +  method + ' for notifyNote plugin');
		} 
  	 })
  };
})(jQuery);