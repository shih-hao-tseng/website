function initializeLanguage () {
	userLang = (navigator.language || navigator.userLanguage).toLowerCase().split("-")[0];
	$('#select-language').val(userLang);

	if ($('#select-language option:selected').length == 0) {
		// not a supported language
		userLang = "en";
		$('#select-language').val(userLang);
	}
}

var jsonFile = new XMLHttpRequest();
jsonFile.responseType = 'text';
var jsonFileContent;
var languageLoadQueue = [];
var languageLoadRetry = 0;
jsonFile.onload = languageLoadSuccess;
jsonFile.onerror = languageLoadFail;

function loadLanguageQueue() {
	// the caller must ensure languageLoadQueue is non empty
	jsonFile.open("get", "data/languages/"+languageLoadQueue[0]+".lan",true);
	jsonFile.send();
}

function languageLoadSuccess() {
	if (jsonFile.status == 200) {
		jsonFileContent = JSON.parse(jsonFile.responseText);
		for (var className in jsonFileContent) {
			$('.'+className).html(jsonFileContent[className]);
			//document.getElementById(className).innerHTML = jsonFileContent[className];
		}
	}

	languageLoadQueue.shift();
	if (languageLoadQueue.length > 0) {
		languageLoadRetry = 0;
		loadLanguageQueue();
	}
}

function languageLoadFail() {
	// retry
	if (languageLoadRetry < 5) {
		++languageLoadRetry;
		loadLanguageQueue();
	}
}

function loadLanguage (lang) {
	// for each in loadPages
	// load data/languages/[userLang]/[loadPages].lan
	// using the id to load content
	userLang = lang;

	for (var page in loadPages) { if (loadPages[page]) {
		jsonFileContent = [];

		languageLoadRetry = 0;
		languageLoadQueue.push('en/'+page)
		languageLoadQueue.push(userLang+'/'+page)

		loadLanguageQueue();
	}}
}
