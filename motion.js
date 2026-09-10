/* OneTab kinetic identities: real-time geometric fields, no tracking. */
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduce.matches; const engines=[];
 const controls=[...document.querySelectorAll('[data-motion-toggle]')];
 function sync(){document.body.classList.toggle('paused',paused);controls.forEach(b=>{b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'Activer les animations':'Suspendre les animations';});engines.forEach(e=>e.resume());}
 controls.forEach(b=>b.addEventListener('click',()=>{paused=!paused;sync();}));reduce.addEventListener('change',e=>{paused=e.matches;sync();});
 const menu=document.querySelector('.menu'),nav=document.querySelector('#navigation');
 function close(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
 menu?.addEventListener('click',()=>{const on=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(on));nav?.classList.toggle('open',on);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.nav-group[open]').forEach(x=>x.open=false);if(nav?.classList.contains('open')){close();menu.focus();}}});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.querySelectorAll('.nav-group').forEach(d=>{d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.nav-group').forEach(o=>{if(o!==d)o.open=false;});});});
 document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))document.querySelectorAll('.nav-group').forEach(x=>x.open=false);});
 document.querySelectorAll('.kinetic-canvas').forEach(canvas=>{
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const host=canvas.parentElement,mode=canvas.dataset.mode||'orbit';
  const palette=(canvas.dataset.colors||'54,245,185;60,144,255').split(';');
  let w=1,h=1,t=1.1,frame=0,last=0,visible=true,mx=0,my=0,tx=0,ty=0;
  const TAU=Math.PI*2;
  function project(x,y,z){const a=t*.13+mx*.5,ca=Math.cos(a),sa=Math.sin(a);let X=x*ca+z*sa,Z=-x*sa+z*ca;const tilt=-.35+my*.35,Y=y*Math.cos(tilt)-Z*Math.sin(tilt);Z=y*Math.sin(tilt)+Z*Math.cos(tilt);const p=4.8/(4.8-Z),r=Math.min(w*.32,h*.36);return [w*.5+X*r*p,h*.5+Y*r*p,Z,p];}
  const color=(i,a=1)=>`rgba(${palette[i%palette.length]},${a})`;
  function line(points,i,alpha=.4,width=.8){ctx.beginPath();points.forEach((p,j)=>j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color(i,alpha);ctx.lineWidth=width;ctx.stroke();}
  function dot(p,i,size=2){ctx.fillStyle=color(i,.45+(p[2]+2)/8);ctx.beginPath();ctx.arc(p[0],p[1],Math.max(.6,size*p[3]),0,TAU);ctx.fill();}
  function sphere(shell=1,phase=0){for(let j=1;j<24;j++){const lat=-Math.PI/2+j*Math.PI/24,pts=[];for(let k=0;k<=96;k++){const a=k*TAU/96;const r=shell*(1+.035*Math.sin(a*5+t+phase));pts.push(project(r*Math.cos(lat)*Math.cos(a),r*Math.sin(lat),r*Math.cos(lat)*Math.sin(a)));}line(pts,j%2,.14+Math.sin(j/24*Math.PI)*.2);}
   for(let j=0;j<20;j++){const a=j*TAU/20,pts=[];for(let k=0;k<=60;k++){const l=-Math.PI/2+k*Math.PI/60;pts.push(project(shell*Math.cos(l)*Math.cos(a),shell*Math.sin(l),shell*Math.cos(l)*Math.sin(a)));}line(pts,j,.22);}}
  function ring(radius,tilt,i,shift=0){const pts=[];for(let k=0;k<=140;k++){const a=k*TAU/140;pts.push(project(Math.cos(a)*radius,Math.sin(a)*Math.sin(tilt)*radius+shift,Math.sin(a)*Math.cos(tilt)*radius));}line(pts,i,.62,1.2);for(let n=0;n<3;n++){const a=t*.4+n*TAU/3+i;const p=project(Math.cos(a)*radius,Math.sin(a)*Math.sin(tilt)*radius+shift,Math.sin(a)*Math.cos(tilt)*radius);ctx.shadowBlur=14;ctx.shadowColor=color(i);dot(p,i,3.2);ctx.shadowBlur=0;}}
  function draw(){ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,Math.min(w,h)*.65);g.addColorStop(0,color(0,.12));g.addColorStop(.65,color(1,.035));g.addColorStop(1,color(0,0));ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
   if(mode==='orbit'||mode==='protection'){sphere(mode==='protection'?.9:1);ring(1.35,.2,0);ring(1.48,1.15,1);ring(1.3,-.8,0);if(mode==='protection'){sphere(1.15,t);for(let j=0;j<50;j++){const a=j*2.399,lat=Math.asin(-1+2*j/50),pulse=1.8-((t*.13+j/50)%1)*.45;dot(project(Math.cos(lat)*Math.cos(a)*pulse,Math.sin(lat)*pulse,Math.cos(lat)*Math.sin(a)*pulse),j,1.3);}}}
   else if(mode==='collaboration'){for(let strand=0;strand<3;strand++){for(let k=0;k<10;k++){const pts=[];for(let j=0;j<=110;j++){const u=j/110*TAU,a=u*2+strand*TAU/3+t*.23,r=.65+k*.035;pts.push(project(Math.cos(a)*r,(u/TAU-.5)*2.7,Math.sin(a)*r));}line(pts,strand,.22+k*.045,1);}for(let j=0;j<16;j++){const u=j/16*TAU,a=u*2+strand*TAU/3+t*.23;dot(project(Math.cos(a)*.83,(u/TAU-.5)*2.7,Math.sin(a)*.83),strand,2.8);}}}
   else if(mode==='network'){for(let z=0;z<19;z++){const pts=[];for(let x=0;x<42;x++){const X=(x/41-.5)*3.3,Z=(z/18-.5)*2.4,Y=Math.sin(X*2+t*.8+Z)*.3+Math.cos(Z*2+t*.35)*.2;const p=project(X,Y,Z);pts.push(p);if(x%5===0)dot(p,z,1.8);}line(pts,z,.38,1);}for(let x=0;x<20;x++){const pts=[];for(let z=0;z<38;z++){const X=(x/19-.5)*3.3,Z=(z/37-.5)*2.4;pts.push(project(X,Math.sin(X*2+t*.8+Z)*.3+Math.cos(Z*2+t*.35)*.2,Z));}line(pts,x,.22);} }
   else if(mode==='continuity'){for(let j=0;j<36;j++){const v=j*TAU/36,pts=[];for(let k=0;k<=100;k++){const u=k*TAU/100,R=.88,r=.33+.04*Math.sin(t+v*3);pts.push(project((R+r*Math.cos(v))*Math.cos(u),r*Math.sin(v),(R+r*Math.cos(v))*Math.sin(u)));}line(pts,j,.28,1);}ring(1.5,.6,0);ring(1.35,-.7,1);}
   else if(mode==='creation'){for(let j=0;j<44;j++){const pts=[];for(let k=0;k<=110;k++){const u=k*TAU/110,v=j/43*TAU,a=1+.2*Math.sin(3*u+t*.35);const x=a*Math.cos(u),y=a*Math.sin(u),z=.4*Math.sin(v+u*3+t*.3);pts.push(project(x*(.65+j/90),y*(.65+j/90),z));}line(pts,j,.2+.15*Math.sin(j/44*Math.PI),1);}}
   else {for(let j=0;j<26;j++)ring(.4+j*.043,Math.sin(t*.16+j*.09)*.9,j,Math.sin(j*.18+t*.3)*.18);}
   // Sparse background particles provide depth without fake operational metrics.
   for(let j=0;j<45;j++){const a=j*2.399+t*.012,r=1.5+(j%9)*.09;dot(project(Math.cos(a)*r,Math.sin(a)*r,Math.sin(j)*.9),j,.65);}
  }
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
  function tick(now){frame=0;if(paused||!visible||document.hidden)return;const dt=last?Math.min(now-last,48):16;last=now;t+=dt*.001;mx+=(tx-mx)*.045;my+=(ty-my)*.045;draw();frame=requestAnimationFrame(tick);}
  function resume(){stop();draw();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
  function resize(){const r=host.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);draw();}
  host.addEventListener('pointermove',e=>{const b=host.getBoundingClientRect();tx=(e.clientX-b.left)/w-.5;ty=(e.clientY-b.top)/h-.5;});host.addEventListener('pointerleave',()=>{tx=0;ty=0;});
  new ResizeObserver(resize).observe(host);new IntersectionObserver(e=>{visible=e[0].isIntersecting;resume();}).observe(host);engines.push({resume});resize();resume();
 });
 document.addEventListener('visibilitychange',()=>engines.forEach(e=>e.resume()));sync();
 // Progressive enhancement: content stays visible without JavaScript.
 if(!reduce.matches&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.detail-blocks article,.service-row,.project-card,.intro-grid,.steps article').forEach(el=>{el.classList.add('reveal');io.observe(el);});}
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelectorAll('.project-card').forEach(p=>p.hidden=b.dataset.filter!=='all'&&p.dataset.category!==b.dataset.filter);}));
})();
