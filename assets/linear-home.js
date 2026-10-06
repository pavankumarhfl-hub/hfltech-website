const nav=document.querySelector('.lh-nav');
const menus={product:document.getElementById('product-menu'),resources:document.getElementById('resources-menu')};
const mobileNav=document.getElementById('mobile-nav');
const mobileBtn=document.querySelector('.mobile-menu-btn');
const override=document.createElement('link');override.rel='stylesheet';override.href='assets/home-overrides.css';document.head.appendChild(override);
const cinematic=document.createElement('link');cinematic.rel='stylesheet';cinematic.href='assets/home-cinematic.css';document.head.appendChild(cinematic);
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>8),{passive:true});
document.querySelectorAll('.nav-menu').forEach(btn=>btn.addEventListener('click',()=>{const target=menus[btn.dataset.menu];Object.entries(menus).forEach(([k,el])=>{if(k!==btn.dataset.menu)el.hidden=true});if(mobileNav)mobileNav.hidden=true;target.hidden=!target.hidden;}));
if(mobileBtn&&mobileNav){mobileBtn.addEventListener('click',()=>{mobileNav.hidden=!mobileNav.hidden;mobileBtn.setAttribute('aria-expanded',String(!mobileNav.hidden));Object.values(menus).forEach(el=>el.hidden=true);});}
document.addEventListener('click',e=>{if(!e.target.closest('.lh-nav')){Object.values(menus).forEach(el=>el.hidden=true);if(mobileNav)mobileNav.hidden=true;if(mobileBtn)mobileBtn.setAttribute('aria-expanded','false')}});
document.querySelectorAll('.mobile-nav-pop a').forEach(a=>a.addEventListener('click',()=>{if(mobileNav)mobileNav.hidden=true;if(mobileBtn)mobileBtn.setAttribute('aria-expanded','false')}));
const localLogos={google:'assets/logo-google.svg',openai:'assets/logo-openai.svg',googlegemini:'assets/logo-gemini.svg',x:'assets/logo-x.svg'};
document.querySelectorAll('.logo-strip img').forEach(img=>{const match=(img.getAttribute('src')||'').match(/simpleicons\.org\/(google|openai|googlegemini|x)/);if(match)img.src=localLogos[match[1]];img.addEventListener('error',()=>{img.style.display='none';});});
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>img.style.visibility='hidden'));
document.querySelectorAll('.lh-actions a').forEach(a=>{if(a.textContent.trim().toLowerCase()==='log in'){a.href='auth.html?mode=login';a.textContent='Log in';}if(a.textContent.trim().toLowerCase()==='get started'){a.href='auth.html?mode=signup';a.textContent='Get started';}});
document.querySelectorAll('a').forEach(a=>{const t=a.textContent.trim().toLowerCase();if(t==='sign up'||t==='create account')a.href='auth.html?mode=signup';});
const revealTargets=document.querySelectorAll('.section-intro,.principle-grid article,.feature-row,.ecosystem .logo-strip,.updates-head,.update-card,.quote,.lh-final');
revealTargets.forEach((el,i)=>{el.classList.add('reveal-ready');if(i%4===1)el.classList.add('reveal-delay-1');if(i%4===2)el.classList.add('reveal-delay-2');if(i%4===3)el.classList.add('reveal-delay-3');});
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');io.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -35px'});revealTargets.forEach(el=>io.observe(el));}else revealTargets.forEach(el=>el.classList.add('revealed'));
if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches){document.querySelectorAll('.feature-visual,.hero-frame').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1200px) rotateX(${(-y*1.4).toFixed(2)}deg) rotateY(${(x*1.8).toFixed(2)}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>{card.style.transform='';});});}
