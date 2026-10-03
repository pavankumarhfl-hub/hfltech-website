/* HFL Global Tech lightweight WebGL cinematic scene. No external library. */
(function(){
  const canvas=document.querySelector('.cx-canvas');
  if(!canvas) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl=canvas.getContext('webgl',{antialias:true,alpha:true,preserveDrawingBuffer:false});
  if(!gl){canvas.style.display='none';return}
  const vs='attribute vec3 p; uniform mat4 m; uniform float t; varying float z; void main(){vec3 q=p; float a=t*.00018; float c=cos(a),s=sin(a); q=vec3(q.x*c-q.z*s,q.y,q.x*s+q.z*c); q.z+=2.8; z=q.z; gl_Position=m*vec4(q,1.0); gl_PointSize=2.0;}';
  const fs='precision mediump float; varying float z; void main(){float a=clamp(1.0-abs(z)/6.0,0.08,.9); gl_FragColor=vec4(.72,.79,.86,a*.42);}';
  function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  const pts=[]; const count=900;
  for(let i=0;i<count;i++){
    const r=Math.pow(Math.random(),.55)*3.9, a=Math.random()*Math.PI*2;
    const y=(Math.random()-.5)*2.2;
    pts.push(Math.cos(a)*r,y,Math.sin(a)*r);
  }
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pts),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'p'), ml=gl.getUniformLocation(pr,'m'), tl=gl.getUniformLocation(pr,'t');
  const proj=new Float32Array(16);
  function perspective(out,fovy,asp,n,f){const q=1/Math.tan(fovy/2),nf=1/(n-f);out[0]=q/asp;out[1]=0;out[2]=0;out[3]=0;out[4]=0;out[5]=q;out[6]=0;out[7]=0;out[8]=0;out[9]=0;out[10]=(f+n)*nf;out[11]=-1;out[12]=0;out[13]=0;out[14]=2*f*n*nf;out[15]=0}
  let mx=0,my=0; addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)},{passive:true});
  function resize(){const d=Math.min(devicePixelRatio||1,2),w=innerWidth*d,h=innerHeight*d;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);perspective(proj,Math.PI/3,w/h,.1,100)}
  addEventListener('resize',resize);resize();
  function frame(t){
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(pr);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);
    gl.uniformMatrix4fv(ml,false,proj);gl.uniform1f(tl,reduce?0:t);
    gl.drawArrays(gl.POINTS,0,count);
    if(!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();