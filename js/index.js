window.onload = function(){
	$('#header-fix').html(document.getElementsByTagName("header")[0].innerHTML);
	$('#header-fix').each(function (i, e) {
		$(e).css('display: none;');
	});
	initializeLanguage();
	loadPages['index'] = true;
	
	loadContent(prevPage);
};

window.onbeforeunload = function(){
	loadPages['index'] = false;
};