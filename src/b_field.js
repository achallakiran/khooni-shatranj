"use strict";
var canvas=document.getElementById('c');
var engine=new BABYLON.Engine(canvas,true,{stencil:true,antialias:true,preserveDrawingBuffer:false});
var FAST=/fast/.test(location.hash);var DPR=Math.min(window.devicePixelRatio||1,1.5);engine.setHardwareScalingLevel(FAST?5:1/DPR);
var scene=new BABYLON.Scene(engine);
var V3=BABYLON.Vector3,C3=BABYLON.Color3,QT=BABYLON.Quaternion,MX=BABYLON.Matrix;
scene.clearColor=new BABYLON.Color4(.08,.05,.04,1);
scene.fogMode=BABYLON.Scene.FOGMODE_EXP2;scene.fogDensity=.012;scene.fogColor=new C3(.58,.42,.32);
function clamp(v,a,b){return v<a?a:v>b?b:v}
function lerp(a,b,t){return a+(b-a)*t}

/* ---------- noise + procedural textures ---------- */
function hash(x,y){var h=x*374761393+y*668265263;h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,y){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;var u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
  var a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,y,o){var s=0,a=.5,f=1;for(var i=0;i<(o||4);i++){s+=a*vnoise(x*f,y*f);f*=2;a*=.5}return s}
function dynTex(name,size,draw){var t=new BABYLON.DynamicTexture(name,{width:size,height:size},scene,true);var g=t.getContext();draw(g,size);t.update(true);t.wrapU=t.wrapV=BABYLON.Texture.WRAP_ADDRESSMODE;return t}
/* normal map from a height function h(u,v) in 0..1 space */
function normalTex(name,size,h,strength){
  var hs=new Float32Array(size*size);for(var y=0;y<size;y++)for(var x=0;x<size;x++)hs[y*size+x]=h(x/size,y/size);
  return dynTex(name,size,function(g){var img=g.createImageData(size,size),d=img.data;
    for(var y=0;y<size;y++)for(var x=0;x<size;x++){
      var l=hs[y*size+((x-1+size)%size)],r=hs[y*size+((x+1)%size)],u=hs[((y-1+size)%size)*size+x],dn=hs[((y+1)%size)*size+x];
      var nx=(l-r)*strength,ny=(u-dn)*strength,nz=1,il=1/Math.sqrt(nx*nx+ny*ny+1);var i=(y*size+x)*4;
      d[i]=(nx*il*.5+.5)*255;d[i+1]=(ny*il*.5+.5)*255;d[i+2]=(nz*il*.5+.5)*255;d[i+3]=255}
    g.putImageData(img,0,0)})}
var NM={};
NM.hammer=normalTex('nh',256,function(u,v){var s=0;for(var i=0;i<60;i++){var cx=hash(i,7),cy=hash(i,13),r=.04+hash(i,3)*.05;var dx=Math.min(Math.abs(u-cx),1-Math.abs(u-cx)),dy=Math.min(Math.abs(v-cy),1-Math.abs(v-cy));var d=Math.sqrt(dx*dx+dy*dy)/r;if(d<1)s+=(1-d*d)*.6}return s+fbm(u*24,v*24,3)*.3},2.2);
NM.leather=normalTex('nl',256,function(u,v){return fbm(u*40,v*40,4)*.8+fbm(u*8,v*8,2)*.4},3);
NM.cloth=normalTex('nc',256,function(u,v){return (Math.sin(u*256*Math.PI)*.5+.5)*.35+(Math.sin(v*256*Math.PI)*.5+.5)*.35+fbm(u*30,v*30,2)*.3},1.6);
NM.skin=normalTex('ns',256,function(u,v){return fbm(u*60,v*60,3)*.5},1.2);
NM.stone=normalTex('nst',256,function(u,v){var bx=(u*4+(Math.floor(v*8)%2)*.5)%1,by=(v*8)%1;var e=Math.min(bx,1-bx)*4,f=Math.min(by,1-by)*2;var m=Math.min(1,Math.min(e,f)*6);return m*.7+fbm(u*20,v*20,4)*.5},3);
NM.sand=normalTex('nsa',256,function(u,v){return fbm(u*16,v*16,5)*.8+Math.sin((u+fbm(u*3,v*3,2)*.3)*60)*.05},2.6);

/* ---------- materials ---------- */
var MAT={};
var probe=new BABYLON.ReflectionProbe('probe',128,scene);probe.position=new V3(0,2,0);
function pbr(name,hex,metal,rough,o){o=o||{};var m=new BABYLON.PBRMaterial(name,scene);m.albedoColor=C3.FromHexString(hex).toLinearSpace();m.metallic=metal;m.roughness=rough;
  if(o.bump){m.bumpTexture=o.bump;m.bumpTexture.level=o.bl||.6;if(o.uv){m.bumpTexture.uScale=m.bumpTexture.vScale=o.uv}}
  if(o.albedo)m.albedoTexture=o.albedo;
  if(o.em){m.emissiveColor=C3.FromHexString(o.em);m.emissiveIntensity=o.ei||1}
  if(o.ds)m.backFaceCulling=false;
  if(o.sheen){m.sheen.isEnabled=true;m.sheen.intensity=o.sheen;m.sheen.color=C3.FromHexString(hex)}
  if(o.cc){m.clearCoat.isEnabled=true;m.clearCoat.intensity=o.cc}
  if(!o.noEnv)m.reflectionTexture=probe.cubeTexture;m.environmentIntensity=o.env==null?1:o.env;return m}
function texClone(t){var sz=t.getSize();var c=new BABYLON.DynamicTexture(t.name+'c',{width:sz.width,height:sz.height},scene,true);c.getContext().drawImage(t.getContext().canvas,0,0);c.update(true);c.wrapU=c.wrapV=BABYLON.Texture.WRAP_ADDRESSMODE;c.hasAlpha=t.hasAlpha;return c}
function bumpClone(t,uv,lvl){var c=texClone(t);c.uScale=c.vScale=uv||1;c.level=lvl||.6;return c}

/* ---------- lights, sky, post ---------- */
var sunDir=new V3(.42,-.36,-.83).normalize();
var sun=new BABYLON.DirectionalLight('sun',sunDir,scene);sun.position=sunDir.scale(-40);sun.intensity=4.2;sun.diffuse=new C3(1,.78,.55);
var hemi=new BABYLON.HemisphericLight('hemi',new V3(0,1,0),scene);hemi.intensity=.55;hemi.diffuse=new C3(.75,.62,.6);hemi.groundColor=new C3(.45,.3,.18);hemi.specular=C3.Black();
var sg=new BABYLON.ShadowGenerator(2048,sun);sg.usePercentageCloserFiltering=true;sg.filteringQuality=BABYLON.ShadowGenerator.QUALITY_MEDIUM;sg.bias=.0015;sg.normalBias=.015;sg.darkness=.15;
sun.shadowMinZ=1;sun.shadowMaxZ=90;sun.autoCalcShadowZBounds=false;sun.autoUpdateExtends=false;sun.shadowFrustumSize=0;
sun.orthoLeft=-20;sun.orthoRight=20;sun.orthoTop=20;sun.orthoBottom=-20;

var skyTex=dynTex('sky',512,function(g,s){var gr=g.createLinearGradient(0,0,0,s);
  gr.addColorStop(0,'#1a1430');gr.addColorStop(.28,'#4a2a3a');gr.addColorStop(.42,'#a0482a');gr.addColorStop(.5,'#f0a050');gr.addColorStop(.53,'#ffd890');gr.addColorStop(.56,'#a86a40');gr.addColorStop(1,'#2a1a12');
  g.fillStyle=gr;g.fillRect(0,0,s,s);
  for(var i=0;i<18;i++){var y=s*(.3+hash(i,2)*.18),x=hash(i,5)*s,w=s*(.2+hash(i,9)*.35);g.fillStyle='rgba(255,170,110,'+(.05+hash(i,4)*.08)+')';g.beginPath();g.ellipse(x,y,w,6+hash(i,1)*10,0,0,6.3);g.fill();g.beginPath();g.ellipse(x-s,y,w,8,0,0,6.3);g.fill()}});
var sky=BABYLON.MeshBuilder.CreateSphere('sky',{diameter:400,segments:24,sideOrientation:BABYLON.Mesh.BACKSIDE},scene);
var skm=new BABYLON.StandardMaterial('skm',scene);skm.emissiveTexture=skyTex;skm.disableLighting=true;skm.fogEnabled=false;sky.material=skm;sky.infiniteDistance=true;sky.isPickable=false;skyTex.wrapU=BABYLON.Texture.WRAP_ADDRESSMODE;skyTex.vScale=-1;skyTex.vOffset=0;
var sunDisc=BABYLON.MeshBuilder.CreateDisc('sund',{radius:9,tessellation:32},scene);var sdm=new BABYLON.StandardMaterial('sdm',scene);sdm.emissiveColor=new C3(1,.85,.55);sdm.disableLighting=true;sdm.fogEnabled=false;sunDisc.material=sdm;
sunDisc.position=sunDir.scale(-180);sunDisc.lookAt(V3.Zero());sunDisc.billboardMode=BABYLON.Mesh.BILLBOARDMODE_ALL;

/* ---------- open battlefield ---------- */
var FIELD_H=16;            /* half size of the square play area (m) */
var ARENA_R=22.6;          /* radius used by camera checks */
var groundAlb=dynTex('groundA',512,function(g,s){var img=g.createImageData(s,s),d=img.data;for(var y=0;y<s;y++)for(var x=0;x<s;x++){var n=fbm(x/s*12,y/s*12,5),m=fbm(x/s*3+4,y/s*3,3),gr=fbm(x/s*6+9,y/s*6+2,4);var i=(y*s+x)*4;
  var gg=Math.max(0,gr-.52)*2.2;d[i]=142+n*60-m*28-gg*40;d[i+1]=110+n*48-m*24+gg*12;d[i+2]=72+n*30-m*20-gg*18;d[i+3]=255}g.putImageData(img,0,0)});
groundAlb.uScale=groundAlb.vScale=24;
MAT.sand=pbr('ground','#ffffff',0,.96,{noEnv:1,albedo:groundAlb,bump:bumpClone(NM.sand,24,.8)});
var floor=BABYLON.MeshBuilder.CreateDisc('floor',{radius:160,tessellation:64},scene);floor.rotation.x=Math.PI/2;floor.material=MAT.sand;floor.receiveShadows=true;
/* distant hills */
MAT.hill=pbr('hill','#6a5238',0,1,{noEnv:1,bump:bumpClone(NM.sand,6,.6)});
for(var hi=0;hi<22;hi++){var ha=hi/22*Math.PI*2+hash(hi,3)*.2,hr=70+hash(hi,5)*55;var h=BABYLON.MeshBuilder.CreateSphere('hill',{diameter:1,segments:10},scene);
  h.scaling.set(40+hash(hi,7)*50,8+hash(hi,9)*16,30+hash(hi,8)*30);h.position.set(Math.sin(ha)*hr,-2,Math.cos(ha)*hr);h.rotation.y=ha;h.material=MAT.hill;h.isPickable=false}
/* stakes along the square edge, with gaps */
MAT.wood=pbr('fwood','#5a3a22',0,.8,{noEnv:1,bump:bumpClone(NM.leather,2,.6)});
(function(){var st=BABYLON.MeshBuilder.CreateCylinder('stake',{diameterTop:0,diameterBottom:.16,height:1.35,tessellation:6},scene);st.material=MAT.wood;
  var mats=[];var E=FIELD_H+.6;
  for(var side=0;side<4;side++)for(var k=-E;k<=E;k+=.55){if(Math.abs(k)%6<1.1&&Math.abs(k)>2)continue;var x=side<2?k:(side===2?-E:E),z=side<2?(side?E:-E):k;
    var out=side===0?new V3(0,0,-1):side===1?new V3(0,0,1):side===2?new V3(-1,0,0):new V3(1,0,0);var tilt=.32+hash(Math.round(k*10),side)*.15;
    var q=QT.RotationAxis(new V3(out.z,0,-out.x),tilt);mats.push(MX.Compose(new V3(1,1+hash(Math.round(k*7),side+3)*.3,1),q,new V3(x,.55,z)))}
  var buf=new Float32Array(mats.length*16);mats.forEach(function(m,i){m.copyToArray(buf,i*16)});st.thinInstanceSetBuffer('matrix',buf,16,true);st.receiveShadows=true;
  var rail=BABYLON.MeshBuilder.CreateBox('rail',{width:2*E,height:.08,depth:.08},scene);rail.material=MAT.wood;
  [[0,-E,0],[0,E,0],[-E,0,1],[E,0,1]].forEach(function(r,i){var m=i?rail.clone('rail'+i):rail;m.position.set(r[0],.45,r[1]);m.rotation.y=r[2]?Math.PI/2:0})})();
/* torches */
var flameTex=dynTex('flame',64,function(g,s){var gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,'rgba(255,240,200,1)');gr.addColorStop(.35,'rgba(255,150,50,.8)');gr.addColorStop(1,'rgba(120,20,0,0)');g.fillStyle=gr;g.fillRect(0,0,s,s)});
flameTex.hasAlpha=true;
MAT.bronzeDark=pbr('bronzeD','#6b4a2a',1,.42,{bump:bumpClone(NM.hammer,2,.5)});
var fireLights=[];
[[-1,-1],[1,-1],[-1,1],[1,1],[0,-1],[0,1],[-1,0],[1,0]].forEach(function(c,bi){var x=c[0]*(FIELD_H+1.4),z=c[1]*(FIELD_H+1.4);
  var pole=BABYLON.MeshBuilder.CreateCylinder('tp',{diameterTop:.1,diameterBottom:.16,height:2.6,tessellation:8},scene);pole.position.set(x,1.3,z);pole.material=MAT.wood;
  var cup=BABYLON.MeshBuilder.CreateCylinder('tc',{diameterTop:.42,diameterBottom:.18,height:.3,tessellation:12},scene);cup.position.set(x,2.65,z);cup.material=MAT.bronzeDark;
  var ps=new BABYLON.ParticleSystem('fire',70,scene);ps.particleTexture=flameTex;ps.emitter=new V3(x,2.85,z);ps.minEmitBox=new V3(-.12,0,-.12);ps.maxEmitBox=new V3(.12,0,.12);
  ps.color1=new BABYLON.Color4(1,.6,.2,1);ps.color2=new BABYLON.Color4(1,.35,.05,1);ps.colorDead=new BABYLON.Color4(.2,.05,0,0);ps.minSize=.25;ps.maxSize=.6;ps.minLifeTime=.25;ps.maxLifeTime=.6;ps.emitRate=55;ps.blendMode=BABYLON.ParticleSystem.BLENDMODE_ADD;ps.gravity=new V3(0,3,0);ps.direction1=new V3(-.15,1.2,-.15);ps.direction2=new V3(.15,2,.15);ps.minEmitPower=.4;ps.maxEmitPower=1;ps.start();
  if(bi<4){var pl=new BABYLON.PointLight('fl',new V3(x,3.1,z),scene);pl.diffuse=new C3(1,.55,.25);pl.intensity=5;pl.range=12;pl.specular=new C3(.3,.2,.1);fireLights.push(pl)}});
/* drifting dust and embers */
(function(){var e=new BABYLON.ParticleSystem('emb',160,scene);e.particleTexture=flameTex;e.emitter=new V3(0,.2,0);e.minEmitBox=new V3(-18,0,-18);e.maxEmitBox=new V3(18,3,18);
  e.color1=new BABYLON.Color4(1,.75,.45,.5);e.color2=new BABYLON.Color4(1,.85,.6,.35);e.colorDead=new BABYLON.Color4(1,.5,.2,0);e.minSize=.03;e.maxSize=.07;e.minLifeTime=3;e.maxLifeTime=7;e.emitRate=22;
  e.blendMode=BABYLON.ParticleSystem.BLENDMODE_ADD;e.gravity=new V3(.15,.2,.05);e.direction1=new V3(-.2,.3,-.2);e.direction2=new V3(.2,.6,.2);e.minEmitPower=.1;e.maxEmitPower=.3;e.start()})();
/* army banners and camps: textures per army, applied to the near or far side */
function bannerTexFor(sun){return dynTex(sun?'bnrS':'bnrE',256,function(g,s){g.fillStyle=sun?'#7a0f12':'#22141e';g.fillRect(0,0,s,s);var gold=sun?'#d9a441':'#9a8a7a';g.strokeStyle=gold;g.lineWidth=10;g.strokeRect(14,8,s-28,s-16);
  g.fillStyle=gold;g.beginPath();g.arc(s/2,s*.42,s*.18,0,6.3);g.fill();g.fillStyle=sun?'#7a0f12':'#22141e';
  if(sun){g.beginPath();g.arc(s/2,s*.42,s*.12,0,6.3);g.fill();g.fillStyle=gold;for(var i=0;i<12;i++){var a=i/12*6.283;g.save();g.translate(s/2,s*.42);g.rotate(a);g.fillRect(-4,-s*.3,8,s*.08);g.restore()}}
  else{g.beginPath();g.arc(s/2+s*.07,s*.4,s*.17,0,6.3);g.fill()}
  g.fillStyle=gold;g.beginPath();g.moveTo(14,s-8);for(var j=0;j<=6;j++){g.lineTo(14+(s-28)*j/6,s-8-(j%2?28:0))}g.fill()})}
MAT.bannerSun=pbr('bannerS','#ffffff',0,.85,{noEnv:1,albedo:bannerTexFor(true),ds:true,bump:bumpClone(NM.cloth,6,.4)});
MAT.bannerEcl=pbr('bannerE','#ffffff',0,.85,{noEnv:1,albedo:bannerTexFor(false),ds:true,bump:bumpClone(NM.cloth,6,.4)});
MAT.tentSun=pbr('tentS','#b8742e',0,.9,{noEnv:1,ds:true,bump:bumpClone(NM.cloth,4,.5)});MAT.tentEcl=pbr('tentE','#3a2a36',0,.9,{noEnv:1,ds:true,bump:bumpClone(NM.cloth,4,.5)});
var CAMP={near:{banners:[],tents:[]},far:{banners:[],tents:[]}};
['near','far'].forEach(function(side){var sz=side==='near'?-1:1;
  for(var i=0;i<7;i++){var x=-12+i*4,z=sz*(FIELD_H+2.6);var pole=BABYLON.MeshBuilder.CreateCylinder('bp',{diameter:.09,height:5,tessellation:6},scene);pole.position.set(x,2.5,z);pole.material=MAT.wood;
    var b=BABYLON.MeshBuilder.CreatePlane('bn',{width:1.1,height:2.4,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene);b.position.set(x+.58,3.7,z);b.rotation.y=sz>0?Math.PI:0;CAMP[side].banners.push(b)}
  for(var t=0;t<6;t++){var tx=-15+t*6+hash(t,sz+5)*2,tz=sz*(FIELD_H+8+hash(t,sz+9)*5);var tent=BABYLON.MeshBuilder.CreateCylinder('tent',{diameterTop:0,diameterBottom:4+hash(t,2)*1.5,height:3+hash(t,4),tessellation:t%2?4:8},scene);tent.position.set(tx,1.5+hash(t,4)*.5,tz);tent.rotation.y=hash(t,6)*3;CAMP[side].tents.push(tent);tent.receiveShadows=true}});
var FIELD={setSides:function(nearSun,farSun){CAMP.near.banners.forEach(function(b){b.material=nearSun?MAT.bannerSun:MAT.bannerEcl});CAMP.far.banners.forEach(function(b){b.material=farSun?MAT.bannerSun:MAT.bannerEcl});
  CAMP.near.tents.forEach(function(t){t.material=nearSun?MAT.tentSun:MAT.tentEcl});CAMP.far.tents.forEach(function(t){t.material=farSun?MAT.tentSun:MAT.tentEcl})}};
FIELD.setSides(true,false);
/* reflections: probe of the sky + ground */
[sky,floor,sunDisc].forEach(function(m){probe.renderList.push(m)});
probe.refreshRate=BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

/* camera + post */
var cam=new BABYLON.ArcRotateCamera('cam',-Math.PI/2,1.25,6,new V3(0,1.3,0),scene);cam.minZ=.1;cam.maxZ=500;cam.fov=.85;cam.inputs.clear();
var pipe=new BABYLON.DefaultRenderingPipeline('pp',true,scene,[cam]);
pipe.samples=engine.webGLVersion>1?4:1;pipe.fxaaEnabled=true;
pipe.bloomEnabled=true;pipe.bloomThreshold=.85;pipe.bloomWeight=.35;pipe.bloomKernel=48;pipe.bloomScale=.5;
pipe.imageProcessingEnabled=true;var ip=pipe.imageProcessing;ip.toneMappingEnabled=true;ip.toneMappingType=BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;ip.exposure=1.05;ip.contrast=1.28;
ip.vignetteEnabled=true;ip.vignetteWeight=2.2;ip.vignetteColor=new BABYLON.Color4(.1,.03,0,0);ip.vignetteStretch=.4;
pipe.grainEnabled=true;pipe.grain.intensity=5;pipe.grain.animated=true;pipe.chromaticAberrationEnabled=true;pipe.chromaticAberration.aberrationAmount=2;pipe.sharpenEnabled=true;pipe.sharpen.edgeAmount=.25;
if(FAST){pipe.dispose();sg.getShadowMap().refreshRate=0}
var vls=null;if(!FAST)try{vls=new BABYLON.VolumetricLightScatteringPostProcess('vls',.5,cam,sunDisc,60,BABYLON.Texture.BILINEAR_SAMPLINGMODE,engine,false);vls.exposure=.18;vls.decay=.965;vls.weight=.6;vls.density=.9}catch(e){vls=null}
