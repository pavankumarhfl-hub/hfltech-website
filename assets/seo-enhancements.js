/* SEO-ADD: Item #11, #13, #15, #16 — accessible media defaults, lazy loading, breadcrumbs and contextual navigation. */
(()=>{'use strict';
 const path=location.pathname.replace(/\\/+$/,'')||'/';
 const home=path==='/'||path==='/index.html';
 // SEO-ADD: Item #13 — defer non-hero media; preserve eager loading for the first visible image.
 const media=[...document.querySelectorAll('img,iframe')];
 media.forEach((el,i)=>{
   if(!el.hasAttribute('loading')&&i>0)el.setAttribute('loading','lazy');
   if(el.tagName==='IMG'&&!el.hasAttribute('decoding'))el.setAttribute('decoding','async');
   // Never invent semantic alt text. Mark only clearly decorative images as decorative.
   if(el.tagName==='IMG'&&!el.hasAttribute('alt')&&(el.getAttribute('aria-hidden')==='true'||el.closest('[aria-hidden="true"]')))el.setAttribute('alt','');
 });
 // SEO-ADD: Item #15 — add a visible breadcrumb and matching JSON-LD on non-home pages.
 if(!home&&document.querySelector('main')){
   const crumbs=[{name:'Home',url:'https://hfltech.in/'}];
   const segments=path.split('/').filter(Boolean);
   let current='';
   segments.forEach((segment,i)=>{
     current+='/'+segment;
     const last=i===segments.length-1;
     const label=(last?segment.replace(/\\.html$/i,''):segment).replace(/[-_]+/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase());
     crumbs.push({name:label,url:'https://hfltech.in'+(current==='/'?'/':current)});
   });
   const main=document.querySelector('main');
   const wrap=document.createElement('nav');
   wrap.className='seo-breadcrumbs';wrap.setAttribute('aria-label','Breadcrumb');
   wrap.innerHTML=crumbs.map((c,i)=>i===crumbs.length-1?'<span aria-current="page"></span>':'<a></a><span aria-hidden="true"> / </span>').join('');
   const links=wrap.querySelectorAll('a');links.forEach((a,i)=>{a.href=crumbs[i].url;a.textContent=crumbs[i].name});
   const currentLabel=wrap.querySelector('[aria-current="page"]');if(currentLabel)currentLabel.textContent=crumbs[crumbs.length-1].name;
   main.parentNode.insertBefore(wrap,main);
   const ld=document.createElement('script');ld.type='application/ld+json';ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:c.url}))});document.head.appendChild(ld);
   const style=document.createElement('style');style.textContent='.seo-breadcrumbs{position:relative;z-index:5;max-width:1200px;margin:0 auto;padding:14px clamp(20px,4vw,44px);font-size:12px;color:rgba(235,239,246,.68)}.seo-breadcrumbs a{color:inherit;text-decoration:none}.seo-breadcrumbs a:hover{color:#fff;text-decoration:underline}.seo-breadcrumbs span[aria-current=page]{color:rgba(255,255,255,.9)}';document.head.appendChild(style);
 }
 // SEO-ADD: Item #16 — add contextual links to related sections where the page has no relevant route links.
 const related={'agentmesh.html':['/docs.html','/evidence.html','/robotics.html'],'robotics.html':['/agentmesh.html','/research.html','/contact.html'],'hfl-astra-space-technologies.html':['/astra-satellite-systems.html','/astra-launch-systems.html','/astra-mission-software.html'],'company.html':['/founder.html','/press.html','/ecosystem.html'],'research.html':['/evidence.html','/technology.html','/contact.html']};
 const key=path.split('/').pop()||'index.html';const links=related[key];
 if(links&&!document.querySelector('.seo-related-links')){
   const main=document.querySelector('main');const section=document.createElement('section');section.className='seo-related-links';section.setAttribute('aria-label','Related pages');
   section.innerHTML='<div><strong>Explore related pages</strong><nav></nav></div>';
   const nav=section.querySelector('nav');links.forEach(url=>{const a=document.createElement('a');a.href=url;a.textContent=url.split('/').pop().replace(/\\.html$/,'').replace(/-/g,' ');nav.appendChild(a)});
   const style=document.createElement('style');style.textContent='.seo-related-links{padding:24px max(22px,calc((100vw - 1160px)/2));border-top:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.015)}.seo-related-links>div{display:flex;gap:24px;align-items:center;flex-wrap:wrap}.seo-related-links strong{font-size:12px;color:#b8bfca}.seo-related-links nav{display:flex;gap:16px;flex-wrap:wrap}.seo-related-links a{font-size:12px;color:#e3e7ef;text-decoration:underline;text-underline-offset:4px;text-transform:capitalize}';document.head.appendChild(style);main.appendChild(section);
 }
 // SEO-ADD: Item #17 — expose form completion as a GA4-compatible event when a site measurement ID is configured.
 document.addEventListener('hfl:form-success',e=>{if(window.gtag)window.gtag('event','generate_lead',{event_category:'form',form_id:e.detail?.formId||'unknown'});if(window.dataLayer)window.dataLayer.push({event:'generate_lead',form_id:e.detail?.formId||'unknown'});});
})();