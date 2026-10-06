(()=>{
  document.querySelectorAll('header.nav').forEach(header=>{
    header.innerHTML=`<div class="wrap nav-in"><a class="brand" href="/" aria-label="HFL Tech home"><span class="brand-mark" aria-hidden="true"></span><span>HFL Tech</span></a><nav class="links" aria-label="Primary"><button class="menu" data-dropdown="product-menu">Product⌄</button><button class="menu" data-dropdown="company-menu">Company⌄</button><a href="evidence.html">Evidence</a><a href="docs.html">Docs</a><a href="pricing.html">Pricing</a><button class="menu" data-dropdown="resources-menu">Resources⌄</button></nav><div class="actions"><a class="ghost" href="auth.html?mode=login">Log in</a><a class="button" href="auth.html?mode=signup">Request early access</a><button class="mobile-btn" aria-label="Open navigation" aria-expanded="false">☰</button></div></div><div class="dropdown" id="product-menu" hidden><a href="agentmesh.html"><b>AgentMesh</b><span>AI agent platform</span></a><a href="agentmesh-context.html"><b>Context</b><span>Understand the whole task</span></a><a href="agentmesh-control.html"><b>Control</b><span>Human approval boundaries</span></a></div><div class="dropdown" id="company-menu" hidden><a href="company.html"><b>About HFL Tech</b><span>Company and mission</span></a><a href="founder.html"><b>Founder</b><span>Pavan Kumar BN</span></a><a href="careers.html"><b>Careers</b><span>Open roles and hiring</span></a><a href="trust-center.html"><b>Trust Center</b><span>Security, privacy and reliability</span></a><a href="contact.html"><b>Contact</b><span>Professional enquiries</span></a></div><div class="dropdown" id="resources-menu" hidden><a href="research.html"><b>Research</b><span>Engineering and system notes</span></a><a href="changelog.html"><b>Changelog</b><span>Product updates</span></a><a href="status.html"><b>Status</b><span>Service status</span></a><a href="press.html"><b>Press</b><span>Official company information</span></a></div><div class="mobile-pop" hidden><a href="agentmesh.html">AgentMesh</a><a href="evidence.html">Evidence</a><a href="docs.html">Docs</a><a href="pricing.html">Pricing</a><a href="company.html">Company</a><a href="founder.html">Founder</a><a href="careers.html">Careers</a><a href="trust-center.html">Trust Center</a><a href="contact.html">Contact</a></div>`;
  });
})();

(()=>{
  const nav=document.querySelector('.nav');
  const mobile=document.querySelector('.mobile-btn');
  const pop=document.querySelector('.mobile-pop');
  const hotfix=document.createElement('style');
  hotfix.textContent=`
    html,body{max-width:100%;overflow-x:hidden}
    .brand-mark{display:none!important}
    .brand{min-width:auto!important;white-space:nowrap}
    .brand span:not(.brand-mark){display:inline!important}
    @media(max-width:1100px){
      .nav-in{gap:14px}
      .links{display:none!important}
      .actions .ghost{display:none!important}
      .mobile-btn{display:grid!important;place-items:center}
      .hero{padding-top:128px}
      .hero h1{font-size:clamp(42px,10vw,64px);max-width:900px}
      .product-window{width:100%;overflow:hidden}
      .app{grid-template-columns:160px minmax(0,1fr)!important}
      .detail{display:none!important}
    }
    @media(max-width:640px){
      .wrap{width:min(calc(100% - 28px),1160px)}
      .nav{height:60px}
      .nav-in{height:60px}
      .hero{padding:112px 0 55px}
      .hero h1{font-size:clamp(39px,11.5vw,54px);line-height:.98;letter-spacing:-.055em}
      .hero p{font-size:15px;line-height:1.55}
      .hero-actions{flex-direction:column;align-items:stretch}
      .hero-actions .button,.hero-actions .link{justify-content:center}
      .product-window{margin-top:44px;border-radius:11px;transform:none!important}
      .app{grid-template-columns:1fr!important;min-height:0!important}
      .sidebar{display:none!important}
      .center{padding:16px!important;min-width:0}
      .center-head{gap:12px}
      .mini{white-space:nowrap}
      .run-head,.run{grid-template-columns:7px minmax(0,1fr) 44px;gap:8px}
      .run strong{font-size:10.5px;line-height:1.35}
      .run code{font-size:8px}
      .timeline{grid-template-columns:1fr!important}
      .timeline div{border-right:0!important;border-bottom:1px solid var(--line)}
      .timeline div:last-child{border-bottom:0}
      .feature,.feature.reverse{grid-template-columns:1fr!important;gap:32px;padding:86px 0}
      .feature.reverse .copy,.feature.reverse .visual{grid-column:auto!important;grid-row:auto!important}
      .demo{padding:19px}
      .demo-row{grid-template-columns:minmax(0,1fr) 60px 50px;gap:7px;font-size:11px}
      .section{padding:92px 0}
      .section h2{font-size:clamp(36px,10vw,50px)}
      .grid3,.updates{grid-template-columns:1fr!important}
      .logo-row{grid-template-columns:1fr 1fr!important}
      .footer-grid{grid-template-columns:1fr 1fr!important}
      .footer-brand{grid-column:1/-1}
      .mobile-pop{top:60px!important}
    }
  `;
  document.head.appendChild(hotfix);
  window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>8),{passive:true});
  document.querySelectorAll('[data-dropdown]').forEach(btn=>btn.addEventListener('click',e=>{
    e.stopPropagation();const id=btn.dataset.dropdown;
    document.querySelectorAll('.dropdown').forEach(x=>{if(x.id!==id)x.hidden=true});
    const el=document.getElementById(id);if(el)el.hidden=!el.hidden;
  }));
  document.addEventListener('click',()=>document.querySelectorAll('.dropdown').forEach(x=>x.hidden=true));
  mobile?.addEventListener('click',()=>{if(!pop)return;pop.hidden=!pop.hidden;mobile.setAttribute('aria-expanded',String(!pop.hidden));});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.querySelector('[data-command]')?.focus()}});
  document.querySelectorAll('.pill-btn').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.target)?.classList.toggle('open')));
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));}else document.querySelectorAll('.reveal').forEach(x=>x.classList.add('revealed'));
  document.querySelectorAll('form[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();form.hidden=true;document.querySelector(form.dataset.demoForm)?.removeAttribute('hidden')}));
  document.querySelectorAll('.brand').forEach(el=>{const mark=el.querySelector('.brand-mark');const word=el.querySelector('span:not(.brand-mark)');if(mark&&word){mark.textContent='';mark.setAttribute('aria-hidden','true');word.textContent='HFL Tech'}});
})();

(function(){
  if(window.__hflAgentMeshLoaded)return;window.__hflAgentMeshLoaded=true;
  const API=window.HFL_AGENTMESH_API||'https://agentmesh-hfltech-api.onrender.com';
  const style=document.createElement('style');
  style.textContent=`
    .am-launch{position:fixed;right:22px;bottom:22px;z-index:9998;border:1px solid rgba(255,255,255,.24);background:#f2f2ed;color:#050505;border-radius:999px;padding:12px 17px;font:800 13px/1 Inter,system-ui,sans-serif;box-shadow:0 16px 50px rgba(0,0,0,.42);cursor:pointer}
    .am-panel{position:fixed;right:22px;bottom:78px;width:min(420px,calc(100vw - 28px));height:min(650px,calc(100vh - 105px));z-index:9999;display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:linear-gradient(145deg,#111315,#060708);box-shadow:0 30px 100px rgba(0,0,0,.62);color:#f4f4ef}
    .am-panel.open{display:flex}.am-head{display:flex;align-items:center;justify-content:space-between;padding:15px 16px;border-bottom:1px solid rgba(255,255,255,.1)}.am-title{display:flex;align-items:center;gap:10px}.am-dot{width:9px;height:9px;border-radius:50%;background:#d9d9d3;box-shadow:0 0 14px rgba(255,255,255,.4)}.am-title strong{font-size:14px}.am-title small{display:block;color:#8e908b;font-size:10px;margin-top:2px}.am-close{border:0;background:transparent;color:#aaa;cursor:pointer;font-size:22px}.am-messages{flex:1;overflow:auto;padding:18px 15px;display:flex;flex-direction:column;gap:13px}.am-msg{max-width:88%;padding:11px 13px;border-radius:13px;font-size:13px;line-height:1.62;white-space:pre-wrap}.am-user{align-self:flex-end;background:#f0f0eb;color:#080909;border-bottom-right-radius:4px}.am-ai{align-self:flex-start;background:#15181b;border:1px solid rgba(255,255,255,.09);color:#e3e4df;border-bottom-left-radius:4px}.am-status{padding:0 15px 8px;color:#858781;font-size:11px;min-height:18px}.am-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.1);background:#090b0d}.am-input{flex:1;resize:none;min-height:42px;max-height:120px;border:1px solid rgba(255,255,255,.15);border-radius:11px;background:#111417;color:#f4f4ef;padding:11px 12px;font:500 13px/1.4 Inter,system-ui,sans-serif;outline:none}.am-send{width:44px;border:0;border-radius:11px;background:#ededE8;color:#050505;font-weight:900;cursor:pointer}.am-send:disabled{opacity:.45;cursor:default}.am-note{padding:0 15px 10px;color:#656762;font-size:9px;line-height:1.4}@media(max-width:700px){.am-launch{right:14px;bottom:14px}.am-panel{right:8px;bottom:68px;width:calc(100vw - 16px);height:calc(100vh - 82px);border-radius:16px}}
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