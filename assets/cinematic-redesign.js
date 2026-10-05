(function(){
  if(window.__HFL_CINEMATIC__) return; window.__HFL_CINEMATIC__=true;
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const load=(href)=>{if(document.querySelector('link[href="'+href+'"]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)};
  load('/assets/cinematic-redesign.css');
  function preloader(){try{if(reduced||sessionStorage.getItem('hfl-cine-seen'))return;sessionStorage.setItem('hfl-cine-seen','1')}catch(e){if(reduced)return}const p=document.createElement('div');p.className='cine-preloader';p.setAttribute('aria-label','HFL Tech loading');p.innerHTML='<div class="cine-orb" aria-hidden="true"></div><div class="cine-preloader__inner"><div class="cine-logo">HFL TECH</div><div class="cine-kicker">AGENTS · SOFTWARE · SECURITY</div><div class="cine-loader"><i></i></div></div>';document.body.prepend(p);setTimeout(()=>p.classList.add('is-done'),2400)}
  function announcement(){if(document.querySelector('.cine-announcement'))return;const a=document.createElement('div');a.className='cine-announcement';a.innerHTML='<span><b>AgentMesh</b> reference runtime is live.</span><a href="evidence.html">Inspect the implementation →</a>';const header=document.querySelector('.site-header');if(header)header.parentNode.insertBefore(a,header);else document.body.prepend(a)}
  function removeUnverifiedHomeClaims(){
    const home=/index\.html$/.test(location.pathname)||location.pathname==='/'||location.pathname==='';
    if(!home)return;
    document.querySelector('.status-section')?.remove();
    document.querySelector('.trust-card[href="benchmarks.html"]')?.remove();
    document.querySelector('.trust-card[href="research.html"]')?.remove();
    document.querySelector('.trust-card[href*="github.com"]')?.querySelector('small')?.replaceChildren(document.createTextNode('Public source repository for the HFL Tech website.'));
    document.querySelectorAll('.project-row').forEach(row=>{if(/Flux AI/i.test(row.textContent))row.remove()});
  }
  function enhance(){document.querySelectorAll('.feature-card,.trust-card,.lab-card,.project-row,.technical-proof-card').forEach(el=>el.classList.add('cine-glass','cine-card-hover'));document.querySelectorAll('.cta').forEach((el,i)=>{if(i===0||/Explore AgentMesh/i.test(el.textContent))el.classList.add('cine-gradient-cta')});const hero=document.querySelector('.hero h1');if(hero&&!hero.dataset.cine){hero.dataset.cine='1';hero.innerHTML=hero.textContent.replace(/real-world use\.?/i,'<span class="cine-gradient-text">real-world use.</span>')}const proof=document.querySelector('.technical-proof-card');if(proof&&!proof.querySelector('.cine-pulse')){const s=document.createElement('span');s.className='cine-pulse';s.title='Verified reference-runtime signal';proof.prepend(s)}}
  function stats(){document.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count||0);if(!target)return;let done=false;const io=new IntersectionObserver(es=>{if(done||!es[0].isIntersecting)return;done=true;let t=0;const step=Math.max(1,Math.ceil(target/35));const timer=setInterval(()=>{t=Math.min(target,t+step);el.textContent=t.toLocaleString('en-IN');if(t>=target)clearInterval(timer)},25);io.disconnect()});io.observe(el)})}
  function boot(){announcement();removeUnverifiedHomeClaims();enhance();stats();if(document.body)preloader()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
