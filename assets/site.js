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