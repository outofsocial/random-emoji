class Mouse {
  constructor(canvas) {
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.mode = 6;
    this.rad = 60;
    const rect = canvas.getBoundingClientRect();
    canvas.onmousemove = (ev) => {
      this.x = ev.clientX - rect.left,
      this.y = ev.clientY - rect.top;
    };
    canvas.onclick = () => {
      this.mode = this.mode === 6 ? 4 : this.mode+1;
    };
  }
}

function getBodyRect() {
  const { width, height} = document.body.getBoundingClientRect();
  return { x: width, y: height };
}

let clearMode = true;
let darkMode = false;
let rando = true;
let previous;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const POS = new Mouse(canvas);
let BR = getBodyRect();
canvas.width = BR.x;
canvas.height = BR.y;
canvas.style.cursor = 'none';
document.body.appendChild(canvas);

function Draw(x, y ,rad, mode) {
  ctx.save();
  ctx.font = `${rad}px Arial`;
  ctx.fillStyle = 'rgba(0,0,0,1)';
  if(rando) {
    const unicodeRange = (Math.abs((y-x)%50).toString(16));
    const text = `0x1f${Math.abs((y-x)%1)+mode}${parseInt(unicodeRange,16) < 16 ? '0'+unicodeRange : unicodeRange}`;
    ctx.fillText(String.fromCodePoint(text),x,y);
    previous = text;
  }else {
    ctx.fillText(String.fromCodePoint(previous),x,y);
  }
  ctx.restore();
}

function clear() {
  ctx.clearRect(0,0,BR.x,BR.y);
}

function Render() {
  window.requestAnimationFrame(Render);
  if(clearMode) {
    ctx.fillRect(0,0,BR.x,BR.y);
    Draw(POS.x,POS.y,POS.rad, POS.mode);
  } else{
    const sl = Math.round(
      Math.sqrt(
        Math.pow(POS.prevY - POS.y,2) + Math.pow(POS.prevX - POS.x,2)
      )
    );
    if(sl > POS.rad+10){
      POS.prevX = POS.x;
      POS.prevY = POS.y;
      POS.rad = Math.random()*30+30;
      Draw(POS.x,POS.y,POS.rad,POS.mode);
    }
  }
}

function reSize() {
  BR = getBodyRect();
  canvas.width = BR.x;
  canvas.height = BR.y;
}

window.addEventListener('keyup', ev => {
  switch(ev.keyCode){
    case 81:
      return clearMode = !clearMode;
    case 87:
      return clear();
    case 69:
      darkMode = !darkMode;
      if(darkMode) {
        ctx.fillStyle = clearMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,1)';
      } else{
        ctx.fillStyle = clearMode ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,1)';
      }
      return ctx.fillRect(0,0,BR.x,BR.y);
    case 82:
      return rando = !rando;
    default:
      return false;
  }
})

window.addEventListener('resize',function() {
  reSize();
});

Render();