/* ================= poses ================= */
var SK=['hy','hx','hyaw','sp','sy','sr','np','fl','fr','fb','ff','ry','air'];
function v(x,y,z){return new V3(x,y,z)}
function nv(x,y,z){return new V3(x,y,z).normalize()}
var GUARD={rh:v(.26,1.1,.28),rd:nv(.08,.6,.8),lh:v(-.24,1.0,.3),ln:nv(-.2,.05,1),hy:-.04,hx:0,hyaw:0,sp:.06,sy:.22,sr:0,np:0,fl:0,fr:0,fb:0,ff:0,ry:0,air:0};
function PZ(o){var p={};for(var k in GUARD){var x=o[k]!==undefined?o[k]:GUARD[k];p[k]=x instanceof V3?x.clone():x}if(p.rd)p.rd.normalize();if(p.ln)p.ln.normalize();return p}
function copyPose(p){return PZ(p)}
function lerpPoseTo(out,a,b,t){out.rh.copyFrom(V3.Lerp(a.rh,b.rh,t));out.lh.copyFrom(V3.Lerp(a.lh,b.lh,t));out.rd.copyFrom(V3.Lerp(a.rd,b.rd,t).normalize());out.ln.copyFrom(V3.Lerp(a.ln,b.ln,t).normalize());for(var i=0;i<SK.length;i++){var k=SK[i];out[k]=a[k]+(b[k]-a[k])*t}return out}
var PO={
  guard:PZ({}),
  /* Rani twin-blade set: ln = left blade direction */
  rGuard:PZ({rh:v(.28,1.15,.3),rd:nv(.1,.55,.8),lh:v(-.26,1.1,.32),ln:nv(-.1,.55,.8),sy:.12,sp:.06,hy:-.06}),
  rBlock:PZ({rh:v(-.04,1.42,.42),rd:nv(-.7,.7,.12),lh:v(.04,1.42,.42),ln:nv(.7,.7,.12),hy:-.12,sp:.16,sy:.05,np:.1,fl:.06}),
  rBlockHit:PZ({rh:v(-.03,1.4,.3),rd:nv(-.65,.75,-.05),lh:v(.03,1.4,.3),ln:nv(.65,.75,-.05),hy:-.15,sp:-.06,sy:.05,fl:.06}),
  rxW:PZ({rh:v(.45,1.8,-.1),rd:nv(-.1,.6,-.8),lh:v(-.45,1.8,-.1),ln:nv(.1,.6,-.8),sp:-.15,sy:0,np:.1,hy:-.02}),
  rxM:PZ({rh:v(-.1,1.2,.6),rd:nv(-.6,-.2,.75),lh:v(.1,1.2,.6),ln:nv(.6,-.2,.75),sp:.25,sy:0,hy:-.16,fl:.3}),
  rxF:PZ({rh:v(-.4,.85,.3),rd:nv(-.8,-.55,.1),lh:v(.4,.85,.3),ln:nv(.8,-.55,.1),sp:.3,sy:0,hy:-.18,fl:.3}),
  lw:PZ({rh:v(.3,1.2,.3),rd:nv(.1,.5,.8),lh:v(-.5,1.88,-.12),ln:nv(.1,.55,-.83),sy:-.8,sp:-.06,hy:-.03,np:.06}),
  lm:PZ({rh:v(.3,1.15,.15),rd:nv(.2,.4,.8),lh:v(-.14,1.36,.62),ln:nv(.7,-.1,.7),sy:.05,sp:.12,hy:-.1,fl:.22}),
  lf:PZ({rh:v(.32,1.12,.1),rd:nv(.2,.4,.8),lh:v(.45,.78,.3),ln:nv(.75,-.6,.2),sy:.75,sp:.18,hy:-.12,fl:.22}),
  spSwW:PZ({rh:v(.5,1.15,-.2),rd:nv(.5,-.15,-.85),lh:v(-.1,1.15,.3),sy:.9,sp:.08,hy:-.18}),
  spSwM:PZ({rh:v(.0,.95,.6),rd:nv(-.3,-.35,.9),lh:v(-.15,1.1,.35),sy:0,sp:.25,hy:-.24,fl:.25}),
  spSwF:PZ({rh:v(-.45,1.0,.3),rd:nv(-.95,-.25,-.1),lh:v(-.2,1.1,.3),sy:-.8,sp:.25,hy:-.22,fl:.25}),
  bruteW:PZ({rh:v(.15,2.25,-.3),rd:nv(0,.4,-.9),lh:v(-.1,2.0,-.1),ln:nv(0,.3,1),sp:-.4,sy:.15,hy:.03,np:.25}),
  spDraw:PZ({rh:v(.38,1.22,-.5),rd:nv(0,.08,1),lh:v(-.15,1.25,.4),ln:nv(.15,.05,1),sy:.7,sp:-.05,hy:-.1,fr:-.12}),
  roar:PZ({rh:v(.4,1.95,.1),rd:nv(.3,.95,0),lh:v(-.35,1.5,.3),ln:nv(-.3,.3,1),sp:-.3,sy:.1,np:.35,hy:-.05}),
  idleLow:PZ({rh:v(.3,1.0,.2),rd:nv(.25,-.2,.95),lh:v(-.42,.98,-.02),ln:nv(-1,.05,.2),sp:.02,sy:-.05}),
  block:PZ({rh:v(.3,1.12,.0),rd:nv(.15,.95,.1),lh:v(.0,1.44,.5),ln:nv(.05,.12,1),hy:-.14,sp:.2,sy:.32,np:.12,fl:.08}),
  blockHit:PZ({rh:v(.32,1.06,.06),rd:nv(.2,.95,.1),lh:v(-.02,1.4,.26),ln:nv(0,.3,1),hy:-.13,sp:-.08,sy:.3,np:-.05,fl:.04}),
  parry:PZ({rh:v(.32,1.42,.42),rd:nv(-.55,.8,.25),lh:v(.06,1.32,.55),ln:nv(.55,.15,1),hy:-.08,sp:.18,sy:.05,fl:.1}),
  /* light chain: wind, mid, follow */
  l1w:PZ({rh:v(.42,1.72,-.06),rd:nv(-.15,.55,-.8),lh:v(-.2,1.15,.3),sy:.62,sp:-.04,hy:-.02,np:.05}),
  l1m:PZ({rh:v(.18,1.38,.55),rd:nv(-.65,-.05,.75),sy:.0,sp:.12,hy:-.08,fl:.16}),
  l1f:PZ({rh:v(-.32,.86,.38),rd:nv(-.7,-.55,.3),lh:v(-.3,1.05,.22),sy:-.5,sp:.24,hy:-.12,fl:.2}),
  l2w:PZ({rh:v(-.34,1.3,.25),rd:nv(-.95,.15,-.2),lh:v(-.12,1.0,.2),ln:nv(.6,-.1,.7),sy:-.55,sp:.06,hy:-.04}),
  l2m:PZ({rh:v(.12,1.28,.62),rd:nv(.4,.05,.9),sy:.05,sp:.12,hy:-.08,fl:.16}),
  l2f:PZ({rh:v(.6,1.26,.18),rd:nv(.9,.05,-.4),lh:v(-.24,1.12,.3),sy:.62,sp:.12,hy:-.1,fl:.2}),
  l3w:PZ({rh:v(.16,1.95,-.04),rd:nv(.05,.35,-.95),lh:v(-.16,1.3,.32),sp:-.18,sy:.3,hy:.0,np:.1}),
  l3m:PZ({rh:v(.06,1.5,.6),rd:nv(0,.25,1),sp:.1,sy:.1,hy:-.06,fl:.18}),
  l3f:PZ({rh:v(.04,.8,.52),rd:nv(0,-.8,.6),sp:.4,sy:.05,hy:-.18,fl:.24,np:-.15}),
  l4w:PZ({rh:v(.32,1.2,-.16),rd:nv(-.05,.08,1),lh:v(-.18,1.15,.4),sy:.72,sp:.02,hy:-.06}),
  l4m:PZ({rh:v(.06,1.24,.82),rd:nv(-.05,0,1),sy:-.32,sp:.18,hy:-.14,fl:.32}),
  l4f:PZ({rh:v(.06,1.22,.78),rd:nv(-.05,-.05,1),sy:-.3,sp:.16,hy:-.14,fl:.32}),
  hvw:PZ({rh:v(.36,1.98,-.22),rd:nv(.2,.3,-.92),lh:v(-.28,1.25,.3),ln:nv(.5,.2,.8),sy:.82,sp:-.24,hy:-.06,np:.12,fr:-.08}),
  hvm:PZ({rh:v(.1,1.4,.62),rd:nv(-.35,0,.95),sy:.1,sp:.2,hy:-.14,fl:.28}),
  hvf:PZ({rh:v(-.16,.7,.55),rd:nv(-.45,-.8,.4),lh:v(-.36,1.0,.2),sy:-.4,sp:.5,hy:-.26,fl:.34,np:-.2}),
  slamw:PZ({rh:v(.1,2.1,-.1),rd:nv(0,.45,-.9),lh:v(-.12,1.95,0),ln:nv(0,-.6,.8),sp:-.3,sy:.1,hy:.04,np:.2}),
  slamf:PZ({rh:v(.05,.46,.85),rd:nv(0,-.92,.35),lh:v(-.25,.7,.5),sp:.75,sy:0,hy:-.42,fl:.36,fr:-.1,np:-.3}),
  hit:PZ({rh:v(.42,1.0,.05),rd:nv(.5,.6,-.1),lh:v(-.4,1.05,.12),ln:nv(-.4,0,1),sp:-.3,sy:-.15,hy:-.1,np:-.25}),
  hitB:PZ({rh:v(.42,1.05,.0),rd:nv(.6,.7,-.2),lh:v(-.38,1.1,.1),ln:nv(-.3,0,1),sp:-.2,sy:.4,hy:-.12,sr:.2,np:-.2}),
  parried:PZ({rh:v(.62,1.62,-.32),rd:nv(.6,.6,-.5),lh:v(-.5,1.0,.0),ln:nv(-1,0,.2),sp:-.36,sy:.5,hy:-.06,np:-.25,fr:-.15}),
  gbreak:PZ({rh:v(.45,.92,.05),rd:nv(.4,-.4,.6),lh:v(-.42,.82,.22),ln:nv(-.8,-.5,.4),sp:.38,sy:-.1,hy:-.2,np:-.3}),
  charge:PZ({rh:v(.4,1.9,-.2),rd:nv(.25,.4,-.88),lh:v(-.26,1.22,.34),ln:nv(.45,.15,.85),sy:.85,sp:-.18,hy:-.08,np:.12,fr:-.08}),
  mend:PZ({rh:v(.24,.92,.24),rd:nv(.1,-.95,.25),lh:v(-.02,1.3,.22),ln:nv(0,.4,.9),sp:.2,sy:.1,hy:-.16,np:.3}),
  kneel:PZ({rh:v(.35,.55,.3),rd:nv(.3,-.9,.3),lh:v(-.3,.6,.25),ln:nv(-.3,-.6,.6),sp:.55,sy:.05,hy:-.45,np:.4,fl:.25,fr:-.2}),
  ripW:PZ({rh:v(.3,1.25,-.18),rd:nv(0,.05,1),lh:v(-.1,1.25,.4),sy:.75,sp:.05,hy:-.06}),
  ripM:PZ({rh:v(.04,1.28,.9),rd:nv(0,-.02,1),lh:v(-.05,1.3,.5),sy:-.35,sp:.2,hy:-.16,fl:.38}),
  flour1:PZ({rh:v(.45,1.7,.1),rd:nv(.3,.9,-.2),lh:v(-.15,1.2,.42),sy:.4,sp:-.05,np:.05}),
  spGuard:PZ({rh:v(.26,1.15,.2),rd:nv(0,.12,1),lh:v(-.24,1.02,.3),ln:nv(.15,.05,1),sy:.25,sp:.06,hy:-.05}),
  spBlock:PZ({rh:v(.3,1.1,.0),rd:nv(0,.3,1),lh:v(0,1.44,.5),ln:nv(.05,.08,1),hy:-.1,sp:.16,sy:.3,np:.1,fl:.04}),
  spBlockHit:PZ({rh:v(.3,1.08,.0),rd:nv(0,.4,1),lh:v(-.02,1.42,.26),ln:nv(0,.3,1),hy:-.13,sp:-.08,sy:.3,fl:.04}),
  spThW:PZ({rh:v(.3,1.25,-.26),rd:nv(0,.06,1),lh:v(-.1,1.2,.38),sy:.45,sp:0,hy:-.06}),
  spThM:PZ({rh:v(.14,1.32,.52),rd:nv(-.05,0,1),sy:-.1,sp:.16,hy:-.12,fl:.26}),
  spThF:PZ({rh:v(.12,1.3,.56),rd:nv(-.05,-.05,1),sy:-.15,sp:.18,hy:-.12,fl:.28}),
  spOvW:PZ({rh:v(.28,1.95,-.15),rd:nv(0,-.25,1),lh:v(-.14,1.25,.34),sp:-.2,sy:.35,np:.1}),
  spOvM:PZ({rh:v(.12,1.55,.45),rd:nv(0,-.45,1),sp:.25,hy:-.12,fl:.25}),
  spOvF:PZ({rh:v(.1,1.3,.5),rd:nv(0,-.6,.9),sp:.35,hy:-.18,fl:.3}),
  bashW:PZ({lh:v(-.2,1.15,.12),ln:nv(.3,0,1),rh:v(.32,1.12,0),sy:.55,sp:.05,hy:-.05}),
  bashM:PZ({lh:v(-.02,1.3,.78),ln:nv(0,.05,1),sy:-.25,sp:.22,fl:.36,hy:-.12}),
  execW:PZ({rh:v(.12,1.9,.1),rd:nv(0,-.2,1),lh:v(-.25,1.3,.3),ln:nv(-.4,0,1),sp:-.15,sy:.2,hy:-.02,np:-.1}),
  execM:PZ({rh:v(.05,.95,.62),rd:nv(0,-.92,.38),lh:v(-.2,1.0,.4),sp:.55,sy:.0,hy:-.3,fl:.3,np:-.35}),
  backW:PZ({rh:v(-.3,1.35,.3),rd:nv(-.9,.2,0),sy:-.5,sp:-.05,hy:-.02,fr:-.1}),
  backM:PZ({rh:v(.45,1.25,.35),rd:nv(.8,.05,.4),sy:.45,sp:.0,hy:-.06,fr:-.2}),
  sweepW:PZ({rh:v(.55,1.2,-.1),rd:nv(.8,-.1,-.5),sy:.8,sp:.08,hy:-.12}),
  sweepM:PZ({rh:v(-.1,1.0,.65),rd:nv(-.2,-.25,1),sy:0,sp:.2,hy:-.2,fl:.2}),
  sweepF:PZ({rh:v(-.6,1.05,.1),rd:nv(-.85,-.2,-.4),sy:-.75,sp:.2,hy:-.18,fl:.2}),
  c1w:PZ({rh:v(.5,1.88,-.12),rd:nv(-.1,.55,-.83),lh:v(-.22,1.12,.3),sy:.8,sp:-.06,hy:-.03,np:.06,fr:-.05}),
  c1m:PZ({rh:v(.14,1.36,.62),rd:nv(-.7,-.1,.7),sy:-.05,sp:.22,hy:-.12,fl:.3}),
  c1f:PZ({rh:v(-.45,.78,.3),rd:nv(-.75,-.6,.2),lh:v(-.32,1.05,.18),sy:-.75,sp:.34,hy:-.18,fl:.32}),
  c2w:PZ({rh:v(-.4,.95,.28),rd:nv(-.75,-.45,-.3),lh:v(-.1,1.0,.18),ln:nv(.5,0,.8),sy:-.75,sp:.18,hy:-.12}),
  c2m:PZ({rh:v(.16,1.4,.66),rd:nv(.45,.35,.8),sy:.05,sp:.08,hy:-.08,fl:.26}),
  c2f:PZ({rh:v(.62,1.78,.05),rd:nv(.55,.8,-.3),sy:.78,sp:-.08,hy:-.04,fl:.26}),
  c3w:PZ({rh:v(.14,2.08,-.14),rd:nv(.05,.3,-.95),lh:v(-.18,1.3,.34),sp:-.24,sy:.3,hy:.02,np:.12}),
  c3m:PZ({rh:v(.06,1.45,.72),rd:nv(0,.1,1),sp:.14,sy:.1,hy:-.08,fl:.3}),
  c3f:PZ({rh:v(.02,.66,.5),rd:nv(0,-.85,.5),sp:.52,sy:.05,hy:-.28,fl:.34,np:-.2}),
  c4w:PZ({rh:v(.55,1.25,-.1),rd:nv(.85,-.05,-.5),sy:.9,sp:.08,hy:-.14,ry:-4.4}),
  c4m:PZ({rh:v(.1,1.2,.7),rd:nv(-.2,-.1,1),sy:0,sp:.14,hy:-.2,ry:-6.0,fl:.2}),
  c4f:PZ({rh:v(-.6,1.2,.15),rd:nv(-.9,-.1,-.4),sy:-.8,sp:.16,hy:-.18,ry:-6.283,fl:.2}),
  pmW:PZ({rh:v(.3,1.22,.02),rd:nv(0,1,.15),sy:.5,sp:.04}),
  pmM:PZ({rh:v(.1,1.55,.48),rd:nv(0,1,-.25),sy:-.3,sp:.14,fl:.28,hy:-.06}),
  lpW:PZ({rh:v(.2,1.9,-.15),rd:nv(.05,.4,-.9),hy:-.25,sp:.24,sy:.3}),
  lpA:PZ({rh:v(.12,2.1,-.05),rd:nv(0,.25,-1),lh:v(-.3,1.35,.2),hy:-.05,sp:-.22,sy:.25,air:1}),
  lpS:PZ({rh:v(.04,.75,.62),rd:nv(0,-.8,.55),hy:-.34,sp:.58,fl:.32,np:-.2,air:0}),
  hitL:PZ({rh:v(.45,1.05,0),rd:nv(.5,.6,-.2),lh:v(-.45,1.1,.1),ln:nv(-.6,0,.8),sp:-.15,sr:.4,sy:-.6,hy:-.12,np:.2}),
  hitR:PZ({rh:v(.4,1.0,.05),rd:nv(.6,.5,-.1),lh:v(-.4,1.1,.15),ln:nv(-.2,0,1),sp:-.15,sr:-.4,sy:.6,hy:-.12,np:-.2}),
  hitBk:PZ({sp:.55,hy:-.16,np:-.2,rh:v(.35,.95,.25),lh:v(-.35,1.0,.25)}),
  hitHead:PZ({sp:-.38,np:-.65,hy:-.08,rh:v(.45,1.1,-.05),lh:v(-.45,1.15,.0),ln:nv(-.8,.2,.4)}),
  parriedBig:PZ({rh:v(.7,1.85,-.4),rd:nv(.6,.7,-.4),lh:v(-.55,1.0,0),ln:nv(-1,0,.2),sp:-.42,sy:.6,hy:-.06,np:-.3,fr:-.2}),
  recoilUp:PZ({rh:v(.5,1.75,-.1),rd:nv(.4,.9,-.2),sp:-.25,sy:.5,hy:-.04,np:-.1}),
  impaled:PZ({rh:v(.3,.85,.25),rd:nv(.2,-.9,.2),lh:v(-.25,.95,.25),ln:nv(-.2,-.5,.6),sp:.55,sy:0,hy:-.18,np:-.3}),
  spun:PZ({ry:1.6,sr:.3,sp:.2,hy:-.2,rh:v(.55,1.1,-.2),rd:nv(.7,.2,-.6),lh:v(-.5,1.0,.1)}),
  fallenB:PZ({fb:1,rh:v(.5,1.2,-.3),rd:nv(.8,.2,-.5),lh:v(-.5,1.25,-.3),ln:nv(-.5,.5,-.6),sp:-.2,sy:0,hy:0,np:-.2}),
  fallenF:PZ({ff:1,rh:v(.4,1.1,.3),rd:nv(.4,-.5,.7),lh:v(-.4,1.1,.3),sp:.3,sy:0,hy:0,np:.2}),
  fallenS:PZ({fb:1,ry:1.6,rh:v(.55,1.2,-.3),lh:v(-.5,1.2,-.3),sp:-.1,sy:.3,sr:.3,hy:0}),
  beatW:PZ({rh:v(.32,1.5,.5),rd:nv(-.6,.7,.35),sy:.1,sp:.08,fl:.15}),
  d1W:PZ({rh:v(.58,1.38,-.2),rd:nv(.9,0,-.4),sy:.95,hy:-.12,sp:.05}),
  d1M:PZ({rh:v(-.35,1.3,.55),rd:nv(-.85,.05,.5),sy:-.65,sp:.12,fl:.32,hy:-.14}),
  salute:PZ({rh:v(.06,1.55,.22),rd:nv(0,1,-.1),lh:v(-.2,1.1,.36),sy:.0,sp:-.04,np:.06})
};
var EASE={lin:function(t){return t},io:function(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2},in:function(t){return t*t*t},out:function(t){return 1-Math.pow(1-t,3)},snap:function(t){return 1-Math.pow(1-t,5)}};
/* clip: keys [{t,p,e}] (t absolute seconds). first key auto = snapshot */
function Clip(keys){this.keys=keys;this.dur=keys[keys.length-1].t}
function catmull(p0,p1,p2,p3,t){var t2=t*t,t3=t2*t;return new V3(
  .5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
  .5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
  .5*((2*p1.z)+(-p0.z+p2.z)*t+(2*p0.z-5*p1.z+4*p2.z-p3.z)*t2+(-p0.z+3*p1.z-3*p2.z+p3.z)*t3))}
function sampleClip(c,time,out){
  var ks=c.keys;if(time<=ks[0].t)return lerpPoseTo(out,ks[0].p,ks[0].p,0);
  for(var i=1;i<ks.length;i++){if(time<=ks[i].t||i===ks.length-1){var a=ks[i-1],b=ks[i];var u=clamp((time-a.t)/Math.max(1e-4,b.t-a.t),0,1);u=(EASE[b.e]||EASE.io)(u);
    lerpPoseTo(out,a.p,b.p,u);
    var p0=(ks[i-2]||a).p.rh,p3=(ks[i+1]||b).p.rh;out.rh.copyFrom(catmull(p0,a.p.rh,b.p.rh,p3,u));
    var q0=(ks[i-2]||a).p.lh,q3=(ks[i+1]||b).p.lh;out.lh.copyFrom(catmull(q0,a.p.lh,b.p.lh,q3,u));
    return out}}return out}

/* ================= IK ================= */
var _m1=new MX(),_m2=new MX(),_m3=new MX();
function setWorldRot(node,X,Y,Z){MX.FromXYZAxesToRef(X,Y,Z,_m1);var p=node.parent;p.computeWorldMatrix(true);
  var pm=p.getWorldMatrix();pm.getRotationMatrixToRef(_m2);_m2.transposeToRef(_m3);
  _m1.multiplyToRef(_m3,_m2);QT.FromRotationMatrixToRef(_m2,node.rotationQuaternion);node.computeWorldMatrix(true)}
function solveLimb(sN,eN,a,b,T,pole){
  sN.computeWorldMatrix(true);var S=sN.getAbsolutePosition().clone();
  var d=T.subtract(S),len=d.length()||1e-4,dist=clamp(len,.05,(a+b)*.998),dir=d.scale(1/len);
  var x=(a*a-b*b+dist*dist)/(2*dist),h=Math.sqrt(Math.max(0,a*a-x*x));
  var pd=pole.subtract(dir.scale(V3.Dot(pole,dir)));if(pd.lengthSquared()<1e-6)pd=new V3(0,0,1);pd.normalize();
  var E=S.add(dir.scale(x)).add(pd.scale(h)),Tc=S.add(dir.scale(dist));
  var up=E.subtract(S).normalize(),Y=up.scale(-1);
  var fv=Tc.subtract(E).normalize();var Z=fv.subtract(up.scale(V3.Dot(fv,up)));if(Z.lengthSquared()<1e-5)Z=pd.scale(-1);Z.normalize();
  var X=V3.Cross(Y,Z).normalize();Z=V3.Cross(X,Y).normalize();
  setWorldRot(sN,X,Y,Z);
  var Y2=fv.scale(-1),Z2=V3.Cross(X,Y2).normalize();var X2=V3.Cross(Y2,Z2).normalize();
  setWorldRot(eN,X2,Y2,Z2);return{E:E,T:Tc}}
function orientNode(node,Y,Zhint){Y=Y.clone().normalize();var Z=Zhint.subtract(Y.scale(V3.Dot(Zhint,Y)));if(Z.lengthSquared()<1e-5)Z=new V3(0,0,1).subtract(Y.scale(Y.z));Z.normalize();var X=V3.Cross(Y,Z).normalize();setWorldRot(node,X,Y,Z)}

/* ================= fighter visual update ================= */
var UP=new V3(0,1,0);
function rootPoint(f,p){var s=f.s;return V3.TransformCoordinates(new V3(p.x*s,p.y*s,p.z*s),f.root.getWorldMatrix())}
function rootDir(f,d){return V3.TransformNormal(d,f.root.getWorldMatrix()).normalize()}
function initFeet(f){f.root.computeWorldMatrix(true);f.feet=[-1,1].map(function(side){var p=rootPoint(f,new V3(side<0?-.13:.14,0,side<0?.17:-.17));p.y=0;return{side:side,pos:p,from:p.clone(),to:p.clone(),t:1,dur:.2}})}
function footTarget(f,side,pose,vel){var lp=side<0?new V3(-.13,0,.17+pose.fl):new V3(.14,0,-.17+pose.fr);var p=rootPoint(f,lp);p.y=0;if(vel){p.x+=vel.x*.14;p.z+=vel.z*.14}return p}
function updateFeet(f,dt,pose,vel,speed){
  var moving=speed>.3;
  for(var i=0;i<2;i++){var ft=f.feet[i],o=f.feet[1-i];
    if(ft.t<1){ft.t=Math.min(1,ft.t+dt/ft.dur);var u=EASE.io(ft.t);ft.pos.x=lerp(ft.from.x,ft.to.x,u);ft.pos.z=lerp(ft.from.z,ft.to.z,u);ft.pos.y=Math.sin(Math.PI*ft.t)*(moving?.1+speed*.012:.05)*f.s;continue}
    var tg=footTarget(f,ft.side,pose,moving?vel:null);var dd=Math.hypot(tg.x-ft.pos.x,tg.z-ft.pos.z);
    var thr=(moving?.2:.07)*f.s;
    if(dd>thr&&(o.t>=1||dd>.6*f.s)){ft.from.copyFrom(ft.pos);ft.to.copyFrom(tg);if(moving){ft.to.x+=vel.x*.08;ft.to.z+=vel.z*.08}ft.t=0;ft.dur=moving?clamp(.3-speed*.035,.15,.28):.16}}}
function applyPose(f,pose,dt,info){
  var s=f.s,stepping=(f.feet&&(f.feet[0].t<1||f.feet[1].t<1))?1:0;
  f.bob=lerp(f.bob||0,stepping*.025,1-Math.exp(-10*dt));
  var lean=info&&info.lean||0;
  f.hips.position.set(pose.hx,HB+pose.hy-f.bob,0);
  f.hips.rotation.set(pose.sp*.25+lean*.5,pose.hyaw+pose.sy*.25,pose.sr*.3);
  f.spine.rotation.set(pose.sp*.4+lean*.3,pose.sy*.38,pose.sr*.4);
  f.chest.rotation.set(pose.sp*.35+(info&&info.breath||0),pose.sy*.37,pose.sr*.3);
  if(!f.headOff)f.head.rotation.set(pose.np-pose.sp*.7-lean*.6,-pose.sy*.85,-pose.sr*.4);
  f.root.computeWorldMatrix(true);f.body.computeWorldMatrix(true);f.hips.computeWorldMatrix(true);f.spine.computeWorldMatrix(true);f.chest.computeWorldMatrix(true);
  /* arms */
  var rT=rootPoint(f,pose.rh),lT=rootPoint(f,pose.lh);
  var rp=rootDir(f,new V3(.55,-1,-.55)),lp=rootDir(f,new V3(-.55,-1,-.35));
  var ra=solveLimb(f.R.s,f.R.e,.29*s,.27*s,rT,rp);
  orientNode(f.R.h,rootDir(f,pose.rd),ra.T.subtract(ra.E));
  var la=solveLimb(f.L.s,f.L.e,.29*s,.27*s,lT,lp);
  if(f.leftBlade)orientNode(f.L.h,rootDir(f,pose.ln),la.T.subtract(la.E));
  else orientNode(f.L.h,UP.subtract(rootDir(f,pose.ln).scale(rootDir(f,pose.ln).y)).normalize(),rootDir(f,pose.ln));
  /* legs */
  if(f.feet){var fw=rootDir(f,new V3(0,0,1));
    [f.LL,f.RL].forEach(function(L,i){var ft=f.feet[i];var T=new V3(ft.pos.x,ft.pos.y+.065*s,ft.pos.z);
      var pole=fw.add(new V3(0,-.2,0)).add(rootDir(f,new V3(i?.25:-.25,0,0)));solveLimb(L.s,L.e,.44*s,.44*s,T,pole);
      orientNode(L.h,UP,fw)})}
  f.sword&&f.sword.computeWorldMatrix(true)}

/* ================= cape cloth ================= */
function Cape(f){var W=7,H=10,len=f.capeLen*f.s,wid=.4*f.s;this.f=f;this.W=W;this.H=H;this.rl=len/(H-1);this.p=[];this.q=[];
  f.chest.computeWorldMatrix(true);
  for(var r=0;r<H;r++){var row=[],rowq=[];for(var c=0;c<W;c++){var a=this.anchor(c);var p=a.add(new V3(0,-r*this.rl,-.02*r));row.push(p);rowq.push(p.clone())}this.p.push(row);this.q.push(rowq)}
  this.mesh=BABYLON.MeshBuilder.CreateRibbon('cape',{pathArray:this.p,updatable:true,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene);this.mesh.material=f.capeMat;this.mesh.receiveShadows=true;sg.addShadowCaster(this.mesh);this.mesh.isPickable=false;f.meshes.push(this.mesh)}
Cape.prototype.anchor=function(c){var t=c/(this.W-1)*2-1;var lp=new V3(t*.19,.21,-.12-.04*(1-t*t)-(Math.abs(t)>.8?-.03:0));return V3.TransformCoordinates(lp,this.f.chest.getWorldMatrix())};
Cape.prototype.update=function(dt,wind){
  var f=this.f,s=f.s,W=this.W,H=this.H;dt=Math.min(dt,1/30);var g=-9.8*dt*dt;
  var fw=rootDir(f,new V3(0,0,1)),rt=rootDir(f,new V3(1,0,0)),rp=f.root.position;
  for(var c=0;c<W;c++){var a=this.anchor(c);this.p[0][c].copyFrom(a);this.q[0][c].copyFrom(a)}
  for(var r=1;r<H;r++)for(c=0;c<W;c++){var p=this.p[r][c],q=this.q[r][c];var vx=(p.x-q.x)*.975,vy=(p.y-q.y)*.975,vz=(p.z-q.z)*.975;q.copyFrom(p);p.x+=vx+wind.x*dt*dt*r*.4;p.y+=vy+g;p.z+=vz+wind.z*dt*dt*r*.4}
  var hl=.4*s/(W-1);
  for(var it=0;it<4;it++){
    for(r=1;r<H;r++)for(c=0;c<W;c++){var p1=this.p[r][c],p0=this.p[r-1][c];this.cons(p0,p1,this.rl,r-1===0?0:.5)}
    for(r=1;r<H;r++)for(c=1;c<W;c++){this.cons(this.p[r][c-1],this.p[r][c],hl*(1+r/H*.45),.5)}
    for(r=1;r<H;r++)for(c=0;c<W;c++){var P=this.p[r][c];var dx=P.x-rp.x,dz=P.z-rp.z;var lz=dx*fw.x+dz*fw.z,lx=dx*rt.x+dz*rt.z,ly=P.y-rp.y;
      var lim=-(.15+(ly<.95*s?.06:0))*s;if(ly>.25*s&&ly<1.7*s&&Math.abs(lx)<.34*s&&lz>lim){var dzz=lim-lz;P.x+=fw.x*dzz;P.z+=fw.z*dzz}
      if(P.y<.02)P.y=.02}}
  BABYLON.MeshBuilder.CreateRibbon(null,{pathArray:this.p,instance:this.mesh})};
Cape.prototype.cons=function(a,b,rest,wa){var dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;var d=Math.sqrt(dx*dx+dy*dy+dz*dz)||1e-6;var k=(d-rest)/d;var wb=1-wa;if(wa>0){a.x+=dx*k*wa;a.y+=dy*k*wa;a.z+=dz*k*wa}b.x-=dx*k*wb;b.y-=dy*k*wb;b.z-=dz*k*wb};

/* ================= FX ================= */
var FX={};
FX.starTex=dynTex('star',128,function(g,s){var gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.12,'rgba(255,255,255,.8)');gr.addColorStop(.4,'rgba(255,255,255,.12)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,s,s);
  g.globalCompositeOperation='lighter';[0,Math.PI/2,Math.PI/4,-Math.PI/4].forEach(function(a,i){g.save();g.translate(s/2,s/2);g.rotate(a);var l=g.createLinearGradient(-s/2,0,s/2,0);l.addColorStop(0,'rgba(255,255,255,0)');l.addColorStop(.5,'rgba(255,255,255,'+(i<2?.95:.4)+')');l.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=l;g.fillRect(-s/2,-(i<2?2.5:1.5),s,i<2?5:3);g.restore()})});
FX.starTex.hasAlpha=true;
FX.glintMat=function(hex){var m=new BABYLON.StandardMaterial('gl'+hex,scene);m.diffuseTexture=FX.starTex;m.opacityTexture=FX.starTex;m.emissiveColor=C3.FromHexString(hex);m.disableLighting=true;m.alphaMode=BABYLON.Engine.ALPHA_ADD;m.backFaceCulling=false;m.fogEnabled=false;return m};
FX.gm={white:FX.glintMat('#ffffff'),blue:FX.glintMat('#3d9bff'),red:FX.glintMat('#ff2030'),gold:FX.glintMat('#ffc040')};
FX.makeGlint=function(){var p=BABYLON.MeshBuilder.CreatePlane('glint',{size:1},scene);p.billboardMode=BABYLON.Mesh.BILLBOARDMODE_ALL;p.material=FX.gm.white;p.isVisible=false;p.isPickable=false;p.renderingGroupId=1;return p};
FX.ringTex=dynTex('ringT',256,function(g,s){var gr=g.createRadialGradient(s/2,s/2,s*.3,s/2,s/2,s/2);gr.addColorStop(0,'rgba(255,40,40,0)');gr.addColorStop(.75,'rgba(255,40,40,.35)');gr.addColorStop(.93,'rgba(255,60,60,1)');gr.addColorStop(1,'rgba(255,60,60,0)');g.fillStyle=gr;g.fillRect(0,0,s,s)});FX.ringTex.hasAlpha=true;
FX.makeZone=function(){var d=BABYLON.MeshBuilder.CreateGround('zone',{width:1,height:1},scene);var m=new BABYLON.StandardMaterial('zm',scene);m.diffuseTexture=FX.ringTex;m.opacityTexture=FX.ringTex;m.emissiveColor=new C3(1,.15,.12);m.disableLighting=true;m.alphaMode=BABYLON.Engine.ALPHA_ADD;d.material=m;d.position.y=.03;d.isVisible=false;d.isPickable=false;return d};
/* sparks */
FX.sp=[];FX.spM=[];(function(){var cols=['#fff2c8','#ffb040','#ff7020'];cols.forEach(function(c){var m=new BABYLON.StandardMaterial('sp'+c,scene);m.emissiveColor=C3.FromHexString(c);m.disableLighting=true;FX.spM.push(m)});
  var bm=new BABYLON.StandardMaterial('blood',scene);bm.diffuseColor=new C3(.16,.005,.005);bm.emissiveColor=new C3(.05,0,0);bm.specularColor=new C3(.5,.2,.2);bm.specularPower=64;FX.spM.push(bm);
  var dm=new BABYLON.StandardMaterial('dust',scene);dm.diffuseColor=new C3(.6,.48,.34);dm.alpha=.55;dm.specularColor=C3.Black();FX.spM.push(dm);
  var base=BABYLON.MeshBuilder.CreateBox('spk',{width:.02,height:.02,depth:.12},scene);base.setEnabled(false);
  for(var i=0;i<260;i++){var m2=base.clone('s'+i);m2.setEnabled(false);m2.isPickable=false;FX.sp.push({m:m2,v:new V3(),life:0,g:1})}})();
FX.burst=function(pos,n,kind,dir,spd){if(kind==='dust'&&FX.dustPuff)return FX.dustPuff(pos,n,dir);for(var i=0;i<n;i++){var s=null;for(var j=0;j<FX.sp.length;j++)if(FX.sp[j].life<=0){s=FX.sp[j];break}if(!s)return;
  var mi=kind==='blood'?3:kind==='dust'?4:Math.floor(Math.random()*3);s.m.material=FX.spM[mi];s.m.setEnabled(true);s.m.position.copyFrom(pos);
  var sp=(spd||5)*(.4+Math.random()*.8);s.v.set((Math.random()-.5)*2,(Math.random()-.2)*1.6,(Math.random()-.5)*2);if(dir)s.v.addInPlace(dir.scale(1.2));s.v.normalize().scaleInPlace(sp);
  s.landed=0;s.life=kind==='blood'?.6+Math.random()*.4:kind==='dust'?.8:.25+Math.random()*.35;s.g=kind==='dust'?-.2:kind==='blood'?1:.6;s.kind=kind;
  var sc=kind==='blood'?.8+Math.random()*1.1:kind==='dust'?3+Math.random()*3:1;s.m.scaling.setAll(sc);if(kind==='blood')s.m.scaling.z=sc*.3}};
FX.flash=new BABYLON.PointLight('flash',new V3(0,1,0),scene);FX.flash.diffuse=new C3(1,.75,.4);FX.flash.intensity=0;FX.flash.range=6;
FX.update=function(dt){for(var i=0;i<FX.sp.length;i++){var s=FX.sp[i];if(s.life<=0)continue;s.life-=dt;s.v.y-=9.8*s.g*dt;s.m.position.addInPlace(s.v.scale(dt));
  if(s.kind!=='dust'){var vv=s.v.clone().normalize();s.m.lookAt(s.m.position.add(vv))}else s.m.scaling.scaleInPlace(1+dt*.6);
  if(s.m.position.y<0){if(s.kind==='blood'&&!s.landed){s.landed=1;if(FX.gore==='full'&&Math.random()<.4)FX.pool(s.m.position,.1+Math.random()*.16,.6)}s.m.position.y=0;s.v.scaleInPlace(.3);s.v.y=Math.abs(s.v.y)*.3}
  if(s.life<=0)s.m.setEnabled(false)}FX.flash.intensity*=Math.exp(-14*dt)};
FX.clash=function(pos,big){FX.burst(pos,big?28:14,'spark');FX.flash.position.copyFrom(pos);FX.flash.intensity=big?40:18};
/* sword trail ribbon */
function Trail(f){this.f=f;this.n=12;this.a=[];this.b=[];for(var i=0;i<this.n;i++){this.a.push(new V3());this.b.push(new V3())}
  this.mesh=BABYLON.MeshBuilder.CreateRibbon('trail',{pathArray:[this.a,this.b],updatable:true,sideOrientation:BABYLON.Mesh.DOUBLESIDE},scene);
  var m=new BABYLON.StandardMaterial('trm',scene);if(!FX.trailTex){FX.trailTex=dynTex('trt',128,function(g,s){var gr=g.createLinearGradient(0,0,s,0);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.3,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,s,s)});FX.trailTex.hasAlpha=true;FX.trailTex.wrapU=FX.trailTex.wrapV=BABYLON.Texture.CLAMP_ADDRESSMODE}m.opacityTexture=FX.trailTex;m.emissiveColor=new C3(1,.86,.62);m.disableLighting=true;m.alpha=0;m.alphaMode=BABYLON.Engine.ALPHA_ADD;m.backFaceCulling=false;this.mesh.material=m;this.mesh.isPickable=false;this.on=0;this.mesh.hasVertexAlpha=false;f.meshes.push(this.mesh)}
Trail.prototype.update=function(dt){var sw=this.node||this.f.sword;if(!sw)return;var wm=sw.getWorldMatrix();var base=V3.TransformCoordinates(new V3(0,this.f.bladeLen*.72,0),wm),tip=V3.TransformCoordinates(new V3(0,this.f.bladeLen,0),wm);
  if(!this.init||this.mesh.material.alpha<.02&&!this.on){this.init=1;for(var i=0;i<this.n;i++){this.a[i].copyFrom(tip);this.b[i].copyFrom(base)}}
  this.a.pop();this.a.unshift(tip);this.b.pop();this.b.unshift(base);
  BABYLON.MeshBuilder.CreateRibbon(null,{pathArray:[this.a,this.b],instance:this.mesh});
  this.mesh.material.alpha=lerp(this.mesh.material.alpha,this.on?.22:0,1-Math.exp(-(this.on?30:9)*dt));this.mesh.isVisible=this.mesh.material.alpha>.02;this.tip=tip};

/* ================= blood & gore ================= */
FX.gore='full';
FX.poolTex=dynTex('pool',256,function(g,s){g.clearRect(0,0,s,s);for(var i=0;i<14;i++){var a=hash(i,3)*6.283,r=s*(.08+hash(i,4)*.18),d=s*hash(i,5)*.22;var gr=g.createRadialGradient(s/2+Math.cos(a)*d,s/2+Math.sin(a)*d,0,s/2+Math.cos(a)*d,s/2+Math.sin(a)*d,r);gr.addColorStop(0,'rgba(70,4,4,.95)');gr.addColorStop(.7,'rgba(90,6,6,.85)');gr.addColorStop(1,'rgba(90,6,6,0)');g.fillStyle=gr;g.beginPath();g.arc(s/2+Math.cos(a)*d,s/2+Math.sin(a)*d,r,0,6.3);g.fill()}});
FX.poolTex.hasAlpha=true;
FX.poolMat=new BABYLON.PBRMaterial('poolM',scene);FX.poolMat.albedoTexture=FX.poolTex;FX.poolMat.useAlphaFromAlbedoTexture=true;FX.poolMat.albedoColor=new C3(1,1,1);FX.poolMat.metallic=0;FX.poolMat.roughness=.12;FX.poolMat.transparencyMode=BABYLON.PBRMaterial.PBRMATERIAL_ALPHABLEND;FX.poolMat.reflectionTexture=probe.cubeTexture;FX.poolMat.environmentIntensity=.6;
FX.pools=[];
FX.pool=function(pos,size,grow){if(FX.gore==='off')return;if(FX.gore==='low'){size*=.6;if(Math.random()<.5)return}var p;if(FX.pools.length>=140){p=FX.pools.shift()}else{p={m:BABYLON.MeshBuilder.CreateGround('bp',{width:1,height:1},scene)};p.m.material=FX.poolMat;p.m.isPickable=false;p.m.receiveShadows=true}
  p.m.position.set(pos.x,.012+FX.pools.length*.0002,pos.z);p.m.rotation.y=Math.random()*6.28;p.size=size;p.t=0;p.grow=grow||1.5;p.m.scaling.setAll(.01);FX.pools.push(p)};
FX.mistTex=dynTex('mist',64,function(g,s){var gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,'rgba(120,8,8,.85)');gr.addColorStop(.5,'rgba(90,4,4,.4)');gr.addColorStop(1,'rgba(60,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,s,s)});FX.mistTex.hasAlpha=true;
FX.mists=[];(function(){var m=new BABYLON.StandardMaterial('mistM',scene);m.diffuseTexture=FX.mistTex;m.opacityTexture=FX.mistTex;m.emissiveColor=new C3(.35,.02,.02);m.disableLighting=true;m.backFaceCulling=false;
  for(var i=0;i<18;i++){var p=BABYLON.MeshBuilder.CreatePlane('mist',{size:1},scene);p.material=m;p.billboardMode=BABYLON.Mesh.BILLBOARDMODE_ALL;p.isVisible=false;p.isPickable=false;FX.mists.push({m:p,t:9,v:new V3()})}})();
FX.blood=function(pos,dir,n,big){if(FX.gore==='off')return;var k=FX.gore==='full'?(big?2:1.3):.35;if(typeof cam!=='undefined'&&cam.target){var dc=Math.hypot(pos.x-cam.target.x,pos.z-cam.target.z);if(dc>30)return;if(dc>15)k*=.5}FX.burst(pos,Math.round(n*k),'blood',dir,big?5:3.4);
  for(var i=0;i<(big?3:1);i++){var s=null;for(var j=0;j<FX.mists.length;j++)if(FX.mists[j].t>=1){s=FX.mists[j];break}if(!s)break;s.t=0;s.m.isVisible=true;s.m.position.copyFrom(pos);s.v.copyFrom(dir?dir.scale(.8):V3.Zero());s.v.y+=.3;s.big=(big?1.6:.9)*(.8+Math.random()*.4)}
  if(FX.gore==='full'&&big)setTimeout(function(){FX.pool(new V3(pos.x+(dir?dir.x*.5:0),0,pos.z+(dir?dir.z*.5:0)),.6+Math.random()*.4,2.5)},250)};
FX.heads=[];FX.fountains=[];
FX.decap=function(f,dir){if(FX.gore!=='full'||f.headOff)return;f.head.computeWorldMatrix(true);f.head.setParent(null);f.headOff=true;
  FX.heads.push({n:f.head,v:new V3(dir.x*2.2,3.4,dir.z*2.2),av:new V3((Math.random()-.5)*12,(Math.random()-.5)*8,(Math.random()-.5)*12)});FX.fountains.push({n:f.neck,t:2.6});
  FX.blood(f.neck.getAbsolutePosition(),new V3(0,1,0),40,true)};
FX.update2=function(dt){
  for(var i=0;i<FX.pools.length;i++){var p=FX.pools[i];if(p.t<1){p.t=Math.min(1,p.t+dt/p.grow);var e=1-Math.pow(1-p.t,2);p.m.scaling.setAll(p.size*e*2)}}
  for(var j=0;j<FX.mists.length;j++){var s=FX.mists[j];if(s.t>=1)continue;s.t+=dt/.7;s.m.position.addInPlace(s.v.scale(dt));var sc=s.big*(.4+s.t*1.1);s.m.scaling.setAll(sc);s.m.visibility=Math.max(0,1-s.t);if(s.t>=1)s.m.isVisible=false}
  for(var h=0;h<FX.heads.length;h++){var H=FX.heads[h];if(H.rest)continue;H.v.y-=9.8*dt;H.n.position.addInPlace(H.v.scale(dt));if(H.n.rotationQuaternion){H.n.rotation=H.n.rotationQuaternion.toEulerAngles();H.n.rotationQuaternion=null}H.n.rotation.addInPlace(H.av.scale(dt));
    if(H.n.position.y<.1){H.n.position.y=.1;H.v.y=Math.abs(H.v.y)*.3;H.v.x*=.6;H.v.z*=.6;H.av.scaleInPlace(.55);if(Math.abs(H.v.y)<.3&&H.v.length()<.4){H.rest=1;FX.pool(H.n.position,.35,1.5)}}}
  for(var k=FX.fountains.length-1;k>=0;k--){var F=FX.fountains[k];F.t-=dt;if(F.t<=0){FX.fountains.splice(k,1);continue}if(Math.random()<.7){var np=F.n.getAbsolutePosition();FX.burst(np.add(new V3(0,.08,0)),2,'blood',new V3((Math.random()-.5)*.6,2,(Math.random()-.5)*.6),2.5+F.t)}}};

FX.dustTex=dynTex('dustT',64,function(g,s){var gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,'rgba(190,150,105,.55)');gr.addColorStop(.6,'rgba(170,130,90,.22)');gr.addColorStop(1,'rgba(150,110,80,0)');g.fillStyle=gr;g.fillRect(0,0,s,s)});FX.dustTex.hasAlpha=true;
FX.dusts=[];(function(){var m=new BABYLON.StandardMaterial('dustM',scene);m.diffuseTexture=FX.dustTex;m.opacityTexture=FX.dustTex;m.emissiveColor=new C3(.55,.42,.3);m.disableLighting=true;m.backFaceCulling=false;
  for(var i=0;i<40;i++){var p=BABYLON.MeshBuilder.CreatePlane('dustp',{size:1},scene);p.material=m;p.billboardMode=BABYLON.Mesh.BILLBOARDMODE_ALL;p.isVisible=false;p.isPickable=false;FX.dusts.push({m:p,t:9,v:new V3(),s:1})}})();
FX.dustPuff=function(pos,n,dir){var c=Math.max(2,Math.round(n/3));for(var i=0;i<c;i++){var d=null;for(var j=0;j<FX.dusts.length;j++)if(FX.dusts[j].t>=1){d=FX.dusts[j];break}if(!d)return;d.t=0;d.m.isVisible=true;d.m.position.set(pos.x+(Math.random()-.5)*.5,.25+Math.random()*.2,pos.z+(Math.random()-.5)*.5);
  d.v.set((Math.random()-.5)*1.2+(dir?dir.x*.8:0),.25+Math.random()*.3,(Math.random()-.5)*1.2+(dir?dir.z*.8:0));d.s=.8+Math.random()*.8}};
(function(){var u=FX.update2;FX.update2=function(dt){u(dt);for(var i=0;i<FX.dusts.length;i++){var d=FX.dusts[i];if(d.t>=1)continue;d.t+=dt/1.1;d.m.position.addInPlace(d.v.scale(dt));d.v.scaleInPlace(Math.exp(-2*dt));d.m.scaling.setAll(d.s*(.6+d.t*1.6));d.m.visibility=Math.max(0,(1-d.t))*.9;if(d.t>=1)d.m.isVisible=false}}})();

/* ---- Version 2 blood extras ---- */
FX.spurt=function(f,t){if(FX.gore!=='full'||!f||!f.chest)return;FX.fountains.push({n:f.chest,t:t||1.5})};
FX.stainMat=(function(){var m=new BABYLON.StandardMaterial('stainM',scene);m.diffuseColor=new C3(.22,.01,.01);m.specularColor=new C3(.35,.1,.1);m.specularPower=48;m.zOffset=-2;return m})();
FX.stain=function(f){if(FX.gore==='off'||!f||!f.chest)return;f.stains=f.stains||0;if(f.stains>=(FX.gore==='full'?7:3))return;f.stains++;
  var bones=[f.chest,f.chest,f.spine,f.hips,f.R.s,f.L.s,f.RL.s];var b=bones[Math.floor(Math.random()*bones.length)];var a=Math.random()*6.28,y=(Math.random()-.3)*.2;
  var r=b===f.chest?.2:b===f.spine||b===f.hips?.17:.07;var m=BABYLON.MeshBuilder.CreateSphere('stain',{diameter:.13+Math.random()*.1,segments:6},scene);m.material=FX.stainMat;m.parent=b;
  m.position.set(Math.sin(a)*r,(b===f.chest?.1:b===f.spine?.1:b===f.hips?0:-.12)+y,Math.cos(a)*r*.8);m.scaling.set(1,1.4+Math.random(),.25);m.lookAt(m.position.scale(3));m.isPickable=false;f.meshes.push(m)};
