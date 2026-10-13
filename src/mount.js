/* ================= mounts: horse (Ashva), camel (Ushtra), war elephant (Gaja) ================= */
var MOUNTMAT={};
function mountMats(type,dark){var k=type+(dark?'D':'L');if(MOUNTMAT[k])return MOUNTMAT[k];var M={};
  var coat={ashva:dark?'#1d1714':'#d9d0c2',ushtra:dark?'#5a4636':'#c09a62',gaja:dark?'#4a4643':'#7a736d'}[type];
  M.coat=pbr('coat'+k,coat,0,type==='gaja'?.85:.55,{bump:bumpClone(type==='gaja'?NM.hammer:NM.leather,type==='gaja'?3:2,type==='gaja'?.9:.35),sheen:type==='ashva'?.25:.1});
  M.hair=pbr('mhair'+k,dark?'#0c0806':(type==='ashva'?'#8a7a66':'#4a3420'),0,.8,{bump:bumpClone(NM.leather,4,.6)});
  M.dark=pbr('mdark'+k,'#120c08',0,.6);
  M.leather=pbr('mleath'+k,dark?'#2a1c14':'#5a3720',0,.65,{bump:bumpClone(NM.leather,2,.8)});
  M.cloth=pbr('mcloth'+k,dark?'#2a1a26':{ashva:'#8e1513',ushtra:'#c4621a',gaja:'#6e1426'}[type],0,.85,{bump:bumpClone(NM.cloth,6,.5),sheen:.4,ds:true});
  M.gold=pbr('mgold'+k,dark?'#8a6a3a':'#e2b04a',1,dark?.38:.26,{bump:bumpClone(NM.hammer,2,.15)});
  M.ivory=pbr('ivory'+k,'#e8dcc4',0,.35);
  return MOUNTMAT[k]=M}
function buildMount(type,dark){var M=mountMats(type,dark);var m={type:type,meshes:[],cast:true,legs:[],trunk:[],phase:rnd()*6,down:0,rear:0,nod:0};
  var K=Kit(m);m.root=TN('mount',null);var B=m.B=TN('mb',m.root);
  function leg(x,y,z,up,lo,r1,r2,foot){var h=TN('mh',B,x,y,z),kn=TN('mk',h,0,-up,0);K.cap(h,up+r1,r1,r1*.8,0,-up/2,0,M.coat);K.cap(kn,lo+r2,r2,r2*.9,0,-lo/2,0,M.coat);foot(kn,lo);m.legs.push({h:h,k:kn,front:z>0,left:x<0});return h}
  if(type==='ashva'){m.saddle=1.63;m.rad=.8;m.k=2.3;m.amp=.55;B.position.y=1.25;
    var bd=K.cap(B,1.55,.32,.3,0,0,0,M.coat);bd.rotation.x=Math.PI/2;bd.scaling.x=.82;
    K.sph(B,.7,0,.02,.55,M.coat,.85,.95,1);K.sph(B,.72,0,.05,-.55,M.coat,.9,.95,1);
    var N=m.neck=TN('neck',B,0,.18,.72);N.rotation.x=.6;var nk=K.cap(N,.85,.15,.2,0,.38,0,M.coat);nk.scaling.x=.75;K.box(N,.05,.75,.12,0,.4,-.14,M.hair);
    var Hd=m.head=TN('head',N,0,.8,0);Hd.rotation.x=1.4;var hd=K.cap(Hd,.62,.11,.075,0,.26,0,M.coat);hd.scaling.x=.8;
    [1,-1].forEach(function(s){K.sph(Hd,.08,s*.05,.02,-.11,M.coat,.55,.6,1.7);K.sph(Hd,.04,s*.085,.14,-.04,M.dark)});
    K.tor(Hd,.17,.018,0,.4,0,M.leather,16);K.tor(Hd,.24,.02,0,.08,0,M.gold,16);
    K.tube(B,arcPath([[0,.12,-.85],[0,-.12,-1.08],[0,-.6,-1.02]],10),function(i){return .06-i*.003},M.hair);
    [[-.2,.55],[.2,.55],[-.2,-.55],[.2,-.55]].forEach(function(p){leg(p[0],-.12,p[1],.55,.5,.11,.055,function(kn,lo){K.cyl(kn,.12,.14,.1,0,-lo-.02,0,M.dark,12)})});
    var cp=K.cyl(B,.95,1.08,.48,0,-.1,0,M.cloth,28);cp.scaling.z=1.85;var tr=K.tor(B,1.08,.025,0,-.34,0,M.gold,28);tr.scaling.z=1.85;
    K.box(B,.44,.1,.56,0,.33,-.05,M.leather);K.box(B,.05,.16,.06,0,.42,.2,M.leather);K.box(B,.74,.025,.82,0,.3,-.05,M.cloth);
    [1,-1].forEach(function(s){K.box(B,.02,.45,.03,s*.3,.08,0,M.leather);K.tor(B,.1,.015,s*.3,-.16,.02,M.gold,12)});
    K.sph(B,.24,0,.25,.95,M.gold,1,1,.35)}
  else if(type==='ushtra'){m.saddle=2.4;m.rad=.85;m.k=1.8;m.amp=.5;B.position.y=1.65;
    var bd2=K.cap(B,1.5,.36,.33,0,0,0,M.coat);bd2.rotation.x=Math.PI/2;bd2.scaling.x=.8;
    K.sph(B,.75,0,.38,-.05,M.coat,.8,.75,1.1);K.sph(B,.6,0,-.05,.55,M.coat,.85,1,1);K.sph(B,.6,0,0,-.55,M.coat);
    var N1=m.neck=TN('neck',B,0,0,.72);N1.rotation.x=1.2;K.cap(N1,.85,.12,.16,0,.38,0,M.coat);
    var N2=TN('neck2',N1,0,.75,0);N2.rotation.x=-1.6;K.cap(N2,.62,.1,.12,0,.28,0,M.coat);K.box(N2,.04,.5,.1,0,.28,-.1,M.hair);
    var Hd2=m.head=TN('head',N2,0,.6,0);Hd2.rotation.x=1.8;K.cap(Hd2,.48,.1,.075,0,.18,0,M.coat);
    [1,-1].forEach(function(s){K.sph(Hd2,.05,s*.06,.0,-.08,M.coat,.6,.6,1.4);K.sph(Hd2,.035,s*.08,.1,-.03,M.dark)});K.tor(Hd2,.16,.02,0,.25,0,M.gold,16);
    K.tube(B,arcPath([[0,.05,-.8],[0,-.2,-.95],[0,-.6,-.9]],8),function(i){return .035},M.hair);
    [[-.22,.5],[.22,.5],[-.22,-.5],[.22,-.5]].forEach(function(p){leg(p[0],-.15,p[1],.68,.7,.09,.05,function(kn,lo){K.sph(kn,.16,0,-lo-.02,.03,M.coat,1,.45,1.3)})});
    var bl=K.cyl(B,.92,1.02,.42,0,.18,0,M.cloth,28);bl.scaling.z=1.55;var tr2=K.tor(B,1.02,.022,0,-.03,0,M.gold,28);tr2.scaling.z=1.55;
    for(var i=0;i<14;i++){var a=i/14*Math.PI*2;K.sph(B,.06,Math.sin(a)*.5,-.08,Math.cos(a)*.78,M.gold)}
    K.box(B,.46,.12,.52,0,.69,-.05,M.leather);K.box(B,.06,.22,.06,0,.82,.2,M.gold);K.box(B,.06,.22,.06,0,.82,-.3,M.gold);
    [1,-1].forEach(function(s){K.box(B,.02,.55,.03,s*.3,.38,0,M.leather);K.tor(B,.1,.015,s*.3,.1,.02,M.gold,12)})}
  else{m.saddle=2.95;m.rad=1.4;m.k=1.25;m.amp=.3;m.gajaH=1;B.position.y=1.85;
    K.sph(B,2.3,0,0,0,M.coat,1,.82,1.25);
    var Hd3=m.head=TN('head',B,0,.25,1.35);K.sph(Hd3,1.15,0,0,0,M.coat,1,1.05,.95);
    [1,-1].forEach(function(s){var e=K.cyl(Hd3,.95,.95,.04,s*.52,-.05,-.18,M.coat,24);e.rotation.z=Math.PI/2;e.scaling.set(1,1,1.2);K.sph(Hd3,.07,s*.32,.12,.4,M.dark)});
    K.sph(Hd3,.55,0,.18,.42,M.gold,1,1.15,.35);K.sph(Hd3,.12,0,.18,.52,pal('maharathi',dark).ruby);
    var T=TN('tr0',Hd3,0,-.22,.48);T.rotation.x=.25;var par=T;for(var j=0;j<7;j++){var r=.3-j*.032;K.sph(par,r,0,0,0,M.coat,1,1.25,1);m.trunk.push(par);var nx=TN('tr',par,0,-.2+j*.008,0);nx.rotation.x=.1;par=nx}
    [1,-1].forEach(function(s){K.tube(Hd3,arcPath([[s*.22,-.25,.38],[s*.3,-.62,.82],[s*.2,-.42,1.18]],10),function(i){return .065-i*.0045},M.ivory)});
    K.tube(B,arcPath([[0,.2,-1.38],[0,-.3,-1.5],[0,-.95,-1.4]],8),function(){return .045},M.coat);
    [[-.58,.8],[.58,.8],[-.58,-.8],[.58,-.8]].forEach(function(p){leg(p[0],-.55,p[1],.65,.62,.27,.25,function(kn,lo){K.cyl(kn,.52,.56,.14,0,-lo-.02,0,M.coat,20)})});
    [1,-1].forEach(function(s){var c=K.box(B,.04,1.05,1.7,s*1.13,-.05,0,M.cloth);c.rotation.z=s*.12;var g=K.box(B,.05,.06,1.74,s*1.2,-.57,0,M.gold);g.rotation.z=s*.12;
      for(var q=0;q<6;q++)K.sph(B,.08,s*1.22,-.66,-.7+q*.28,M.gold)});
    var Hw=TN('howdah',B,0,.92,-.15);K.box(Hw,1.05,.14,1.15,0,0,0,M.gold);
    [1,-1].forEach(function(s){K.box(Hw,.05,.34,1.15,s*.5,.22,0,M.cloth);K.box(Hw,1.05,.34,.05,0,.22,s*.56,M.cloth);K.box(Hw,.06,.05,1.17,s*.5,.4,0,M.gold)});
    [[-.47,-.53],[.47,-.53],[-.47,.53],[.47,.53]].forEach(function(p){K.cyl(Hw,.05,.05,1.5,p[0],.75,p[1],M.gold,8)});
    K.dome(Hw,1.3,0,1.48,0,M.gold,.5,1,.55,1);K.cyl(Hw,0,.07,.4,0,1.95,0,M.gold,8)}
  mergeFighter(m);
  m.root.getChildMeshes(false).forEach(function(x){x.receiveShadows=true});
  return m}
/* per-frame mount animation; f is the rider */
function animMount(f,dt,spn){var m=f.mount;var R=m.root;
  R.position.x=f.pos.x;R.position.z=f.pos.z;R.rotation.y=f.face;
  var mov=Math.min(1,spn/(m.type==='gaja'?1.5:2.2));m.phase+=dt*(spn*m.k+.4);var ph=m.phase;
  var offs=m.type==='gaja'?[0,Math.PI,Math.PI*1.5,Math.PI*.5]:[0,Math.PI,Math.PI,0];
  var by={ashva:1.25,ushtra:1.65,gaja:1.85}[m.type];
  var atk=f.st==='attack'&&f.act?f.act:null,lean=0,rear=0,foot=0;
  if(atk){var tt=G.t-atk.impactAt;
    if(atk.footStomp){foot=tt<0?clamp(1+tt/(atk.wind*.85),0,1):clamp(1-tt*8,0,1);m.footSide=atk.foot||1}
    else if(atk.rearUp||atk.zone||(atk.heavy&&m.type==='gaja')){rear=tt<0?clamp(1+tt/(atk.wind*.8),0,1):clamp(1-tt*7,0,1)}
    else lean=tt>-.12&&tt<atk.active+.15?1:0}
  var rk=m.type==='gaja'?1:.6;
  m.rear=lerp(m.rear,rear*rk,1-Math.exp(-10*dt));m.nod=lerp(m.nod,lean,1-Math.exp(-14*dt));m.foot=lerp(m.foot||0,foot,1-Math.exp(-16*dt));
  var Rr=m.rear,Fo=m.foot,fs=m.footSide||1;
  m.legs.forEach(function(L,i){var s=Math.sin(ph+offs[i]);var hx=s*m.amp*mov,kx=Math.max(0,-Math.cos(ph+offs[i]))*m.amp*1.4*mov*(L.front?1:-1);
    if(L.front){hx-=1.05*Rr;kx+=.95*Rr;if((fs>0)!==L.left){hx-=.95*Fo;kx+=1.15*Fo}}else{hx+=.45*Rr}
    L.h.rotation.x=hx;L.k.rotation.x=kx});
  var B=m.B;B.position.y=by+Math.abs(Math.sin(ph))*.05*mov+Math.sin(G.real*1.6+m.phase*.1)*.01+.32*Rr+.05*Fo;B.position.z=-.34*Rr;
  B.rotation.x=.1*m.nod-.46*Rr;B.rotation.z=.05*Fo*fs;
  if(m.head&&m.type==='gaja'){m.head.rotation.x=-.3*Rr-.12*Fo+.18*m.nod;m.head.rotation.y=Math.sin(G.real*.7)*.06+(m.nod?.35*Math.sin(G.t*9)*m.nod:0)}
  else if(m.neck)m.neck.rotation.x=(m.type==='ashva'?.6:1.2)+.12*Math.sin(ph*2)*mov-.3*Rr;
  m.trunk.forEach(function(n,i){n.rotation.x=(i?.1:.25)+.08*Math.sin(G.real*1.3+i*.6)-(m.nod*.25)-Rr*.42-Fo*.22;n.rotation.z=.07*Math.sin(G.real*.9+i*.5)});
  if(f.st==='dead'){m.down=Math.min(1,m.down+dt*1.3);R.rotation.z=(m.side||1)*1.45*EASE.in(m.down);R.position.y=-.15*m.down}
  return B.position.y-by}
