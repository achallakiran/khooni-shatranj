/* ================= Khooni Shatranj: voices, animals, battle bed, music (all synthesized) ================= */
(function(){
  AU.crowd=function(){};var baseInit=AU.init;
  AU.vol={sfx:SET.sfx,voice:SET.voice,music:SET.music};
  AU.init=function(){if(AU.ctx)return;baseInit();if(!AU.ctx)return;var c=AU.ctx;
    AU.out=c.createGain();AU.out.gain.value=1;AU.out.connect(c.destination);
    var comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(AU.out);
    AU.master.disconnect();AU.master.connect(comp);AU.master.gain.value=.8*AU.vol.sfx;
    AU.vbus=c.createGain();AU.vbus.gain.value=AU.vol.voice;AU.vbus.connect(comp);
    AU.mbus=c.createGain();AU.mbus.gain.value=.5*AU.vol.music;AU.mbus.connect(AU.out);
    AU.bed();AU.active=0};
  AU.setVol=function(s,v,m){AU.vol={sfx:s,voice:v,music:m};if(!AU.ctx)return;var t=AU.ctx.currentTime;AU.master.gain.setTargetAtTime(.8*s,t,.05);AU.vbus.gain.setTargetAtTime(v,t,.05);AU.mbus.gain.setTargetAtTime(.5*m,t,.05)};
  AU.duck=function(on){if(!AU.ctx)return;AU.out.gain.setTargetAtTime(on?.35:1,AU.ctx.currentTime,.1)};
  /* ---------- spatial helper ---------- */
  function spatial(pos){var c=AU.ctx,p=c.createPanner();p.panningModel='equalpower';p.distanceModel='inverse';p.refDistance=4;p.rolloffFactor=1.3;p.maxDistance=60;
    try{if(p.positionX){p.positionX.value=pos.x;p.positionY.value=1.5;p.positionZ.value=pos.z}else p.setPosition(pos.x,1.5,pos.z)}catch(e){}return p}
  function camDist(pos){if(typeof cam==='undefined'||!cam.target)return 0;return Math.hypot(pos.x-cam.target.x,pos.z-cam.target.z)}
  AU.update=function(rdt){if(!AU.ctx)return;var L=AU.ctx.listener,t=cam.target,a=cam.alpha;var fx=-Math.cos(a),fz=-Math.sin(a);
    try{if(L.positionX){L.positionX.value=t.x;L.positionY.value=1.5;L.positionZ.value=t.z;L.forwardX.value=fx;L.forwardY.value=0;L.forwardZ.value=fz;L.upX.value=0;L.upY.value=1;L.upZ.value=0}else{L.setPosition(t.x,1.5,t.z);L.setOrientation(fx,0,fz,0,1,0)}}catch(e){}
    AU.bedTick(rdt);AU.music.tick()};
  /* ---------- voices: source + formant filters ---------- */
  var VOW={a:[800,1150,2900],o:[450,800,2830],e:[400,2000,2600],u:[350,600,2700],ae:[660,1700,2400]};
  function voice(f,opt){var c=AU.ctx,t=c.currentTime+.005,vp=f.vp||{pitch:120,form:1,rough:.5};var dur=opt.dur;
    var src=c.createOscillator();src.type='sawtooth';var p0=vp.pitch*opt.p0,p1=vp.pitch*opt.p1,p2=vp.pitch*(opt.p2||opt.p1);
    src.frequency.setValueAtTime(p0,t);src.frequency.linearRampToValueAtTime(p1,t+dur*.35);src.frequency.linearRampToValueAtTime(p2,t+dur);
    var vib=c.createOscillator();vib.frequency.value=opt.vib||5.5;var vg=c.createGain();vg.gain.value=vp.pitch*(opt.vd||.02);vib.connect(vg);vg.connect(src.frequency);
    var nz=c.createBufferSource();nz.buffer=AU.nb;var ng=c.createGain();ng.gain.value=.25+vp.rough*.5*(opt.breath||1);
    var mix=c.createGain();src.connect(mix);nz.connect(ng);ng.connect(mix);
    var out=c.createGain();out.gain.value=0;
    var vw=VOW[opt.v]||VOW.a,vw2=VOW[opt.v2||opt.v]||vw;
    [0,1,2].forEach(function(i){var b=c.createBiquadFilter();b.type='bandpass';b.Q.value=i?9:6;b.frequency.setValueAtTime(vw[i]*vp.form,t);b.frequency.linearRampToValueAtTime(vw2[i]*vp.form,t+dur);var g=c.createGain();g.gain.value=[1,.55,.22][i];mix.connect(b);b.connect(g);g.connect(out)});
    var env=out.gain,pk=opt.peak||.6;env.setValueAtTime(0,t);env.linearRampToValueAtTime(pk,t+(opt.att||.03));env.setValueAtTime(pk*.85,t+dur*.6);env.exponentialRampToValueAtTime(.001,t+dur);
    var pan=spatial(f.pos);out.connect(pan);pan.connect(AU.vbus);
    src.start(t);vib.start(t);nz.start(t,Math.random());src.stop(t+dur+.05);vib.stop(t+dur+.05);nz.stop(t+dur+.05);
    AU.active++;setTimeout(function(){AU.active--},(dur+.1)*1000)}
  var VT={grunt:{dur:.16,p0:1.1,p1:.85,v:'u',v2:'ae',peak:.45,att:.01,vd:.01},
    yell:{dur:.55,p0:1.0,p1:1.45,p2:1.35,v:'a',peak:.7,vib:6,vd:.03},
    pain:{dur:.34,p0:1.6,p1:1.9,p2:1.2,v:'ae',v2:'a',peak:.6,vib:9,vd:.05,breath:1.4},
    death:{dur:1.0,p0:1.7,p1:1.3,p2:.7,v:'a',v2:'o',peak:.7,vib:7,vd:.06,breath:1.3},
    cut:{dur:.22,p0:1.6,p1:1.1,v:'a',peak:.6,vd:.05},
    roar:{dur:1.5,p0:.8,p1:1.05,p2:.9,v:'a',v2:'o',peak:.85,vib:4,vd:.03,breath:2}};
  AU.voice=function(type,f,prio){if(!AU.ctx||!f||!f.pos)return;if(AU.vol.voice<=0)return;var d=camDist(f.pos);if(d>40)return;
    var limit=prio>=2?8:6;if(AU.active>=limit)return;if(type==='grunt'&&d>18)return;voice(f,VT[type]||VT.grunt)};
  /* ---------- animals ---------- */
  AU.animal=function(type,f){if(!AU.ctx||!f||!f.pos)return;var d=camDist(f.pos);if(d>45||AU.active>=8)return;var c=AU.ctx,t=c.currentTime+.005;
    var o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),bp=c.createBiquadFilter(),pan=spatial(f.pos);o.type='sawtooth';o2.type='square';
    var dur,f0,f1,f2,q,bf,pk;
    if(type==='trumpet'){dur=1.1;f0=280;f1=620;f2=420;bf=900;q=3;pk=.9}else if(type==='neigh'){dur=.9;f0=520;f1=1000;f2=420;bf=1400;q=4;pk=.55}else{dur=.8;f0=110;f1=150;f2=90;bf=500;q=2;pk=.6}
    o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f1,t+dur*.3);o.frequency.linearRampToValueAtTime(f2,t+dur);
    var lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=type==='neigh'?14:type==='trumpet'?7:5;lg.gain.value=type==='neigh'?60:type==='trumpet'?40:12;lfo.connect(lg);lg.connect(o.frequency);
    o2.frequency.setValueAtTime(f0*1.01,t);o2.frequency.linearRampToValueAtTime(f1*1.01,t+dur*.3);o2.frequency.linearRampToValueAtTime(f2,t+dur);var g2=c.createGain();g2.gain.value=.3;
    bp.type='bandpass';bp.frequency.value=bf;bp.Q.value=q;o.connect(bp);o2.connect(g2);g2.connect(bp);bp.connect(g);g.connect(pan);pan.connect(AU.vbus);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.06);g.gain.setValueAtTime(pk*.8,t+dur*.7);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    [o,o2,lfo].forEach(function(x){x.start(t);x.stop(t+dur+.05)});AU.active++;setTimeout(function(){AU.active--},(dur+.1)*1000)};
  /* ---------- army charge: staggered war cries ---------- */
  AU.charge=function(){if(!AU.ctx)return;AU.play('roar',1.4);var n=0;G.fighters.forEach(function(f){if(n>=7||!alive(f))return;if(Math.random()<.35){n++;setTimeout(function(){AU.voice('yell',f,2)},Math.random()*700)}});AU.stinger('charge')};
  /* ---------- battle bed: distant clashes and shouts ---------- */
  AU.bedG=null;AU.bed=function(){var c=AU.ctx,s=c.createBufferSource();s.buffer=AU.nb;s.loop=true;var f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=420;f.Q.value=.6;var g=c.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(AU.master);s.start();AU.bedG=g;AU.bedT=0};
  AU.bedTick=function(rdt){if(!AU.bedG)return;var fight=G.mode==='fight'&&!G.paused,n=0;if(fight&&G.player){G.fighters.forEach(function(f){if(f.st==='attack'&&alive(f)&&camDist(f.pos)<20)n++})}
    var lvl=fight?Math.min(.12,.03+n*.012):0;AU.bedG.gain.setTargetAtTime(lvl,AU.ctx.currentTime,.4);
    AU.bedT-=rdt;if(fight&&G.battle&&AU.bedT<=0){AU.bedT=.25+Math.random()*.6;var t=AU.ctx.currentTime;var b=380+Math.random()*300;AU.tone(t,'sine',b,.03,.3);AU.tone(t,'sine',b*2.76,.012,.2);
      if(Math.random()<.25){var far=G.fighters[Math.floor(Math.random()*G.fighters.length)];if(far&&alive(far)&&camDist(far.pos)>10)AU.voice(Math.random()<.5?'yell':'pain',far,0)}}};
  /* ---------- music ---------- */
  var M={on:false,lvl:0,next:0,step:0,bpm:92};
  function mOut(){return AU.mbus}
  function drum(t,f,dec,pk,noise){var c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f*1.8,t);o.frequency.exponentialRampToValueAtTime(f,t+.06);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+dec);o.connect(g);g.connect(mOut());o.start(t);o.stop(t+dec+.05);
    if(noise){var s=c.createBufferSource();s.buffer=AU.nb;var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=noise;bp.Q.value=1.5;var ng=c.createGain();ng.gain.setValueAtTime(pk*.5,t);ng.gain.exponentialRampToValueAtTime(.001,t+.12);s.connect(bp);bp.connect(ng);ng.connect(mOut());s.start(t,Math.random());s.stop(t+.15)}}
  function pluck(t,f,pk){var c=AU.ctx,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*2.005;lp.type='lowpass';lp.frequency.setValueAtTime(2400,t);lp.frequency.exponentialRampToValueAtTime(500,t+1.2);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+2.2);o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(mOut());o.start(t);o2.start(t);o.stop(t+2.3);o2.stop(t+2.3)}
  function horn(t,f,dur,pk){var c=AU.ctx,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sawtooth';o2.type='sawtooth';o.frequency.value=f;o2.frequency.value=f*1.006;lp.type='lowpass';lp.frequency.setValueAtTime(300,t);lp.frequency.linearRampToValueAtTime(1300,t+dur*.6);lp.frequency.linearRampToValueAtTime(400,t+dur);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(pk,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(mOut());o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05)}
  var drone=null;
  function startDrone(){var c=AU.ctx;if(drone)return;var g=c.createGain();g.gain.value=0;var lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;lp.connect(g);g.connect(mOut());
    var os=[];var sun=G.army!=='ecl';var root=sun?73.4:65.4;[root,root*1.5,root*2,root*2.997].forEach(function(f,i){var o=c.createOscillator();o.type=i<2?'sawtooth':'triangle';o.frequency.value=f;var og=c.createGain();og.gain.value=[.22,.14,.1,.06][i];o.connect(og);og.connect(lp);o.start();os.push(o)});
    var lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.13;lg.gain.value=160;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();os.push(lfo);
    drone={g:g,os:os,sun:sun};g.gain.setTargetAtTime(.5,c.currentTime,1.5)}
  function stopDrone(){if(!drone)return;var d=drone;drone=null;d.g.gain.setTargetAtTime(0,AU.ctx.currentTime,.5);setTimeout(function(){d.os.forEach(function(o){try{o.stop()}catch(e){}})},2500)}
  M.start=function(){if(!AU.ctx)return;M.on=true;M.next=AU.ctx.currentTime+.1;startDrone()};
  M.set=function(l){M.lvl=l;if(drone&&drone.sun!==(G.army!=='ecl')){stopDrone();if(M.on)setTimeout(startDrone,300)}};
  M.tick=function(){if(!M.on||!AU.ctx)return;if(!drone)startDrone();var c=AU.ctx;
    if(G.mode==='fight'&&G.player&&!G.paused){var p=G.player,n=0,boss=false;G.fighters.forEach(function(f){if(f.team!==p.team&&alive(f)&&dist(f,p)<6){n++;if(f.boss||f.king)boss=true}});M.lvl=G.t<(G.holdUntil||0)?0:(n>=3||boss)?2:1}
    else if(G.mode==='menu')M.lvl=0;
    var sun=G.army!=='ecl';var spb=60/(sun?96:84)/2;
    while(M.next<c.currentTime+.25){var t=M.next,s=M.step%16;
      if(sun){if(s%8===0)pluck(t,sun?146.8:130.8,.08);if(s===4||s===12)pluck(t,220,.05);
        if(M.lvl>=1){if(s===0||s===6||s===10)drum(t,62,.45,.5,0);if(s===4||s===12||s===14)drum(t,180,.12,.18,1400)}
        if(M.lvl>=2){if(s%2===1)drum(t,220,.07,.1,2400);if(s===8)drum(t,48,.7,.55,0)}}
      else{if(s===0)horn(t,98,spb*14,M.lvl>=1?.07:.04);
        if(M.lvl>=1){if(s===0||s===8)drum(t,44,.8,.6,0);if(s===4||s===12)drum(t,90,.25,.3,600)}
        if(M.lvl>=2){if(s===2||s===6||s===10||s===14)drum(t,70,.2,.25,0);if(s===12)horn(t,147,spb*4,.06)}}
      M.step++;M.next+=spb}};
  AU.music=M;
  /* ---------- stingers ---------- */
  AU.stinger=function(k){if(!AU.ctx)return;var t=AU.ctx.currentTime;
    if(k==='perfect'){[1,2.76,5.4].forEach(function(r,i){var o=AU.ctx.createOscillator(),g=AU.ctx.createGain();o.frequency.value=660*r;g.gain.setValueAtTime(.08/(i+1),t);g.gain.exponentialRampToValueAtTime(.001,t+1.2);o.connect(g);g.connect(mOut());o.start(t);o.stop(t+1.3)})}
    else if(k==='break'){drum(t,40,.9,.6,300)}
    else if(k==='charge'){drum(t,42,1.2,.7,0);drum(t+.25,42,1.2,.6,0);horn(t,98,1.6,.08)}
    else if(k==='win'){[1,1.5,2,3].forEach(function(r,i){horn(t+i*.08,98*r,2.4,.06)});drum(t,40,1.5,.7,0)}
    else if(k==='lose'){horn(t,73,2.6,.08);horn(t,87,2.6,.05)}};
})();
