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
    var cam;
    var data;
    var nodes = [];
    var globe_img;
    var R = 600;

    // show_button = p.createButton('Toggle Show');


    p.preload = function(){
      data = p.loadTable('src/data/fin-geo.csv');
      globe_img = p.loadImage('src/data/earth.jpg', function(i){ globe_img = i; });
    }

    p.setup = function(){

      let t = navigator.userAgent;
      let foo = navigator;
      // console.log(data.getRowCount());

      let canvas = p.createCanvas(window.innerWidth, window.innerHeight*0.7, p.WEBGL);
      for (let r = 0; r < data.getRowCount(); r++){
        var lat = data.getString(r, 11);
        var lon = data.getString(r, 12);
        var node = CreateNode(lat, lon, data.getRow(r));
        nodes.push(node);
        // console.log(node)
      }

      p.colorMode(p.HSB, 255);
      cam = new Dw.EasyCam(this._renderer, {distance:R*2, center:[0,0,0], rotation:[1,0,0,0]});
      noise.seed(2);
      // noise.seed(Math.floor(Math.random()*65536));

      // var div = $(`<div>butts</div>`);
      // var div = $(`<div>${t}</div>`);
      // $('#container').append(div);


      // $('#container').append(div_hash);



    };
    p.draw = function(){
      // p.stroke(255, 144, 75);
      p.background(255);
      // p.strokeWeight(0.7);

      p.rotateY(p.PI + p.PI/16);
      p.rotateX(p.PI/5);

      if (globe_img){
        p.push();
        p.rotateY(p.PI/2);
        p.texture(globe_img);
        p.sphere(R);
        p.pop();
      }
      nodes.forEach(n => {
        n.display();
        // console.log(n.pos);
      });

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

    class DataPoint {
      constructor(pos,r,ab,new_height,attr) {
        this.online = true;
        this.pos = pos;
        this.r = r;
        this.ab = ab;
        this.h = new_height;
        this.attr = attr;
        this.color = hashItem(attr)%255;
      }



      display(){
        // var c = map(this.h,0.95,1.20,0,255);
        // stroke(color(255-c,255,c));
        p.fill(this.color, 255, 255);
        p.stroke(this.color, 255, 255);
        // p.fill(255, 0, 0);
        p.line(this.pos.x,this.pos.y,this.pos.z,this.r.x,this.r.y,this.r.z);
      }
    }

  function CreateNode(lat, lon, attr){
    // var alt = R-10;
    var alt = fmap(hashItem(attr)%25, 0, 25, 100, 110);
    var new_height = fmap(hashItem(attr)%50, 0, 50, 6, 7);

    var rlat = p.radians(lat);
    var rlon = p.radians(lon);

    var cx = alt * p.cos(rlat) * p.cos(rlon);
    var cy = alt * p.cos(rlat) * p.sin(rlon);
    var cz = alt * p.sin(rlat);

    var pos = p.createVector(-cx, -cz, cy);

    var xa = p.createVector(1, 0, 0);
    var angleb = xa.angleBetween(pos);
    var raxis = xa.cross(pos);
    raxis = raxis.normalize();
    var tmp = pos.copy();


    // var new_height = calcHeight(attr);
    // var new_height = 1.1;
    tmp.mult(new_height);
    // raxis.mult(h);
    raxis.add(tmp);
    // var data = { 'x': -cx, 'y': -cz, 'z' : cy, 'rx': raxis.x, 'ry': raxis.y, 'rz': raxis.z, 'ab': angleb};

    var tmp = new DataPoint(pos,raxis,angleb,new_height,attr);
    return tmp;
  }

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