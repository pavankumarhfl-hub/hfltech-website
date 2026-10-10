(()=>{
  document.querySelectorAll('header.nav').forEach(header=>{
    header.innerHTML=`<div class="wrap nav-in"><a class="brand" href="/" aria-label="HFL Tech home"><span class="brand-mark" aria-hidden="true"></span><span>HFL Tech</span></a><nav class="links" aria-label="Primary"><button class="menu" data-dropdown="product-menu" aria-haspopup="true" aria-expanded="false">Product⌄</button><button class="menu" data-dropdown="solutions-menu" aria-haspopup="true" aria-expanded="false">Solutions⌄</button><a href="docs.html">Developers</a><button class="menu" data-dropdown="resources-menu" aria-haspopup="true" aria-expanded="false">Resources⌄</button><button class="menu" data-dropdown="company-menu" aria-haspopup="true" aria-expanded="false">Company⌄</button><a href="pricing.html">Pricing</a><a href="contact.html">Contact</a></nav><div class="actions"><a class="button" href="contact.html?topic=early-access">Request early access</a><button class="mobile-btn" aria-label="Open navigation" aria-expanded="false">☰</button></div></div><div class="dropdown" id="product-menu" hidden><a href="agentmesh.html"><b>AgentMesh</b><span>AI agent platform</span></a><a href="agentmesh-context.html"><b>Context</b><span>Understand the whole task</span></a><a href="agentmesh-control.html"><b>Control</b><span>Human approval boundaries</span></a></div><div class="dropdown" id="solutions-menu" hidden><a href="projects.html"><b>Solutions overview</b><span>Example workflows and intended users</span></a><a href="agentmesh.html#runtime"><b>Software engineering</b><span>Prototype and reference workflows</span></a><a href="research.html"><b>Research workflows</b><span>Organise context and evidence</span></a><a href="roadmap.html"><b>Operations</b><span>Automation concepts with human review</span></a></div><div class="dropdown" id="company-menu" hidden><a href="company.html"><b>About HFL Tech</b><span>Company and mission</span></a><a href="founder.html"><b>Founder</b><span>Pavan Kumar BN</span></a><a href="careers.html"><b>Careers</b><span>Open roles and hiring</span></a><a href="trust-center.html"><b>Trust Center</b><span>Security, privacy and reliability</span></a><a href="contact.html"><b>Contact</b><span>Professional enquiries</span></a></div><div class="dropdown" id="resources-menu" hidden><a href="research.html"><b>Research</b><span>Engineering and system notes</span></a><a href="changelog.html"><b>Changelog</b><span>Product updates</span></a><a href="status.html"><b>Status</b><span>Service status</span></a><a href="press.html"><b>Press</b><span>Official company information</span></a></div><div class="mobile-pop" hidden><a href="agentmesh.html">AgentMesh</a><a href="evidence.html">Evidence</a><a href="docs.html">Developers &amp; docs</a><a href="projects.html">Solutions</a><a href="pricing.html">Pricing</a><a href="research.html">Research</a><a href="changelog.html">Changelog</a><a href="company.html">Company</a><a href="founder.html">Founder</a><a href="careers.html">Careers</a><a href="trust-center.html">Trust Center</a><a href="contact.html">Contact</a></div>`;
  });

  document.querySelectorAll('[data-dropdown]').forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();const id=btn.dataset.dropdown;document.querySelectorAll('.dropdown').forEach(x=>{if(x.id!==id)x.hidden=true});const el=document.getElementById(id);if(el){el.hidden=!el.hidden;btn.setAttribute('aria-expanded',String(!el.hidden));}})});
  document.addEventListener('click',()=>document.querySelectorAll('.dropdown').forEach(x=>{x.hidden=true;const b=document.querySelector('[data-dropdown="'+x.id+'"]');if(b)b.setAttribute('aria-expanded','false')}));
  const mobile=document.querySelector('.mobile-btn'),pop=document.querySelector('.mobile-pop'); mobile?.addEventListener('click',()=>{if(!pop)return;pop.hidden=!pop.hidden;mobile.setAttribute('aria-expanded',String(!pop.hidden));});
  document.querySelectorAll('.pill-btn').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.target)?.classList.toggle('open')));
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));}else document.querySelectorAll('.reveal').forEach(x=>x.classList.add('revealed'));
  document.querySelectorAll('form[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();form.hidden=true;document.querySelector(form.dataset.demoForm)?.removeAttribute('hidden')}));
  document.querySelectorAll('.brand').forEach(el=>{el.replaceChildren(document.createTextNode('HFL Tech'));el.setAttribute('aria-label','HFL Tech home');});if(!document.querySelector('link[data-hfl-site-polish]')){const polish=document.createElement('link');polish.rel='stylesheet';polish.href='/assets/site-wide-polish.css?v=20261010-v6';polish.dataset.hflSitePolish='true';document.head.appendChild(polish);}
})();

(function(){
  if(window.__hflAgentMeshLoaded)return;window.__hflAgentMeshLoaded=true;
  const API=window.HFL_AGENTMESH_API||'https://agentmesh-hfltech-api.onrender.com';
  const style=document.createElement('style');
  style.textContent=`
    .am-launch{position:fixed;right:22px;bottom:22px;z-index:9998;border:1px solid rgba(255,255,255,.24);background:#f2f2ed;color:#050505;border-radius:999px;padding:12px 17px;font:800 13px/1 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 16px 50px rgba(0,0,0,.42);cursor:pointer}
    .am-panel{position:fixed;right:22px;bottom:78px;width:min(420px,calc(100vw - 28px));height:min(650px,calc(100vh - 105px));z-index:9999;display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:linear-gradient(145deg,#111315,#060708);box-shadow:0 30px 100px rgba(0,0,0,.62);color:#f4f4ef}
    .am-panel.open{display:flex}.am-head{display:flex;align-items:center;justify-content:space-between;padding:15px 16px;border-bottom:1px solid rgba(255,255,255,.1)}.am-title{display:flex;align-items:center;gap:10px}.am-dot{width:9px;height:9px;border-radius:50%;background:#d9d9d3;box-shadow:0 0 14px rgba(255,255,255,.4)}.am-title strong{font-size:14px}.am-title small{display:block;color:#8e908b;font-size:10px;margin-top:2px}.am-close{border:0;background:transparent;color:#aaa;cursor:pointer;font-size:22px}.am-messages{flex:1;overflow:auto;padding:18px 15px;display:flex;flex-direction:column;gap:13px}.am-msg{max-width:88%;padding:11px 13px;border-radius:13px;font-size:13px;line-height:1.62;white-space:pre-wrap}.am-user{align-self:flex-end;background:#f0f0eb;color:#080909;border-bottom-right-radius:4px}.am-ai{align-self:flex-start;background:#15181b;border:1px solid rgba(255,255,255,.09);color:#e3e4df;border-bottom-left-radius:4px}.am-status{padding:0 15px 8px;color:#858781;font-size:11px;min-height:18px}.am-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.1);background:#090b0d}.am-input{flex:1;resize:none;min-height:42px;max-height:120px;border:1px solid rgba(255,255,255,.15);border-radius:11px;background:#111417;color:#f4f4ef;padding:11px 12px;font:500 13px/1.4 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;outline:none}.am-send{width:44px;border:0;border-radius:11px;background:#ededE8;color:#050505;font-weight:900;cursor:pointer}.am-send:disabled{opacity:.45;cursor:default}.am-note{padding:0 15px 10px;color:#656762;font-size:9px;line-height:1.4}@media(max-width:700px){.am-launch{right:14px;bottom:14px}.am-panel{right:8px;bottom:68px;width:calc(100vw - 16px);height:calc(100vh - 82px);border-radius:16px}}
  `;
  document.head.appendChild(style);
  const launch=document.createElement('button');launch.className='am-launch';launch.type='button';launch.textContent='Ask AgentMesh';
  const panel=document.createElement('section');panel.className='am-panel';panel.innerHTML='<div class="am-head"><div class="am-title"><i class="am-dot"></i><div><strong>AgentMesh</strong><small>HFL Tech assistant</small></div></div><button class="am-close" aria-label="Close">×</button></div><div class="am-messages"></div><div class="am-status"></div><div class="am-note">Do not submit passwords, payment details or other sensitive information.</div><form class="am-form"><textarea class="am-input" rows="1" placeholder="Ask about HFL Tech or AgentMesh…"></textarea><button class="am-send" type="submit">↑</button></form>';
  document.body.append(launch,panel);
  const messages=panel.querySelector('.am-messages'),input=panel.querySelector('.am-input'),form=panel.querySelector('.am-form'),send=panel.querySelector('.am-send'),status=panel.querySelector('.am-status');
  let sessionId=localStorage.getItem('hfl_agentmesh_session')||'';
  const add=(text,kind)=>{const el=document.createElement('div');el.className='am-msg '+(kind==='user'?'am-user':'am-ai');el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el};
  add("Hi. I’m the AgentMesh assistant from HFL Tech. Ask about HFL Tech, AgentMesh, Flux AI, technology, or general technical questions.",'ai');
  launch.addEventListener('click',()=>{panel.classList.add('open');input.focus()});panel.querySelector('.am-close').addEventListener('click',()=>panel.classList.remove('open'));
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
  form.addEventListener('submit',async e=>{
    e.preventDefault();const message=input.value.trim();if(!message||send.disabled)return;add(message,'user');input.value='';send.disabled=true;status.textContent='AgentMesh is processing…';const ai=add('','ai');
    try{
      const res=await fetch(API+'/v1/chat/stream',{method:'POST',headers:{'Content-Type':'application/json',...(sessionId?{'X-Session-ID':sessionId}:{})},body:JSON.stringify({message})});
      if(!res.ok)throw new Error('Request failed.');
      const reader=res.body.getReader(),decoder=new TextDecoder();let buffer='';
      while(true){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const parts=buffer.split('\n\n');buffer=parts.pop()||'';for(const part of parts){const line=part.split('\n').find(x=>x.startsWith('data:'));if(!line)continue;try{const data=JSON.parse(line.slice(5).trim());if(data.type==='delta'){ai.textContent+=data.text;messages.scrollTop=messages.scrollHeight}if(data.type==='done'&&data.session_id){sessionId=data.session_id;localStorage.setItem('hfl_agentmesh_session',sessionId)}}catch(_){}}}
      if(!ai.textContent)ai.textContent='AgentMesh returned an empty response.';
    }catch(_){ai.textContent='AgentMesh is currently unavailable. Please try again shortly.'}
    finally{send.disabled=false;status.textContent='';input.focus()}
  });
})();





(()=>{const scene=document.getElementById('mesh-3d');if(!scene)return;
const stages=[
{title:'Request',desc:'A task begins with a clear objective, boundaries and a definition of done. The system should know what success means before it acts.',status:'Goal defined'},
{title:'Context',desc:'Relevant sources, working state and constraints are assembled so the task is grounded in the information it is allowed to use.',status:'Context assembled'},
{title:'Plan',desc:'The task is broken into a sequence of steps. The plan identifies what needs a tool, what can be checked, and where risk may arise.',status:'Plan prepared'},
{title:'Tools',desc:'The agent can call only tools and resources that have been made available to it. Tool access is not the same as permission to perform every action.',status:'Scoped access'},
{title:'Human control',desc:'Actions with meaningful external impact can pause for review. Approval boundaries should be explicit, not hidden in the interface.',status:'Review boundary'},
{title:'Evaluate',desc:'The run records its outcome and trace so a person can inspect what happened, identify failures and decide what should happen next.',status:'Outcome inspectable'}];
const nodes=[...scene.querySelectorAll('.mesh-node')],tabs=[...document.querySelectorAll('.mesh-sequence button')];
const index=document.getElementById('mesh-index'),title=document.getElementById('mesh-title'),desc=document.getElementById('mesh-description'),status=document.getElementById('mesh-status');
function select(n){const s=stages[n];nodes.forEach((b,i)=>{b.classList.toggle('is-active',i===n);b.setAttribute('aria-pressed',String(i===n))});tabs.forEach((b,i)=>{b.classList.toggle('is-active',i===n);b.setAttribute('aria-pressed',String(i===n))});index.textContent=String(n+1).padStart(2,'0')+' / 06';title.textContent=s.title;desc.textContent=s.desc;status.textContent=s.status}
nodes.forEach((b,i)=>b.addEventListener('click',()=>select(i)));tabs.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
const run=document.getElementById('mesh-run');run.addEventListener('click',()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){select(5);return}scene.classList.remove('is-running');void scene.offsetWidth;scene.classList.add('is-running');let n=0;select(0);run.disabled=true;run.textContent='Sequence running…';const tick=()=>{n++;if(n<stages.length){select(n);setTimeout(tick,520)}else{run.disabled=false;run.innerHTML='Run again <span>↗</span>';setTimeout(()=>scene.classList.remove('is-running'),800)}};setTimeout(tick,520)});
select(0);
})();


(()=> {
  const footer=document.querySelector('footer.footer, footer.site-footer, footer');
  if(!footer || footer.dataset.compactFooter==='true') return;
  footer.dataset.compactFooter='true';
  footer.innerHTML=`<div class="wrap compact-footer">
    <div class="compact-footer-main">
      <a class="brand" href="/" aria-label="HFL Tech home"><span class="brand-mark" aria-hidden="true"></span><span>HFL Tech</span></a>
      <nav class="compact-footer-links" aria-label="Footer navigation">
        <a href="agentmesh.html">AgentMesh</a>
        <a href="evidence.html">Evidence</a>
        <a href="docs.html">Docs</a>
        <a href="pricing.html">Pricing</a>
        <a href="contact.html">Contact</a>
        <a href="ecosystem.html">HFL ecosystem <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
    <div class="compact-footer-bottom"><span>© 2026 HFL Tech Private Limited</span><span><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="legal/cookies.html">Cookies</a><a href="legal/acceptable-use.html">Acceptable use</a></span></div>
  </div>`;
  const style=document.createElement('style');
  style.textContent=`.compact-footer{padding-top:28px;padding-bottom:20px}.compact-footer-main{display:flex;align-items:flex-start;justify-content:space-between;gap:28px;flex-wrap:wrap}.compact-footer .brand{display:inline-flex;align-items:center;gap:9px;color:var(--text,#eceff3);text-decoration:none;font-weight:650}.compact-footer-links{display:flex;gap:10px 22px;align-items:center;justify-content:flex-end;flex-wrap:wrap}.compact-footer-links a,.compact-footer-bottom a{color:var(--muted,#9aa4b2);text-decoration:none;font-size:13px;line-height:1.5}.compact-footer-links a:hover,.compact-footer-bottom a:hover{color:var(--text,#eceff3)}.compact-footer-bottom{margin-top:22px;padding-top:14px;border-top:1px solid var(--border,#232a33);display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;color:var(--muted,#9aa4b2);font-size:12px}.compact-footer-bottom span:last-child{display:flex;gap:18px}@media(max-width:640px){.compact-footer{padding-top:22px}.compact-footer-main{display:block}.compact-footer-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 16px;margin-top:22px;justify-content:stretch}.compact-footer-links a{font-size:14px;min-height:32px;display:flex;align-items:center}.compact-footer-bottom{margin-top:16px}.compact-footer-bottom span:first-child{width:100%}}`;
  document.head.appendChild(style);
})();
