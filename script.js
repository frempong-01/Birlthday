// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
let currentPage = 1;
let envelopeOpened = false;
let photoRainInterval = null;
let loveAnimFrame = null;
let page5Timer = null;
let orbitFrame = null;
let loveFireRAF = null;

// ══════════════════════════════════════════
// UTIL
// ══════════════════════════════════════════
function vibrate() {
  if (navigator.vibrate) navigator.vibrate(40);
}

function goTo(n) {
  vibrate();
  startBGM();
  const overlay = document.getElementById('overlay');
  overlay.classList.add('flash');
  setTimeout(() => {
    showPage(n);
    overlay.classList.remove('flash');
  }, 400);
}

function showPage(n) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page' + n).classList.add('active');
  currentPage = n;
  stopAll();
  if (n === 1) initPage1();
  if (n === 2) initPage2();
  if (n === 3) initPage3();
  if (n === 4) initPage4();
  if (n === 5) initPage5();
}

function stopAll() {
  clearInterval(photoRainInterval);
  document.getElementById('photo-rain').innerHTML = '';
  if (loveAnimFrame)  cancelAnimationFrame(loveAnimFrame);
  if (orbitFrame)     cancelAnimationFrame(orbitFrame);
  if (spaceAnimFrame) cancelAnimationFrame(spaceAnimFrame);
  if (page5Timer)     clearTimeout(page5Timer);
  if (loveFireRAF) { cancelAnimationFrame(loveFireRAF); loveFireRAF = null; }
  const lfc = document.getElementById('loveFireCanvas');
  if (lfc) { lfc.style.display = 'none'; lfc.getContext('2d').clearRect(0, 0, lfc.width, lfc.height); }
}

// ══════════════════════════════════════════
// RAIN CANVAS — page 1 only
// ══════════════════════════════════════════
const rainCanvas = document.getElementById('rain-canvas');
const rctx = rainCanvas.getContext('2d');
let rainDrops = [];
let rainActive = false;
let rainAnimFrame;

function resizeRain() {
  rainCanvas.width  = window.innerWidth;
  rainCanvas.height = window.innerHeight;
}
resizeRain();
window.addEventListener('resize', resizeRain);

function createRainDrop() {
  return {
    x:       Math.random() * rainCanvas.width,
    y:       Math.random() * -200,
    speed:   1.5 + Math.random() * 2.5,
    size:    10  + Math.random() * 10,
    emoji:   Math.random() < 0.7 ? '❤️' : (Math.random() < 0.5 ? '🌹' : '💕'),
    opacity: 0.5 + Math.random() * 0.5,
    swing:   (Math.random() - 0.5) * 0.5,
  };
}

function startRain() {
  rainActive = true;
  rainCanvas.style.display = 'block';
  rainDrops = Array.from({ length: 35 }, createRainDrop);
  (function loop() {
    if (!rainActive) return;
    rctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    rainDrops.forEach(d => {
      d.y += d.speed;
      d.x += d.swing;
      if (d.y > rainCanvas.height + 30) { d.y = -20; d.x = Math.random() * rainCanvas.width; }
      rctx.globalAlpha = d.opacity;
      rctx.font = d.size + 'px serif';
      rctx.fillText(d.emoji, d.x, d.y);
    });
    rctx.globalAlpha = 1;
    rainAnimFrame = requestAnimationFrame(loop);
  })();
}

function stopRain() {
  rainActive = false;
  cancelAnimationFrame(rainAnimFrame);
  rctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainCanvas.style.display = 'none';
}

// ══════════════════════════════════════════
// PAGE 1
// ══════════════════════════════════════════
function initPage1() {
  startRain();
  const h = document.getElementById('p1-headline');
  h.style.animation = 'none';
  void h.offsetWidth;
  h.style.animation = '';
}

// ══════════════════════════════════════════
// PAGE 2 – ENVELOPE
// ══════════════════════════════════════════
function initPage2() {
  stopRain();
  envelopeOpened = false;
  const scene = document.getElementById('envScene');
  scene.classList.remove('hidden');
  scene.style.display = '';
  document.getElementById('envFlap').classList.remove('opened');
  document.getElementById('innerCard').classList.remove('risen');
  document.getElementById('envSeal').classList.remove('hide');
  document.getElementById('p2-btn').textContent = 'open me 💌';
  document.getElementById('p2-btn').onclick = openEnvelope;
  stopLoveFireworks();
}

function stopLoveFireworks() {
  if (loveFireRAF) { cancelAnimationFrame(loveFireRAF); loveFireRAF = null; }
  const c = document.getElementById('loveFireCanvas');
  c.style.display = 'none';
  c.getContext('2d').clearRect(0, 0, c.width, c.height);
}

function openEnvelope() {
  if (envelopeOpened) { goTo(3); return; }
  vibrate();
  envelopeOpened = true;
  document.getElementById('envSeal').classList.add('hide');

  // 1. Flap opens
  setTimeout(() => document.getElementById('envFlap').classList.add('opened'), 100);

  // 2. Card rises from envelope mouth after flap is open
  setTimeout(() => {
    const scene = document.getElementById('envScene');
    const rect  = scene.getBoundingClientRect();
    const card  = document.getElementById('innerCard');
    card.style.setProperty('--start-y', rect.top + 'px');
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('risen')));
  }, 750);

  // 3. Silently hide the envelope once card is clear — no animation
  setTimeout(() => {
    document.getElementById('envScene').classList.add('hidden');
  }, 1300);

  // 4. Fireworks
  setTimeout(() => startLoveFireworks(), 1600);

  document.getElementById('p2-btn').textContent = 'next →';
  document.getElementById('p2-btn').onclick = function() { goTo(3); };
}

function startLoveFireworks() {
  const canvas = document.getElementById('loveFireCanvas');
  const ctx    = canvas.getContext('2d');
  const W      = window.innerWidth;
  const H      = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;
  canvas.style.display = 'block';

  const launchX = W / 2;
  const launchY = H + 10;

  const LETTERS  = ['L','O','V','E'];
  const PALETTES = [
    { core:'#fff0f3', mid:'#ff4d6d', dim:'#c9184a' },
    { core:'#fffbe6', mid:'#ffd60a', dim:'#e9a820' },
    { core:'#f0f4ff', mid:'#7eb8f7', dim:'#4895ef' },
    { core:'#f4fff0', mid:'#80ed99', dim:'#38b000' },
    { core:'#fdf0ff', mid:'#c77dff', dim:'#7b2d8b' },
    { core:'#fff5f0', mid:'#ff8c42', dim:'#cc5500' },
  ];

  let rockets    = [];
  let bursts     = [];
  let letterIdx  = 0;
  let lastLaunch = -999;
  const LAUNCH_INTERVAL = 700;

  function scheduleLaunch(ts) {
    if (currentPage !== 2) return;
    const letter  = LETTERS[letterIdx % LETTERS.length];
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    letterIdx++;
    const spread  = (Math.random() - 0.5) * 120;
    const x       = launchX + spread;
    const peakY   = H * (0.08 + Math.random() * 0.28);
    const dist    = launchY - peakY;
    const gravity = 0.20;
    const initVY  = -Math.sqrt(2 * gravity * Math.max(dist, 20));
    rockets.push({ letter, palette, x, y: launchY, vx: spread * 0.012, vy: initVY, gravity, exploded: false, alpha: 1, trail: [] });
    lastLaunch = ts;
  }

  function explode(x, y, palette) {
    const shards = [];
    const count = 90 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle  = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.12;
      const speed  = 1.6 + Math.random() * 4.8;
      const bright = Math.random() < 0.35;
      shards.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        gravity:  0.055 + Math.random() * 0.055,
        drag:     0.965 + Math.random() * 0.02,
        alpha:    1,
        fadeRate: 0.007 + Math.random() * 0.007,
        radius:   bright ? 2.0 + Math.random() * 1.8 : 1.0 + Math.random() * 1.0,
        color:    bright ? palette.core : (Math.random() < 0.5 ? palette.mid : palette.dim),
        glow: bright, trail: [],
      });
    }
    for (let i = 0; i < 28; i++) {
      const angle = Math.PI * 2 * i / 28;
      const speed = 5.0 + Math.random() * 3.0;
      shards.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, gravity:0.10, drag:0.92, alpha:0.85, fadeRate:0.020, radius:0.8+Math.random()*0.8, color:palette.core, glow:true, trail:[] });
    }
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      shards.push({ x:x+(Math.random()-0.5)*24, y:y+(Math.random()-0.5)*16, vx:Math.cos(angle)*(0.3+Math.random()*1.0), vy:Math.sin(angle)*(0.3+Math.random()*1.0)+0.2, gravity:0.025, drag:0.99, alpha:0.65, fadeRate:0.003, radius:0.7+Math.random()*0.8, color:palette.mid, glow:false, trail:[] });
    }
    bursts.push({ shards, age: 0, maxAge: 150 });
    if (navigator.vibrate) navigator.vibrate(25);
  }

  function drawRocket(r) {
    for (let i = 0; i < r.trail.length; i++) {
      const pct = i / r.trail.length;
      ctx.save();
      ctx.globalAlpha = pct * pct * 0.65 * r.alpha;
      ctx.fillStyle   = r.palette.mid;
      ctx.shadowColor = r.palette.mid;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(r.trail[i].x, r.trail[i].y, Math.max(0.4, pct * 3.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha  = r.alpha;
    ctx.font         = `900 22px 'Playfair Display', serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = r.palette.core;
    ctx.shadowColor  = r.palette.mid;
    ctx.shadowBlur   = 18;
    ctx.fillText(r.letter, r.x, r.y);
    ctx.restore();
  }

  function drawBurst(b) {
    b.shards.forEach(s => {
      if (s.trail.length > 1) {
        ctx.save();
        ctx.lineCap = 'round'; ctx.lineWidth = s.radius * 0.7;
        ctx.strokeStyle = s.color; ctx.globalAlpha = s.alpha * 0.30;
        ctx.beginPath();
        ctx.moveTo(s.trail[0].x, s.trail[0].y);
        for (let i = 1; i < s.trail.length; i++) ctx.lineTo(s.trail[i].x, s.trail[i].y);
        ctx.lineTo(s.x, s.y); ctx.stroke(); ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = s.alpha; ctx.fillStyle = s.color;
      if (s.glow) { ctx.shadowColor = s.color; ctx.shadowBlur = 9; }
      ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(0.3, s.radius), 0, Math.PI * 2); ctx.fill(); ctx.restore();
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 5) s.trail.shift();
      s.x += s.vx; s.y += s.vy; s.vy += s.gravity; s.vx *= s.drag; s.vy *= s.drag;
      s.alpha -= s.fadeRate; s.radius *= 0.994;
    });
    b.shards = b.shards.filter(s => s.alpha > 0.02);
  }

  function frame(ts) {
    if (currentPage !== 2) { stopLoveFireworks(); return; }
    ctx.clearRect(0, 0, W, H);
    if (ts - lastLaunch > LAUNCH_INTERVAL) scheduleLaunch(ts);
    rockets.forEach(r => {
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 16) r.trail.shift();
      drawRocket(r);
      r.x += r.vx; r.y += r.vy; r.vy += r.gravity;
      if (!r.exploded && r.vy >= 0) { r.exploded = true; explode(r.x, r.y, r.palette); }
      if (r.exploded) r.alpha -= 0.10;
    });
    rockets = rockets.filter(r => r.alpha > 0);
    bursts.forEach(b => { b.age++; drawBurst(b); });
    bursts = bursts.filter(b => b.age < b.maxAge && b.shards.length > 0);
    loveFireRAF = requestAnimationFrame(frame);
  }

  scheduleLaunch(performance.now());
  loveFireRAF = requestAnimationFrame(frame);
}

// ══════════════════════════════════════════
// ══════════════════════════════════════════
// PAGE 3 – SPACE + SATURN ORBIT
// ══════════════════════════════════════════
let spaceAnimFrame = null;

function initPage3() {
  stopRain();
  if (spaceAnimFrame) cancelAnimationFrame(spaceAnimFrame);
  if (orbitFrame)     cancelAnimationFrame(orbitFrame);
  initSpaceAndOrbit();
}

function initSpaceAndOrbit() {
  const canvas = document.getElementById('space-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;

  // Stars
  const stars = [];
  [[150,0.3,0.85,0.40],[65,0.8,1.5,0.65],[18,1.4,2.6,0.90]].forEach(([n,mn,mx,a]) => {
    for (let i = 0; i < n; i++) stars.push({
      x: Math.random()*W, y: Math.random()*H,
      r: mn + Math.random()*(mx-mn),
      base: a*(0.5+Math.random()*0.5),
      ts: 0.002+Math.random()*0.012,
      to: Math.random()*Math.PI*2,
      col: Math.random()<0.12 ? `hsl(${210+Math.random()*50},65%,82%)`
         : Math.random()<0.07 ? `hsl(${32+Math.random()*14},75%,78%)` : '#ffffff',
    });
  });

  // ONE planet — top-right, warm ringed gas giant
  const PR = Math.min(38, W*0.09, H*0.09);
  const PX = W - PR * 3.4;
  const PY = PR * 2.8;

  const pOff = document.createElement('canvas');
  pOff.width = W; pOff.height = H;
  const pctx = pOff.getContext('2d');

  (function drawPlanetOnce() {
    const c1='#c4855a', c2='#5a2808', c3='#f0c090';
    const ringColor='rgba(220,170,90,0.45)', ringTilt=0.30;
    pctx.save();
    pctx.globalAlpha = 0.80;
    // ring back
    pctx.save();
    pctx.translate(PX,PY); pctx.scale(1,ringTilt);
    pctx.strokeStyle=ringColor; pctx.lineWidth=PR*0.55;
    pctx.beginPath(); pctx.ellipse(0,0,PR*2.5,PR*0.5,0,Math.PI,Math.PI*2); pctx.stroke();
    pctx.lineWidth=PR*0.20; pctx.strokeStyle='rgba(240,200,120,0.22)';
    pctx.beginPath(); pctx.ellipse(0,0,PR*3.1,PR*0.5,0,Math.PI,Math.PI*2); pctx.stroke();
    pctx.restore();
    // sphere
    const g=pctx.createRadialGradient(PX-PR*0.32,PY-PR*0.32,PR*0.08,PX,PY,PR);
    g.addColorStop(0,c3); g.addColorStop(0.45,c1); g.addColorStop(1,c2);
    pctx.fillStyle=g; pctx.shadowColor=c3; pctx.shadowBlur=PR*1.4;
    pctx.beginPath(); pctx.arc(PX,PY,PR,0,Math.PI*2); pctx.fill(); pctx.shadowBlur=0;
    // shadow
    const sh=pctx.createRadialGradient(PX+PR*0.4,PY+PR*0.35,0,PX,PY,PR);
    sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(0.55,'rgba(0,0,0,0.08)'); sh.addColorStop(1,'rgba(0,0,0,0.65)');
    pctx.fillStyle=sh; pctx.beginPath(); pctx.arc(PX,PY,PR,0,Math.PI*2); pctx.fill();
    // ring front
    pctx.save();
    pctx.translate(PX,PY); pctx.scale(1,ringTilt);
    pctx.strokeStyle=ringColor; pctx.lineWidth=PR*0.55;
    pctx.beginPath(); pctx.ellipse(0,0,PR*2.5,PR*0.5,0,0,Math.PI); pctx.stroke();
    pctx.lineWidth=PR*0.20; pctx.strokeStyle='rgba(240,200,120,0.22)';
    pctx.beginPath(); pctx.ellipse(0,0,PR*3.1,PR*0.5,0,0,Math.PI); pctx.stroke();
    pctx.restore();
    pctx.restore();
  })();

  // Saturn orbit bodies
  const RING_TILT = 0.22;
  const RING_HPAD = 52;
  const BODIES = [
    {emoji:'💖',size:15,offset:0},
    {emoji:'✨',size:11,offset:Math.PI*0.25},
    {emoji:'💗',size:13,offset:Math.PI*0.50},
    {emoji:'🌸',size:12,offset:Math.PI*0.75},
    {emoji:'💓',size:14,offset:Math.PI},
    {emoji:'🌹',size:11,offset:Math.PI*1.25},
    {emoji:'💫',size:12,offset:Math.PI*1.50},
    {emoji:'💝',size:13,offset:Math.PI*1.75},
  ];

  let orbitAngle = 0;
  let t = 0;

  function drawFrame() {
    if (currentPage !== 3) return;
    t += 0.016;

    // Background
    const bg = ctx.createLinearGradient(0,0,0,H);
    bg.addColorStop(0,'#010008'); bg.addColorStop(0.5,'#020010'); bg.addColorStop(1,'#030018');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // Nebula
    [[W*0.15,H*0.20,150,100,'rgba(90,30,160,0.032)'],
     [W*0.80,H*0.28,170,110,'rgba(20,60,160,0.028)'],
     [W*0.50,H*0.80,200,130,'rgba(160,20,80,0.028)'],
    ].forEach(([nx,ny,nrx,nry,nc]) => {
      ctx.save(); ctx.scale(1,nry/nrx);
      const ng=ctx.createRadialGradient(nx,ny*(nrx/nry),0,nx,ny*(nrx/nry),nrx);
      ng.addColorStop(0,nc); ng.addColorStop(1,'transparent');
      ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(nx,ny*(nrx/nry),nrx,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });

    ctx.drawImage(pOff,0,0);

    stars.forEach(s => {
      const tw=0.5+0.5*Math.sin(t*s.ts*60+s.to);
      ctx.save(); ctx.globalAlpha=s.base*(0.5+0.5*tw);
      if(s.r>1.1){ctx.shadowColor=s.col;ctx.shadowBlur=s.r*3;}
      ctx.fillStyle=s.col; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore();
    });

    // Saturn ring around the card
    const card = document.getElementById('bday-card');
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = rect.width / 2 + RING_HPAD;
    const ry   = rx * RING_TILT;

    const bands = [
      {rx:rx,      ry:ry,      lw:rx*0.10, color:'rgba(232,200,100,0.38)'},
      {rx:rx*0.80, ry:ry*0.80, lw:rx*0.14, color:'rgba(220,180,80,0.28)'},
      {rx:rx*1.18, ry:ry*1.18, lw:rx*0.06, color:'rgba(200,160,60,0.20)'},
    ];

    // Back half (behind card)
    bands.forEach(b => {
      ctx.save();
      ctx.strokeStyle=b.color; ctx.lineWidth=b.lw;
      ctx.shadowColor='rgba(220,190,80,0.28)'; ctx.shadowBlur=5;
      ctx.beginPath(); ctx.ellipse(cx,cy,b.rx,b.ry,0,Math.PI,Math.PI*2); ctx.stroke();
      ctx.restore();
    });

    const bodyData = BODIES.map(b => {
      const a=orbitAngle+b.offset;
      return {...b, bx:cx+Math.cos(a)*rx, by:cy+Math.sin(a)*ry, z:Math.sin(a)};
    });

    bodyData.filter(b=>b.z<0).sort((a,b)=>a.z-b.z).forEach(b => {
      const d=(b.z+1)/2;
      ctx.save(); ctx.globalAlpha=0.32+0.28*d;
      ctx.font=`${b.size*(0.55+0.18*d)}px serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='rgba(255,200,230,0.4)'; ctx.shadowBlur=4;
      ctx.fillText(b.emoji,b.bx,b.by); ctx.restore();
    });

    // Front half (in front of card)
    bands.forEach(b => {
      ctx.save();
      ctx.strokeStyle=b.color; ctx.lineWidth=b.lw;
      ctx.shadowColor='rgba(220,190,80,0.28)'; ctx.shadowBlur=5;
      ctx.beginPath(); ctx.ellipse(cx,cy,b.rx,b.ry,0,0,Math.PI); ctx.stroke();
      ctx.restore();
    });

    bodyData.filter(b=>b.z>=0).sort((a,b)=>a.z-b.z).forEach(b => {
      const d=(b.z+1)/2;
      ctx.save(); ctx.globalAlpha=0.62+0.38*d;
      ctx.font=`${b.size*(0.72+0.28*d)}px serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='rgba(255,200,230,0.65)'; ctx.shadowBlur=7*d;
      ctx.fillText(b.emoji,b.bx,b.by); ctx.restore();
    });

    orbitAngle += 0.009;
    spaceAnimFrame = requestAnimationFrame(drawFrame);
  }
  drawFrame();
}


const PHOTOS = [
  'assets/m4.mp4',
  'assets/m2.jpeg',
  'assets/m6.mp4',
  'assets/m3.mp4',
  'assets/m5.mp4',
  'assets/m10.mp4',
  'assets/m1.jpeg',
  'assets/m8.mp4',
  'assets/m7.mp4',
  'assets/m9.mp4',
  'assets/m11.mp4',
  'assets/m12.mp4',
  'assets/m13.jpeg',
  'assets/m14.mp4',
  'assets/m15.mp4',
  'assets/m17.mp4',
  'assets/m16.mp4',
];

const PLACEHOLDER_COLORS = [
  '#3d0d1a','#1a0d3d','#0d3d1a','#3d2e0d',
  '#2e0d3d','#0d2e3d','#3d0d2e','#1a3d0d',
];

function initPage4() {
  stopRain();
  const container = document.getElementById('photo-rain');
  container.innerHTML = '';

  function spawnPhoto() {
    if (currentPage !== 4) return;
    const el  = document.createElement('div');
    const w   = 80 + Math.random() * 100;
    const h   = 80 + Math.random() * 100;
    const rot = (Math.random() - 0.5) * 30;
    const dur = 4 + Math.random() * 5;
    const left = Math.random() * (window.innerWidth - w);
    el.style.cssText = `
      position:absolute; width:${w}px; height:${h}px;
      left:${left}px; top:-${h+20}px;
      border-radius:10px; border:2px solid rgba(232,25,60,0.35);
      box-shadow:0 8px 24px rgba(0,0,0,0.5);
      --rot:${rot}deg; animation:photoDrop ${dur}s linear forwards;
      overflow:hidden; display:flex; align-items:center; justify-content:center;
    `;

    if (PHOTOS.length > 0) {
      const src = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
      if (src.match(/\.(mp4|webm|mov)$/i)) {
        const v = document.createElement('video');
        v.src = src; v.autoplay = true; v.muted = true; v.loop = true;
        v.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        el.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        el.appendChild(img);
      }
    } else {
      el.style.background = PLACEHOLDER_COLORS[Math.floor(Math.random() * PLACEHOLDER_COLORS.length)];
      const ph = document.createElement('span');
      ph.textContent = ['📷','🖼️','🌸','💖'][Math.floor(Math.random() * 4)];
      ph.style.cssText = 'font-size:2rem;opacity:0.5;';
      el.appendChild(ph);
    }

    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 0.5) * 1000);
  }

  for (let i = 0; i < 6; i++) setTimeout(spawnPhoto, i * 300);
  photoRainInterval = setInterval(spawnPhoto, 600);
}

// ══════════════════════════════════════════
// PAGE 5 – LOVE PARTICLES + LIGHTNING
// ══════════════════════════════════════════
function initPage5() {
  stopRain();
  const canvas = document.getElementById('love-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const lc   = document.getElementById('lightning-canvas');
  const lctx = lc.getContext('2d');
  lc.width  = window.innerWidth;
  lc.height = window.innerHeight;

  const off  = document.createElement('canvas');
  off.width  = canvas.width; off.height = canvas.height;
  const octx = off.getContext('2d');
  const fs   = Math.min(canvas.width * 0.20, 100);
  octx.font         = `900 ${fs}px 'Playfair Display', serif`;
  octx.fillStyle    = 'white';
  octx.textAlign    = 'center';
  octx.textBaseline = 'middle';
  octx.fillText('i ❤ you', canvas.width / 2, canvas.height / 2);

  const imgData = octx.getImageData(0, 0, off.width, off.height).data;
  const targets = [];
  const step    = 4;
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      if (imgData[(y * off.width + x) * 4 + 3] > 128) targets.push({ x, y });
    }
  }

  const particles = targets.map(t => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    tx: t.x, ty: t.y,
    r:  1.2 + Math.random() * 0.8,
    delay: Math.random() * 1.4,
  }));

  const count  = particles.length;
  let start    = null;
  let allArrived = false;
  let arrivedAt  = null;
  let lightningStarted = false;

  (function loop(ts) {
    if (currentPage !== 5) return;
    if (!start) start = ts;
    const elapsed = (ts - start) / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = '#e8193c';

    let doneCount = 0;
    particles.forEach(p => {
      if (elapsed < p.delay) return;
      const dx = p.tx - p.x, dy = p.ty - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 1) { p.x += dx * 0.06; p.y += dy * 0.06; }
      else { p.x = p.tx; p.y = p.ty; doneCount++; }
      ctx.moveTo(p.x + p.r, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    });
    ctx.fill();

    if (doneCount === count && !allArrived) { allArrived = true; arrivedAt = ts; }

    if (allArrived && !lightningStarted) {
      lightningStarted = true;
      startLightning(lctx, lc.width, lc.height, () => {
        if (currentPage === 5) setTimeout(() => { if (currentPage === 5) goTo(1); }, 3000);
      });
    }

    if (!allArrived || (ts - arrivedAt) < 25000) loveAnimFrame = requestAnimationFrame(loop);
  })();
}

// ══════════════════════════════════════════
// LIGHTNING ENGINE
// ══════════════════════════════════════════
function startLightning(ctx, W, H, onDone) {
  const originX = W * 0.88;
  const originY = 0;

  let bolts       = [];
  let droplets    = [];
  let flashAlpha  = 0;
  let done        = false;
  let strikeCount = 0;
  const MAX_STRIKES = 5;
  let lastStrike   = performance.now();
  let nextStrikeIn = 500;
  let lightFrame;

  function makeBolt(sx, sy, ex, ey, depth, roughness) {
    if (depth === 0) return [{ x:sx, y:sy }, { x:ex, y:ey }];
    const mx = (sx+ex)/2 + (Math.random()-0.5)*roughness;
    const my = (sy+ey)/2 + (Math.random()-0.5)*roughness*0.4;
    return [...makeBolt(sx,sy,mx,my,depth-1,roughness*0.6).slice(0,-1), ...makeBolt(mx,my,ex,ey,depth-1,roughness*0.6)];
  }

  function spawnStrike() {
    if (currentPage !== 5) return;
    strikeCount++;
    const tx    = W * (0.05 + Math.random() * 0.75);
    const ty    = H * (0.45 + Math.random() * 0.45);
    const mainPts = makeBolt(originX, originY, tx, ty, 8, 120);
    const forks = [];
    const forkCount = 2 + Math.floor(Math.random() * 2);
    for (let f = 0; f < forkCount; f++) {
      const si  = Math.floor(mainPts.length * (0.2 + Math.random() * 0.5));
      const sp  = mainPts[si];
      const ang = Math.random() * Math.PI * 0.5 + Math.PI * 0.1;
      const len = 60 + Math.random() * 160;
      const fex = sp.x + Math.cos(ang) * len * (Math.random() < 0.5 ? 1 : -1);
      const fey = sp.y + Math.sin(ang) * len;
      forks.push({ pts: makeBolt(sp.x, sp.y, fex, fey, 5, 50), width: 0.5 + Math.random() * 0.8 });
    }
    if (forks.length > 0) {
      const par = forks[0].pts;
      const si  = Math.floor(par.length * 0.4);
      const sp  = par[si];
      forks.push({ pts: makeBolt(sp.x, sp.y, sp.x+(Math.random()-0.5)*80, sp.y+40+Math.random()*80, 4, 30), width: 0.4 });
    }
    bolts.push({ pts: mainPts, forks, life: 0, phases: buildFlickerPhases(), width: 2+Math.random()*1.5 });
    flashAlpha = 0.55 + Math.random() * 0.2;
    const burstCount = 18 + Math.floor(Math.random() * 14);
    for (let i = 0; i < burstCount; i++) spawnDroplet();
    if (navigator.vibrate) navigator.vibrate([80, 30, 40, 20, 20]);
  }

  function buildFlickerPhases() {
    return [
      { show:true,  frames: 2+Math.floor(Math.random()*3) },
      { show:false, frames: 1+Math.floor(Math.random()*2) },
      { show:true,  frames: 1+Math.floor(Math.random()*2), dim:0.5 },
      { show:false, frames: 1 },
      { show:true,  frames: 3+Math.floor(Math.random()*3), dim:0.25 },
    ];
  }

  function getBoltAlpha(bolt) {
    let n = 0;
    for (const ph of bolt.phases) {
      n += ph.frames;
      if (bolt.life < n) return ph.show ? (ph.dim || 1.0) : 0;
    }
    return 0;
  }

  function boltMaxLife(bolt) { return bolt.phases.reduce((s,p) => s + p.frames, 0); }

  function drawBoltPath(pts, alpha, width) {
    if (pts.length < 2 || alpha <= 0) return;
    ctx.save(); ctx.globalAlpha=alpha*0.18; ctx.strokeStyle='#c8e8ff'; ctx.lineWidth=width*12;
    ctx.lineJoin='round'; ctx.lineCap='round'; ctx.shadowColor='#a0d0ff'; ctx.shadowBlur=40;
    ctx.beginPath(); pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha=alpha*0.45; ctx.strokeStyle='#ddf0ff'; ctx.lineWidth=width*4;
    ctx.lineJoin='round'; ctx.lineCap='round'; ctx.shadowColor='#b8dfff'; ctx.shadowBlur=16;
    ctx.beginPath(); pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=width;
    ctx.lineJoin='round'; ctx.lineCap='round'; ctx.shadowColor='#ffffff'; ctx.shadowBlur=6;
    ctx.beginPath(); pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)); ctx.stroke(); ctx.restore();
  }

  function spawnDroplet() {
    droplets.push({
      x: Math.random()*W, y: Math.random()*H,
      r: 3+Math.random()*9, alpha: 0.55+Math.random()*0.35,
      life: 0, maxLife: 60+Math.floor(Math.random()*80),
      trail: Array.from({length:3+Math.floor(Math.random()*4)},(_,i)=>({ ox:(Math.random()-0.5)*6, oy:6+i*(4+Math.random()*5), r:1+Math.random()*1.8 }))
    });
  }

  function drip() {
    if (currentPage!==5 || done) return;
    if (Math.random()<0.35) spawnDroplet();
    setTimeout(drip, 80+Math.random()*120);
  }

  function drawDroplet(d) {
    const progress = d.life / d.maxLife;
    const a = d.alpha * (1 - progress);
    if (a <= 0.01) return;
    const ringR = d.r * (1 + progress * 0.6);
    ctx.save(); ctx.globalAlpha=a*0.5; ctx.strokeStyle='rgba(180,220,255,0.9)'; ctx.lineWidth=0.8;
    ctx.shadowColor='rgba(160,210,255,0.4)'; ctx.shadowBlur=4;
    ctx.beginPath(); ctx.arc(d.x,d.y,ringR,0,Math.PI*2); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha=a*0.35;
    const grad = ctx.createRadialGradient(d.x-ringR*0.2,d.y-ringR*0.2,0,d.x,d.y,ringR*0.7);
    grad.addColorStop(0,'rgba(240,248,255,0.9)'); grad.addColorStop(1,'rgba(160,210,255,0)');
    ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(d.x,d.y,ringR*0.7,0,Math.PI*2); ctx.fill(); ctx.restore();
    if (progress < 0.6) {
      d.trail.forEach(t => {
        ctx.save(); ctx.globalAlpha=a*0.25*(1-progress/0.6);
        ctx.strokeStyle='rgba(200,230,255,0.8)'; ctx.lineWidth=t.r*0.6; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(d.x+t.ox,d.y+t.oy); ctx.lineTo(d.x+t.ox*0.5,d.y+t.oy+5+progress*8); ctx.stroke(); ctx.restore();
      });
    }
  }

  function lightLoop(ts) {
    if (currentPage!==5) { ctx.clearRect(0,0,W,H); return; }
    if (strikeCount<MAX_STRIKES && (ts-lastStrike)>nextStrikeIn) {
      spawnStrike(); lastStrike=ts; nextStrikeIn=700+Math.random()*1400;
    }
    ctx.clearRect(0,0,W,H);
    if (flashAlpha>0.008) {
      ctx.save(); ctx.globalAlpha=flashAlpha; ctx.fillStyle='#f0f8ff'; ctx.fillRect(0,0,W,H); ctx.restore();
      flashAlpha*=0.68;
    }
    droplets = droplets.filter(d=>d.life<d.maxLife);
    droplets.forEach(d=>{drawDroplet(d);d.life++;});
    bolts = bolts.filter(b=>b.life<boltMaxLife(b));
    bolts.forEach(bolt=>{
      const a=getBoltAlpha(bolt);
      drawBoltPath(bolt.pts,a,bolt.width);
      bolt.forks.forEach(f=>drawBoltPath(f.pts,a*0.65,f.width));
      bolt.life++;
    });
    if (strikeCount>=MAX_STRIKES && bolts.length===0 && flashAlpha<0.008) {
      const wait = setInterval(()=>{
        if (droplets.length===0 || currentPage!==5) {
          clearInterval(wait);
          if (!done) { done=true; ctx.clearRect(0,0,W,H); onDone(); }
        }
      },100);
      return;
    }
    lightFrame = requestAnimationFrame(lightLoop);
  }

  setTimeout(()=>{ if(currentPage===5){ drip(); lightFrame=requestAnimationFrame(lightLoop); } },1200);
}

// ══════════════════════════════════════════
// BGM
// ══════════════════════════════════════════
function startBGM() {
  const bgm = document.getElementById('bgm');
  if (!bgm || bgm._started) return;
  bgm._started = true;
  bgm.volume = 0.65;
  bgm.play().catch(() => {});
}

// Try autoplay immediately on load (works on some browsers/contexts)
window.addEventListener('load', () => {
  const bgm = document.getElementById('bgm');
  if (!bgm) return;
  bgm.volume = 0.65;
  bgm.play().then(() => {
    bgm._started = true;
  }).catch(() => {
    // Blocked — will start on first interaction instead
  });
});

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
initPage1();
