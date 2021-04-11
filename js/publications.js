function convertMyName (text) {
	if ( text == "me" ) {
		return "<b>S.-H. Tseng</b>";
	} else {
		return text;
	}
}

function getSurname (text) {
	if ( text == "me" ) {
		return "Tseng";
	} else {
		split_text = text.split(". ");
	  return split_text[split_text.length-1];
	}
}

function convertPaperName (text) {
	text = text.replace(/\//g, '-');  // replace all / by -
	text = text.replace(/\'/g, '');  // replace all ' by nothing
	text = text.replace(/:/g, '_');  // replace all : by _

	//text = text.replace('/', '-');  // replace / by -
	//text = text.replace('\'', '');  // replace ' by nothing
	//text = text.replace(':', '_');  // replace : by _
	return text;
}

function parseAuthors (authors) {
	var html_stack = "";
	if ( authors.length == 1 ) {
		html_stack += convertMyName(authors[0]) + ",";
	} else if ( authors.length == 2 ) {
		html_stack += convertMyName(authors[0]) + " and " + convertMyName(authors[1]) + ",";
	} else {
		i = 0;
		for(; i < authors.length - 1; ++i) {
			html_stack += convertMyName(authors[i]) + ", ";
		}
		html_stack += "and " + convertMyName(authors[i]) + ",";
	}
	html_stack += "<br>";
	return html_stack;
}

function parseTitle (title,last = false) {
	if (last) {
		return "“" + title + ".”<br>";
	}
	return "“" + title + ",”<br>";
}

function parseData (data) {
	cachedPublicationPapers = [];
	publicationTypes = {};
	publicationTopics = {};

	papers = JSON.parse(data);
	console.debug(papers);

	papers.forEach(function (paper, paper_id) {
		paper_string = "";
		paper_string += parseAuthors(paper.a) + "\n";
		paper_string += parseTitle(paper.t, paper.type === "s") + "\n";
		
		// auxiliary variables
		t = convertPaperName(paper.t);
		y = paper.y.toString();
		has_p = false;
		has_s = false;
		if ("tags" in paper) {
			has_p = !("nop" in paper.tags);
			has_s = !("nos" in paper.tags);
		}
		surname = getSurname(paper.a[0])

		switch (paper.type) {
			case "s": // submitted
				if (has_p) {
					paper_string += "[<a class=\"publications-manuscript\" href=\"data/publications/manuscripts/" + surname + " - " + t + " - submitted.pdf\">manuscript</a>] ";
				}
				break;
			case "c": // conferences
				if ( !("d" in paper) ) {
					paper_string += "to appear ";
				}
				paper_string += "in <i>" + paper.b + "</i>, " + y + ".";

				//if ( "r" in paper ) { // 接受率
				//	paper_string += " (acceptance rate: " + paper.r + ")";
				//}
				paper_string += "<br>\n";
				if ( "d" in paper ) {
					if (has_p) {
						paper_string += "[<a class=\"publications-paper\" href=\"data/publications/papers/" + surname + " " + y + " - " + t + " - author version.pdf\">paper</a>] ";
					}
					if (has_s) {
						paper_string += "[<a class=\"publications-slides\" href=\"data/publications/slides/Tseng " + y + paper.d + " - slides - " + t + ".pdf\">slides</a>] ";
					}
				}
				break;
			case "j": // journal
				paper_string += "in <i>" + paper.b + "</i>, " + y + ".";
				if (has_p){
					paper_string += "[<a class=\"publications-paper\" href=\"data/publications/papers/" + surname + " " + y + " - " + t + " - author version.pdf\">paper</a>] ";
				}
				break;
			case "d": // dissertation
				paper_string += " " + y + ".<br>";
				paper_string += "[<a class=\"publications-link\" href=\"" + paper.l + "\">link</a>] ";
				break;
		}
		if ( "arxiv" in paper ){
			paper_string += "[<a class=\"publications-arxiv\" href=\"https://arxiv.org/abs/" + paper.arxiv + "\">arXiv</a>]";
		}
		cachedPublicationPapers.push(paper_string);

		// categorize the paper
		if (paper.type in publicationTypes) {
			publicationTypes[paper.type].push(paper_id);
		} else {
			publicationTypes[paper.type] = [paper_id]
		}

		if ("topic" in paper) {
			if (paper.topic in publicationTopics) {
				publicationTopics[paper.topic].push(paper_id);
			} else {
				publicationTopics[paper.topic] = [paper_id];
			}
		}
	});
}

const publicationTypeNames = {
	"s": "submitted",
	"c": "conference",
	"j": "journal",
	"d": "dissertation"
}

function renderPublicationBy(items,item_names){
	rendered_html_stack = "";
	for (item in items) {
		item_name = item_names[item];
		capitalized_item_name = item_name.charAt(0).toUpperCase() + item_name.slice(1);
		rendered_html_stack += "<h2 class=\"publications-"+item_name+"\"></h2>";
		rendered_html_stack += "<ul id=\""+capitalized_item_name+"\">";
		
		items[item].forEach(function (paper_id, index) {
			rendered_html_stack += "<li style=\"padding-bottom:15px;\">";
			rendered_html_stack += cachedPublicationPapers[paper_id];
			rendered_html_stack += "</li>";
		});
		rendered_html_stack += "</ul>";
	}
	return rendered_html_stack;
}

function renderPublicationData(){
	rendered_html_stack = renderPublicationBy(publicationTypes,publicationTypeNames);
	$('#publications-end').before(rendered_html_stack);
	loadLanguage(userLang);
}

function loadPublications() {
	if (cachedPublicationPapers.length === 0) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'text';
		xhr.open("get","data/publications/data",true);
		xhr.onload = function (e) {
			parseData(xhr.responseText);
			renderPublicationData();
		};
		xhr.send();
	} else {
		renderPublicationData();
	}
}

addLoadEvent(loadPublications());