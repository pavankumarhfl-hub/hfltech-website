(()=>{if(window.__hflStoryScenes)return;window.__hflStoryScenes=true;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const path=location.pathname.toLowerCase();
const page=path.includes('hfl-astra-space-technologies')?'space':path.includes('robotics')?'robotics':path.includes('agentmesh')||path==='/'||path.endsWith('/index.html')?'agents':path.includes('flux-ai')?'flux':null;
const hero=document.querySelector('main .astra-hero,main .robotics-hero,main .page-hero,main>.hero,main .hero');
const existing=document.getElementById('hero-sphere');
if(hero&&page&&!reduced){
 let canvas=existing;
 if(!canvas){canvas=document.createElement('canvas');canvas.className='page-scene-canvas';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);}
 canvas.classList.add('page-scene-canvas');hero.classList.add('page-scene-hero');
 const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
 load('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js').then(()=>{
  if(!window.THREE)return;const T=window.THREE;let renderer,scene,camera,root,raf,resizeObserver;
  try{renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);scene=new T.Scene();camera=new T.PerspectiveCamera(38,1,.1,100);camera.position.z=7;root=new T.Group();scene.add(root);
  scene.add(new T.AmbientLight(0xffffff,1.7));const light=new T.PointLight(0x8d8fff,2.6,20);light.position.set(2,3,5);scene.add(light);
  const mat=(color,metalness=.25,roughness=.36)=>new T.MeshStandardMaterial({color,metalness,roughness});
  const indigo=mat(0x7779ff,.5,.24),silver=mat(0xcbd0dc,.72,.25),dark=mat(0x222632,.55,.32),glow=mat(0xa5a6ff,.2,.22),gold=mat(0xffbd70,.45,.26),blue=mat(0x7fd6ff,.5,.22);
  const sphere=(r,m,x,y,z)=>{const o=new T.Mesh(new T.SphereGeometry(r,20,16),m);o.position.set(x,y,z);root.add(o);return o};
  const link=(a,b,m=indigo,opacity=.65)=>{const d=new T.Vector3(...b).sub(new T.Vector3(...a));const o=new T.Mesh(new T.CylinderGeometry(.008,.008,d.length(),5),m);o.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());root.add(o);return o};
  if(page==='space'){
   const rocket=new T.Group();rocket.position.set(1.35,-.05,0);rocket.rotation.z=-.13;root.add(rocket);
   const body=new T.Mesh(new T.CylinderGeometry(.28,.34,2.05,32),silver);body.position.y=.05;rocket.add(body);
   const nose=new T.Mesh(new T.ConeGeometry(.28,.68,32),indigo);nose.position.y=1.415;rocket.add(nose);
   const band=new T.Mesh(new T.CylinderGeometry(.291,.291,.12,32),gold);band.position.y=.62;rocket.add(band);
   const window=new T.Mesh(new T.SphereGeometry(.095,20,16),blue);window.position.set(0,.35,.29);rocket.add(window);
   const nozzle=new T.Mesh(new T.CylinderGeometry(.17,.25,.36,20),dark);nozzle.position.y=-1.15;rocket.add(nozzle);
   for(let i=0;i<3;i++){const fin=new T.Mesh(new T.BoxGeometry(.1,.6,.15),indigo);fin.position.set((i-1)*.28,-.75,.02);fin.rotation.z=(i-1)*-.28;rocket.add(fin)}
   const flame=new T.Mesh(new T.ConeGeometry(.14,.62,20),gold);flame.position.y=-1.6;flame.rotation.z=Math.PI;rocket.add(flame);
   // Compact satellite in the same scene makes the page unmistakably about space systems.
   const sat=new T.Group();sat.position.set(-1.05,.8,-.4);sat.rotation.z=.18;root.add(sat);
   const core=new T.Mesh(new T.BoxGeometry(.42,.42,.42),silver);sat.add(core);
   for(const side of [-1,1]){const panel=new T.Mesh(new T.BoxGeometry(.72,.32,.035),indigo);panel.position.x=side*.62;sat.add(panel);for(let j=0;j<3;j++){const stripe=new T.Mesh(new T.BoxGeometry(.018,.31,.04),blue);stripe.position.set(side*(.38+j*.24),0,.025);sat.add(stripe)}}
   const antenna=new T.Mesh(new T.CylinderGeometry(.012,.012,.42,8),gold);antenna.position.set(0,.38,0);sat.add(antenna);
   const ring=new T.Mesh(new T.TorusGeometry(2.25,.008,5,120),indigo);ring.rotation.set(.9,.3,-.3);ring.position.x=.35;root.add(ring);
   for(let i=0;i<95;i++){const a=i*2.39996,r=2.4+(i%7)*.09;sphere(.012+(i%3)*.004, i%4===0?gold:glow,Math.cos(a)*r,Math.sin(a)*r*.72,(i%11-5)*.12)}
  }else if(page==='robotics'){
   const bot=new T.Group();bot.position.set(1.35,-.35,0);bot.rotation.y=-.18;root.add(bot);
   const put=(geo,m,x,y,z,rz=0)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.rotation.z=rz;bot.add(o);return o};
   put(new T.BoxGeometry(.78,.94,.42),silver,0,.2,0);put(new T.BoxGeometry(.62,.12,.46),indigo,0,.55,.02);
   put(new T.BoxGeometry(.55,.48,.43),dark,0,1.04,0);put(new T.BoxGeometry(.42,.23,.06),indigo,0,1.05,.24);
   // no unrelated ornament outside the robot group
   const eye1=put(new T.SphereGeometry(.055,14,12),blue,-.12,1.07,.24),eye2=put(new T.SphereGeometry(.055,14,12),blue,.12,1.07,.24);
   put(new T.CylinderGeometry(.09,.09,.24,16),gold,0,.78,0);
   const limb=(a,b,r,m)=>{const v=new T.Vector3(...b).sub(new T.Vector3(...a));const o=new T.Mesh(new T.CylinderGeometry(r*.8,r,v.length(),14),m);o.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());bot.add(o);sphere(r*1.2,m,...a)};
   limb([-.43,.48,0],[-.73,-.08,0],.105,silver);limb([.43,.48,0],[.72,-.08,0],.105,silver);
   limb([-.22,-.28,0],[-.29,-.91,0],.13,silver);limb([.22,-.28,0],[.29,-.91,0],.13,silver);
   put(new T.BoxGeometry(.38,.12,.52),dark,-.29,-.99,.08);put(new T.BoxGeometry(.38,.12,.52),dark,.29,-.99,.08);
   const halo=new T.Mesh(new T.TorusGeometry(1.5,.008,6,100),indigo);halo.position.set(0,.35,-.25);halo.rotation.x=1.18;root.add(halo);
   for(let i=0;i<14;i++){const a=i*Math.PI*2/14;sphere(.025, i%3===0?blue:glow,Math.cos(a)*1.85,Math.sin(a)*1.35,(i%4)*.15-.2)}
  }else{
   // AgentMesh / Flux: an interconnected execution graph, deliberately not a globe.
   const nodes=[];const count=page==='flux'?28:20;
   for(let i=0;i<count;i++){const t=i/count*Math.PI*2;const band=(i%4)-1.5;const p=[Math.cos(t)*(1.05+Math.abs(band)*.18),Math.sin(t)*(.9+Math.abs(band)*.12),band*.27];nodes.push(p);sphere(i%5===0?.09:.045,i%5===0?indigo:(i%3===0?blue:glow),...p)}
   const core=new T.Mesh(new T.IcosahedronGeometry(.52,1),indigo);root.add(core);const coreWire=new T.Mesh(new T.IcosahedronGeometry(.73,1),new T.MeshBasicMaterial({color:0xa5a6ff,wireframe:true,transparent:true,opacity:.45}));root.add(coreWire);
   nodes.forEach((p,i)=>{link(p,nodes[(i+1)%count],i%4===0?blue:indigo,.55);if(i%2===0)link(p,nodes[(i+5)%count],indigo,.45);if(i%4===0)link(p,[0,0,0],glow,.5)});
   const orbit=new T.Mesh(new T.TorusGeometry(1.8,.008,6,100),blue);orbit.rotation.set(.8,.35,.3);root.add(orbit);
   for(let i=0;i<75;i++){const a=i*2.39996,r=1.9+(i%8)*.09;sphere(.012,i%5===0?blue:glow,Math.cos(a)*r,Math.sin(a)*r*.72,(i%9-4)*.14)}
  }
  const resizeTarget=canvas===existing?canvas.parentElement:hero;const resize=()=>{const box=resizeTarget.getBoundingClientRect();const w=Math.max(1,box.width),h=Math.max(1,box.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();root.position.x=w<760?.25:1.35;root.scale.setScalar(w<760?.62:1);};
  resize();window.addEventListener('resize',resize,{passive:true});if('ResizeObserver'in window){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(resizeTarget)}
  let last=0,scroll=0;const render=t=>{raf=requestAnimationFrame(render);if(t-last<30)return;last=t;root.rotation.y+=page==='space'?.002:.0015;root.rotation.x=Math.sin(t*.00022)*.045;renderer.render(scene,camera)};render(0);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else render(0)});
  load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js').then(()=>load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js')).then(()=>{if(!window.gsap||!window.ScrollTrigger)return;window.gsap.registerPlugin(window.ScrollTrigger);const p={v:0};window.gsap.to(p,{v:1,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1},onUpdate(){root.rotation.y=.1+p.v*.8}});window.gsap.utils.toArray('main .section h2,main .card,main .work-card,main .robotics-grid article,main .ecosystem-grid article').forEach((el,i)=>window.gsap.fromTo(el,{y:26,opacity:0},{y:0,opacity:1,duration:.7,delay:(i%3)*.05,ease:'power2.out',clearProps:'transform,opacity',scrollTrigger:{trigger:el,start:'top 84%',once:true}}));window.ScrollTrigger.refresh()}).catch(()=>{});
  }catch(e){canvas.remove()}
 }).catch(()=>{if(canvas!==existing)canvas.remove()});
}
if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('main .card,main .service-card,main .trust-card,main .work-card,main .project-row,main .principle,main .runtime-demo,main .notice,main .section-head,main .section-heading,main .founder-principles article,main .timeline-pro article').forEach(el=>{el.classList.add('reveal');io.observe(el)})}
if(!reduced&&!window.__hflLenisStarted){window.__hflLenisStarted=true;const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js';s.async=true;s.onload=()=>{if(!window.Lenis)return;const lenis=new window.Lenis({duration:1.15,smoothWheel:true,orientation:'vertical',gestureOrientation:'vertical',wheelMultiplier:1,touchMultiplier:1.05});window.__hflLenis=lenis;lenis.on('scroll',()=>window.ScrollTrigger&&window.ScrollTrigger.update());const tick=t=>{lenis.raf(t);window.__hflLenisRaf=requestAnimationFrame(tick)};window.__hflLenisRaf=requestAnimationFrame(tick);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(window.__hflLenisRaf);else window.__hflLenisRaf=requestAnimationFrame(tick)})};document.head.appendChild(s)}
})();