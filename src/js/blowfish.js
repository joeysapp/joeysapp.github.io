$(document).ready(e => {
  var choices = ['hobbit', 'fellowship', 'twotowers', 'returnoftheking', 'silmarillion'];
  var book = choices[Math.floor(Math.random() * choices.length)];
  $.get({
    url: `src/data/${book}.txt`
  }, (res, status) => {
    if (status == 'success'){
      var book = res.split(/\r?\n/);
      var line_idx = 0;
      var char_idx = 0;
      setInterval(() => {
        $('#boartusk').append(book[line_idx][char_idx]);
        if (char_idx >= book[line_idx].length){
           $('#boartusk').append(line_idx < 5 ? '<br>' : ' ');
          char_idx = 0;
          line_idx++;
        } else {
          char_idx++;
        }
        var html = $('#boartusk').html();
        var len = html.length;

      }, 25);
    } else {
      console.log('[ERROR]', status);
    }
  });

});
