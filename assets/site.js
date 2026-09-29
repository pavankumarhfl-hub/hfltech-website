(function(){
  document.addEventListener('DOMContentLoaded',function(){
    const header=document.querySelector('.site-header');
    const nav=document.querySelector('.nav');
    const menu=document.querySelector('.menu');
    if(!header||!nav||!menu) return;
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
      if(e.target.closest('a')){header.classList.remove('mobile-nav-open');toggle.setAttribute('aria-expanded','false');}
    });
    document.addEventListener('click',function(e){
      if(!header.contains(e.target)){header.classList.remove('mobile-nav-open');toggle.setAttribute('aria-expanded','false');}
    });
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduce){
      const els=document.querySelectorAll('.card,.status-card,.trust-card,.feature-card,.project-row,.lab-card,.section-head,.system-node');
      const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.08});
      els.forEach(el=>{el.classList.add('reveal-item');io.observe(el)});
    }
  });
})();