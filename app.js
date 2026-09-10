(() => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Ouvrir le menu'); };
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu'); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); menu.focus(); } });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('#motion');
  let paused = reduce.matches;
  let frame = null;
  let visible = true;
  const canvas = document.querySelector('#network');
  const ctx = canvas?.getContext('2d');
  let w = 0, h = 0, angle = .2, px = 0, py = 0, tx = 0, ty = 0;
  const applyMotion = () => { document.body.classList.toggle('paused', paused); toggle?.setAttribute('aria-pressed', String(paused)); if (toggle) toggle.textContent = paused ? 'Activer les animations' : 'Suspendre les animations'; };
  const stop = () => { if (frame !== null) cancelAnimationFrame(frame); frame = null; };
  const start = () => { stop(); if (ctx && !paused && visible && !document.hidden) frame = requestAnimationFrame(draw); };
  toggle?.addEventListener('click', () => { paused = !paused; applyMotion(); start(); });
  reduce.addEventListener('change', e => { paused = e.matches; applyMotion(); start(); });
  applyMotion();
  if (!ctx) return;
  function resize() { const box = canvas.getBoundingClientRect(); w = box.width; h = box.height; const d = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(w * d); canvas.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0); render(); }
  function point(x, y, z) { const a = angle + px; const rx = x * Math.cos(a) + z * Math.sin(a); const rz = -x * Math.sin(a) + z * Math.cos(a); const tilt = -.30 + py; const ry = y * Math.cos(tilt) - rz * Math.sin(tilt); const zz = y * Math.sin(tilt) + rz * Math.cos(tilt); const k = 3.8 / (3.8 - zz); const r = Math.min(w * .36, h * .36); return [w * .53 + rx * r * k, h * .5 + ry * r * k, zz]; }
  function line(points, alpha, width = .65) { ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.strokeStyle = `rgba(75,125,255,${alpha})`; ctx.lineWidth = width; ctx.stroke(); }
  function render() {
    ctx.clearRect(0, 0, w, h);
    const r = Math.min(w, h) * .52;
    const glow = ctx.createRadialGradient(w*.53,h*.5,0,w*.53,h*.5,r); glow.addColorStop(0,'rgba(31,69,174,.22)'); glow.addColorStop(.65,'rgba(25,53,120,.10)'); glow.addColorStop(1,'rgba(16,18,20,0)'); ctx.fillStyle = glow; ctx.fillRect(0,0,w,h);
    for (let j = 1; j < 23; j++) { const lat = -Math.PI / 2 + j * Math.PI / 23; const points = []; for (let i = 0; i <= 100; i++) { const a = i * Math.PI * 2 / 100; points.push(point(Math.cos(lat)*Math.cos(a),Math.sin(lat),Math.cos(lat)*Math.sin(a))); } line(points, .22 + .16 * Math.cos(lat)); }
    for (let j = 0; j < 32; j++) { const lon = j * Math.PI * 2 / 32; const points = []; for (let i = 0; i <= 65; i++) { const lat = -Math.PI/2 + i*Math.PI/65; points.push(point(Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon))); } line(points,.25); }
    for (let o = 0; o < 3; o++) { const points = []; for (let i=0;i<=130;i++) { const a=i*Math.PI*2/130; const t=o*.85+.25; points.push(point(Math.cos(a)*1.26,Math.sin(a)*Math.sin(t)*1.26,Math.sin(a)*Math.cos(t)*1.26)); } line(points,o===0?.7:.28,o===0?1:.6); const a=angle*(o+1)*.85+o*2; const t=o*.85+.25; const p=point(Math.cos(a)*1.26,Math.sin(a)*Math.sin(t)*1.26,Math.sin(a)*Math.cos(t)*1.26); ctx.shadowBlur=17;ctx.shadowColor='#689bff';ctx.fillStyle='#aacaff';ctx.beginPath();ctx.arc(p[0],p[1],3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0; }
    for(let j=0;j<21;j++){const lat=Math.sin(j*2.4)*1.2;const a=j*2.399;const p=point(Math.cos(lat)*Math.cos(a),Math.sin(lat),Math.cos(lat)*Math.sin(a));if(p[2]<-.15)continue;ctx.fillStyle=`rgba(181,209,255,${.45+p[2]*.5})`;ctx.beginPath();ctx.arc(p[0],p[1],1.7+p[2],0,Math.PI*2);ctx.fill();}
  }
  let last = 0;
  function draw(now) { frame = null; const dt = Math.min(now-last || 16,40); last = now; angle += dt * .000065; px += (tx-px)*.035; py += (ty-py)*.035; render(); if(!paused && visible && !document.hidden) frame=requestAnimationFrame(draw); }
  canvas.parentElement.addEventListener('pointermove', e => { const b=canvas.getBoundingClientRect();tx=((e.clientX-b.left)/w-.5)*.6;ty=((e.clientY-b.top)/h-.5)*.35; });
  canvas.parentElement.addEventListener('pointerleave',()=>{tx=0;ty=0;});
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start();}).observe(canvas);
  document.addEventListener('visibilitychange',start);
  resize(); start();
})();
