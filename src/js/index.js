/* todo:
make a finite state machine/walker,
"oh go left, oh go right, oh speed up, oh change div, oh change speed"
remove all libs
*/

$(document).ready(e => {
  let emojis = [];
  src.forEach(e => emojis.push(e));

  let t = Math.PI;
  let dt = 0.000001;
  let _dt = dt;
  let dt_ceil = 1;
  // document.getElementById('dtime').innerHTML = `${dt}`;

  let seed = 42; // Math.floor(Math.random()*65536);
  let simplex = new SimplexNoise(seed);
  let divx = 500;
  let divy = 500;
  
  let incD = 1.05;
  let incT = 12;

  let acc_lim = 0.00005;
  let _acc_lim = acc_lim;
  let acc_ceil = 10;

  let pos = [12., -3.];
  let vel = [acc_lim, acc_lim];
  let acc = [acc_lim, acc_lim];

  const shiftInterval = setInterval(() => {
    const shiftInt = setInterval(() => {
      if (acc_lim < 0.0001) {
        let n = simplex.noise2D(t, 0);
        n = fmap(n, -1, 1, 0, Math.PI * 2.0);
        shiftAmt = Math.ceil(fmap(Math.cos(n), -1, 1, 1, 5));
        for (let i = 0; i < shiftAmt; i++) {
          //emojis.unshift(emojis.pop());
        }
      }
    }, 25);
    const clearShift = setTimeout(() => {
      clearInterval(shiftInt);
    }, 1000);
  }, 2100);

  const changeDiv = setInterval(() => {
    let n = simplex.noise2D(t, 0);
    n = fmap(n, -1, 1, 0, Math.PI * 2.0);
    divx = fmap(Math.cos(n), -1, 1, 8, 200);
    divy = fmap(Math.cos(n), -1, 1, 8, 200);
  }, 12);

  const incSpd = setInterval(() => {
    const inc = setInterval(() => {
      dt *= incD;
      dt = dt > dt_ceil ? dt_ceil : dt;
      acc_lim *= incD;
      acc_lim = acc_lim > acc_ceil ? acc_ceil : acc_lim;
      //emojis.unshift(emojis.pop()); // put last elem to front
      emojis.push(emojis.shift()); // put first elm to last
    }, incT);

    const cancelInc = setTimeout(() => {
      clearInterval(inc);
      acc_lim = _acc_lim;
      dt = _dt;
    }, 2000);

  const shuffleInt = setInterval(() => {
    // emojis = [];
    // src.forEach(e => emojis.push(e));
    //emojis = emojis.splice(0, 128);
    
    //seed = Math.floor(Math.random()*65536);
    // simplex = new SimplexNoise(seed);
    
    // pos = [0, 0];
    // vel = [0, 0];
  }, 10000);


  }, 4000);
  document.getElementById('div').innerHTML = `${divx}`;
  
  // noise div
  let incDivInt = null;
  let decDivInt = null;
  $('#incDiv').mousedown(e => {
    clearInterval(decDivInt);
    clearInterval(incDivInt);
    
    const goal = divx * 2;
    incDivInt = setInterval(e => {
      document.getElementById('incDiv').disabled = true;				
      document.getElementById('decDiv').disabled = true;				
      if (divx >= goal || divy >= goal) {
	clearInterval(incDivInt);
	document.getElementById('incDiv').disabled = false;
	document.getElementById('decDiv').disabled = false;				
	return;
      }
      divx *= 1.01;
      divy *= 1.01;
      const dx = Math.round((divx * 10)/10);
      const dy = Math.round((divx * 10)/10);
      document.getElementById("div").innerHTML = `${dx}`;
    }, 15);
  });
  
  $('#decDiv').click(e => {
    clearInterval(incDivInt);
    clearInterval(decDivInt);

    const goal = Math.max(1, divx / 2);
    decDivInt = setInterval(e => {
      document.getElementById('decDiv').disabled = true;
      document.getElementById('incDiv').disabled = true;
      if (divx <= goal || divy <= goal) {
	clearInterval(decDivInt);
	document.getElementById('decDiv').disabled = false;
	document.getElementById('incDiv').disabled = false;				
	return;
      }
      divx *= 0.99;
      divy *= 0.99;
      const dx = Math.round((divx * 10)/10);
      const dy = Math.round((divx * 10)/10);
      document.getElementById("div").innerHTML = `${dx}`;
    }, 15);
  })
  
  const s = (p) => {
    p.setup = () => {
      const canvas = p.createCanvas(0, 0).remove();
      let div = $('<div/>');
      $('#container').append(div);
      
      const ua = navigator.userAgent;
      let text = '';
      let height = Math.floor((window.innerHeight)/9);
      let width =  Math.floor((window.innerWidth)/12);
      setInterval(e => {
	text = '';
        for (let y = 0; y < height; y++){
          for (let x = 0; x < width; x++){
	    const nx = (pos[0] + x)/divx;
	    const ny = (pos[1] + y)/divy;
            // const n = noise.perlin3(nx, ny, t);
            const n = simplex.noise3D(nx, ny, t);
            
	    let emoji_idx = Math.floor(fmap(n, -1, 1, 0, emojis.length-1));
            text += emojis[emoji_idx];
          }
          text += '\n';
        }
        div.text(text);
        t += dt;
        
        let n = simplex.noise3D(pos[0]/divx, pos[1]/divy, dt);
	n = fmap(n, -1, 1, 0, Math.PI * 2.0);
	acc[0] = Math.cos(n);
	acc[1] = Math.sin(n);
	vel[0] = Math.max(Math.min(vel[0] + acc[0], acc_lim), -acc_lim);
	vel[1] = Math.max(Math.min(vel[1] + acc[1], acc_lim), -acc_lim);
	pos[0] += vel[0];
	pos[1] += vel[1];
        
	const rx = Math.round(vel[0] * 100)/100.0;
	const ry = Math.round(vel[1] * 100)/100.0;
	document.getElementById("vel").innerHTML = `[${rx}, ${ry}]`;
      }, 7);

      setInterval(e => {
	const rx = Math.round(pos[0] * 100)/100.0;
	const ry = Math.round(pos[1] * 100)/100.0;
	document.getElementById("pos").innerHTML = `[${rx}, ${ry}]`;
      }, 250);
      
    };
  };
  const f = new p5(s, 'container'); 
});

const fmap = (v, vlow, vhigh, low, high) => {
  return ((v - vlow)/(vhigh - vlow)) * (high - low) + low;
};

const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;
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








// emojis down below, beware



























// const src = ['🌎','🌍','🌏','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔' ];
// const src = ['🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔' ];
const src = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👣', '👂', '🦻', '👃', '🫀', '🫁', '🧠', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '🗣', '👤', '👥', '🫂', '🧳', '🌂', '☂️', '🧵', '🪡', '🪢', '🧶', '👓', '🕶', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩴', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑', '🪖', '💄', '💍', '💼', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪲', '🪳', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕', '🐈', '🐈', '🪶', '🐓', '🦃', '🦤', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🪵', '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🪨', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐️', '🌟', '✨', '⚡️', '☄️', '💥', '🔥', '🌪', '🌈', '☀️', '🌤', '⛅️', '🌥', '☁️', '🌦', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️', '⛄️', '🌬', '💨', '💧', '💦', '☔️', '☂️', '🌊', '🌫', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕️', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂', '', '⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕', '🎻', '🎲', '♟', '🎯', '🎳', '🎮', '🎰', '🧩🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩', '💺', '🛰', '🚀', '🛸', '🚁', '🛶', '⛵️', '🚤', '🛥', '🛳', '⛴', '🚢', '⚓️', '🪝', '⛽️', '🚧', '🚦', '🚥', '🚏', '🗺', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟', '🎡', '🎢', '🎠', '⛲️', '⛱', '🏖', '🏝', '🏜', '🌋', '⛰', '🏔', '🗻', '🏕', '⛺️', '🛖', '🏠', '🏡', '🏘', '🏚', '🏗', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛', '⛪️', '🕌', '🕍', '🛕', '🕋', '⛩', '🛤', '🛣', '🗾', '🎑', '🏞', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙', '🌃', '🌌', '🌉', '🌁', '⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔', '🧯', '🛢', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒', '🛠', '⛏', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡', '⚔️', '🛡', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡', '🧹', '🪠', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪥', '🪒', '🧽', '🪣', '🧴', '🛎', '🔑', '🗝', '🚪', '🪑', '🛋', '🛏', '🛌', '🧸', '🪆', '🖼', '🪞', '🪟', '🛍', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🪅', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷', '🪧', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒', '🗓', '📆', '📅', '🗑', '📇', '🗃', '🗳', '🗄', '📋', '📁', '📂', '🗂', '🗞', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊', '🖋', '✒️', '🖌', '🖍', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚️', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕️', '🛑', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯️', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿️', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫️', '⚪️', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾️', '◽️', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛️', '⬜️', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁', '💬', '💭', '🗯', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧🏳️', '🏴', '🏁', '🚩', '🏳', '🏳️', '🏴', '🥲', '🥸', '🎄', '🫂', '🐈', '🦬', '🦣', '🦫', '🐻', '🦤', '🪶', '🦭', '🪲', '🪳', '🪰', '🪱', '🪴', '🫐', '🫒', '🫑', '🫓', '🫔', '🫕', '🫖', '🧋', '🪨', '🪵', '🛖', '🛻', '🛼', '🪄', '🪅', '🪆', '🪡', '🪢', '🩴', '🪖', '🪗', '🪘', '🪙', '🪃', '🪚', '🪛', '🪝', '🪜', '🛗', '🪞', '🪟', '🪠', '🪤', '🪣', '🪥', '🪦', '🪧', '🏳'];
