var cachedContents = {};

function applyContent(page,content) {
	$('#page-content').html(content);
	// 讓內文頂部與底部稍有距離
	//$('.Content-Fix').css('height','10px');

	loadLanguage(userLang);

	prevPage = page;
}

// 按下選單的時候切換內文
function loadContent(page) {
	loadPages[prevPage] = false;
	loadPages[page] = true;

	if (page in cachedContents) {
		console.debug('cached'+page);
		applyContent(page,cachedContents[page]);
	} else {
		console.debug('no cached'+page);
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'text';
		xhr.open("get","pages/" + page + ".html",true);
		xhr.onload = function (e) {
			cachedContents[page] = xhr.responseText;
			applyContent(page,xhr.responseText);
		};
		xhr.send();
	}
}

// 增加初次載入頁面要做的工作
function addLoadEvent(func) {
	// 先確認目前有沒有已經要做的工作
	var oldOnload = window.onload;
	if (typeof window.onload != 'function') {
		// 沒有的話執行新工作
		window.onload = func;
	} else {
		// 有的話先做舊的再做新的
		window.onload = function() {
			if (oldOnload) {
				oldOnload();
			}
			func();
		}
	}
}

// 在新分頁/視窗中開啟連結
function loadNewScreen(url) {
	var new_window = window.open();
	new_window.location= url;
	return false;
}
