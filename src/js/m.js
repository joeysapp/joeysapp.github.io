// import src from './emojis.js';
// import perlin from './perlin.js';
// import simplex from './simplex.js';

function Vector(x, y, z, args) {
  this.x = x;
  this.y = y;
  this.z = z;

  Vector.prototype.toString = function() {
    return `(${this.x} ${this.y} ${this.z})`;
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
}

function Node() {
  this.pos = new Vector(0, 0, 0);
  this.vel = new Vector(0, 0, 0);
  this.acc = new Vector(0, 0, 0);
  this.mass = 1.0;

  Node.prototype.applyForce = function(force) {
    // make a new force every loop?
    force.div(this.mass);
    this.acc.add(force);
  };

  Node.prototype.update = function() {
    this.vel.add(this.acc);
    this.vel.mult(0.5);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}

const m = () => {
  const ua = navigator.userAgent;
  let text = '';
  let height = Math.floor((window.innerHeight)/5);
  let width =  Math.floor((window.innerWidth)/9);
  
  const head = new Node();
  const gravity = new Vector(-1, 0, 0);

  let seed = Math.floor(Math.random()*65536);
  let simplex = new SimplexNoise(seed);
  console.log(head);

  setInterval(() => {
    const ndiv = 64;
    const { x, y, z } = head.pos;
    let n = simplex.noise3D((x+0)/ndiv, (y+0)/ndiv, (z+0)/ndiv);

    n = map(n, -1, 1, 0, Math.PI * 2.0);
    
    let r = 0.3;
    let nx = r * Math.cos(n) * Math.sin(n);
    let ny = r * Math.sin(n) * Math.sin(n);
    let nz = r * Math.cos(n);

    const simplexForce = new Vector(nx, ny, nz);
    head.applyForce(simplexForce);
    head.update();

    // console.log(x, y, z);
    // console.log(head.vel);

    let string = '';
    for (let wx = -width/2; wx < width/2; wx += 1) {
      for (let wy = -height/2; wy <= height/2; wy += 1) {
        let char = '';
        let n = simplex.noise3D((x+wx)/ndiv, (y+wy)/ndiv, (z+0)/ndiv);
        // n = map(n, -1, 1, 161, 1000);
        n = map(n, -1, 1, 700, 900);
        char = Math.floor(n);
        string += String.fromCharCode(parseInt(n, 10));
      }
      string += '\n';
    }
    document.getElementById('container').innerHTML = string;
  }, 10);
};

const map = (v, vlow, vhigh, low, high) => {
  return ((v - vlow)/(vhigh - vlow)) * (high - low) + low;
};

const shuffle = (array) => {
  let idx = array.length, temporaryValue, randomIndex;
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


m();
