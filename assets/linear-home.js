const nav=document.querySelector('.lh-nav');
const menus={product:document.getElementById('product-menu'),resources:document.getElementById('resources-menu')};
const mobileNav=document.getElementById('mobile-nav');
const mobileBtn=document.querySelector('.mobile-menu-btn');
const override=document.createElement('link');override.rel='stylesheet';override.href='assets/home-overrides.css';document.head.appendChild(override);
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>8),{passive:true});
document.querySelectorAll('.nav-menu').forEach(btn=>btn.addEventListener('click',()=>{const target=menus[btn.dataset.menu];Object.entries(menus).forEach(([k,el])=>{if(k!==btn.dataset.menu)el.hidden=true});if(mobileNav)mobileNav.hidden=true;target.hidden=!target.hidden;}));
if(mobileBtn&&mobileNav){mobileBtn.addEventListener('click',()=>{mobileNav.hidden=!mobileNav.hidden;mobileBtn.setAttribute('aria-expanded',String(!mobileNav.hidden));Object.values(menus).forEach(el=>el.hidden=true);});}
document.addEventListener('click',e=>{if(!e.target.closest('.lh-nav')){Object.values(menus).forEach(el=>el.hidden=true);if(mobileNav)mobileNav.hidden=true;if(mobileBtn)mobileBtn.setAttribute('aria-expanded','false')}});
document.querySelectorAll('.mobile-nav-pop a').forEach(a=>a.addEventListener('click',()=>{if(mobileNav)mobileNav.hidden=true;if(mobileBtn)mobileBtn.setAttribute('aria-expanded','false')}));
// Use first-party local logo assets so the ecosystem strip does not depend on external CDNs.
const localLogos={google:'assets/logo-google.svg',openai:'assets/logo-openai.svg',googlegemini:'assets/logo-gemini.svg',x:'assets/logo-x.svg'};
document.querySelectorAll('.logo-strip img').forEach(img=>{const match=(img.getAttribute('src')||'').match(/simpleicons\.org\/(google|openai|googlegemini|x)/);if(match)img.src=localLogos[match[1]];img.addEventListener('error',()=>{img.style.display='none';});});
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>img.style.visibility='hidden'));
// Keep authentication entry points consistent across the site.
document.querySelectorAll('.lh-actions a').forEach(a=>{if(a.textContent.trim().toLowerCase()==='log in'){a.href='auth.html?mode=login';a.textContent='Log in';}if(a.textContent.trim().toLowerCase()==='get started'){a.href='auth.html?mode=signup';a.textContent='Get started';}});
document.querySelectorAll('a').forEach(a=>{const t=a.textContent.trim().toLowerCase();if(t==='sign up'||t==='create account')a.href='auth.html?mode=signup';});