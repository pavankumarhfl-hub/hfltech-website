/* HFL Tech — homepage enhancement layer intentionally neutralized. The homepage visual system is controlled by linear-inspired.css. */
(function(){
  if(window.__HFL_LINEAR__) return;
  window.__HFL_LINEAR__=true;
  function seo(){
    const isHome=/index\\.html$/.test(location.pathname)||location.pathname==='/'||location.pathname==='';
    if(!isHome)return;
    document.title='HFL Tech — AgentMesh Super Intelligence & Technology';
    const set=(name,content)=>{
      let m=document.querySelector('meta[name="'+name+'"]');
      if(!m){m=document.createElement('meta');m.name=name;document.head.appendChild(m)}
      m.content=content;
    };
    set('description','HFL Tech is an India-built technology company developing AgentMesh, a super intelligence platform for reasoning, tools, execution, evaluation and human control.');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',seo);else seo();
})();
