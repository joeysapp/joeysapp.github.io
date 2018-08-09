$(document).ready(e => {
  var char = 0;
  var switched = false;
  setInterval(() => {
    for (var i = 0; i < Math.random()*5; i++){
      $('#boartusk').prepend(String.fromCharCode(97 + char));
    }
    // $('#boartusk').scrollTop($('#boartusk').prop('scrollHeight'));
    if (Math.random() > 0.1){
      char += 1;
    }
    if (char > 1600 && !switched){
      char = 2000;
      switched = true;
    }
  }, 1);
});


// var s = function(p){
//   p.setup = function(){
//     p.createCanvas(p.windowWidth, p.windowHeight);
//   };

//   p.draw = function(){
//     p.strokeWeight(p.random(10));
//     p.point(p.random(p.windowWidth), p.random(p.windowHeight));
//   };

//   p.canvasResized = function(){
//     p.resizeCanvas(p.windowWidth, p.windowHeight);
//   };

// };

// var f = new p5(s, 'boar-tusk');