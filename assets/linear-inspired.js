(function(){
  const home=location.pathname==='/'||location.pathname===''||/index\.html$/.test(location.pathname); if(!home)return;
  function boot(){
    document.documentElement.classList.add('hfl-linear');
    const hero=document.querySelector('.hero h1');
    if(hero) hero.innerHTML='<span class="cine-gradient-text">Super Intelligence.</span><br>Built for real-world work.';
    const lead=document.querySelector('.hero .lead');
    if(lead) lead.textContent='HFL Tech builds AgentMesh and intelligent software systems for reasoning, execution, evaluation and human control.';
    const eyebrow=document.querySelector('.hero .eyebrow');
    if(eyebrow) eyebrow.textContent='HFL TECH · INDIA';
    const feature=document.querySelector('.cx-feature');
    if(feature){
      const panel=feature.querySelector('.cx-agent-panel');
      if(panel && !panel.querySelector('.linear-product-copy')){
        const copy=document.createElement('div');copy.className='linear-product-copy';
        copy.innerHTML='<div class="eyebrow">FLAGSHIP PLATFORM</div><h3>AgentMesh</h3><p>A super-intelligence platform for agent reasoning, tools, execution and evaluation.</p><a class="text-link" href="agentmesh.html">Explore AgentMesh →</a>';
        panel.appendChild(copy);
      }
    }
    document.querySelectorAll('.project-row').forEach((row,i)=>{if(/Flux AI/i.test(row.textContent))row.remove();});
    document.querySelectorAll('.trust-card').forEach(card=>{if(/Research/i.test(card.textContent))card.remove();});
    const gh=document.querySelector('.trust-card[href*="github.com"] small');if(gh)gh.textContent='Public source repository for the HFL Tech website.';
    const status=document.querySelector('.status-section');if(status)status.remove();
    const announce=document.querySelector('.cine-announcement span');if(announce)announce.innerHTML='<b>AgentMesh</b> reference runtime · 6/6 checks passing.';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
