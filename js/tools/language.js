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

// local cache
var cachedLanguages = {};

function applyLanguage(content) {
	for (var className in content) {
		$('.'+className).html(content[className]);
		//document.getElementById(className).innerHTML = jsonFileContent[className];
	}
}

function loadLanguageQueue() {
	// check cache:
	if (languageLoadQueue[0] in cachedLanguages) {
		applyLanguage(cachedLanguages[languageLoadQueue[0]]);

		languageLoadQueue.shift();
		if (languageLoadQueue.length > 0) {
			languageLoadRetry = 0;
			loadLanguageQueue();
		}
	} else {
		// the caller must ensure languageLoadQueue is non empty
		jsonFile.open("get", "data/languages/"+languageLoadQueue[0]+".lan",true);
		jsonFile.send();
	}
}

function languageLoadFail() {
	// retry
	if (languageLoadRetry < 5) {
		++languageLoadRetry;
		loadLanguageQueue();
	}
}

function languageLoadSuccess() {
	if (jsonFile.status == 200) {
		jsonFileContent = JSON.parse(jsonFile.responseText);
		applyLanguage(jsonFileContent);
		current_language = languageLoadQueue.shift();
		cachedLanguages[current_language] = jsonFileContent;

		if (languageLoadQueue.length > 0) {
			languageLoadRetry = 0;
			loadLanguageQueue();
		}
	} else {
		languageLoadFail();
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
