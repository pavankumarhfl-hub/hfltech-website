(function(){
  if(window.__HFL_CINEMATIC__) return;
  window.__HFL_CINEMATIC__=true;
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const load=(href)=>{if(document.querySelector('link[href="'+href+'"]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)};
  load('/assets/cinematic-redesign.css');

  function preloader(){
    if(reduced) return;
    try{if(sessionStorage.getItem('hfl-cine-seen'))return;sessionStorage.setItem('hfl-cine-seen','1')}catch(e){}
    const p=document.createElement('div');
    p.className='cine-preloader';
    p.setAttribute('aria-label','HFL Tech loading');
    p.innerHTML='<div class="cine-orb" aria-hidden="true"></div><div class="cine-preloader__inner"><div class="cine-logo">HFL TECH</div><div class="cine-kicker">SUPER INTELLIGENCE · AGENTS · SOFTWARE</div><div class="cine-loader"><i></i></div></div>';
    document.body.prepend(p);
    setTimeout(()=>p.classList.add('is-done'),1800);
  }

  function enhance(){
    document.querySelectorAll('.feature-card,.trust-card,.lab-card,.project-row,.technical-proof-card,.benchmark-parity-target .cost-proof,.cx-agent-panel').forEach(el=>el.classList.add('cine-glass','cine-card-hover'));
    document.querySelectorAll('.cta').forEach((el,i)=>{if(i===0||/Explore AgentMesh/i.test(el.textContent))el.classList.add('cine-gradient-cta')});
    const proof=document.querySelector('.technical-proof-card');
    if(proof&&!proof.querySelector('.cine-pulse')){
      const s=document.createElement('span');
      s.className='cine-pulse';
      s.title='Verified reference-runtime signal';
      proof.prepend(s);
    }
  }

  function seo(){
    const isHome=/index\\.html$/.test(location.pathname)||location.pathname==='/'||location.pathname==='';
    if(!isHome)return;
    document.title='HFL Tech — AgentMesh Super Intelligence & Technology';
    const set=(name,content)=>{
      let m=document.querySelector('meta[name="'+name+'"]');
      if(!m){m=document.createElement('meta');m.name=name;document.head.appendChild(m)}
      m.content=content;
    };
    set('description','HFL Tech is an India-built technology company developing AgentMesh, a super intelligence platform for reasoning, tools, execution, evaluation and human control.');
    const og=(prop,content)=>{
      let m=document.querySelector('meta[property="'+prop+'"]');
      if(!m){m=document.createElement('meta');m.setAttribute('property',prop);document.head.appendChild(m)}
      m.content=content;
    };
    og('og:title','HFL Tech — AgentMesh Super Intelligence & Technology');
    og('og:description','HFL Tech builds AgentMesh and intelligent software systems for reasoning, tools, execution, evaluation and human control.');
  }

  function boot(){seo();enhance();if(document.body)preloader()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
