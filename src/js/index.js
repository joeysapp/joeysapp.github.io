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
      p.resizeCanvas($('#l').innerWidth(), $('#l').innerHeight());
      p.textSize(p.height/2);
    }

    p.setup = function(){

      let t = navigator.userAgent;
      let foo = navigator;
    
      let canvas = p.createCanvas($('#l').innerWidth(), $('#l').innerHeight());
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

      var n = p.noise(p.millis()/1000.0);
      n = fmap(n, 0, 1, 0, Math.PI*2.0);

      for (var i = 0; i < 1000; i++){
        var c = 255 + 255*Math.sin(p.frameCount/25.0);

        var x = (p.width)*Math.random();
        var y = (p.height)*Math.random();

        p.stroke((x/100.0 + y/100.0 + n * 100.0 + c)%255, (n+c)*100.0, 255);



        p.point(x, y);
      }
      p.textSize(p.height/10.0);
      p.translate(p.width/2, p.height/2);
      p.fill(255);
      p.noStroke();
      // p.text('joeys pp', 0, 0);


      var x = Math.cos(n)*10.0;
      var y = Math.sin(n)*10.0;
      p.fill(255);
      p.text('joeys pp', -x, -y);
      p.fill(255);
      p.text('     a  ', x, y);

      p.fill(0);
      var c;


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