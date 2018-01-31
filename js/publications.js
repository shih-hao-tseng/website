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
   text = text.replace('/', '-');  // replace / by -
   text = text.replace('\'', '');  // replace ' by nothing
   text = text.replace(':', '_');  // replace : by _
   return text;
}

function loadPublications() {
   $.get("data/publications/data", function(data) {
      // 預備輸出的html
      var html_stack_conf = "";
      // conference papers
      $("conferences",data).each(function(){
         $('p',$(this)).each(function(){
         html_stack_conf += "<li style=\"padding-bottom:15px;\">";

         as = $('a',(this)); // 作者
         if ( as.length == 1 ) {
            html_stack_conf += convertMyName(as.eq(0).text()) + ",";
         } else if ( as.length == 2 ) {
            html_stack_conf += convertMyName(as.eq(0).text()) + " and " + convertMyName(as.eq(1).text()) + ",";
         } else {
            i = 0;
            for(; i < as.length - 1; ++i) {
               html_stack_conf += convertMyName(as.eq(i).text()) + ", ";
            }
            html_stack_conf += "and " + convertMyName(as.eq(i).text()) + ",";
         }
         html_stack_conf += "<br>\n";
         
         t = $(this).find('t').text(); // 標題
         html_stack_conf += "``" + t + ",''<br>\n";

         b = $(this).find('b').text(); // 期刊名
         y = $(this).find('y').text(); // 年
         d = $(this).find('d').text(); // 日期
         if ( d == "" ) {
            html_stack_conf += "to appear ";
         }
         html_stack_conf += "in <i>" + b + "</i>, " + y + ".";

         //r = $(this).find('r').text(); // 接受率
         //if ( r != "" ) {
         //   html_stack_conf += " (acceptance rate: " + r + ")";
         //}
         html_stack_conf += "<br>\n";

         if ( d != "" ) {
            t = convertPaperName(t);
            nop = $(this).find('nop').text(); // 沒有 paper 原檔
            if ( nop == "" ){
               html_stack_conf += "[<a class=\"publications-paper\" href=\"data/publications/papers/" + getSurname(as.eq(0).text()) + " " + y + " - " + t + " - author version.pdf\">paper</a>]";
            }
            nos = $(this).find('nos').text(); // 沒有 slides 原檔
            if ( nos == "" ){
               html_stack_conf += " [<a class=\"publications-slides\" href=\"data/publications/slides/Tseng " + y + d + " - slides - " + t + ".pdf\">slides</a>]";
            }
         }
         html_stack_conf += "</li>";
         });
      });
      $('#Conferences').html(html_stack_conf);

      // submitted work
      var html_stack_subm = "";
      $("submitted",data).each(function(){
         $('p',$(this)).each(function(){
         html_stack_subm += "<li style=\"padding-bottom:15px;\">";

         as = $('a',(this)); // 作者
         if ( as.length == 1 ) {
            html_stack_subm += convertMyName(as.eq(0).text()) + ",";
         } else if ( as.length == 2 ) {
            html_stack_subm += convertMyName(as.eq(0).text()) + " and " + convertMyName(as.eq(1).text()) + ",";
         } else {
            i = 0;
            for(; i < as.length - 1; ++i) {
               html_stack_subm += convertMyName(as.eq(i).text()) + ", ";
            }
            html_stack_subm += "and " + convertMyName(as.eq(i).text()) + ",";
         }
         html_stack_subm += "<br>\n";
         
         t = $(this).find('t').text(); // 標題
         html_stack_subm += "``" + t + ",''<br>\n";

         html_stack_subm += "submitted for review.<br>\n";

         t = convertPaperName(t);
         nop = $(this).find('nop').text(); // 沒有 paper 原檔
         if ( nop == "" ){
            html_stack_subm += "[<a class=\"publications-manuscript\" href=\"data/publications/manuscripts/" + getSurname(as.eq(0).text()) + " - " + t + " - submitted.pdf\">manuscript</a>]";
         }
         html_stack_subm += "</li>";
         });
      });
      $('#Submitted').html(html_stack_subm);
   });
}

addLoadEvent(loadPublications());