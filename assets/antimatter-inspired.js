(()=>{
  const header=document.querySelector('.topbar');
  const menu=document.querySelector('.menu-toggle');
  const mobile=document.querySelector('.mobile-nav');
  const close=()=>{
    mobile?.classList.remove('open');
    menu?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-label','Open menu');
    if(menu)menu.textContent='☰';
  };
  const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>16);
  window.addEventListener('scroll',updateHeader,{passive:true});
  updateHeader();
  menu?.addEventListener('click',()=>{
    const open=!mobile.classList.contains('open');
    mobile.classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Close menu':'Open menu');
    menu.textContent=open?'×':'☰';
  });
  mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  if('IntersectionObserver'in window){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
    }),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }else{
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  }
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
  // The hero canvas is rendered by immersive-site.js with Three.js. Do not request a 2D context here.
  const form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const data=new FormData(form);
      let valid=true;
      form.querySelectorAll('[data-error]').forEach(el=>el.textContent='');
      for(const field of form.querySelectorAll('[required]')){
        const value=field.value.trim();
        const bad=!value||(field.type==='email'&&!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(value));
        if(bad){
          const error=form.querySelector('[data-error="'+field.name+'"]');
          if(error)error.textContent=field.type==='email'?'Enter a valid email address.':'This field is required.';
          valid=false;
        }
      }
      if(!valid)return;
      const subject=encodeURIComponent('HFL Tech enquiry · '+data.get('topic'));
      const body=encodeURIComponent('Name: '+data.get('name')+'\\nEmail: '+data.get('email')+'\\nCompany: '+(data.get('company')||'—')+'\\nTopic: '+data.get('topic')+'\\n\\n'+data.get('message'));
      const status=document.getElementById('form-status');
      if(status){status.hidden=false;status.textContent='Your email app will open with your message ready to send.';}
      window.location.href='mailto:HFLFOUNDER@GMAIL.COM?subject='+subject+'&body='+body;
    });
  }
})();