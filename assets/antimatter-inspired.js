(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header=document.querySelector('.topbar'),menu=document.querySelector('.menu-toggle'),mobile=document.querySelector('.mobile-nav');
  const close=()=>{mobile?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open menu');if(menu)menu.textContent='☰';};
  const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>16);
  window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  menu?.addEventListener('click',()=>{const open=!mobile.classList.contains('open');mobile.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');menu.textContent=open?'×':'☰';});
  mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
  // Three.js owns this canvas. Only create a still 2D fallback when motion is reduced.
  const canvas=document.getElementById('hero-sphere');
  if(reduced&&canvas){const ctx=canvas.getContext('2d');if(ctx){const draw=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.4);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);const w=r.width,h=r.height,cx=w*.5,cy=h*.5,rad=Math.min(w,h)*.32;const glow=ctx.createRadialGradient(cx,cy,rad*.08,cx,cy,rad*1.4);glow.addColorStop(0,'rgba(110,214,195,.12)');glow.addColorStop(.6,'rgba(110,214,195,.035)');glow.addColorStop(1,'rgba(110,214,195,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,rad*1.4,0,Math.PI*2);ctx.fill();for(let i=0;i<240;i++){const y=1-2*(i+.5)/240,a=i*2.399963,radius=Math.sqrt(1-y*y)*rad;ctx.fillStyle='rgba(174,239,228,.45)';ctx.beginPath();ctx.arc(cx+Math.cos(a)*radius,cy+y*rad,.7,0,Math.PI*2);ctx.fill();}};draw();}}
  const form=document.getElementById('contact-form');
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);let valid=true;form.querySelectorAll('[data-error]').forEach(el=>el.textContent='');for(const field of form.querySelectorAll('[required]')){const value=field.value.trim();const bad=!value||(field.type==='email'&&!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(value));if(bad){const error=form.querySelector('[data-error="'+field.name+'"]');if(error)error.textContent=field.type==='email'?'Enter a valid email address.':'This field is required.';valid=false;}}if(!valid)return;const subject=encodeURIComponent('HFL Tech enquiry · '+data.get('topic'));const body=encodeURIComponent('Name: '+data.get('name')+'\\nEmail: '+data.get('email')+'\\nCompany: '+(data.get('company')||'—')+'\\nTopic: '+data.get('topic')+'\\n\\n'+data.get('message'));const status=document.getElementById('form-status');if(status){status.hidden=false;status.textContent='Your email app will open with your message ready to send.';}window.location.href='mailto:HFLFOUNDER@GMAIL.COM?subject='+subject+'&body='+body;});}
})();
/* Cinematic story engine: page-specific atmosphere, scroll chapters, light parallax, progress. */
(()=> {
 if(window.__hflCinematicV2)return;window.__hflCinematicV2=true;
 const body=document.body,main=document.querySelector('main');if(!body||!main)return;
 const path=(location.pathname+' '+document.title+' '+(main.querySelector('h1')?.textContent||'')).toLowerCase();
 const scene=path.includes('astra')||path.includes('space')?'astra':path.includes('robot')||path.includes('superman')?'robotics':path.includes('agentmesh')||path.includes('flux')?'agentmesh':path.includes('founder')?'founder':path.includes('ecosystem')||path.includes('directory')?'ecosystem':'hfltech';
 body.dataset.cineScene=scene;
 const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const progress=document.createElement('div');progress.className='cine-progress';progress.setAttribute('aria-hidden','true');body.appendChild(progress);
 const vignette=document.createElement('div');vignette.className='cine-vignette';vignette.setAttribute('aria-hidden','true');body.appendChild(vignette);
 const candidates=[...main.querySelectorAll('section')];
 const hero=candidates[0];
 if(hero){const art=hero.querySelector('canvas, .hero-art, .hero-visual, .page-scene-canvas, .robot-visual, .space-visual, img');if(art)art.classList.add('cine-hero-art','cine-art-ready')}
 const chapters=new Set();
 candidates.forEach((section,si)=>{
   section.dataset.cineChapter=String(si+1);
   const nodes=section.querySelectorAll(':scope > .wrap > .section-heading,:scope > .wrap > .section-head,:scope > .wrap > h2,:scope > .wrap > .eyebrow,:scope > .wrap > .work-grid > *, :scope > .wrap > .directory-item,:scope > .wrap > .ecosystem-chapter,:scope > .wrap > .astra-story,:scope > .wrap > .project-row,:scope > .wrap > .timeline-pro article');
   nodes.forEach((el,i)=>{if(el.closest('.hero,.page-hero,.robotics-hero,.founder-hero,.astra-hero,.story-hero,.ecosystem-hero,.directory-hero'))return;el.classList.add('cine-chapter');if((i%3)===1)el.classList.add('cine-from-left');el.style.setProperty('--cine-stagger',Math.min(i%5,4)*75+'ms');chapters.add(el)});
   const rule=section.querySelector('hr');if(rule){rule.classList.add('cine-rule');chapters.add(rule)}
 });
 if(reduce){chapters.forEach(el=>el.classList.add('cine-visible'));body.classList.add('cine-ready');return}
 if('IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('cine-visible');if(e.target.matches('section'))e.target.classList.add('cine-in-view');io.unobserve(e.target)}}),{threshold:.13,rootMargin:'0px 0px -6% 0px'});
  candidates.forEach(s=>io.observe(s));chapters.forEach(el=>io.observe(el));
 }else chapters.forEach(el=>el.classList.add('cine-visible'));
 body.classList.add('cine-ready');
 let scheduled=false;
 const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+ (max>0?Math.min(1,scrollY/max):0)+')';if(!reduce&&innerWidth>640){const art=hero?.querySelector('.cine-hero-art');if(art){const rect=hero.getBoundingClientRect();const offset=Math.max(-18,Math.min(18,-rect.top*.035));art.style.setProperty('--cine-parallax',offset+'px')}}scheduled=false};
 const onScroll=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});update();
})();
