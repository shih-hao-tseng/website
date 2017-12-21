function loadCourses() {
   $.get("data/courses/data", function(data) {
      // 預備輸出的html
      var html_stack = "";
      $('c',data).each(function(){
         n = $(this).find('n').text(); // 課號
         t = $(this).find('t').text(); // 標題
         html_stack += "<tr><td>" + n + "</td><td style=\"width:2%;\"></td><td>" + t +"</td></tr>\n";
      });
      $('#Courses').html(html_stack);
   });
}

addLoadEvent(loadCourses());