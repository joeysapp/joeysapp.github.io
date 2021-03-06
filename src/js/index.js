$(document).ready(e => {

  let divx = 12;
  let divy = 12;

  let incTime;
  let decTime;

  $(document).keypress(e => {
    shuffle(emojis);
  })

  $('#inc').mousedown(e => {
    divx += divx*2;
    divy += divy*2;
    // clearInterval(decTime);
    // incTime = setInterval(e => {
    //   divx += 0.5;
    //   divy += 0.5;
    //   $('#divisor').text(Math.round(divx*10)/10);
    // }, 33);

  })

  $('#dec').click(e => {
    divx -= divx/2;
    divy -= divy/2;
    // clearInterval(incTime);
    // decTime = setInterval(e => {
    //   divx -= 0.5;
    //   divy -= 0.5;
    //   $('#divisor').text(Math.round(divx*10)/10);
    // }, 33);
  })

  // var emojis = ['🌎','🌍','🌏','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔' ];
  var emojis = ['🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔' ];


  var s = function(p){

    p.setup = function(){
      // console.log(emojis.length, emojis[0]);

      let t = navigator.userAgent;
      let time = 0;
      let canvas = p.createCanvas(0, 0);

      canvas.remove()

      noise.seed(Math.floor(Math.random()*65536));

      // var div = $(`<div>butts</div>`);
      var div = $(`<div>${t}</div>`);
      $('#container').append(div);

      var div_hash = '';

      for (var i = 0; i < t.length; i++){
        div_hash += emojis[t[i].charCodeAt(0)%emojis.length];

      }

      var simplex = new SimplexNoise();


      // $('#container').append(div_hash);
      let cur_x = 0.0;
      let cur_y = 0.0;

      setInterval(e => {
        cur_x += 0.0025;
        cur_y -= 0.0005;

        t = '';
        for (var y = 0; y < Math.floor((window.innerHeight)/9); y++){
          for (var x = 0; x < Math.floor((window.innerWidth)/12); x++){
            // var n = noise.perlin3((cur_x+x)/divx, (cur_y+y)/divy, time);
            var n = simplex.noise3D((cur_x+x)/divx, (cur_y+y)/divy, time);
            // var vx = (x)/divx + 4.*Math.cos(x/256.);
            // var vy = (y)/divy + 4.*Math.sin(y/256.);
            // var vx = (x)/divx + 4.*Math.cos(x/divx);
            // var vy = (y)/divy + 4.*Math.sin(y/divy);
            // var n = noise.perlin3(vx, vy, time);
            t += emojis[Math.floor(fmap(n, -1, 1, 0, emojis.length-1))];
          }
          t += '\n'
        }
        div.text(t);
        time += 0.009;
      }, 7);

    };

   };

  var fmap = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

   var f = new p5(s, 'container'); 
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