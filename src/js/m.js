// import src from './emojis.js';
// import perlin from './perlin.js';
// import simplex from './simplex.js';

let seed = Math.floor(Math.random()*65536);

function Vector(x, y, z, args) {
  this.x = x;
  this.y = y;
  this.z = z;

  Vector.prototype.toString = function() {
    const p = 6;
    let _x = (this.x.toFixed(p).padEnd(p, '0'));
    let _y = (this.y.toFixed(p).padEnd(p, '0'));
    let _z = (this.z.toFixed(p).padEnd(p, '0'));
    // handle xx. and -0.xx being out of line
    _x = _x.padStart(p + 3, '0');
    _y = _y.padStart(p + 3, '0');
    _z = _z.padStart(p + 3, '0');
    return `(${_x} ${_y} ${_z})`;
  }

  Vector.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
  }

  Vector.prototype.div = function(v) {
    this.x /= v;
    this.y /= v;
    this.z /= v;
  }

  Vector.prototype.mult = function(v) {
    this.x *= v;
    this.y *= v;
    this.z *= v;
  }

  Vector.prototype.mag = () => {
    const _mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    return _mag;
  }
}

function Node() {
  this.pos = new Vector(42, 0, 0);
  this.vel = new Vector(0, 0, 0);
  this.acc = new Vector(0, 0, 0);

  this.mass = .5; // acc divided by this
  this.drag = 0.95; // vel reduced by this

  this.xdiv = 32;
  this.ydiv = 32;
  this.zdiv = 32;

  Node.prototype.applyForce = function(force) {
    // make a new force every loop?
    force.div(this.mass);
    this.acc.add(force);
  };

  Node.prototype.randomize = ({ options }) => {
    options = {
      pos: true,
      vel: true,
      acc: true,
      ndiv: true,
      mass: true,
      drag: true,
      ...options
    };
  };

  Node.prototype.update = () => {
    this.vel.add(this.acc);
    this.vel.mult(this.drag);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  Node.prototype.log = function() {
    const _mag = this.vel.mag();
    const _velRed = map((1 - _mag*100) / 1, 0, 1, 0, 255);
    const _velCol = `rgb(255, ${_velRed}, ${_velRed})`;
    const _string = `%cpos: ${this.pos.toString()}\n%cvel: ${this.vel.toString()}\nmag: ${_mag}`;
    console.log(_string, 'color: white', `color: ${_velCol}`);
    // console.log(_velRed, _velCol);
  }
}

const populateMap = ((shuffle = false) => {
  let _map = [];
  let _src = emoji1;

  // Random distribution
  const idx = Math.floor(Math.random() * _src.length);
  const amt = Math.min(100, Math.floor(Math.random() * _src.length));

  _map = emoji1.slice(idx, idx + amt);
  if (shuffle) _map = shuffle(src);

  return _map;
});

const loop = (() => {
  let characterMap = populateMap();; 
  let text = '';

  const traveler = new Node();
  const gravity = new Vector(-1, 0, 0);
  const wind = new Vector(0, 0.5, 0.5);

  let simplex = new SimplexNoise(seed);
  const ua = navigator.userAgent;

  // Every 2.5s, randomize: [ position, noise_div, characterMap ]
  // const randomizeInterval = 2500;
  // setInterval(() => {
  //   seed = Math.floor(Math.random()*65536);
  // 
  //   traveler.pos = new Vector(Math.random()*65536, Math.random()*65536, Math.random()*65536);
  //   traveler.xdiv = 64 + Math.random()*128;
  //   traveler.ydiv = 64 + Math.random()*128;
  //   traveler.zdiv = 64 + Math.random()*128;
  // 
  //   populateMap();
  // }, randomizeInterval);

  // Every 10ms, look at position and get a 'Random simplex' force vector RV from the traveler's pos. 
  // 1. applyForce ( traveler.acc = (RV) * traveler.mass)
  // 2. update ( traveler.vel += traveler.acc, 
  let updateInterval = 10;
  let updateCt = 0;
  setInterval(() => {
    const { x, y, z } = traveler.pos;
    const { xdiv, ydiv, zdiv } = traveler;
    let noise = simplex.noise3D((x+0)/xdiv, (y+0)/ydiv, (z+0)/zdiv);

    let theta = map(noise, -1, 1, 0, Math.PI);
    let phi = map(noise, -1, 1, 0, Math.PI * 2.0);

    let r = 0.005;
    let nx = r * Math.cos(theta) * Math.sin(phi);
    let ny = r * Math.sin(theta) * Math.sin(phi);
    let nz = r * Math.cos(theta);

    const simplexForce = new Vector(nx, ny, nz);
    traveler.applyForce(simplexForce);
    traveler.update();
    if (updateCt % 67 === 0) traveler.log();

    const height = Math.floor((window.innerHeight)/8.);
    const width =  Math.floor((window.innerWidth)/16.);
    let string = '';
    for (let i = -height/2; i < height/2; i += 1) {
      for (let j = -width/2; j < width/2; j += 1) {
        let n = simplex.noise3D((x+i)/xdiv, (y+j)/ydiv, (z+0)/zdiv);

        // unicode chars
        // n = map(n, -1, 1, 161, 1000);
        // n = map(n, -1, 1, 700, 900);
        // n = map(n, -1, 1, 600, 800);
        // string += String.fromCharCode(parseInt(Math.floor(n), 10));
        // emojis

        let mappedN = map(n, -1, 1, 0, characterMap.length);
        mappedN = Math.floor(mappedN);
        string += characterMap[mappedN];
      }
      string += '\n';
    }
    document.getElementById('container').innerHTML = string;
    updateCt++;
  }, updateInterval);
})();

const map = (v, vlow, vhigh, low, high) => {
  return ((v - vlow)/(vhigh - vlow)) * (high - low) + low;
};

const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
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
