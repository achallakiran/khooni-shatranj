/* ---------- shield / armour face textures ---------- */
var TX={};
TX.lambda=dynTex('lam',512,function(g,s){var gr=g.createRadialGradient(s*.45,s*.4,s*.05,s/2,s/2,s*.55);gr.addColorStop(0,'#e6b46a');gr.addColorStop(.6,'#b07a38');gr.addColorStop(1,'#6a4520');g.fillStyle=gr;g.fillRect(0,0,s,s);
  for(var i=0;i<900;i++){g.fillStyle='rgba(60,30,10,'+(hash(i,1)*.12)+')';g.beginPath();g.arc(hash(i,2)*s,hash(i,3)*s,2+hash(i,4)*6,0,6.3);g.fill()}
  g.strokeStyle='#5a1410';g.lineWidth=s*.075;g.lineCap='butt';g.beginPath();g.moveTo(s*.27,s*.76);g.lineTo(s*.5,s*.22);g.lineTo(s*.73,s*.76);g.stroke();
  g.strokeStyle='rgba(255,220,150,.25)';g.lineWidth=4;g.beginPath();g.arc(s/2,s/2,s*.47,0,6.3);g.stroke()});
TX.scutum=dynTex('scu',512,function(g,s){g.fillStyle='#8a1414';g.fillRect(0,0,s,s);for(var i=0;i<4000;i++){g.fillStyle='rgba(0,0,0,'+hash(i,9)*.08+')';g.fillRect(hash(i,1)*s,hash(i,2)*s,3,3)}
  g.strokeStyle='#d9a441';g.lineWidth=12;g.strokeRect(22,22,s-44,s-44);g.fillStyle='#d9a441';
  for(var k=0;k<2;k++){g.save();g.translate(s/2,s/2);g.scale(k?-1:1,1);for(var j=0;j<5;j++){g.beginPath();g.moveTo(40,-20+j*14);g.quadraticCurveTo(130,-110+j*22,210-j*14,-150+j*30);g.lineTo(200-j*14,-138+j*30);g.quadraticCurveTo(120,-96+j*22,40,-8+j*14);g.fill()}
    g.beginPath();g.moveTo(30,30);g.lineTo(190,150);g.lineTo(170,150);g.lineTo(26,48);g.fill();g.restore()}
  g.beginPath();g.moveTo(s/2-12,s/2-200);g.lineTo(s/2+20,s/2-60);g.lineTo(s/2-6,s/2-60);g.lineTo(s/2+12,s/2+200);g.lineTo(s/2-22,s/2+40);g.lineTo(s/2+4,s/2+40);g.closePath();g.fill()});
TX.murm=dynTex('mur',512,function(g,s){g.fillStyle='#2c3f26';g.fillRect(0,0,s,s);for(var i=0;i<3000;i++){g.fillStyle='rgba(0,0,0,'+hash(i,7)*.1+')';g.fillRect(hash(i,3)*s,hash(i,4)*s,3,3)}
  g.strokeStyle='#c99a45';g.lineWidth=14;g.strokeRect(20,20,s-40,s-40);g.lineWidth=6;g.beginPath();g.arc(s/2,s/2,s*.3,0,6.3);g.stroke();
  g.fillStyle='#c99a45';for(var j=0;j<8;j++){var a=j/8*6.283;g.beginPath();g.arc(s/2+Math.cos(a)*s*.38,s/2+Math.sin(a)*s*.38,10,0,6.3);g.fill()}});
TX.sun=dynTex('sunS',512,function(g,s){var gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,'#ffe2a0');gr.addColorStop(.5,'#d9a441');gr.addColorStop(1,'#8a5a1c');g.fillStyle=gr;g.fillRect(0,0,s,s);
  g.translate(s/2,s/2);g.strokeStyle='#6a3d10';g.lineWidth=5;for(var i=0;i<24;i++){g.rotate(6.283/24);g.beginPath();g.moveTo(0,s*.12);g.quadraticCurveTo(s*.05,s*.25,0,s*.43);g.stroke()}
  for(var r=0;r<3;r++){g.beginPath();g.arc(0,0,s*(.12+r*.155),0,6.3);g.stroke()}
  g.fillStyle='#6a3d10';for(var k=0;k<36;k++){var a=k/36*6.283;g.beginPath();g.arc(Math.cos(a)*s*.465,Math.sin(a)*s*.465,4,0,6.3);g.fill()}});
TX.engrave=dynTex('eng',256,function(g,s){g.fillStyle='#d9a441';g.fillRect(0,0,s,s);g.strokeStyle='#7a4f12';g.lineWidth=3;
  for(var y=0;y<4;y++)for(var x=0;x<4;x++){var cx=x*s/4+s/8,cy=y*s/4+s/8;g.beginPath();g.arc(cx,cy,s/10,0,6.3);g.stroke();for(var p=0;p<6;p++){var a=p/6*6.283;g.beginPath();g.ellipse(cx+Math.cos(a)*s/18,cy+Math.sin(a)*s/18,s/40,s/80,a,0,6.3);g.stroke()}}});
TX.grille=dynTex('grl',256,function(g,s){g.fillStyle='#b07a38';g.fillRect(0,0,s,s);g.fillStyle='#120a05';for(var y=0;y<7;y++)for(var x=0;x<9;x++){g.beginPath();g.arc(x*s/8.4+10,y*s/6.5+16,8,0,6.3);g.fill()}});
TX.eclipse=dynTex('ecl',512,function(g,s){var gr=g.createRadialGradient(s*.45,s*.4,s*.05,s/2,s/2,s*.55);gr.addColorStop(0,'#a8783e');gr.addColorStop(.6,'#7a5226');gr.addColorStop(1,'#3e2812');g.fillStyle=gr;g.fillRect(0,0,s,s);
  for(var i=0;i<700;i++){g.fillStyle='rgba(20,10,5,'+(hash(i,11)*.15)+')';g.beginPath();g.arc(hash(i,12)*s,hash(i,13)*s,2+hash(i,14)*6,0,6.3);g.fill()}
  g.fillStyle='#1a0c0a';g.beginPath();g.arc(s/2,s/2,s*.26,0,6.3);g.fill();g.fillStyle='#8a1a14';g.beginPath();g.arc(s/2,s/2,s*.3,0,6.3);g.arc(s/2+s*.06,s/2-s*.02,s*.29,0,6.3,true);g.fill();
  g.strokeStyle='#5a1410';g.lineWidth=10;for(var k=0;k<12;k++){var a=k/12*6.283;g.beginPath();g.moveTo(s/2+Math.cos(a)*s*.34,s/2+Math.sin(a)*s*.34);g.lineTo(s/2+Math.cos(a)*s*.43,s/2+Math.sin(a)*s*.43);g.stroke()}});
var NM_eng=normalTex('neng',256,function(u,v){var x=u*4%1-.5,y=v*4%1-.5;var r=Math.sqrt(x*x+y*y);return Math.abs(r-.2)<.03?0:1},2);

/* ---------- palettes ---------- */
function makePalette(kind,dark){
  var P={};
  var SUNK={maharathi:1,sipahiSun:1,raniSun:1,rajaSun:1};
  P.skin=pbr('skin'+kind+dark,SUNK[kind]?(kind==='raniSun'?'#9a6040':'#8a5634'):(kind==='gladiator'?'#a86f4c':'#b88360'),0,kind==='gladiator'?.42:.55,{bump:bumpClone(NM.skin,3,.25),sheen:.15});
  P.hair=pbr('hair','#140d08',0,.8,{bump:bumpClone(NM.leather,4,.6)});
  P.dark=pbr('dark','#0c0806',0,.7);
  if(!dark){
    P.bronze=pbr('bronze'+kind,'#c58b45',1,.33,{bump:bumpClone(NM.hammer,1.5,.35)});
    P.iron=pbr('iron'+kind,'#9aa0a8',1,.38,{bump:bumpClone(NM.hammer,2,.2)});
    P.gold=pbr('gold'+kind,'#e2b04a',1,.26,{bump:bumpClone(NM.hammer,2,.15)});
    P.cloth=pbr('cloth'+kind,{maharathi:'#6e1426',rajaSun:'#6e1426',raniSun:'#7a1030',sipahiSun:'#c4621a'}[kind]||'#8e1513',0,.82,{bump:bumpClone(NM.cloth,6,.5),sheen:.4,ds:true});
    P.crest=pbr('crest'+kind,'#9a1210',0,.92,{bump:bumpClone(NM.leather,3,1),sheen:.5});
  }else{
    P.bronze=pbr('dbronze'+kind,'#5a4636',1,.45,{bump:bumpClone(NM.hammer,1.5,.4)});
    P.iron=pbr('diron'+kind,'#4a4a50',1,.42,{bump:bumpClone(NM.hammer,2,.25)});
    P.gold=pbr('dgold'+kind,'#8a6a3a',1,.38,{bump:bumpClone(NM.hammer,2,.2)});
    P.cloth=pbr('dcloth'+kind,'#2a1a26',0,.85,{bump:bumpClone(NM.cloth,6,.5),sheen:.35,ds:true});
    P.crest=pbr('dcrest'+kind,'#1a1214',0,.92,{bump:bumpClone(NM.leather,3,1),sheen:.4});
  }
  P.leather=pbr('leather'+kind+dark,dark?'#2e2018':'#5a3720',0,.68,{bump:bumpClone(NM.leather,2,.8)});
  P.linen=pbr('linen'+dark,dark?'#5a5048':'#d8cdb4',0,.88,{bump:bumpClone(NM.cloth,4,.5),sheen:.3,ds:true});
  P.steel=pbr('steel','#d8dde4',1,.18,{bump:bumpClone(NM.hammer,4,.08)});
  P.wood=pbr('wood','#4a2c18',0,.6,{bump:bumpClone(NM.leather,2,.5)});
  P.plume=pbr('plume'+dark,dark?'#1d2a24':'#2f6a58',.2,.45,{sheen:.6});
  P.ruby=pbr('ruby','#a0101a',0,.15,{em:'#300004',cc:1});
  var faceTex={spartan:TX.lambda,legion:TX.scutum,gladiator:TX.murm,maharathi:TX.sun,sipahi:TX.eclipse,sipahiSun:TX.sun,raniSun:TX.sun,rajaSun:TX.sun,raniEcl:TX.eclipse,rajaEcl:TX.scutum}[kind];
  var metF=kind==='spartan'||SUNK[kind];
  P.face=pbr('face'+kind+dark,'#ffffff',metF?1:0,metF?.35:.6,{albedo:faceTex,bump:SUNK[kind]?NM_eng:bumpClone(NM.hammer,1,.25)});
  if(dark)P.face.albedoColor=new C3(.32,.28,.26);
  P.goldEng=pbr('goldEng'+dark,'#ffffff',1,.3,{albedo:TX.engrave,bump:NM_eng});if(dark)P.goldEng.albedoColor=new C3(.45,.4,.36);
  P.grille=pbr('grille'+dark,'#ffffff',1,.35,{albedo:TX.grille});if(dark)P.grille.albedoColor=new C3(.4,.38,.36);
  return P}
var PALS={};function pal(kind,dark){var k=kind+(dark?'D':'L');return PALS[k]||(PALS[k]=makePalette(kind,dark))}

/* ---------- builders ---------- */
var HB=1.0;
function TN(name,par,x,y,z){var n=new BABYLON.TransformNode(name,scene);n.parent=par;n.position.set(x||0,y||0,z||0);return n}
function Kit(f){
  function reg(m,par,x,y,z,mat){m.parent=par;m.position.set(x||0,y||0,z||0);m.material=mat;f.meshes.push(m);m.receiveShadows=true;m.isPickable=false;return m}
  return{
    sph:function(par,d,x,y,z,mat,sx,sy,sz,seg){var m=reg(BABYLON.MeshBuilder.CreateSphere('s',{diameter:d,segments:seg||16},scene),par,x,y,z,mat);m.scaling.set(sx||1,sy||1,sz||1);return m},
    dome:function(par,d,x,y,z,mat,slice,sx,sy,sz){var m=reg(BABYLON.MeshBuilder.CreateSphere('d',{diameter:d,segments:20,slice:slice,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),par,x,y,z,mat);m.scaling.set(sx||1,sy||1,sz||1);return m},
    cap:function(par,h,r1,r2,x,y,z,mat){return reg(BABYLON.MeshBuilder.CreateCapsule('c',{height:h,radiusTop:r1,radiusBottom:r2,tessellation:16,subdivisions:2,capSubdivisions:6},scene),par,x,y,z,mat)},
    cyl:function(par,dt,db,h,x,y,z,mat,tess,arc){return reg(BABYLON.MeshBuilder.CreateCylinder('y',{diameterTop:dt,diameterBottom:db,height:h,tessellation:tess||24,arc:arc||1,sideOrientation:(arc&&arc<1)||dt===0?BABYLON.Mesh.DOUBLESIDE:BABYLON.Mesh.DEFAULTSIDE,enclose:false},scene),par,x,y,z,mat)},
    box:function(par,w,h,d,x,y,z,mat){return reg(BABYLON.MeshBuilder.CreateBox('b',{width:w,height:h,depth:d},scene),par,x,y,z,mat)},
    tor:function(par,dia,th,x,y,z,mat,tess){return reg(BABYLON.MeshBuilder.CreateTorus('t',{diameter:dia,thickness:th,tessellation:tess||24},scene),par,x,y,z,mat)},
    tube:function(par,path,rf,mat){return reg(BABYLON.MeshBuilder.CreateTube('tb',{path:path,radiusFunction:rf,tessellation:12,cap:BABYLON.Mesh.CAP_ALL,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),par,0,0,0,mat)},
    lathe:function(par,shape,x,y,z,mat,tess){return reg(BABYLON.MeshBuilder.CreateLathe('l',{shape:shape,tessellation:tess||28,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene),par,x,y,z,mat)}
  }}
function arcPath(pts,n){var out=[];for(var i=0;i<=n;i++){var t=i/n;var a=pts[0],b=pts[1],c=pts[2];var u=1-t;out.push(new V3(u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1],u*u*a[2]+2*u*t*b[2]+t*t*c[2]))}return out}

var FEM={raniSun:1,raniEcl:1};
function buildFighter(kind,dark,opt){
  opt=opt||{};var P=pal(kind,dark);
  var f={kind:kind,dark:dark,meshes:[],cast:opt.cast!==false,s:opt.scale||1};
  var K=Kit(f),sph=K.sph,cap=K.cap,cyl=K.cyl,box=K.box,tor=K.tor;
  f.root=TN('root',null);f.body=TN('body',f.root);f.body.scaling.setAll(f.s);
  f.hips=TN('hips',f.body,0,HB,0);f.spine=TN('spine',f.hips,0,.1,0);f.chest=TN('chest',f.spine,0,.22,0);
  f.neck=TN('neck',f.chest,0,.27,-.01);f.head=TN('head',f.neck,0,.09,.012);
  function arm(side){var s=TN('sh',f.chest,side*.2,.2,0),e=TN('el',s,0,-.29,0),h=TN('hd',e,0,-.27,0);[s,e,h].forEach(function(n){n.rotationQuaternion=QT.Identity()});return{s:s,e:e,h:h}}
  function leg(side){var s=TN('lg',f.hips,side*.1,-.06,0),e=TN('kn',s,0,-.44,0),h=TN('an',e,0,-.44,0);[s,e,h].forEach(function(n){n.rotationQuaternion=QT.Identity()});return{s:s,e:e,h:h}}
  f.R=arm(1);f.L=arm(-1);f.RL=leg(1);f.LL=leg(-1);
  var sk=P.skin,bare=kind==='spartan'||kind==='gladiator'||kind==='maharathi';
  /* torso anatomy */
  sph(f.hips,.36,0,-.02,0,sk,1,.62,.74);
  var ab=cap(f.spine,.34,FEM[kind]?.115:.135,FEM[kind]?.11:.122,0,.1,0,sk);ab.scaling.z=.78;
  if(bare){for(var r=0;r<3;r++)for(var c2=-1;c2<=1;c2+=2)sph(f.spine,.072,c2*.038,.025+r*.07,.092,sk,1,.8,.5)}
  var fem=!!FEM[kind];
  if(fem){sph(f.chest,.4,0,.1,-.01,sk,.95,.66,.56);sph(f.chest,.2,0,.22,-.04,sk,.95,.4,.65)}
  else{sph(f.chest,.46,0,.1,-.01,sk,1,.66,.6);
  sph(f.chest,.2,.085,.13,.075,sk,1,.62,.55);sph(f.chest,.2,-.085,.13,.075,sk,1,.62,.55);
  sph(f.chest,.2,.15,.04,-.03,sk,.7,1.1,.8);sph(f.chest,.2,-.15,.04,-.03,sk,.7,1.1,.8);
  sph(f.chest,.24,0,.23,-.04,sk,1.05,.45,.7)}
  cap(f.neck,.16,.058,.062,0,.03,0,sk);
  /* head */
  sph(f.head,.215,0,.1,0,sk,.9,1.1,1.02);sph(f.head,.17,0,.03,.03,sk,.92,.8,1);
  box(f.head,.028,.06,.05,0,.095,.1,sk).rotation.x=-.25;
  sph(f.head,.05,.1,.1,0,sk,.4,1,.8);sph(f.head,.05,-.1,.1,0,sk,.4,1,.8);
  var eyeM=P.dark;sph(f.head,.024,.037,.122,.087,eyeM);sph(f.head,.024,-.037,.122,.087,eyeM);
  box(f.head,.05,.012,.02,.038,.142,.09,P.hair).rotation.z=-.12;box(f.head,.05,.012,.02,-.038,.142,.09,P.hair).rotation.z=.12;
  if(FEM[kind]){sph(f.head,.24,0,.11,-.025,P.hair,.95,1.0,1.0)}
  else if(kind!=='legion'&&kind!=='rajaEcl'){sph(f.head,.15,0,.005,.05,P.hair,.92,.62,.78);sph(f.head,.06,0,.058,.098,P.hair,1.35,.32,.45)}
  /* limbs */
  [f.R,f.L].forEach(function(A){
    if(fem){sph(A.s,.12,0,-.02,0,sk);cap(A.s,.32,.05,.042,0,-.15,0,sk);sph(A.e,.07,0,0,0,sk);cap(A.e,.29,.043,.032,0,-.135,0,sk)}else{
    sph(A.s,.155,0,-.02,0,sk,1.05,1,1);
    cap(A.s,.32,.06,.05,0,-.15,0,sk);sph(A.s,.105,0,-.13,.022,sk,.9,1.5,1);sph(A.s,.1,0,-.12,-.025,sk,.9,1.5,1);
    sph(A.e,.08,0,0,0,sk);cap(A.e,.29,.052,.038,0,-.135,0,sk);sph(A.e,.095,0,-.06,.015,sk,1,1.6,1)}
    sph(A.h,.095,0,0,0,sk,.85,1.15,1.15)});
  [f.RL,f.LL].forEach(function(L){
    cap(L.s,.5,.09,.062,0,-.22,0,sk);sph(L.s,.15,0,-.18,-.03,sk,.85,1.7,.9);
    sph(L.e,.1,0,0,-.015,sk);cap(L.e,.47,.062,.042,0,-.22,0,sk);sph(L.e,.115,0,-.13,.035,sk,.85,1.6,1);
    var ft=cap(L.h,.26,.046,.042,0,-.025,.06,P.leather);ft.rotation.x=Math.PI/2;ft.scaling.x=1.15});
  /* gear */
  GEAR[kind](f,K,P);
  mergeFighter(f);
  return f}
function mergeFighter(f){var groups={},out=[];
  f.meshes.forEach(function(m){if(!m.parent||!m.material){out.push(m);return}var k=m.parent.uniqueId+'|'+m.material.uniqueId;(groups[k]=groups[k]||[]).push(m)});
  Object.keys(groups).forEach(function(k){var g=groups[k],par=g[0].parent,mat=g[0].material;
    if(g.length>1){g.forEach(function(m){var q=m.rotationQuaternion||QT.FromEulerAngles(m.rotation.x,m.rotation.y,m.rotation.z);var L=MX.Compose(m.scaling,q,m.position);m.bakeTransformIntoVertices(L);m.position.setAll(0);m.rotation.setAll(0);m.rotationQuaternion=null;m.scaling.setAll(1);m.parent=null;m.computeWorldMatrix(true)});var mm=BABYLON.Mesh.MergeMeshes(g,true,true);mm.parent=par;mm.material=mat;mm.receiveShadows=true;mm.isPickable=false;out.push(mm)}else out.push(g[0])});
  out.forEach(function(m){if(f.cast)sg.addShadowCaster(m,false)});f.meshes=out}

var GEAR={};
function cape(f,P,len){f.capeMat=P.cloth;f.capeLen=len||1.0}
function shieldRound(f,K,P,dia,faceMat,rimMat,boss){
  var sh=TN('shield',f.L.h,0,0,.0);f.shield=sh;
  var g=TN('sg',sh,0,0,.075);
  var disc=K.cyl(g,dia,dia,.04,0,0,0,P.leather,40);disc.rotation.x=Math.PI/2;
  var dm=K.dome(g,dia*.98,0,0,.012,rimMat,.5,1,.12,1);dm.rotation.x=Math.PI/2;var face=K.cyl(g,dia*.93,dia*.93,.01,0,0,.075,faceMat,48);face.rotation.x=-Math.PI/2;face.rotation.y=Math.PI;
  var rim=K.tor(g,dia,.04,0,0,.02,rimMat,48);rim.rotation.x=Math.PI/2;
  if(boss)K.sph(g,dia*.2,0,0,.07,rimMat,1,1,.5);
  K.box(sh,.05,.16,.03,0,0,.03,P.leather);
  return sh}
function shieldScutum(f,K,P,h,w,faceMat,rim){
  var sh=TN('shield',f.L.h,0,0,0);f.shield=sh;var g=TN('sg',sh,0,.0,.06);
  var R=.75,arc=w/(2*Math.PI*R);var c=K.cyl(g,R*2,R*2,h,0,0,-R+.06,faceMat,48,arc);c.rotation.y=-Math.PI/2-arc*Math.PI;
  var b=K.sph(g,.2,0,0,.1,rim,1,1,.45);
  K.box(g,.03,h,.05,w/2-.01,0,.02,rim).rotation.y=-.6;K.box(g,.03,h,.05,-w/2+.01,0,.02,rim).rotation.y=.6;
  return sh}
function swordStraight(f,K,P,bl,bw,leaf,grip){
  var sw=TN('sword',f.R.h,0,0,0);f.sword=sw;
  K.cyl(sw,.034,.036,.12,0,0,0,grip||P.leather,10);K.box(sw,.12,.024,.045,0,.072,0,P.bronze);K.sph(sw,.05,0,-.075,0,P.bronze);
  if(leaf){var a=K.cyl(sw,bw*1.25,bw*.85,bl*.45,0,.085+bl*.225,0,P.steel,4);a.scaling.z=.22;a.rotation.y=Math.PI/4*0;var b=K.cyl(sw,0,bw*1.25,bl*.55,0,.085+bl*.45+bl*.275,0,P.steel,4);b.scaling.z=.22}
  else{var c=K.box(sw,bw,bl*.86,.012,0,.085+bl*.43,0,P.steel);var d=K.cyl(sw,0,bw*1.41,bl*.14,0,.085+bl*.86+bl*.07,0,P.steel,4);d.rotation.y=Math.PI/4;d.scaling.set(1,1,.17)}
  f.bladeLen=bl+.09;return sw}

GEAR.sipahi=function(f,K,P){
  K.tor(f.hips,.39,.05,0,.07,0,P.leather).scaling.z=.8;
  var sk=K.cyl(f.hips,.4,.5,.24,0,-.08,0,P.linen,24);sk.scaling.z=.8;
  for(var i=0;i<16;i++){var a=i/16*Math.PI*2;var st=K.box(f.hips,.075,.24,.015,Math.sin(a)*.21,-.24,Math.cos(a)*.17,P.leather);st.rotation.y=a;st.rotation.x=-.1}
  var lt=K.cyl(f.chest,.45,.36,.42,0,.13,0,P.linen,24);lt.scaling.z=.66;K.box(f.chest,.3,.22,.03,0,.18,.15,P.bronze);
  [1,-1].forEach(function(s){var fl=K.box(f.chest,.16,.03,.2,s*.17,.33,0,P.linen);fl.rotation.z=-s*.35});
  [f.R,f.L].forEach(function(A){K.cap(A.e,.17,.058,.046,0,-.17,0,P.bronze)});
  [f.RL,f.LL].forEach(function(L){var g=K.cap(L.e,.4,.07,.05,0,-.21,-.008,P.bronze);g.scaling.z=1.05;K.tor(L.h,.11,.012,0,.0,.02,P.leather)});
  var H=f.head;K.sph(H,.27,0,.15,-.005,P.bronze,1,1.08,1.12);K.cyl(H,.27,.25,.12,0,.03,.0,P.bronze,28).scaling.z=1.12;
  K.box(H,.16,.03,.03,0,.125,.142,P.dark);K.box(H,.04,.11,.03,0,.05,.145,P.dark);K.box(H,.03,.07,.02,0,.11,.155,P.bronze);
  K.box(H,.03,.07,.03,0,.31,0,P.bronze);
  var cr=K.tube(H,arcPath([[0,.3,.18],[0,.55,.0],[0,.28,-.28]],16),function(i){var t=i/16;return .012+.06*Math.sin(Math.PI*Math.min(1,t*1.05))},P.crest);cr.scaling.x=.3;
  shieldRound(f,K,P,.9,P.face,P.bronze,true);
  spearWeapon(f,K,P,P.bronze);f.capeLen=0};
function spearWeapon(f,K,P,fit){var sp=TN('sword',f.R.h,0,0,0);f.sword=sp;K.cyl(sp,.034,.038,2.3,0,.2,0,P.wood,10);
  var tip=K.cyl(sp,0,.075,.32,0,1.5,0,P.steel,4);tip.scaling.z=.25;K.cyl(sp,.04,.04,.06,0,1.32,0,fit,10);K.cyl(sp,.04,0,.16,0,-1.02,0,fit,8);
  f.bladeLen=1.62;f.weapon='spear';return sp}
GEAR.spartan=function(f,K,P){
  K.tor(f.hips,.39,.05,0,.07,0,P.leather).scaling.z=.8;K.box(f.hips,.08,.06,.02,0,.07,.16,P.bronze);
  var sk=K.cyl(f.hips,.4,.47,.2,0,-.07,0,P.leather,24);sk.scaling.z=.8;
  for(var i=0;i<16;i++){var a=i/16*Math.PI*2;var st=K.box(f.hips,.075,.26,.015,Math.sin(a)*.2,-.2,Math.cos(a)*.16,P.leather);st.rotation.y=a;st.rotation.x=-.12}
  [f.R,f.L].forEach(function(A){K.cap(A.e,.17,.058,.046,0,-.17,0,P.bronze)});
  [f.RL,f.LL].forEach(function(L){var g=K.cap(L.e,.4,.07,.05,0,-.21,-.008,P.bronze);g.scaling.z=1.05;K.tor(L.h,.11,.012,0,.0,.02,P.leather)});
  K.box(f.chest,.06,.5,.012,.03,.12,.135,P.leather).rotation.z=.65;
  /* corinthian helm */
  var H=f.head;K.sph(H,.27,0,.15,-.005,P.bronze,1,1.08,1.12);K.cyl(H,.27,.25,.12,0,.03,.0,P.bronze,28).scaling.z=1.12;
  K.box(H,.16,.03,.03,0,.125,.142,P.dark);K.box(H,.04,.11,.03,0,.05,.145,P.dark);K.box(H,.03,.07,.02,0,.11,.155,P.bronze);
  K.tor(H,.27,.012,0,.17,0,P.bronze,32).scaling.z=1.12;
  K.box(H,.03,.07,.03,0,.31,0,P.bronze);
  var cr=K.tube(H,arcPath([[0,.3,.2],[0,.6,.0],[0,.28,-.3]],18),function(i,d){var t=i/18;return .012+.07*Math.sin(Math.PI*Math.min(1,t*1.05))},P.crest);cr.scaling.x=.3;
  shieldRound(f,K,P,.92,P.face,P.bronze,true);
  swordStraight(f,K,P,.58,.05,true);cape(f,P,1.05)};
function legionBody(f,K,P,noHelm){
  var sk=K.cyl(f.hips,.42,.58,.42,0,-.17,0,P.cloth,28);sk.scaling.z=.8;K.tor(f.hips,.58,.02,0,-.38,0,P.cloth).scaling.z=.8;
  for(var i=0;i<6;i++){var st=K.box(f.hips,.05,.34,.012,-.12+i*.048,-.2,.17,P.leather);K.sph(f.hips,.025,-.12+i*.048,-.37,.172,P.bronze)}
  K.tor(f.hips,.4,.05,0,.07,0,P.leather).scaling.z=.8;
  var bands=[[-.22,.27,.25],[-.15,.29,.28],[-.08,.32,.31],[-.01,.35,.36],[.06,.4,.42],[.13,.44,.45],[.2,.45,.44]];
  bands.forEach(function(b){var c=K.cyl(f.chest,b[1],b[2],.074,0,b[0]+.04,0,P.iron,28);c.scaling.z=.7});
  K.box(f.chest,.34,.16,.03,0,.27,.13,P.iron);
  [1,-1].forEach(function(s){for(var k=0;k<4;k++){var a=K.cyl(s>0?f.R.s:f.L.s,.2-k*.012,.2-k*.012,.06,0,.03-k*.045,0,P.iron,24,.55);a.rotation.z=Math.PI/2;a.rotation.y=s>0?0:Math.PI;a.rotation.x=0}});
  [[.09,.2],[-.09,.2],[0,.08],[.09,.0],[-.09,.0]].forEach(function(p){var d=K.cyl(f.chest,.07,.07,.014,p[0],p[1],.165,P.gold,20);d.rotation.x=Math.PI/2});
  K.box(f.chest,.025,.3,.01,.09,.1,.162,P.leather);K.box(f.chest,.025,.3,.01,-.09,.1,.162,P.leather);
  var H=f.head;K.dome(H,.27,0,.12,-.005,P.iron,.55,1,1.05,1.1);K.tor(H,.268,.016,0,.13,0,P.gold,32).scaling.z=1.1;
  var ng=K.cyl(H,.25,.34,.08,0,.06,-.03,P.iron,24,.5);ng.rotation.y=Math.PI/2;
  [1,-1].forEach(function(s){var c=K.box(H,.018,.12,.11,s*.118,.06,.04,P.iron);c.rotation.z=s*.12});
  K.box(H,.03,.05,.03,0,.29,0,P.gold);
  var cr=K.tube(H,arcPath([[-.26,.24,0],[0,.62,0],[.26,.24,0]],18),function(i){var t=i/18;return .015+.065*Math.sin(Math.PI*t)},P.crest);cr.scaling.z=.32;
  [f.RL,f.LL].forEach(function(L){K.cap(L.e,.36,.068,.05,0,-.22,-.006,P.bronze)})}
GEAR.legion=function(f,K,P){legionBody(f,K,P);shieldScutum(f,K,P,1.0,.68,P.face,P.gold);swordStraight(f,K,P,.52,.055,false);cape(f,P,1.0)};
GEAR.gladiator=function(f,K,P){
  var sb=K.cyl(f.hips,.38,.42,.17,0,-.05,0,P.linen,24);sb.scaling.z=.8;K.box(f.hips,.18,.26,.02,0,-.2,.16,P.linen);
  var bt=K.cyl(f.hips,.395,.4,.11,0,.06,0,P.bronze,28);bt.scaling.z=.82;for(var i=0;i<10;i++){var a=i/10*Math.PI*2;K.sph(f.hips,.025,Math.sin(a)*.2,.06,Math.cos(a)*.165,P.gold)}
  for(var k=0;k<7;k++){K.tor(f.R.s,.135-k*.006,.026,0,-.03-k*.04,0,P.iron,20)}for(var k2=0;k2<6;k2++){K.tor(f.R.e,.11-k2*.008,.024,0,-.02-k2*.045,0,P.iron,20)}
  K.sph(f.R.s,.19,0,.0,0,P.iron,1.1,.7,1.1);
  K.cap(f.LL.e,.38,.072,.052,0,-.21,-.008,P.bronze);for(var k3=0;k3<5;k3++)K.tor(f.RL.e,.12-k3*.01,.02,0,-.06-k3*.07,0,P.linen,18);
  var H=f.head;K.sph(H,.27,0,.15,-.01,P.bronze,1,1.05,1.1);
  var br=K.cyl(H,.48,.46,.02,0,.13,-.01,P.bronze,40);br.scaling.z=1.05;
  var vz=K.cyl(H,.285,.285,.2,0,.06,.0,P.grille,28,.5);vz.rotation.y=Math.PI;
  var fin=K.tube(H,arcPath([[0,.26,.16],[0,.64,.02],[0,.3,-.22]],18),function(i){var t=i/18;return .01+.09*Math.sin(Math.PI*Math.min(1,t*1.05))},P.bronze);fin.scaling.x=.12;
  K.tube(H,arcPath([[0,.33,.12],[0,.7,-.02],[0,.4,-.2]],14),function(i){var t=i/14;return .01+.05*Math.sin(Math.PI*t)},P.crest).scaling.x=.25;
  shieldScutum(f,K,P,.82,.6,P.face,P.bronze);swordStraight(f,K,P,.5,.055,false);f.capeLen=0};
function maharathiBody(f,K,P){
  var dh=K.cyl(f.hips,.42,.64,.52,0,-.21,0,P.cloth,30);dh.scaling.z=.82;K.tor(f.hips,.64,.025,0,-.47,0,P.gold,30).scaling.z=.82;
  K.box(f.hips,.16,.48,.02,0,-.22,.215,P.cloth).rotation.x=.05;K.box(f.hips,.02,.48,.025,.08,-.22,.217,P.gold);K.box(f.hips,.02,.48,.025,-.08,-.22,.217,P.gold);
  var sash=K.tor(f.hips,.4,.08,0,.08,0,P.cloth,24);sash.scaling.z=.82;K.tor(f.hips,.42,.02,0,.12,0,P.gold,24).scaling.z=.82;
  var bp=K.sph(f.chest,.48,0,.1,-.005,P.goldEng,1,.68,.64);var ap=K.cap(f.spine,.24,.14,.13,0,.1,.0,P.goldEng);ap.scaling.z=.8;
  K.sph(f.chest,.06,0,.13,.15,P.ruby,1,1,.6);K.tor(f.chest,.12,.012,0,.13,.145,P.gold).rotation.x=Math.PI/2;
  for(var j=0;j<7;j++){var a=-1.2+j*.4;K.sph(f.chest,.03,Math.sin(a)*.17,.27-Math.abs(a)*.05,Math.cos(a)*.1+.04,P.gold)}
  [f.R,f.L].forEach(function(A){K.sph(A.s,.2,0,0,0,P.gold,1.05,.75,1.05);K.tor(A.s,.12,.02,0,-.12,0,P.gold);K.tor(A.s,.115,.014,0,-.15,0,P.gold);K.cap(A.e,.2,.06,.047,0,-.16,0,P.goldEng)});
  [f.RL,f.LL].forEach(function(L){K.tor(L.h,.1,.018,0,.02,.0,P.gold)});
  var H=f.head;K.dome(H,.27,0,.15,-.005,P.gold,.6,1,1.05,1.1);K.tor(H,.275,.03,0,.16,0,P.gold,32).scaling.z=1.1;
  K.cyl(H,0,.07,.28,0,.42,0,P.gold,12);K.sph(H,.06,0,.29,0,P.gold);K.sph(H,.05,0,.2,.15,P.ruby,1,1,.6);
  [1,-1].forEach(function(s){var w=K.box(H,.02,.16,.1,s*.14,.24,-.02,P.gold);w.rotation.z=-s*.35;var c=K.box(H,.018,.11,.08,s*.122,.07,.035,P.gold);c.rotation.z=s*.1});
  K.tube(H,arcPath([[0,.42,-.05],[0,.62,-.2],[0,.5,-.42]],14),function(i){var t=i/14;return .008+.04*Math.sin(Math.PI*t)},P.plume).scaling.x=.4;
  for(var b=0;b<6;b++)K.sph(H,.075-b*.006,0,.08-b*.08,-.12-b*.012,P.hair)}
GEAR.maharathi=function(f,K,P){maharathiBody(f,K,P);
  shieldRound(f,K,P,.84,P.face,P.gold,true);
  var sw=swordStraight(f,K,P,.72,.07,false,P.gold);K.box(sw,.11,.05,.013,0,.085+.72*.88,0,P.steel);K.tor(sw,.12,.012,0,.03,0,P.gold).rotation.z=Math.PI/2;
  cape(f,P,1.0)};

/* ================= Milestone 2 pieces ================= */
function talwar(node,K,P,len,hilt){var sw=TN('blade',node,0,0,0);
  K.cyl(sw,.032,.034,.12,0,0,0,P.leather,10);K.box(sw,.12,.022,.04,0,.068,0,hilt);K.sph(sw,.06,0,-.078,0,hilt,1,.6,1);
  var n=16,bl=K.tube(sw,arcPath([[0,.08,0],[.0,.08+len*.6,0],[-.11,.08+len,0]],n),function(i){var t=i/n;return .026*(1-Math.pow(t,2.6))+.003},P.steel);bl.scaling.z=.2;
  return sw}
function leafBlade(node,K,P,bl,bw,hilt){var sw=TN('blade',node,0,0,0);
  K.cyl(sw,.034,.036,.12,0,0,0,P.leather,10);K.box(sw,.12,.024,.045,0,.072,0,hilt);K.sph(sw,.05,0,-.075,0,hilt);
  var a=K.cyl(sw,bw*1.25,bw*.85,bl*.45,0,.085+bl*.225,0,P.steel,4);a.scaling.z=.22;var b=K.cyl(sw,0,bw*1.25,bl*.55,0,.085+bl*.45+bl*.275,0,P.steel,4);b.scaling.z=.22;
  return sw}
function twinBlades(f,K,P,mk){f.sword=mk(f.R.h);f.sword2=mk(f.L.h);f.leftBlade=true;f.weapon='twin'}
function maceWeapon(f,K,P,shaft,fl){var sw=TN('sword',f.R.h,0,0,0);f.sword=sw;
  K.cyl(sw,.042,.046,.84,0,.32,0,shaft,12);K.sph(sw,.07,0,-.11,0,fl,1,.8,1);for(var r=0;r<3;r++)K.tor(sw,.06,.012,0,-.02+r*.07,0,fl,12);
  K.sph(sw,.17,0,.8,0,P.steel,1,1.1,1);for(var i=0;i<8;i++){var a=i/8*Math.PI*2;var b=K.box(sw,.022,.2,.085,Math.sin(a)*.075,.8,Math.cos(a)*.075,fl);b.rotation.y=a}
  K.cyl(sw,0,.045,.14,0,.96,0,fl,8);K.tor(sw,.1,.02,0,.68,0,fl,16);
  f.bladeLen=.9;f.weapon='mace';return sw}
GEAR.sipahiSun=function(f,K,P){
  var coat=K.cyl(f.hips,.44,.64,.62,0,-.25,0,P.cloth,28);coat.scaling.z=.82;K.tor(f.hips,.64,.022,0,-.56,0,P.gold,28).scaling.z=.82;
  for(var i=0;i<10;i++){var a=i/10*Math.PI*2;var q=K.box(f.hips,.012,.6,.012,Math.sin(a)*.25,-.25,Math.cos(a)*.205,P.gold);q.rotation.y=a;q.rotation.x=Math.cos(a)*.14;q.rotation.z=-Math.sin(a)*.14}
  K.tor(f.hips,.42,.06,0,.07,0,P.leather).scaling.z=.8;K.box(f.hips,.09,.08,.03,0,.07,.18,P.gold);
  var ch=K.cyl(f.chest,.47,.4,.44,0,.13,0,P.cloth,24);ch.scaling.z=.68;
  for(var r=0;r<4;r++){var b2=K.tor(f.chest,.46-r*.015,.01,0,.0+r*.08,0,P.gold,24);b2.scaling.z=.68}
  K.box(f.chest,.02,.42,.01,0,.12,.165,P.gold);
  [f.R,f.L].forEach(function(A){K.cap(A.s,.3,.075,.06,0,-.13,0,P.cloth);K.cap(A.e,.2,.058,.046,0,-.16,0,P.iron)});
  [f.RL,f.LL].forEach(function(L){K.cap(L.e,.42,.068,.05,0,-.21,-.006,P.linen);K.tor(L.h,.11,.014,0,.02,.0,P.leather)});
  var H=f.head;K.dome(H,.27,0,.13,-.005,P.iron,.55,1,1.0,1.08);K.tor(H,.268,.02,0,.135,0,P.gold,32).scaling.z=1.08;
  K.cyl(H,0,.035,.2,0,.36,0,P.gold,8);K.sph(H,.05,0,.26,0,P.gold);K.box(H,.022,.13,.02,0,.08,.15,P.iron);
  var av=K.cyl(H,.29,.34,.17,0,.04,-.02,P.iron,24,.62);av.rotation.y=Math.PI*.69;
  K.tube(H,arcPath([[0,.28,-.04],[0,.5,-.12],[0,.4,-.32]],12),function(i){var t=i/12;return .006+.035*Math.sin(Math.PI*t)},P.plume).scaling.x=.4;
  shieldRound(f,K,P,.78,P.face,P.gold,true);spearWeapon(f,K,P,P.gold);f.capeLen=0};
GEAR.raniSun=function(f,K,P){
  var lh=K.cyl(f.hips,.42,.9,.88,0,-.41,0,P.cloth,32);lh.scaling.z=.84;K.tor(f.hips,.9,.03,0,-.84,0,P.gold,32).scaling.z=.84;K.tor(f.hips,.74,.016,0,-.62,0,P.gold,32).scaling.z=.84;
  K.tor(f.hips,.42,.05,0,.06,0,P.gold,24).scaling.z=.8;K.box(f.hips,.12,.42,.012,0,-.16,.205,P.goldEng).rotation.x=.06;
  var bd=K.cyl(f.chest,.39,.33,.3,0,.12,-.005,P.cloth,24);bd.scaling.z=.74;[1,-1].forEach(function(s){K.sph(f.chest,.15,s*.07,.13,.075,P.goldEng,1,.85,.72)});K.box(f.chest,.26,.03,.03,0,.04,.13,P.gold);K.sph(f.chest,.04,0,.12,.14,P.ruby,1,1,.6);
  [f.R,f.L].forEach(function(A){K.cap(A.s,.16,.062,.055,0,-.05,0,P.cloth)});
  for(var j=0;j<9;j++){var a=-1.3+j*.325;K.sph(f.chest,.026,Math.sin(a)*.16,.27-Math.abs(a)*.06,Math.cos(a)*.09+.05,P.gold)}
  [f.R,f.L].forEach(function(A){K.tor(A.s,.11,.016,0,-.1,0,P.gold);K.cap(A.e,.18,.052,.042,0,-.17,0,P.goldEng)});
  [f.RL,f.LL].forEach(function(L){K.tor(L.h,.1,.016,0,.02,.0,P.gold)});
  var H=f.head;var ti=K.tor(H,.235,.016,0,.19,.01,P.gold,32);ti.scaling.z=1.1;ti.rotation.x=-.18;K.sph(H,.045,0,.2,.12,P.ruby,1,1,.6);
  for(var k=-2;k<=2;k++){var sp=K.cyl(H,0,.028,.07,Math.sin(k*.35)*.12,.24-Math.abs(k)*.012,.07+Math.cos(k*.35)*.04,P.gold,6);sp.rotation.x=-.25}
  [1,-1].forEach(function(s){K.tor(H,.04,.008,s*.1,.04,0,P.gold,12).rotation.z=Math.PI/2});
  for(var b=0;b<9;b++)K.sph(H,.07-b*.004,0,.06-b*.075,-.11-b*.008,P.hair);K.sph(H,.04,0,-.62,-.18,P.gold);
  cape(f,P,.95);twinBlades(f,K,P,function(n){return talwar(n,K,P,.8,P.gold)});f.bladeLen=.86};
GEAR.raniEcl=function(f,K,P){
  var sk=K.cyl(f.hips,.42,.82,.86,0,-.4,0,P.cloth,30);sk.scaling.z=.84;K.tor(f.hips,.82,.022,0,-.82,0,P.bronze,30).scaling.z=.84;
  K.tor(f.hips,.4,.05,0,.07,0,P.leather).scaling.z=.8;
  for(var i=0;i<12;i++){var a=i/12*Math.PI*2;var st=K.box(f.hips,.075,.22,.015,Math.sin(a)*.22,-.12,Math.cos(a)*.18,P.leather);st.rotation.y=a;st.rotation.x=-.1}
  var lt=K.cyl(f.chest,.42,.34,.42,0,.13,0,P.linen,24);lt.scaling.z=.72;[1,-1].forEach(function(s){K.sph(f.chest,.15,s*.07,.13,.08,P.bronze,1,.85,.7)});K.box(f.chest,.3,.03,.02,0,.03,.15,P.bronze);
  var ws=K.cyl(f.spine,.34,.3,.3,0,.1,0,P.linen,24);ws.scaling.z=.78;
  [1,-1].forEach(function(s){var fl=K.box(f.chest,.14,.03,.19,s*.15,.31,0,P.linen);fl.rotation.z=-s*.35});
  [f.R,f.L].forEach(function(A){K.cap(A.e,.17,.048,.04,0,-.17,0,P.bronze)});
  [f.RL,f.LL].forEach(function(L){K.tor(L.h,.1,.012,0,.02,.0,P.leather)});
  var H=f.head;K.dome(H,.27,0,.14,-.01,P.bronze,.55,1,1.0,1.1);K.tor(H,.27,.014,0,.145,-.005,P.bronze,32).scaling.z=1.1;
  [1,-1].forEach(function(s){var c=K.box(H,.016,.11,.09,s*.12,.08,.03,P.bronze);c.rotation.z=s*.1});
  var cr=K.tube(H,arcPath([[0,.28,.14],[0,.54,-.02],[0,.26,-.3]],16),function(i){var t=i/16;return .01+.055*Math.sin(Math.PI*Math.min(1,t*1.05))},P.crest);cr.scaling.x=.3;
  for(var b=0;b<5;b++)K.sph(H,.07-b*.005,0,.02-b*.08,-.12-b*.01,P.hair);
  cape(f,P,.95);twinBlades(f,K,P,function(n){return leafBlade(n,K,P,.56,.05,P.bronze)});f.bladeLen=.66};
GEAR.rajaSun=function(f,K,P){maharathiBody(f,K,P);var H=f.head;
  K.cyl(H,.25,.28,.1,0,.25,0,P.gold,28).scaling.z=1.08;K.cyl(H,.17,.23,.12,0,.35,0,P.goldEng,28).scaling.z=1.05;K.cyl(H,.08,.15,.1,0,.46,0,P.gold,20);
  for(var i=0;i<8;i++){var a=i/8*Math.PI*2;K.sph(H,.035,Math.sin(a)*.135,.3,Math.cos(a)*.145,P.ruby,1,1,.6);var sp=K.cyl(H,0,.04,.12,Math.sin(a)*.12,.37,Math.cos(a)*.125,P.gold,6);sp.rotation.x=Math.cos(a)*.35;sp.rotation.z=-Math.sin(a)*.35}
  shieldRound(f,K,P,.86,P.face,P.gold,true);maceWeapon(f,K,P,P.gold,P.gold);cape(f,P,1.15)};
GEAR.rajaEcl=function(f,K,P){legionBody(f,K,P);var H=f.head;
  var cw=K.tor(H,.29,.026,0,.22,0,P.gold,32);cw.scaling.z=1.1;for(var i=0;i<9;i++){var a=i/9*Math.PI*2;var sp=K.cyl(H,0,.035,.11,Math.sin(a)*.145,.28,Math.cos(a)*.16,P.gold,6);sp.rotation.x=Math.cos(a)*.3;sp.rotation.z=-Math.sin(a)*.3}
  shieldScutum(f,K,P,1.0,.68,P.face,P.gold);maceWeapon(f,K,P,P.wood,P.iron);cape(f,P,1.15)};
