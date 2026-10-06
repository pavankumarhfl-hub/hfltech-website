const nav=document.querySelector('.lh-nav');
const menus={product:document.getElementById('product-menu'),resources:document.getElementById('resources-menu')};
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>8),{passive:true});
document.querySelectorAll('.nav-menu').forEach(btn=>btn.addEventListener('click',()=>{
  const target=menus[btn.dataset.menu];
  Object.entries(menus).forEach(([k,el])=>{if(k!==btn.dataset.menu)el.hidden=true});
  target.hidden=!target.hidden;
}));
document.addEventListener('click',e=>{if(!e.target.closest('.lh-nav'))Object.values(menus).forEach(el=>el.hidden=true)});
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>img.style.visibility='hidden'));
