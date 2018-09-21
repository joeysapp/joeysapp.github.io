$(document).ready(e => {

  let div;
  let canvas;


  var s = function(p){

    p.setup = function(){
      canvas = p.createCanvas(0, 0);
      div = p.createDiv(`${navigator.userAgent}`);
    };

   };
   var f = new p5(s, 'container'); 
});
