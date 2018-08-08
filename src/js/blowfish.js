var s = function(p){
  p.setup = function(){
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function(){
    p.strokeWeight(p.random(10));
    p.point(p.random(p.windowWidth), p.random(p.windowHeight));
  };

};

var f = new p5(s, 'boar-tusk');