window.onload = function(){	initializeLanguage();	loadPages['index'] = true;	loadLanguage(userLang);};window.onbeforeunload = function(){	loadPages['index'] = false;};