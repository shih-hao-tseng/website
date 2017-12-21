function convertMyName (text) {
   if ( text == "me" ) {
      return "<b>S.-H. Tseng</b>"
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
   text = text.replace('/', '');
   text = text.replace('\'', '');
   return text;
}

function loadPublications() {
   $.get("data/publications/data", function(data) {
      // 預備輸出的html
      var html_stack = "";
      $("conferences",data).each(function(){
         $('p',$(this)).each(function(){
		    html_stack += "<li style=\"padding-bottom:15px;\">";

            as = $('a',(this)); // 作者
			if ( as.length == 1 ) {
			   html_stack += convertMyName(as.eq(0).text()) + ",";
			} else if ( as.length == 2 ) {
			   html_stack += convertMyName(as.eq(0).text()) + " and " + convertMyName(as.eq(1).text()) + ",";
			} else {
			   i = 0;
			   for(; i < as.length - 1; ++i) {
			      html_stack += convertMyName(as.eq(i).text()) + ", ";
			   }
			   html_stack += "and " + convertMyName(as.eq(i).text()) + ",";
			}
			html_stack += "<br>\n";
			
            t = $(this).find('t').text(); // 標題
			html_stack += "``" + t + ",''<br>\n";

			b = $(this).find('b').text(); // 期刊名
			y = $(this).find('y').text(); // 年
			d = $(this).find('d').text(); // 日期
			if ( d == "" ) {
			   html_stack += "to appear ";
			}
			html_stack += "in <i>" + b + "</i>, " + y + ".";

			r = $(this).find('r').text(); // 接受率
			if ( r != "" ) {
			   html_stack += " (acceptance rate: " + r + ")";
			}
            html_stack += "<br>\n";

			if ( d != "" ) {
			   t = convertPaperName(t);
			   nop = $(this).find('nop').text(); // 沒有 paper 原檔
			   if ( nop == "" ){
			      html_stack += "[<a class=\"publications-paper\" href=\"data/publications/papers/" + getSurname(as.eq(0).text()) + " " + y + " - " + t + " - author version.pdf\"></a>]";
			   }
			   nos = $(this).find('nos').text(); // 沒有 slides 原檔
			   if ( nos == "" ){
			      html_stack += "[<a class=\"publications-slides\" href=\"data/publications/slides/Tseng " + y + d + " - slides - " + t + ".pdf\"></a>]";
			   }
			}
            html_stack += "</li>";
         });
      });
      $('#Conferences').html(html_stack);
   });
}

addLoadEvent(loadPublications());