/* ================= Khooni Shatranj v3: look engine =================
   Quality tiers + Auto, visual styles, time of day, weather.
   Combat signals (glints, counter ring, danger zones, your ground ring) are drawn by a second
   camera after every style effect, so no style can blur, tint or pixelate them. */
var LOOK=(function(){
  var DPR=window.devicePixelRatio||1;
  var TIERS=[{n:'High',pr:2,sh:2048,half:false},{n:'Normal',pr:1.5,sh:1024,half:false},{n:'Lite',pr:1,sh:512,half:true},{n:'Minimal',pr:.75,sh:0,half:true}];
  var QIDX={high:0,normal:1,lite:2,min:3};
  var L={tier:1,fps:60,auto:true};
  var TESTMODE=FAST||SIMTEST;
  /* ---------- overlay camera for combat signals ---------- */
  var OVER=0x10000000;
  cam.layerMask=0x0FFFFFFF;
  var ocam=new BABYLON.ArcRotateCamera('ocam',cam.alpha,cam.beta,cam.radius,cam.target.clone(),scene);ocam.layerMask=OVER;ocam.inputs.clear();
  scene.activeCameras=[cam,ocam];scene.activeCamera=cam;
  scene.onBeforeCameraRenderObservable.add(function(c){if(c!==ocam)return;ocam.target.copyFrom(cam.target);ocam.alpha=cam.alpha;ocam.beta=cam.beta;ocam.radius=cam.radius;ocam.fov=cam.fov;ocam.minZ=cam.minZ;ocam.maxZ=cam.maxZ});
  function overlay(m){if(m)m.layerMask=OVER}
  /* your fighter's ground ring (Shadow war, Night battle, Storm) */
  var pRing=BABYLON.MeshBuilder.CreateTorus('pring',{diameter:1.5,thickness:.05,tessellation:40},scene);var prm=new BABYLON.StandardMaterial('prm',scene);prm.emissiveColor=new C3(1,.82,.4);prm.disableLighting=true;prm.alpha=.7;pRing.material=prm;pRing.isPickable=false;overlay(pRing);pRing.isVisible=false;
  /* wrap makeFighter: signals go to the overlay, Shadow war materials apply to new fighters */
  var _mf=makeFighter;
  makeFighter=function(){var f=_mf.apply(this,arguments);overlay(f.glint);overlay(f.ring);overlay(f.zone);if(cur.silh)silh(f,true);return f};
  /* ---------- quality ---------- */
  function applyTier(i){L.tier=i;var t=TIERS[i];
    if(!FAST){try{engine.setHardwareScalingLevel(1/Math.min(DPR,t.pr))}catch(e){}}
    try{var sm=sg.getShadowMap();if(t.sh){if(sm.getSize().width!==t.sh)sm.resize(t.sh);sm.refreshRate=1}else sm.refreshRate=0;
      if(!t.sh){sm.renderList.length=0}}catch(e){}
    if(pipe&&!FAST){try{pipe.bloomEnabled=i<3&&cur.bloom!==0;pipe.fxaaEnabled=true;pipe.sharpenEnabled=i<2;pipe.samples=engine.webGLVersion>1&&i<2?4:1}catch(e){}}
    if(vls){try{vls.isEnabled=i===0&&cur.vls!==false}catch(e){}}
    setStylePass();setWeatherCount();}
  /* Auto: average frame time over ~2 s; step down above 20 ms, back up after 6 s under 14 ms */
  var ft=[],calm=0,lastChange=0,longRun=0;
  function autoTick(){if(TESTMODE||SET.quality!=='auto')return;var dt=engine.getDeltaTime();if(dt>250){longRun++;if(longRun<3)return;dt=250}else longRun=0;ft.push(dt);if(ft.length>120)ft.shift();
    var avg=ft.reduce(function(a,b){return a+b},0)/ft.length;L.fps=1000/Math.max(1,avg);var now=performance.now();
    var span=avg*ft.length;if(span>=1500&&ft.length>=8&&avg>20&&L.tier<3&&now-lastChange>2000){lastChange=now;ft.length=0;calm=0;applyTier(L.tier+1)}
    else if(avg<14){calm+=dt;if(calm>6000&&L.tier>0&&now-lastChange>4000){lastChange=now;calm=0;ft.length=0;applyTier(L.tier-1)}}else calm=0}
  /* ---------- clean default image ---------- */
  if(pipe&&!FAST){try{pipe.grainEnabled=false;pipe.chromaticAberrationEnabled=false;pipe.sharpen.edgeAmount=.15}catch(e){}}
  /* shadows follow the camera so their detail stays high on the big field */
  scene.onBeforeRenderObservable.add(function(){var t=cam.target;sun.position.copyFrom(t.subtract(sun.direction.scale(40)));
    if(G.player&&cur.ring){pRing.isVisible=G.mode!=='menu'&&alive(G.player);pRing.position.set(G.player.pos.x,.06,G.player.pos.z)}else pRing.isVisible=false;
    autoTick();weatherTick()});
  (function(){sun.orthoLeft=-16;sun.orthoRight=16;sun.orthoTop=16;sun.orthoBottom=-16})();
  /* ---------- skies ---------- */
  function skyGrad(name,stops,stars){return dynTex(name,512,function(g,s){var gr=g.createLinearGradient(0,0,0,s);stops.forEach(function(st){gr.addColorStop(st[0],st[1])});g.fillStyle=gr;g.fillRect(0,0,s,s);
    if(stars)for(var i=0;i<260;i++){var y=hash(i,41)*s*.45;g.fillStyle='rgba(255,255,255,'+(.3+hash(i,42)*.7)+')';g.fillRect(hash(i,43)*s,y,1+hash(i,44)*1.4,1+hash(i,44)*1.4)}
    else for(var j=0;j<14;j++){var yy=s*(.3+hash(j,2)*.16),x=hash(j,5)*s,w=s*(.2+hash(j,9)*.35);g.fillStyle='rgba(255,255,255,'+(.04+hash(j,4)*.06)+')';g.beginPath();g.ellipse(x,yy,w,6+hash(j,1)*10,0,0,6.3);g.fill()}})}
  var SKY={dusk:skyTex,
    dawn:skyGrad('skyDawn',[[0,'#1e2a52'],[.3,'#58608e'],[.44,'#d9908c'],[.5,'#ffcf9e'],[.53,'#ffe6c4'],[.57,'#b48a74'],[1,'#3a2a22']]),
    day:skyGrad('skyDay',[[0,'#2c6cb4'],[.35,'#6fa8dc'],[.5,'#c8e2f2'],[.54,'#eef4f2'],[.58,'#b9a48a'],[1,'#4a3a2a']]),
    night:skyGrad('skyNight',[[0,'#02030a'],[.35,'#070b1c'],[.5,'#18203a'],[.54,'#232a40'],[.58,'#120f12'],[1,'#050405']],true),
    mist:skyGrad('skyMist',[[0,'#bdb8ae'],[.45,'#e6e1d6'],[.52,'#fffaf0'],[.58,'#ddd6ca'],[1,'#9a948a']])};
  [SKY.dawn,SKY.day,SKY.night,SKY.mist].forEach(function(t){t.wrapU=BABYLON.Texture.WRAP_ADDRESSMODE;t.vScale=-1});
  var TIMES={
    dawn:{dir:[-.55,-.3,-.78],sun:[1,.74,.66],si:3.4,hemi:.62,hd:[.78,.72,.86],hg:[.4,.32,.3],fog:[.72,.6,.6],fd:.010,disc:[1,.78,.62],torch:3,exp:1.05},
    day:{dir:[.25,-.86,-.44],sun:[1,.97,.9],si:4.6,hemi:.78,hd:[.82,.86,.95],hg:[.5,.42,.32],fog:[.74,.8,.86],fd:.006,disc:[1,.98,.9],torch:1.5,exp:1.0},
    dusk:{dir:[.42,-.36,-.83],sun:[1,.78,.55],si:4.2,hemi:.55,hd:[.75,.62,.6],hg:[.45,.3,.18],fog:[.58,.42,.32],fd:.012,disc:[1,.85,.55],torch:5,exp:1.05},
    night:{dir:[-.3,-.72,.62],sun:[.6,.7,1],si:1.4,hemi:.34,hd:[.35,.42,.65],hg:[.1,.09,.12],fog:[.07,.08,.13],fd:.018,disc:[.85,.9,1],torch:10,exp:1.15}};
  function v3(a){return new V3(a[0],a[1],a[2])}function c3(a){return new C3(a[0],a[1],a[2])}
  /* ---------- styles ---------- */
  var STYLES={
    real:{n:'Realistic',slider:'Contrast',mode:0},
    painted:{n:'Painted',slider:'Bleed',mode:1,depth:true},
    comic:{n:'Comic',slider:'Outline',mode:2,depth:true},
    toy:{n:'Toy board',slider:'Blur',mode:3,pitch:.14},
    night:{n:'Night battle',slider:'Glow',mode:4,time:'night',bloom:1,ring:true},
    shadow:{n:'Shadow war',slider:'Haze',mode:5,silh:true,ring:true,vls:false},
    retro:{n:'Retro pixel',slider:'Pixel size',mode:6}};
  var ORDER=['real','painted','comic','toy','night','shadow','retro'];
  var cur=STYLES.real;
  BABYLON.Effect.ShadersStore.ksStyleFragmentShader=[
  'precision highp float;varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D depthSampler;',
  'uniform vec2 res;uniform float mode;uniform float p;uniform float focusY;uniform float hasDepth;',
  'float h(vec2 v){return fract(sin(dot(v,vec2(12.9898,78.233)))*43758.5453);}',
  'float n2(vec2 v){vec2 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}',
  'float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}',
  'float dep(vec2 uv){return texture2D(depthSampler,uv).r;}',
  'float edgeD(vec2 uv,float w){vec2 px=w/res;float d=dep(uv);float s=dep(uv+vec2(px.x,0.))+dep(uv-vec2(px.x,0.))+dep(uv+vec2(0.,px.y))+dep(uv-vec2(0.,px.y));return abs(s-4.*d)/max(d,1e-4);}',
  'float edgeC(vec2 uv,float w){vec2 px=w/res;float l=lum(texture2D(textureSampler,uv).rgb);float s=lum(texture2D(textureSampler,uv+vec2(px.x,0.)).rgb)+lum(texture2D(textureSampler,uv-vec2(px.x,0.)).rgb)+lum(texture2D(textureSampler,uv+vec2(0.,px.y)).rgb)+lum(texture2D(textureSampler,uv-vec2(0.,px.y)).rgb);return abs(s-4.*l);}',
  'void main(){vec2 uv=vUV;vec3 c=texture2D(textureSampler,uv).rgb;',
  ' if(mode<0.5){gl_FragColor=vec4(c,1.);return;}',
  ' if(mode<1.5){float st=1.2+p*1.8;vec2 w=(vec2(n2(uv*res/22.+3.),n2(uv*res/22.+11.))-.5)*st*2.5/res;vec2 u2=uv+w;vec3 m0=vec3(0.),m1=vec3(0.),m2=vec3(0.),m3=vec3(0.),s0=vec3(0.),s1=vec3(0.),s2=vec3(0.),s3=vec3(0.);',
  '  for(int j=-2;j<=0;j++)for(int i=-2;i<=0;i++){vec3 a=texture2D(textureSampler,u2+vec2(float(i),float(j))*st/res).rgb;m0+=a;s0+=a*a;vec3 b=texture2D(textureSampler,u2+vec2(float(-i),float(j))*st/res).rgb;m1+=b;s1+=b*b;',
  '   vec3 cc=texture2D(textureSampler,u2+vec2(float(i),float(-j))*st/res).rgb;m2+=cc;s2+=cc*cc;vec3 d=texture2D(textureSampler,u2+vec2(float(-i),float(-j))*st/res).rgb;m3+=d;s3+=d*d;}',
  '  m0/=9.;m1/=9.;m2/=9.;m3/=9.;float v0=dot(s0/9.-m0*m0,vec3(1.)),v1=dot(s1/9.-m1*m1,vec3(1.)),v2=dot(s2/9.-m2*m2,vec3(1.)),v3=dot(s3/9.-m3*m3,vec3(1.));',
  '  vec3 col=m0;float mv=v0;if(v1<mv){mv=v1;col=m1;}if(v2<mv){mv=v2;col=m2;}if(v3<mv){mv=v3;col=m3;}',
  '  float sl=lum(col);col=mix(vec3(sl),col,1.2);float e=hasDepth>.5?edgeD(u2,1.5):0.;col*=1.-clamp(e*12.,0.,1.)*.45;',
  '  float paper=.9+.07*n2(uv*res/2.)+.05*n2(uv*res/34.);col=col*paper*vec3(1.05,1.,.87)+vec3(.05,.04,.01);gl_FragColor=vec4(col,1.);return;}',
  ' if(mode<2.5){vec3 sm=c*2.;for(int i=0;i<8;i++){float a=float(i)*.7854;sm+=texture2D(textureSampler,uv+vec2(cos(a),sin(a))*2.6/res).rgb;}sm/=10.;',
  '  float l=lum(sm);float q=.1+.27*smoothstep(.1,.17,l)+.3*smoothstep(.36,.46,l)+.26*smoothstep(.7,.8,l);vec3 cc=sm*(q/max(l,.002));cc=mix(vec3(lum(cc)),cc,1.25);',
  '  float w=1.+p*2.;float e=hasDepth>.5?edgeD(uv,w):0.;float ec=edgeC(uv,w);float ink=clamp(step(.05,e)+step(.25,ec),0.,1.);',
  '  cc=mix(cc,vec3(.05,.035,.03),ink*.9);gl_FragColor=vec4(cc,1.);return;}',
  ' if(mode<3.5){float d=abs(uv.y-focusY);float amt=smoothstep(.07,.42,d)*(1.5+p*9.);vec3 s=c;',
  '  if(amt>.25){s=vec3(0.);for(int i=0;i<10;i++){float a=float(i)*.6283;s+=texture2D(textureSampler,uv+vec2(cos(a),sin(a))*amt/res).rgb;}s/=10.;}',
  '  float l=lum(s);s=mix(vec3(l),s,1.3);gl_FragColor=vec4(s,1.);return;}',
  ' if(mode<4.5){float l=lum(c);vec3 g=c*vec3(.8,.9,1.18);g=mix(g,c*1.1,smoothstep(.5,.95,l));gl_FragColor=vec4(g*(.95+p*.3),1.);return;}',
  ' if(mode<5.5){float l=lum(c);vec3 g=mix(c,vec3(l),.3);g=(g-.5)*(1.1+p*.35)+.5;gl_FragColor=vec4(g,1.);return;}',
  ' float ps=2.+floor(p*7.);vec2 cell=ps/res;vec2 cid=floor(uv/cell);vec3 r=texture2D(textureSampler,(cid+.5)*cell).rgb;',
  ' float dth=(h(cid)-.5)/14.;r=floor((r+dth)*14.+.5)/14.;gl_FragColor=vec4(r,1.);}'].join('\n');
  var pp=null,depthR=null;
  function ensurePP(){if(pp||FAST)return;pp=new BABYLON.PostProcess('ksStyle','ksStyle',['res','mode','p','focusY','hasDepth'],['depthSampler'],1.0,cam);
    pp.onApply=function(e){e.setFloat2('res',pp.width,pp.height);e.setFloat('mode',cur.mode);e.setFloat('p',SET.styleP);e.setFloat('hasDepth',depthR&&cur.depth&&L.tier<3?1:0);
      var fy=.5;if(cur.mode===3&&G.player&&G.mode==='fight'){var q=project(new V3(G.player.pos.x,1.2,G.player.pos.z));fy=1-q.y/Math.max(1,canvas.clientHeight)}else if(cur.mode===3)fy=.45;e.setFloat('focusY',fy);
      if(depthR)e.setTexture('depthSampler',depthR.getDepthMap());else e.setTexture('depthSampler',SKY.mist)}}
  function setStylePass(){if(FAST)return;var need=cur.mode!==0&&!(L.tier===3&&cur.mode!==6&&cur.mode!==5&&cur.mode!==4);
    var wantDepth=need&&cur.depth&&L.tier<3;
    if(wantDepth&&!depthR){depthR=scene.enableDepthRenderer(cam,false);depthR.getDepthMap().renderList=null}
    if(!wantDepth&&depthR){scene.disableDepthRenderer(cam);depthR=null}
    if(need){ensurePP();if(cam._postProcesses.indexOf(pp)<0)cam.attachPostProcess(pp)}else if(pp&&cam._postProcesses.indexOf(pp)>=0)cam.detachPostProcess(pp)}
  /* Shadow war: near-black bodies with an army-coloured rim */
  var SILM={};function silMat(dark){var k=dark?'e':'s';if(SILM[k])return SILM[k];var m=new BABYLON.StandardMaterial('silh'+k,scene);m.diffuseColor=new C3(.035,.03,.03);m.specularColor=C3.Black();
    m.emissiveFresnelParameters=new BABYLON.FresnelParameters();m.emissiveFresnelParameters.bias=.45;m.emissiveFresnelParameters.power=1.6;m.emissiveFresnelParameters.leftColor=dark?new C3(.62,.42,.95):new C3(1,.72,.25);m.emissiveFresnelParameters.rightColor=C3.Black();m.emissiveColor=C3.Black();return SILM[k]=m}
  function silh(f,on){(f.casters||[]).forEach(function(m){if(!m||m.isDisposed())return;if(on){if(!m._ksMat)m._ksMat=m.material;m.material=silMat(f.dark)}else if(m._ksMat){m.material=m._ksMat;m._ksMat=null}})}
  /* ---------- apply time + style ---------- */
  function applyLook(){var st=cur;var tName=st.time||SET.time;var T=TIMES[tName]||TIMES.dusk;
    sun.direction=v3(T.dir).normalize();sun.diffuse=c3(T.sun);sun.intensity=T.si;hemi.intensity=T.hemi;hemi.diffuse=c3(T.hd);hemi.groundColor=c3(T.hg);
    scene.fogColor=c3(T.fog);scene.fogDensity=T.fd;skm.emissiveTexture=SKY[tName]||skyTex;sdm.emissiveColor=c3(T.disc);sunDisc.position=sun.direction.scale(-180);sunDisc.isVisible=true;
    sunDisc.scaling.setAll(tName==='night'?.45:1);fireLights.forEach(function(l){l.intensity=T.torch});
    if(pipe&&!FAST){try{var ip=pipe.imageProcessing;ip.exposure=T.exp;ip.contrast=st.mode===0?1.1+SET.styleP*.5:1.25;pipe.bloomWeight=st.bloom?.55+SET.styleP*.6:.35;pipe.bloomThreshold=st.bloom?.55:.85}catch(e){}}
    if(st.silh){skm.emissiveTexture=SKY.mist;scene.fogColor=new C3(.88,.85,.8);scene.fogDensity=.02+SET.styleP*.03;hemi.intensity=1.15;hemi.diffuse=new C3(1,.97,.92);sun.intensity=1.4;sunDisc.isVisible=false}
    window.LOOKPITCH=st.pitch||0;
    G.fighters.forEach(function(f){silh(f,!!st.silh)});
    applyWeatherLight()}
  function setStyle(id){cur=STYLES[id]||STYLES.real;SET.style=STYLES[id]?id:'real';applyLook();applyTier(L.tier)}
  /* ---------- weather ---------- */
  var WX={clear:{light:1,fog:1,tint:null,fall:null,count:0},rain:{light:.8,fog:1.6,tint:[.42,.47,.52],fall:'rain',count:900},snow:{light:1.05,fog:1.7,tint:[.86,.89,.93],fall:'snow',count:700},storm:{light:.6,fog:2,tint:[.24,.27,.32],fall:'rain',count:1200,lightning:true}};
  var curWx='clear';
  function partTex(kind){return dynTex('wx'+kind,64,function(g,s){g.clearRect(0,0,s,s);if(kind==='rain'){var gr=g.createLinearGradient(0,0,0,s);gr.addColorStop(0,'rgba(220,230,255,0)');gr.addColorStop(.5,'rgba(220,230,255,.9)');gr.addColorStop(1,'rgba(220,230,255,0)');g.fillStyle=gr;g.fillRect(s*.44,0,s*.12,s)}
    else{var r=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.5,'rgba(255,255,255,.6)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,s,s)}})}
  var rainPS=null,snowPS=null;
  function mkRain(){var ps=new BABYLON.ParticleSystem('rain',1400,scene);ps.particleTexture=partTex('rain');ps.particleTexture.hasAlpha=true;ps.billboardMode=BABYLON.ParticleSystem.BILLBOARDMODE_STRETCHED;
    ps.emitter=new V3(0,14,0);ps.minEmitBox=new V3(-20,0,-20);ps.maxEmitBox=new V3(20,2,20);ps.direction1=new V3(-1.5,-24,-.5);ps.direction2=new V3(-.5,-28,.5);ps.minEmitPower=1;ps.maxEmitPower=1;
    ps.minLifeTime=.55;ps.maxLifeTime=.65;ps.minSize=.05;ps.maxSize=.07;ps.minScaleY=8;ps.maxScaleY=12;ps.color1=new BABYLON.Color4(.8,.85,1,.5);ps.color2=new BABYLON.Color4(.7,.78,.95,.35);ps.colorDead=new BABYLON.Color4(.7,.8,1,0);ps.blendMode=BABYLON.ParticleSystem.BLENDMODE_STANDARD;return ps}
  function mkSnow(){var ps=new BABYLON.ParticleSystem('snow',1000,scene);ps.particleTexture=partTex('snow');ps.particleTexture.hasAlpha=true;ps.emitter=new V3(0,12,0);ps.minEmitBox=new V3(-20,0,-20);ps.maxEmitBox=new V3(20,2,20);
    ps.direction1=new V3(-.6,-1.4,-.4);ps.direction2=new V3(.6,-2,.4);ps.minEmitPower=1;ps.maxEmitPower=1;ps.minLifeTime=6;ps.maxLifeTime=8;ps.minSize=.06;ps.maxSize=.13;ps.color1=new BABYLON.Color4(1,1,1,.9);ps.color2=new BABYLON.Color4(.9,.93,1,.75);ps.colorDead=new BABYLON.Color4(1,1,1,0);ps.blendMode=BABYLON.ParticleSystem.BLENDMODE_STANDARD;return ps}
  function setWeatherCount(){var w=WX[curWx];var k=[1,.7,.4,0][L.tier];var n=Math.floor(w.count*k);
    if(rainPS){rainPS.stop()}if(snowPS){snowPS.stop()}
    if(!n||!w.fall)return;if(w.fall==='rain'){if(!rainPS)rainPS=mkRain();rainPS.emitRate=n/.6;rainPS.start()}else{if(!snowPS)snowPS=mkSnow();snowPS.emitRate=n/7;snowPS.start()}}
  function applyWeatherLight(){var w=WX[curWx];if(w.light!==1){sun.intensity*=w.light;hemi.intensity*=Math.max(.6,w.light)}
    if(w.tint&&!cur.silh){scene.fogColor=C3.Lerp(scene.fogColor,c3(w.tint),.6);scene.fogDensity*=w.fog;if(curWx!=='snow')sunDisc.isVisible=false}
    if(AU.rain)AU.rain(w.fall==='rain'?(curWx==='storm'?1:.6):0)}
  function setWeather(id){if(id==='random'){var o=['clear','clear','rain','snow','storm'];id=o[Math.floor(Math.random()*o.length)]}curWx=WX[id]?id:'clear';applyLook();setWeatherCount()}
  /* lightning: never inside the last 0.6 s before an attack lands on you */
  var nextBolt=0,flashT=0,flashEl=null;
  function weatherTick(){var t=cam.target;if(rainPS)rainPS.emitter=new V3(t.x,14,t.z);if(snowPS)snowPS.emitter=new V3(t.x,12,t.z);
    if(flashT>0){flashT-=engine.getDeltaTime()/1000;var k=Math.max(0,flashT/.25);if(flashEl)flashEl.style.opacity=(k*.55).toFixed(3);hemi.intensity=L.baseHemi+k*2.5;if(flashT<=0){hemi.intensity=L.baseHemi;if(flashEl)flashEl.style.opacity=0}}
    if(!WX[curWx].lightning||G.paused)return;var now=performance.now();if(!nextBolt)nextBolt=now+4000+Math.random()*5000;if(now<nextBolt||flashT>0)return;
    if(G.mode==='fight'&&G.player&&G.fighters.some(function(e){return e.st==='attack'&&e.act&&!e.act.done&&e.act.target===G.player&&e.act.impactAt-G.t<.6}))return;
    nextBolt=now+5000+Math.random()*7000;if(!flashEl){flashEl=document.createElement('div');flashEl.style.cssText='position:fixed;inset:0;background:#dfe8ff;opacity:0;pointer-events:none;z-index:1';document.body.appendChild(flashEl)}
    L.baseHemi=hemi.intensity;flashT=.25;if(AU.thunder)setTimeout(AU.thunder,400+Math.random()*1200)}
  /* ---------- public ---------- */
  function apply(){cur=STYLES[SET.style]||STYLES.real;L.auto=SET.quality==='auto';curWx=SET.weather==='random'?curWx:(WX[SET.weather]?SET.weather:'clear');
    applyLook();applyTier(L.auto?L.tier:QIDX[SET.quality]);setWeatherCount()}
  L.auto=SET.quality==='auto';
  var touch=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
  L.tier=L.auto?(touch?1:0):(QIDX[SET.quality]||0);if(TESTMODE)L.tier=1;
  if(SET.weather==='random')setWeather('random');
  return {apply:apply,setStyle:setStyle,setWeather:setWeather,STYLES:STYLES,ORDER:ORDER,TIERS:TIERS,state:L,cur:function(){return cur},weather:function(){return curWx}}})();
