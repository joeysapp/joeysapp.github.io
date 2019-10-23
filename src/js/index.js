$(document).ready(e => {

  // $(document).keypress(e => {
  //   shuffle(emojis);
  // })

  let t = 0;
  setInterval(e => {
    // $('#content').css('background-color', `rgb(${41}, ${(41 + Math.sin(t/Math.PI)*127)%255}, ${(41 + Math.cos(t)*127)%255})`);
    t += 1;

  }, 100);

  var s = function(p){

    var incons;
    p.preload = function(){
      incons = p.loadFont('../src/data/incons.ttf');
    }
    p.windowResized = function(){
      p.resizeCanvas($('#header').innerWidth(), $('#header').innerHeight());
      p.textSize(p.height/2);
      console.log(p.width);
    }

    p.setup = function(){

      let t = navigator.userAgent;
      let foo = navigator;
    
      let canvas = p.createCanvas($('#header').innerWidth(), $('#header').innerHeight());
      // let canvas = p.createCanvas(window.innerWidth/1, window.innerHeight/10);
      p.textFont(incons);
      p.textAlign(p.CENTER, p.CENTER);
      // var div = $(`<div>butts</div>`);
      // var div = $(`<div>${t}</div>`);
      // $('#container').append(div);
      // $('##').append(canvas);
      p.colorMode(p.HSB);

      p.background(255);
    };

    p.draw = function(){
      // p.background(255);
      p.textSize(p.height/1.5);
      p.translate(p.width/2, p.height/2);
      p.fill(255);
      p.noStroke();
      p.text('Joey Sapp', 0, 0);

      p.fill(0);
      var c;
      for (var i = 0; i < 1000; i++){
        var c = 255 + 255*Math.sin(p.frameCount/25.0);
        p.stroke(c%255, Math.random()*255, 255);
        p.point(p.random(-p.width/2, p.width/2), p.random(-p.height/2, p.height/2));
      }

      p.point(0, 0);
    }

    function hashItem(attr){
      var hash = 0;
      var str = "";
      if (attr.getString(1) != ""){
        str = attr.getString(1);
      }
      for (c of str){
        hash += c.charCodeAt(0);
      }
      if (hash == 0){
        hue = Math.random()*255;
      }
      return hash;
    }
   };

  var fmap = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };
  var f = new p5(s, 'l'); 
});




function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}