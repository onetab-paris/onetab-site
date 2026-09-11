/* Apparitions progressives ; sans JS, tout le contenu reste visible. */
(()=>{
 const root=document.querySelector('.ig-v3');
 if(!root||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('ig-visible');observer.unobserve(entry.target);}
 }),{threshold:.08});
 root.querySelectorAll('.ig-photo,.ig-copy,.ig-monitor,.ig-lifecycle article,.ig-security article,.ig-awareness,.ig-loan,.ig-steps li').forEach(el=>{
  if(el.getBoundingClientRect().top>innerHeight){el.classList.add('ig-enter');observer.observe(el);}
 });
})();
