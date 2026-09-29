(function(){
  document.addEventListener('DOMContentLoaded',function(){
    const header=document.querySelector('.site-header');
    const nav=document.querySelector('.nav');
    const menu=document.querySelector('.menu');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if(header&&nav&&menu){
      const toggle=document.createElement('button');
      toggle.className='mobile-menu-toggle';
      toggle.type='button';
      toggle.setAttribute('aria-label','Open navigation');
      toggle.setAttribute('aria-expanded','false');
      toggle.innerHTML='<span></span><span></span><span></span>';
      nav.appendChild(toggle);
      toggle.addEventListener('click',function(){
        const open=header.classList.toggle('mobile-nav-open');
        toggle.setAttribute('aria-expanded',String(open));
        toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
      });
      menu.addEventListener('click',function(e){
        if(e.target.closest('a')){
          header.classList.remove('mobile-nav-open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
      document.addEventListener('click',function(e){
        if(!header.contains(e.target)){
          header.classList.remove('mobile-nav-open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
    }

    const reveal=document.querySelectorAll('.card,.status-card,.trust-card,.feature-card,.project-row,.lab-card,.section-head,.system-node,.ecosystem-strip a,.tech-layer-list a,.timeline article,.comparison-row,.investor-card');
    if(!reduce && 'IntersectionObserver' in window){
      const io=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },{threshold:.08,rootMargin:'0px 0px -40px'});
      reveal.forEach(function(el){el.classList.add('reveal-item');io.observe(el);});
    }else{
      reveal.forEach(function(el){el.classList.add('is-visible');});
    }

    if(!reduce){
      const fields=document.querySelectorAll('.hero,.section,.proof-strip,.product-section,.trust-section,.founder-preview,.contact-preview');
      let ticking=false;
      function update(){
        const y=window.scrollY||0;
        fields.forEach(function(el){
          const r=el.getBoundingClientRect();
          if(r.bottom>0 && r.top<window.innerHeight){
            const delta=(window.innerHeight/2-(r.top+r.height/2))*0.035;
            el.style.setProperty('--hfl-scroll',delta.toFixed(1)+'px');
          }
        });
        ticking=false;
      }
      window.addEventListener('scroll',function(){
        if(!ticking){window.requestAnimationFrame(update);ticking=true;}
      },{passive:true});
      update();
    }
  });
})();