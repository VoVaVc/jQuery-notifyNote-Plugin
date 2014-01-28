$(document).ready(function(){
	$('code').each(function(i, e) {hljs.highlightBlock(e, null, true)});
	$('body').notifyNote()
	$('[data-page]').on('click', function(){
		$('section.show').removeClass('show')
		$('section.'+$(this).attr('data-page')).addClass('show')
		notifyNote.hideNotifications()
		var el = $(this);
		setTimeout(function(){
			if(el.attr('data-page')=='events'){
				notifyNote.notification('darkGrey', '<a href="example/events.html" target="_blank">Events example</a>', 'example')
			}
			else if(el.attr('data-page')=='settings'){
				notifyNote.notification('darkGrey', '<a href="example/align.html" target="_blank">Align example</a>', 'example')
				notifyNote.notification('darkGrey', '<a href="example/close_events.html" target="_blank">Close events example</a>', 'example2')
				notifyNote.notification('darkGrey', '<a href="example/css.html" target="_blank">Custom css example</a>', 'example3')
			}
		}, 1000)
	})
})