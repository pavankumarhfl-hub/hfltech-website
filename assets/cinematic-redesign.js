(function(){
  if(window.__HFL_CINEMATIC__) return; window.__HFL_CINEMATIC__=true;
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const load=(href)=>{if(document.querySelector('link[href="'+href+'"]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)};
  load('/assets/cinematic-redesign.css');
  function preloader(){try{if(reduced||sessionStorage.getItem('hfl-cine-seen'))return;sessionStorage.setItem('hfl-cine-seen','1')}catch(e){if(reduced)return}const p=document.createElement('div');p.className='cine-preloader';p.setAttribute('aria-label','HFL Tech loading');p.innerHTML='<div class="cine-orb" aria-hidden="true"></div><div class="cine-preloader__inner"><div class="cine-logo">HFL TECH</div><div class="cine-kicker">SUPER INTELLIGENCE · AGENTS · SOFTWARE</div><div class="cine-loader"><i></i></div></div>';document.body.prepend(p);setTimeout(()=>p.classList.add('is-done'),2400)}
  function announcement(){if(document.querySelector('.cine-announcement'))return;const a=document.createElement('div');a.className='cine-announcement';a.innerHTML='<span><b>AgentMesh</b> reference runtime is live · 6/6 checks passing.</span><a href="evidence.html">Inspect the evidence →</a>';const header=document.querySelector('.site-header');if(header)header.parentNode.insertBefore(a,header);else document.body.prepend(a)}
  function removeUnverifiedHomeClaims(){
    const home=/index\\.html$/.test(location.pathname)||location.pathname==='/'||location.pathname==='';
    if(!home)return;
    document.querySelector('.status-section')?.remove();
    document.querySelector('.trust-card[href="benchmarks.html"]')?.remove();
    document.querySelector('.trust-card[href="research.html"]')?.remove();
    document.querySelector('.trust-card[href*="github.com"]')?.querySelector('small')?.replaceChildren(document.createTextNode('Public source repository for the HFL Tech website.'));
    document.querySelectorAll('.project-row').forEach(row=>{if(/Flux AI/i.test(row.textContent))row.remove()});
  }
  function benchmarkScore(){
    const home=/index\\.html$/.test(location.pathname)||location.pathname==='/'||location.pathname==='';
    if(!home||document.querySelector('.benchmark-parity-target'))return;
    const anchor=document.querySelector('.technical-proof-section'); if(!anchor)return;
    const section=document.createElement('section'); section.className='section benchmark-parity-target';
    section.innerHTML='<div class="wrap"><div class="cost-proof"><div class="eyebrow">REAL MEASURED SCORE</div><h2>AgentMesh reference score: 100%.</h2><p class="section-intro">The current AgentMesh browser reference runtime passes 6 of 6 defined deterministic checks.</p><div class="cost-proof-grid"><div><div class="cost-number">100%</div><div class="cost-label">measured reference-runtime pass rate</div><p class="cost-note">This is a real measured engineering result for the published six-check reference suite. It is not a claim of model intelligence or superiority over OpenAI, Claude, Gemini or other external systems.</p></div><div class="cost-status"><span>VERIFIED · 06 OCT 2026</span><strong>6 / 6 deterministic checks passing.</strong><div class="cost-bars"><div class="cost-bar"><b>AgentMesh reference runtime</b><i style="width:100%"></i><em>100%</em></div><div class="cost-bar pending"><b>Frontier-model comparison</b><i style="width:0%"></i><em>not measured</em></div></div><a class="cost-cta" href="benchmarks.html">Open the benchmark methodology →</a></div></div></div></div>';
    anchor.parentNode.insertBefore(section,anchor.nextSibling);
  }
  function positionBrand(){
    const home=/index\\.html$/.test(location.pathname)||location.pathname==='/'||location.pathname==='';
    if(!home)return;
    const hero=document.querySelector('.hero h1');
    if(hero){hero.innerHTML='<span class="cine-gradient-text">India\'s Super Intelligence.</span><br>Built for real-world work.';}
    const lead=document.querySelector('.hero .lead');
    if(lead)lead.textContent='HFL Tech builds AgentMesh and intelligent software systems around execution, evaluation, automation and human control.';
    const eyebrow=document.querySelector('.hero .eyebrow');
    if(eyebrow)eyebrow.textContent='HFL TECH · INDIA';
    const agentTitle=document.querySelector('.cx-agent-title');
    if(agentTitle)agentTitle.textContent='AgentMesh';
    const agentSub=document.querySelector('.cx-agent-sub');
    if(agentSub)agentSub.textContent='Super Intelligence';
  }
  function enhance(){document.querySelectorAll('.feature-card,.trust-card,.lab-card,.project-row,.technical-proof-card,.benchmark-parity-target .cost-proof').forEach(el=>el.classList.add('cine-glass','cine-card-hover'));document.querySelectorAll('.cta').forEach((el,i)=>{if(i===0||/Explore AgentMesh/i.test(el.textContent))el.classList.add('cine-gradient-cta')});positionBrand();const proof=document.querySelector('.technical-proof-card');if(proof&&!proof.querySelector('.cine-pulse')){const s=document.createElement('span');s.className='cine-pulse';s.title='Verified reference-runtime signal';proof.prepend(s)}}
  function stats(){document.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count||0);if(!target)return;let done=false;const io=new IntersectionObserver(es=>{if(done||!es[0].isIntersecting)return;done=true;let t=0;const step=Math.max(1,Math.ceil(target/35));const timer=setInterval(()=>{t=Math.min(target,t+step);el.textContent=t.toLocaleString('en-IN');if(t>=target)clearInterval(timer)},25);io.disconnect()});io.observe(el)})}
  function seo(){
    const home=/index\\.html$/.test(location.pathname)||location.pathname==='/'||location.pathname==='';
    if(!home)return;
    document.title='HFL Tech | India Super Intelligence & AgentMesh';
    const set=(name,content)=>{let m=document.querySelector('meta[name="'+name+'"]');if(!m){m=document.createElement('meta');m.name=name;document.head.appendChild(m)}m.content=content};
    set('description','HFL Tech builds AgentMesh, a super-intelligence platform for real-world agent execution, automation, evaluation and human control.');
    set('keywords','HFL Tech, India super intelligence, AgentMesh, super intelligent systems, AI agents, agentic AI, intelligent automation, AI software, cybersecurity, India technology');
    const og=(prop,content)=>{let m=document.querySelector('meta[property="'+prop+'"]');if(!m){m=document.createElement('meta');m.setAttribute('property',prop);document.head.appendChild(m)}m.content=content};
    og('og:title','HFL Tech | India Super Intelligence & AgentMesh');
    og('og:description','HFL Tech builds AgentMesh and intelligent systems for real-world execution, automation, evaluation and human control.');
    const data={"@context":"https://schema.org","@type":"SoftwareApplication","name":"AgentMesh","applicationCategory":"BusinessApplication","operatingSystem":"Web","url":"https://hfltech.in/agentmesh.html","description":"A HFL Tech super-intelligence and agent execution platform under active development."};
    if(!document.querySelector('script[data-hfl-agent-schema]')){const s=document.createElement('script');s.type='application/ld+json';s.dataset.hflAgentSchema='1';s.textContent=JSON.stringify(data);document.head.appendChild(s)}
  }
  function boot(){announcement();removeUnverifiedHomeClaims();benchmarkScore();enhance();stats();seo();if(document.body)preloader()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
