/* HFL Tech — shared interactions. No libraries. */
(function(){
  function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded",fn); }
  ready(function(){
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const header=document.querySelector(".site-header");
    const nav=document.querySelector(".nav");
    const menu=document.querySelector(".menu");

    /* Accessible mobile navigation */
    if(header&&nav&&menu&&!nav.querySelector(".mobile-menu-toggle")){
      const t=document.createElement("button");
      t.className="mobile-menu-toggle";
      t.type="button";
      t.setAttribute("aria-label","Open navigation");
      t.setAttribute("aria-expanded","false");
      t.setAttribute("aria-controls","hfl-mobile-menu");
      menu.id="hfl-mobile-menu";
      t.innerHTML="<span></span><span></span><span></span>";
      nav.appendChild(t);
      const close=()=>{
        header.classList.remove("mobile-nav-open");
        t.setAttribute("aria-expanded","false");
        t.setAttribute("aria-label","Open navigation");
      };
      t.addEventListener("click",()=>{
        const open=header.classList.toggle("mobile-nav-open");
        t.setAttribute("aria-expanded",String(open));
        t.setAttribute("aria-label",open?"Close navigation":"Open navigation");
      });
      menu.addEventListener("click",e=>{if(e.target.closest("a"))close();});
      document.addEventListener("click",e=>{if(!header.contains(e.target))close();});
      document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
    }

    /* Current-page state */
    const current=(location.pathname.split("/").pop()||"index.html").toLowerCase();
    document.querySelectorAll(".menu a").forEach(a=>{
      const href=(a.getAttribute("href")||"").split("/").pop().split("#")[0].toLowerCase();
      if(href===current||(current===""&&href==="index.html")) a.classList.add("is-current");
      if(a.classList.contains("is-current")) a.setAttribute("aria-current","page");
    });

    /* Scroll reveal */
    const reveal=document.querySelectorAll(
      ".card,.status-card,.trust-card,.feature-card,.project-row,.lab-card,.section-head,"+
      ".system-node,.ecosystem-strip a,.tech-layer-list a,.timeline article,.comparison-row,"+
      ".investor-card,.impact-card,.stat-card,.resource-card,.roadmap-card,.tech-card,.research-card"
    );
    if(!reduce&&"IntersectionObserver" in window){
      const io=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },{threshold:.08,rootMargin:"0px 0px -48px"});
      reveal.forEach(el=>{el.classList.add("reveal-item");io.observe(el);});
    }else{
      reveal.forEach(el=>el.classList.add("is-visible"));
    }

    /* Scroll-driven cinematic background + progress */
    let ticking=false;
    const scrollUpdate=()=>{
      ticking=false;
      const y=Math.max(0,window.scrollY||0);
      const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      const progress=Math.min(1,y/max);
      document.documentElement.style.setProperty("--hfl-scroll-y",y+"px");
      document.documentElement.style.setProperty("--hfl-progress",progress.toFixed(4));
      if(header) header.classList.toggle("is-scrolled",y>18);
    };
    addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(scrollUpdate);ticking=true;}},{passive:true});
    scrollUpdate();

    /* Pointer lighting is subtle and disabled on touch-only layouts */
    if(!reduce&&window.matchMedia("(pointer:fine)").matches){
      addEventListener("pointermove",e=>{
        const x=(e.clientX/window.innerWidth-.5)*18;
        const y=(e.clientY/window.innerHeight-.5)*12;
        document.documentElement.style.setProperty("--hfl-pointer-x",x.toFixed(1)+"px");
        document.documentElement.style.setProperty("--hfl-pointer-y",y.toFixed(1)+"px");
      },{passive:true});
      document.querySelectorAll(".card,.status-card,.trust-card,.lab-card,.impact-card,.investor-card").forEach(card=>{
        card.addEventListener("pointermove",e=>{
          const r=card.getBoundingClientRect();
          card.style.setProperty("--mx",((e.clientX-r.left)/r.width*100).toFixed(1)+"%");
          card.style.setProperty("--my",((e.clientY-r.top)/r.height*100).toFixed(1)+"%");
          if(window.innerWidth>900){
            const x=(e.clientX-r.left)/r.width-.5;
            const y=(e.clientY-r.top)/r.height-.5;
            card.style.setProperty("--tilt-x",(y*-2.1).toFixed(2)+"deg");
            card.style.setProperty("--tilt-y",(x*2.1).toFixed(2)+"deg");
          }
        });
        card.addEventListener("pointerleave",()=>{
          card.style.setProperty("--mx","50%");
          card.style.setProperty("--my","0%");
          card.style.setProperty("--tilt-x","0deg");
          card.style.setProperty("--tilt-y","0deg");
        });
      });
    }

    /* Hero scene follows pointer + scroll slightly, preserving its CSS animation */
    const scene=document.querySelector(".hero-3d .scene");
    if(scene&&!reduce&&window.matchMedia("(pointer:fine)").matches){
      addEventListener("pointermove",e=>{
        const x=(e.clientX/window.innerWidth-.5)*2;
        const y=(e.clientY/window.innerHeight-.5)*2;
        scene.style.setProperty("--tilt-x",(y*-2.2).toFixed(2)+"deg");
        scene.style.setProperty("--tilt-y",(x*3.0).toFixed(2)+"deg");
      },{passive:true});
    }

    /* Top progress rail */
    const bar=document.createElement("div");
    bar.className="hfl-scroll-progress";
    bar.setAttribute("aria-hidden","true");
    bar.style.cssText="position:fixed;left:0;top:0;width:100%;z-index:1000;pointer-events:none;transform-origin:left center;transform:scaleX(0)";
    document.body.appendChild(bar);
    if(!reduce){
      const progressUpdate=()=>{
        const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
        bar.style.transform="scaleX("+Math.min(1,window.scrollY/max)+")";
      };
      addEventListener("scroll",progressUpdate,{passive:true});
      progressUpdate();
    }else bar.hidden=true;
  });
})();

/* AgentMesh live web assistant */
(function(){
  if(window.__hflAgentMeshLoaded) return;
  window.__hflAgentMeshLoaded=true;
  const API="https://agentmesh-hfltech-api.onrender.com";
  const style=document.createElement("style");
  style.textContent=`
    .am-launch{position:fixed;right:22px;bottom:22px;z-index:9998;border:1px solid rgba(255,255,255,.24);background:#f2f2ed;color:#050505;border-radius:999px;padding:12px 17px;font:800 13px/1 Inter,system-ui,sans-serif;box-shadow:0 16px 50px rgba(0,0,0,.42);cursor:pointer}
    .am-launch:hover{transform:translateY(-2px);box-shadow:0 20px 60px rgba(0,0,0,.5)}
    .am-panel{position:fixed;right:22px;bottom:78px;width:min(420px,calc(100vw - 28px));height:min(650px,calc(100vh - 105px));z-index:9999;display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:linear-gradient(145deg,#111315,#060708);box-shadow:0 30px 100px rgba(0,0,0,.62);color:#f4f4ef}
    .am-panel.open{display:flex}
    .am-head{display:flex;align-items:center;justify-content:space-between;padding:15px 16px;border-bottom:1px solid rgba(255,255,255,.10)}
    .am-title{display:flex;align-items:center;gap:10px}.am-dot{width:9px;height:9px;border-radius:50%;background:#d9d9d3;box-shadow:0 0 14px rgba(255,255,255,.4)}.am-title strong{font-size:14px}.am-title small{display:block;color:#8e908b;font-size:10px;margin-top:2px}
    .am-close{border:0;background:transparent;color:#aaa;cursor:pointer;font-size:22px}
    .am-messages{flex:1;overflow:auto;padding:18px 15px;display:flex;flex-direction:column;gap:13px}
    .am-msg{max-width:88%;padding:11px 13px;border-radius:13px;font-size:13px;line-height:1.62;white-space:pre-wrap}.am-user{align-self:flex-end;background:#f0f0eb;color:#080909;border-bottom-right-radius:4px}.am-ai{align-self:flex-start;background:#15181b;border:1px solid rgba(255,255,255,.09);color:#e3e4df;border-bottom-left-radius:4px}
    .am-status{padding:0 15px 8px;color:#858781;font-size:11px;min-height:18px}
    .am-form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.10);background:#090b0d}.am-input{flex:1;resize:none;min-height:42px;max-height:120px;border:1px solid rgba(255,255,255,.15);border-radius:11px;background:#111417;color:#f4f4ef;padding:11px 12px;font:500 13px/1.4 Inter,system-ui,sans-serif;outline:none}.am-input:focus{border-color:rgba(255,255,255,.32)}.am-send{width:44px;border:0;border-radius:11px;background:#ededE8;color:#050505;font-weight:900;cursor:pointer}.am-send:disabled{opacity:.45;cursor:default}
    .am-note{padding:0 15px 10px;color:#656762;font-size:9px;line-height:1.4}
    @media(max-width:700px){.am-launch{right:14px;bottom:14px}.am-panel{right:8px;bottom:68px;width:calc(100vw - 16px);height:calc(100vh - 82px);border-radius:16px}}
  `;
  document.head.appendChild(style);
  const launch=document.createElement("button"); launch.className="am-launch"; launch.type="button"; launch.textContent="Ask AgentMesh";
  const panel=document.createElement("section"); panel.className="am-panel"; panel.setAttribute("aria-label","AgentMesh AI assistant");
  panel.innerHTML='<div class="am-head"><div class="am-title"><i class="am-dot"></i><div><strong>AgentMesh</strong><small>Powered by HFL Tech · Flush</small></div></div><button class="am-close" aria-label="Close">×</button></div><div class="am-messages"></div><div class="am-status"></div><div class="am-note">Responses are generated by the AgentMesh server. Do not submit passwords, payment details or other sensitive information.</div><form class="am-form"><textarea class="am-input" rows="1" placeholder="Ask HFL Tech / AgentMesh anything…"></textarea><button class="am-send" type="submit">↑</button></form>';
  document.body.append(launch,panel);
  const messages=panel.querySelector(".am-messages"), input=panel.querySelector(".am-input"), form=panel.querySelector(".am-form"), send=panel.querySelector(".am-send"), status=panel.querySelector(".am-status");
  let sessionId=localStorage.getItem("hfl_agentmesh_session")||"";
  const add=(text,kind)=>{const el=document.createElement("div");el.className="am-msg "+(kind==="user"?"am-user":"am-ai");el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el};
  add("Hi. I’m Flush, the AgentMesh assistant from HFL Tech. Ask me about HFL Tech, AgentMesh, Flux AI, our technology, or general technical questions.","ai");
  launch.addEventListener("click",()=>{panel.classList.add("open");input.focus()});
  panel.querySelector(".am-close").addEventListener("click",()=>panel.classList.remove("open"));
  input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
  form.addEventListener("submit",async e=>{
    e.preventDefault(); const message=input.value.trim(); if(!message||send.disabled)return;
    add(message,"user"); input.value=""; send.disabled=true; status.textContent="AgentMesh is processing…";
    const ai=add("","ai");
    try{
      const res=await fetch(API+"/v1/chat/stream",{method:"POST",headers:{"Content-Type":"application/json",...(sessionId?{"X-Session-ID":sessionId}: {})},body:JSON.stringify({message})});
      if(!res.ok){let detail="Request failed.";try{const j=await res.json();detail=j.detail||detail}catch(_){}throw new Error(detail)}
      const reader=res.body.getReader(), decoder=new TextDecoder(); let buffer="";
      while(true){
        const {value,done}=await reader.read(); if(done)break; buffer+=decoder.decode(value,{stream:true});
        const parts=buffer.split("\n\n"); buffer=parts.pop()||"";
        for(const part of parts){
          const line=part.split("\n").find(x=>x.startsWith("data:")); if(!line)continue;
          try{const data=JSON.parse(line.slice(5).trim()); if(data.type==="delta"){ai.textContent+=data.text;messages.scrollTop=messages.scrollHeight} if(data.type==="done"&&data.session_id){sessionId=data.session_id;localStorage.setItem("hfl_agentmesh_session",sessionId)}}catch(_){}
        }
      }
      if(!ai.textContent) ai.textContent="AgentMesh returned an empty response.";
    }catch(err){ai.textContent="AgentMesh is currently unavailable. Please try again shortly.";status.textContent=err.message||"Connection error."}
    finally{send.disabled=false;status.textContent="";input.focus()}
  });
})();

