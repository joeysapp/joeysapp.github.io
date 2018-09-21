$(document).ready(e => {

  function* arrayGen(item, amt){
    let i = 0;

    while (i < amt){
      i += 1;
      yield item;
    }
  };

  let emojid, c, canvas, origtxt, newtxt, txt, div, t = 0, r = 27, dt = 25;

  var s = function(p){
    p.setup = function(){
      txt = origtxt = navigator.userAgent;
      emojid = [...arrayGen(false, txt.length)];

      // txt = 'abc';

      canvas = p.createCanvas(0, 0);
      div = p.createDiv(`${txt}`);
      setInterval(() => {
        t += dt;
        if (t % (dt*r) == 0){
          div.html(origtxt);
          return;
        }
        txt = div.html();
        newtxt = ''
        for (var i = 0; i < txt.length; i++){
          if (Math.random() > 0.99){
            c = Math.random();
            if (c > 0.90 && !emojid[i]){
              emojid[i] = true;
              newtxt += String.fromCodePoint(0x1F600);
            } else if (c > 0.4 && !emojid[i]){
              newtxt += String.fromCharCode((txt[i].charCodeAt()) + 1);
            } else if (!emojid[i]){
              newtxt += String.fromCharCode((txt[i].charCodeAt()) - 1);

            }
          } else {
            newtxt += String.fromCharCode((txt[i].charCodeAt()) + 0);

          }
        }
        div.html(newtxt);
      }, dt);
    };

   };

   var f = new p5(s, 'container'); 
});
