$(document).ready(e => {

  let burp;
  let canvas;
  let time;
  let hour;
  let minute;
  let second;
  let millisecond;

  var s = function(p){

    p.setup = function(){
      burp = p.createDiv('<div>HI</div>');
      canvas = p.createCanvas(0, 0);
    };

   };
   var f = new p5(s, 'container'); 


  setInterval(e => {
    // console.log('hi');
    time = new Date();
    hour = time.getHours();
    minute = time.getMinutes();
    second = time.getSeconds();
    millisecond = time.getMilliseconds();
    burp.html(`${hour}:${minute}:${second}:${millisecond}`);
  }, 1);
});
