/* =====================================================================
   Blood & Bronze — Khooni Shatranj v3: visual styles, weather, time of day, sharper picture
   Deterministic 60 Hz simulation: states, move data, parry → counter,
   posture on both sides, anti-mash AI defence, attack director.
   ===================================================================== */

/* ================= audio ================= */
var AU={ctx:null,nb:null,master:null};
AU.init=function(){if(AU.ctx)return;try{var c=new(window.AudioContext||window.webkitAudioContext)();AU.ctx=c;AU.master=c.createGain();AU.master.gain.value=.8;AU.master.connect(c.destination);
  var b=c.createBuffer(1,c.sampleRate*1.5,c.sampleRate),d=b.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.nb=b;AU.crowd()}catch(e){AU.ctx=null}};
AU.env=function(g,t,a,peak,dec){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec)};
AU.noise=function(t,type,f,q,peak,dec,f2){var c=AU.ctx,s=c.createBufferSource();s.buffer=AU.nb;var fl=c.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dec);fl.Q.value=q||1;var g=c.createGain();s.connect(fl);fl.connect(g);g.connect(AU.master);AU.env(g,t,.004,peak,dec);s.start(t,Math.random());s.stop(t+dec+.05)};
AU.tone=function(t,type,f,peak,dec,f2){var c=AU.ctx,o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dec);var g=c.createGain();o.connect(g);g.connect(AU.master);AU.env(g,t,.003,peak,dec);o.start(t);o.stop(t+dec+.05)};
AU.play=function(n,k){if(!AU.ctx)return;var t=AU.ctx.currentTime;k=(k||1)*(typeof G!=='undefined'&&G.volK!==undefined?G.volK:1);if(k<.04)return;
  if(n==='clang'){var b=480+Math.random()*80;[1,2.76,5.4,8.93].forEach(function(r,i){AU.tone(t,'sine',b*r,.12*k/(i+1),.5/(i*.6+1))});AU.noise(t,'highpass',3000,.7,.22*k,.08)}
  else if(n==='block'){AU.noise(t,'lowpass',700,1,.4*k,.12);var b2=300+Math.random()*40;[1,2.4,4.1].forEach(function(r,i){AU.tone(t,'triangle',b2*r,.06*k/(i+1),.25)})}
  else if(n==='thud'){AU.noise(t,'lowpass',240,1,.7*k,.2);AU.tone(t,'sine',90,.3*k,.25,50)}
  else if(n==='hit'){AU.noise(t,'lowpass',380,1,.6*k,.18);AU.noise(t,'bandpass',2200,2,.18*k,.09,800)}
  else if(n==='gore'){AU.noise(t,'lowpass',500,1,.7*k,.35);AU.noise(t+.04,'bandpass',1400,1.5,.3*k,.25,500)}
  else if(n==='whoosh'){AU.noise(t,'bandpass',500,2.5,.16*k,.2,2400)}
  else if(n==='gwhite'){AU.tone(t,'sine',2650,.1,.35);AU.tone(t,'sine',3970,.04,.2)}
  else if(n==='gblue'){AU.tone(t,'sine',880,.12,.6);AU.tone(t,'sine',1320,.08,.5);AU.tone(t,'sine',1760,.05,.4)}
  else if(n==='gred'){AU.tone(t,'sine',70,.5,.5,45);AU.noise(t,'lowpass',200,1,.5,.3);AU.tone(t,'sawtooth',196,.06,.6,180)}
  else if(n==='warn'){AU.tone(t,'sine',1800,.035,.12)}
  else if(n==='counter'){AU.tone(t,'sine',1046,.12,.6);AU.tone(t+.05,'sine',1568,.08,.5);AU.noise(t,'highpass',4000,.7,.1,.15)}
  else if(n==='roar'){AU.noise(t,'bandpass',700,.6,.35*k,2.2,500)}
  else if(n==='heal'){AU.tone(t,'sine',523,.08,.8);AU.tone(t+.1,'sine',784,.07,.8)}};
AU.crowd=function(){var c=AU.ctx,s=c.createBufferSource();s.buffer=AU.nb;s.loop=true;var f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=650;f.Q.value=.5;var g=c.createGain();g.gain.value=.045;s.connect(f);f.connect(g);g.connect(AU.master);s.start()};

/* ================= piece & move data ================= */
var CLS={
  spartan:{name:'Spartan Hoplite',short:'Hoplite',hp:130,post:100,spd:1,dmg:1,desc:'Bronze, crimson and discipline. A great <em>aspis</em> shield turns any blade, and a leaf-bladed <em>xiphos</em> finds the gap.'},
  legion:{name:'Roman Centurion',short:'Centurion',hp:140,post:120,spd:.94,dmg:.95,desc:'Segmented iron and a towering <em>scutum</em>. The steadiest guard in the arena, built to absorb a crowd.'},
  gladiator:{name:'Murmillo Gladiator',short:'Murmillo',hp:120,post:90,spd:1.08,dmg:1.12,desc:'Oiled, armoured on the sword arm, helmet like a fish-fin crest. Strikes the hardest of the four.'},
  maharathi:{name:'Maharathi',short:'Maharathi',hp:135,post:110,spd:1,dmg:1.05,desc:'An Indian warrior-king in engraved gold. A sun-wrought <em>dhaal</em> and a broad <em>khanda</em>, built for a grand last stand.'},
  sipahi:{name:'Eclipse Sipahi',short:'Sipahi',hp:120,post:100,spd:1.04,dmg:1,ehp:100,epost:100,tech:'phalanx',desc:'The Eclipse spearman. Longest reach on the board, a sweeping cut that trips, and a lunge from four paces. Resolve technique: <em>Phalanx Push</em>.'},
  sipahiSun:{name:'Sun Sipahi',short:'Sipahi',hp:120,post:100,spd:1.04,dmg:1,ehp:100,epost:100,tech:'phalanx',desc:'Saffron coat, sun <em>dhaal</em> and a gold-shod spear. Longest reach on the board, a sweeping cut that trips, and a lunge from four paces. Resolve technique: <em>Phalanx Push</em>.'},
  raniSun:{name:'Rani of the Sun',short:'Rani',hp:110,post:85,spd:1.1,dmg:1,ehp:120,epost:90,tech:'dance',parryB:.06,blockDot:.5,blockPost:1.3,desc:'Twin curved <em>talwars</em>, no shield. A five-cut chain, the widest parry window, a narrow guard. Resolve technique: <em>Dance of Blades</em>.'},
  raniEcl:{name:'Eclipse Rani',short:'Rani',hp:110,post:85,spd:1.1,dmg:1,ehp:120,epost:90,tech:'dance',parryB:.06,blockDot:.5,blockPost:1.3,desc:'Twin leaf blades and a dark crest. A five-cut chain, the widest parry window, a narrow guard. Resolve technique: <em>Dance of Blades</em>.'},
  rajaSun:{name:'Raja of the Sun',short:'Raja',hp:170,post:150,spd:.9,dmg:1,ehp:300,epost:180,tech:'warcry',blockPost:.6,desc:'A crowned king with a gold mace. Slow, crushing blows, a shield charge, and a ground slam that floors a crowd. Resolve technique: <em>War Cry</em>.'},
  rajaEcl:{name:'Eclipse Raja',short:'Raja',hp:170,post:150,spd:.9,dmg:1,ehp:300,epost:180,tech:'warcry',blockPost:.6,desc:'Iron lorica, a crowned galea and a flanged mace. Slow, crushing blows, a shield charge, and a ground slam that floors a crowd. Resolve technique: <em>War Cry</em>.'}
};
(function(){var D={
  ashva:{short:'Ashvarohi',hp:160,post:120,ehp:140,epost:110,spd:1.5,dmg:1,mount:'ashva',kit:'horse',tech:'trample',mspd:2.1,role:'Knight'},
  ushtra:{short:'Ushtra',hp:150,post:120,ehp:130,epost:110,spd:1.3,dmg:1,mount:'ushtra',kit:'camel',tech:'phalanx',mspd:1.7,role:'Bishop'},
  gaja:{short:'Gaja',hp:320,post:220,ehp:300,epost:200,spd:.8,dmg:1,mount:'gaja',kit:'gaja',tech:'warcry',mspd:1.0,role:'Rook'}};
  var riders={ashvaSun:'maharathi',ashvaEcl:'spartan',ushtraSun:'sipahiSun',ushtraEcl:'sipahi',gajaSun:'sipahiSun',gajaEcl:'sipahi'};
  var desc={ashva:'A horse-rider with sword and shield. Fastest piece on the board; strikes from the saddle and gallops through lines. Resolve technique: <em>Trample</em>.',
    ushtra:'A spearman on a tall camel. Long reach from above, the sweeping cut and the lunge. Resolve technique: <em>Phalanx Push</em>.',
    gaja:'A war elephant with a spear-armed mahout in the howdah. Slow and huge: it stomps, rears up to crush a crowd, sweeps with its tusks and tramples through lines. Resolve technique: <em>War Cry</em>.'};
  Object.keys(riders).forEach(function(k){var b=k.replace(/Sun|Ecl/,''),sun=/Sun/.test(k);CLS[k]=Object.assign({},D[b],{rider:riders[k],name:(sun?'Sun ':'Eclipse ')+D[b].short,desc:desc[b]})})})();
['sipahi','sipahiSun'].forEach(function(k){CLS[k].role='Pawn'});['raniSun','raniEcl'].forEach(function(k){CLS[k].role='Queen'});['rajaSun','rajaEcl'].forEach(function(k){CLS[k].role='King'});
var ARMY={sun:{name:'Sun',sipahi:'sipahiSun',rani:'raniSun',raja:'rajaSun',champion:'maharathi',ashva:'ashvaSun',ushtra:'ushtraSun',gaja:'gajaSun'},ecl:{name:'Eclipse',sipahi:'sipahi',rani:'raniEcl',raja:'rajaEcl',champion:'spartan',ashva:'ashvaEcl',ushtra:'ushtraEcl',gaja:'gajaEcl'}};
var PIECES=['sipahi','rani','raja','champion'],BPIECES=['sipahi','ashva','ushtra','gaja','rani','raja'],PNAME={sipahi:'Sipahi',rani:'Rani',raja:'Raja',champion:'Champion',ashva:'Ashvarohi',ushtra:'Ushtra',gaja:'Gaja'};
var PSCALE={raniSun:.96,raniEcl:.96,rajaSun:1.12,rajaEcl:1.12};
var TECHNAME={phalanx:'Phalanx Push',dance:'Dance of Blades',warcry:'War Cry',trample:'Trample'};
var KINDS=['spartan','legion','gladiator','maharathi'];
/* AI defence profiles (from the plan) */
var PROF={sipahi:{block:.7,parry:.08},veteran:{block:.75,parry:.16},champion:{block:.6,parry:.2},rani:{block:.6,parry:.35},raja:{block:.75,parry:.2}};
/* player sword kit */
var M={
  c1:{wind:.17,active:.08,rec:.3,dmg:13,post:12,reach:2.0,arc:110,lunge:.5,poses:['c1w','c1m','c1f']},
  c2:{wind:.15,active:.08,rec:.3,dmg:12,post:12,reach:2.0,arc:110,lunge:.5,poses:['c2w','c2m','c2f']},
  c3:{wind:.21,active:.09,rec:.34,dmg:16,post:18,reach:2.0,arc:80,lunge:.55,poses:['c3w','c3m','c3f']},
  c4:{wind:.24,active:.1,rec:.36,dmg:11,post:12,reach:2.2,arc:230,lunge:.35,multi:3,spin:1,poses:['c4w','c4m','c4f']},
  pommel:{wind:.1,active:.07,rec:.22,dmg:5,post:22,reach:1.6,arc:90,lunge:.3,poses:['pmW','pmM','pmM']},
  leap:{wind:.34,active:.1,rec:.36,dmg:17,post:24,reach:2.2,arc:90,lunge:6.2,dash:1,lungeFrom:.05,leap:1,knock:1,poses:['lpW','lpS','lpS']},
  retreat:{wind:.12,active:.09,rec:.3,dmg:10,post:10,reach:2.0,arc:120,lunge:-1.1,poses:['backW','backM','backM']},
  heavy:{wind:.2,active:.11,rec:.45,dmg:26,post:42,reach:2.2,arc:100,lunge:.6,heavy:1,knock:1,poses:['hvw','hvm','hvf']},
  bash:{wind:.1,active:.08,rec:.3,dmg:3,post:30,reach:1.7,arc:90,lunge:.6,bash:1,poses:['bashW','bashM','bashM']}
};
/* Sipahi spear kit (AI) */
var SP={
  thrust:{w:40,glint:'white',wind:.55,active:.1,rec:.45,dmg:10,post:18,reach:2.5,arc:60,lunge:.8,poses:['spThW','spThM','spThF']},
  double:{w:18,glint:'white',wind:.55,active:.1,rec:.3,dmg:9,post:16,reach:2.5,arc:60,lunge:.6,chain:{wind:.36},poses:['spThW','spThM','spThF']},
  sbash:{w:14,glint:'white',wind:.5,active:.1,rec:.45,dmg:4,post:30,reach:1.8,arc:90,lunge:.7,poses:['bashW','bashM','bashM']},
  smash:{w:24,glint:'blue',wind:.8,active:.11,rec:.6,dmg:16,post:35,reach:2.4,arc:70,lunge:.5,poses:['spOvW','spOvM','spOvF']},
  delayed:{w:0,glint:'white',wind:.55,delay:.3,active:.1,rec:.45,dmg:11,post:18,reach:2.5,arc:60,lunge:.8,poses:['spThW','spThM','spThF']}
};
var CH={
  slash:{w:35,glint:'white',wind:.6,active:.1,rec:.5,dmg:12,post:20,reach:2.1,arc:100,lunge:.55,poses:['l1w','l1m','l1f']},
  cleave:{w:25,glint:'blue',wind:.82,active:.11,rec:.65,dmg:18,post:40,reach:2.1,arc:80,lunge:.6,poses:['l3w','l3m','l3f']},
  delayed:{w:15,glint:'white',wind:.6,delay:.32,active:.1,rec:.5,dmg:12,post:20,reach:2.1,arc:100,lunge:.55,poses:['l2w','l2m','l2f']},
  slam:{w:25,glint:'red',wind:1.15,active:.12,rec:.95,dmg:30,post:0,reach:2.6,arc:360,lunge:.3,zone:2.4,poses:['slamw','slamw','slamf']}
};
var LIGHT_SEQ=['c1','c2','c3','c4'];
var TUNE={perfect:.12,cwPerfect:.9,cwNormal:.5,slowPerfect:.4,slowNormal:.6,lightPost:6,heavyPost:35,gbDmg:1.5,recDelay:1.5,recRate:12,cancelAt:.6,pBlockLight:10,pBlockHeavy:30,pGB:1.0,foeHp:1.15,kingTake:.6};
var ARCHK={sipahi:'shield',sipahiSun:'shield',legion:'shield',ushtraSun:'spear',ushtraEcl:'spear',raniSun:'duelist',raniEcl:'duelist',maharathi:'duelist',spartan:'duelist',gladiator:'duelist',rajaSun:'brute',rajaEcl:'brute',gajaSun:'brute',gajaEcl:'brute',ashvaSun:'cavalry',ashvaEcl:'cavalry'};
var ARCHPROF={shield:{block:.85,parry:.08,lightK:.5,feint:.08,punish:.2},spear:{block:.6,parry:.1,lightK:1,feint:.08,punish:.2},duelist:{block:.55,parry:.35,lightK:1,feint:.15,punish:.4},brute:{block:.6,parry:.15,lightK:.8,feint:.08,punish:.4},cavalry:{block:.3,parry:.1,lightK:1,feint:.08,punish:.2}};
var ARCHNAME={shield:'Shield',spear:'Spear',duelist:'Duelist',brute:'Brute',cavalry:'Cavalry'};
var PIECEOF={sipahi:'sipahi',sipahiSun:'sipahi',raniSun:'rani',raniEcl:'rani',rajaSun:'raja',rajaEcl:'raja',maharathi:'champion',spartan:'champion',legion:'champion',gladiator:'champion',ashvaSun:'ashva',ashvaEcl:'ashva',ushtraSun:'ushtra',ushtraEcl:'ushtra',gajaSun:'gaja',gajaEcl:'gaja'};
var MATCH={sipahi:{shield:1.5,duelist:.7},rani:{duelist:1.5,spear:1.5,brute:.7},raja:{shield:1.5,brute:1.5,cavalry:.7},champion:{spear:1.5},ashva:{spear:1.5,duelist:1.5,brute:.7},ushtra:{cavalry:1.5,shield:.7},gaja:{cavalry:1.5,shield:1.5,duelist:.7}};
function mu(att,d){if(!isP(att)||isP(d))return 1;var t=MATCH[PIECEOF[att.kindId]];return t&&t[d.arch]||1}
function gbLen(d){if(isP(d))return TUNE.pGB;if(d.mount&&d.mount.type==='gaja')return 1.0;return (d.champion||d.boss||d.king||d.veteran||d.arch==='duelist')?1.4:2.0}
/* Sipahi spear kit (player) */
var MS={
  t1:{wind:.16,active:.08,rec:.3,dmg:12,post:12,reach:2.6,arc:60,lunge:.5,poses:['spThW','spThM','spThF']},
  t2:{wind:.2,active:.09,rec:.34,dmg:15,post:16,reach:2.5,arc:70,lunge:.5,poses:['spOvW','spOvM','spOvF']},
  sw:{wind:.24,active:.1,rec:.38,dmg:8,post:20,reach:2.6,arc:220,lunge:.3,multi:3,knock:1,poses:['spSwW','spSwM','spSwF']},
  pommel:M.pommel,bash:M.bash,
  leap:{wind:.3,active:.1,rec:.4,dmg:18,post:24,reach:2.6,arc:70,lunge:3.6,dash:1,lungeFrom:.1,knock:1,poses:['spThW','spThM','spThF']},
  retreat:{wind:.12,active:.09,rec:.3,dmg:10,post:10,reach:2.5,arc:70,lunge:-1.1,poses:['spThW','spThM','spThF']},
  heavy:{wind:.22,active:.11,rec:.45,dmg:26,post:42,reach:2.6,arc:80,lunge:.6,heavy:1,knock:1,poses:['spOvW','spOvM','spOvF']}};
/* Rani twin-blade kit (player) */
var MT={
  c1:Object.assign({},M.c1,{wind:.14,dmg:11,reach:1.9}),
  lc:{wind:.13,active:.08,rec:.26,dmg:10,post:10,reach:1.9,arc:110,lunge:.5,poses:['lw','lm','lf']},
  c2:Object.assign({},M.c2,{wind:.12,dmg:10,reach:1.9}),
  rx:{wind:.18,active:.09,rec:.32,dmg:15,post:18,reach:1.9,arc:90,lunge:.55,poses:['rxW','rxM','rxF']},
  c4:Object.assign({},M.c4,{wind:.19,dmg:9,reach:2.0}),
  pommel:M.pommel,leap:Object.assign({},M.leap,{dmg:15}),retreat:M.retreat,
  heavy:{wind:.2,active:.11,rec:.45,dmg:24,post:40,reach:2.0,arc:100,lunge:.6,heavy:1,knock:1,poses:['rxW','rxM','rxF']}};
/* Raja mace kit (player) */
var MM={
  m1:Object.assign({},M.c1,{wind:.23,dmg:19,post:19}),
  m2:Object.assign({},M.c2,{wind:.2,dmg:17,post:19}),
  m3:Object.assign({},M.c3,{wind:.28,dmg:23,post:29}),
  c4:Object.assign({},M.c4,{wind:.32,dmg:16,post:19}),
  pommel:M.pommel,bash:M.bash,retreat:Object.assign({},M.retreat,{wind:.16,dmg:14}),
  leap:{wind:.24,active:.12,rec:.45,dmg:10,post:40,reach:1.8,arc:100,lunge:4.2,dash:1,lungeFrom:.05,knock:1,charge:1,poses:['bashW','bashM','bashM']},
  heavy:{wind:.3,active:.12,rec:.6,dmg:30,post:50,reach:2.4,arc:360,lunge:.3,zone:2.4,multi:5,heavy:1,knock:1,poses:['slamw','slamw','slamf']}};
function reachUp(src,dr,lk){var o={};for(var k in src){o[k]=Object.assign({},src[k],{reach:src[k].reach+dr});if(!o[k].dash&&o[k].lunge>0)o[k].lunge*=lk}return o}
var MH=reachUp(M,.5,1.4);MH.leap=Object.assign({},MH.leap,{lunge:7,knock:1,leap:0,charge:1,poses:['l3w','l3m','l3f']});
var MC=reachUp(MS,.45,1.2);
var MG={t1:{wind:.3,active:.1,rec:.4,dmg:20,post:26,reach:2.6,arc:120,lunge:.3,zone:2.2,multi:4,footStomp:1,foot:1,poses:['spOvW','spOvM','spOvF']},
  t1b:{wind:.3,active:.1,rec:.4,dmg:20,post:26,reach:2.6,arc:120,lunge:.3,zone:2.2,multi:4,footStomp:1,foot:-1,poses:['spOvW','spOvM','spOvF']},
  sweep:{wind:.3,active:.12,rec:.45,dmg:15,post:22,reach:3.0,arc:200,lunge:.3,multi:3,poses:['spSwW','spSwM','spSwF']},
  t2:{wind:.3,active:.12,rec:.45,dmg:15,post:22,reach:3.0,arc:200,lunge:.3,multi:3,poses:['spSwW','spSwM','spSwF']},
  leap:{wind:.35,active:.14,rec:.5,dmg:14,post:40,reach:2.8,arc:120,lunge:5,dash:1,lungeFrom:.1,knock:1,multi:3,charge:1,poses:['spThW','spThM','spThF']},
  retreat:{wind:.2,active:.1,rec:.4,dmg:14,post:16,reach:2.8,arc:100,lunge:-.8,poses:['spThW','spThM','spThF']},
  heavy:{wind:.55,active:.14,rec:.6,dmg:34,post:50,reach:3.2,arc:360,lunge:.2,zone:3.2,multi:8,heavy:1,knock:1,rearUp:1,poses:['spOvW','spOvM','spOvF']}};MG.pommel=MG.t1;MG.t2=MG.sweep;
var KIT={horse:{M:MH,seq:LIGHT_SEQ,leap:[3.6,8]},camel:{M:MC,seq:['t1','t2','t1','sw'],leap:[3.8,7],side:'sw'},gaja:{M:MG,seq:['t1','t1b'],leap:[3.8,7.5],bash:'pommel',side:'sweep'},sword:{M:M,seq:LIGHT_SEQ,leap:[3.0,6.6]},spear:{M:MS,seq:['t1','t2','t1','sw'],leap:[3.4,6.6],side:'sw'},twin:{M:MT,seq:['c1','lc','c2','rx','c4'],leap:[3.0,6.6],bash:'pommel'},mace:{M:MM,seq:['m1','m2','m3'],leap:[2.8,6.2]}};
function kitOf(f){return KIT[f.kitId||f.weapon||'sword']||KIT.sword}
/* mounted AI kits */
var AS={slash:{w:40,glint:'white',wind:.55,active:.1,rec:.5,dmg:13,post:22,reach:2.5,arc:110,lunge:1.2,poses:['l1w','l1m','l1f']},
  ride:{w:25,glint:'blue',wind:.8,active:.12,rec:.6,dmg:18,post:36,reach:2.5,arc:90,lunge:2.4,poses:['l3w','l3m','l3f']},
  cuts:{w:20,glint:'white',wind:.55,active:.1,rec:.45,dmg:11,post:18,reach:2.5,arc:110,lunge:1,chain:{wind:.4,poses:['l2w','l2m','l2f']},poses:['l1w','l1m','l1f']}};
var US={thrust:Object.assign({},SP.thrust,{reach:2.9}),double:Object.assign({},SP.double,{reach:2.9}),smash:Object.assign({},SP.smash,{reach:2.8})};
var GJA={tusk:{w:38,glint:'white',wind:.8,active:.12,rec:.6,dmg:18,post:30,reach:2.6,arc:120,lunge:.3,zone:2.2,footStomp:1,foot:1,poses:['spOvW','spOvM','spOvF']},
  sweep:{w:22,glint:'blue',wind:.95,active:.14,rec:.7,dmg:20,post:40,reach:3,arc:200,lunge:.3,poses:['spSwW','spSwM','spSwF']},
  charge:{w:14,glint:'white',wind:.7,active:.14,rec:.7,dmg:14,post:30,reach:2.8,arc:120,lunge:4,dash:1,lungeFrom:.1,knock:1,charge:1,poses:['spThW','spThM','spThF']},
  stomp:{w:24,glint:'red',wind:1.25,active:.14,rec:1.0,dmg:34,post:0,reach:3.4,arc:360,lunge:.2,zone:3.2,knock:1,rearUp:1,poses:['spOvW','spOvM','spOvF']}};
var AIMOVES={sipahi:SP,rani:RN,raja:RJ,ashva:AS,ushtra:US,gaja:GJA};
var PROFOF={sipahi:PROF.sipahi,rani:PROF.rani,raja:PROF.raja,ashva:PROF.veteran,ushtra:PROF.sipahi,gaja:PROF.raja};
var ENV_CASTERS=sg.getShadowMap().renderList.slice();
/* Rani AI */
var RN={
  flurry:{w:30,glint:'white',wind:.5,active:.08,rec:.35,dmg:8,post:12,reach:2.0,arc:90,lunge:.6,chain:{wind:.34,poses:['lw','lm','lf'],next:{wind:.34,poses:['c2w','c2m','c2f']}},poses:['c1w','c1m','c1f']},
  cross:{w:22,glint:'white',wind:.6,active:.1,rec:.45,dmg:12,post:20,reach:2.0,arc:90,lunge:.6,poses:['rxW','rxM','rxF']},
  feint:{w:18,glint:'white',wind:.55,delay:.35,active:.1,rec:.45,dmg:11,post:16,reach:2.0,arc:90,lunge:.6,poses:['lw','lm','lf']},
  leap:{w:20,glint:'blue',wind:.8,active:.1,rec:.6,dmg:16,post:35,reach:2.1,arc:80,lunge:1.6,leap:1,poses:['rxW','rxM','rxF']}};
/* Raja AI */
var RJ={
  swing:{w:35,glint:'white',wind:.7,active:.12,rec:.6,dmg:16,post:28,reach:2.2,arc:110,lunge:.5,poses:['l1w','l1m','l1f']},
  combo:{w:25,glint:'blue',wind:.85,active:.12,rec:.5,dmg:18,post:40,reach:2.2,arc:90,lunge:.5,chain:{wind:.55,poses:['l3w','l3m','l3f']},poses:['l2w','l2m','l2f']},
  slam:{w:22,glint:'red',wind:1.1,active:.12,rec:.95,dmg:32,post:0,reach:2.6,arc:360,lunge:.3,zone:2.6,poses:['slamw','slamw','slamf']},
  shove:{w:15,glint:'white',wind:.55,active:.1,rec:.45,dmg:6,post:35,reach:1.9,arc:90,lunge:.7,poses:['bashW','bashM','bashM']}};
function basicMove(e){var m=e.moves;return m.thrust||m.slash||m.cross||m.swing||m.tusk}
/* ================= state ================= */
var SET=(function(){var touch=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);var d={zoom:.5,sens:1,assist:touch,hints:true,shake:true,music:.55,sfx:.9,voice:.8,blood:'full',quality:'auto',style:'real',styleP:.5,time:'dusk',weather:'clear',seenHowto:false};
  try{var raw=localStorage.getItem('ks_settings');if(raw){var o=JSON.parse(raw);for(var k in o)if(k in d)d[k]=o[k]}}catch(e){}if(['auto','high','normal','lite','min'].indexOf(d.quality)<0)d.quality=d.quality==='low'?'lite':'auto';return d})();
function saveSet(){try{localStorage.setItem('ks_settings',JSON.stringify(SET))}catch(e){}}
var ST={};function stat(k,n){ST[k]=(ST[k]||0)+(n||1)}
var G={army:'sun',piece:'sipahi',bmode:'battle',events:[],combo:0,bestCombo:0,comboT:0,mode:'menu',t:0,real:0,stop:0,slowK:1,slowUntil:0,fighters:[],player:null,round:0,kills:0,sel:'spartan',shake:0,breathUntil:0,hits:[],seed:777,menuF:null,
  yaw:Math.PI,pitch:1.2,used:0,paused:false,camR:5.2,lastCamInput:-9,locked:false,camT:new V3(0,1.3,0),cw:null,impactLog:[],diff:3};
function rnd(){G.seed=(G.seed*1664525+1013904223)>>>0;return G.seed/4294967296}
function rr(a,b){return a+(b-a)*rnd()}
var keys={},joy={x:0,y:0};
var tagsEl=document.getElementById('tags'),indEl=document.getElementById('ind');
var RING_MAT=(function(){var m=new BABYLON.StandardMaterial('ringM',scene);m.emissiveColor=new C3(2.2,1.6,.6);m.disableLighting=true;m.alpha=.9;return m})();

function makeFighter(kind,team,o){o=o||{};
  var C=CLS[kind],dk=o.dark!==undefined?o.dark:team===1;
  var f=buildFighter(C.rider||kind,dk,{scale:o.scale||PSCALE[kind]||1});f.casters=f.meshes.slice();
  if(C.mount){f.capeLen=0;f.mount=buildMount(C.mount,dk);f.mount.side=rnd()<.5?1:-1;f.mount.meshes.forEach(function(m){f.meshes.push(m);f.casters.push(m)});f.kitId=C.kit;f.mspd=C.mspd;f.hOff=f.mount.saddle-HB}
  var isAI=o.ai!==undefined?o.ai:team===1;f.kindId=kind;f.team=team;f.name=o.name||C.name;f.pos=new V3(o.x||0,0,o.z||0);f.face=o.face||0;f.vel=new V3();f.speed=0;
  f.maxHp=Math.round((o.hpMul||1)*(isAI&&C.ehp||C.hp));f.hp=f.maxHp;f.maxPost=Math.round((o.pMul||1)*(isAI&&C.epost||C.post));f.post=0;f.lastPostT=-9;f.rad=f.mount?f.mount.rad:.42*f.s;f.hOff=f.hOff||0;f.king=!!o.king;
  f.st='idle';f.stT=0;f.stDur=0;f.act=null;f.blocking=false;f.blockPressT=-9;f.pressId=0;f.parries={};f.penaltyUntil=0;f.resolve=team===0?1:0;
  f.P=f.weapon==='spear'?{guard:PO.spGuard,block:PO.spBlock,blockHit:PO.spBlockHit}:f.weapon==='twin'?{guard:PO.rGuard,block:PO.rBlock,blockHit:PO.rBlockHit,parry:PO.rBlockHit}:{guard:PO.guard,block:PO.block,blockHit:PO.blockHit};
  f.clip=null;f.clipT=0;f.pose=copyPose(f.P.guard);f.tmpPose=copyPose(f.P.guard);f.champion=!!o.champion;f.veteran=!!o.veteran;f.cls=C;
  f.arch=o.arch||ARCHK[kind]||'shield';f.prof=Object.assign({},ARCHPROF[f.arch]);if(o.veteran)f.prof.parry+=.08;f.moves=o.moves||SP;f.boss=!!o.boss;
  f.vp={pitch:FEM[C.rider||kind]?rr(230,290):rr(82,150),form:rr(.9,1.12),rough:rr(0,1)};
  f.ai={cd:rr(1,2.4),strafe:rnd()<.5?1:-1,waitR:3.4+rnd()*1.4,turtleUntil:0,nextTurtle:rr(2,5),punish:0,spam:[],reads:0,followUp:0};
  f.root.position.copyFrom(f.pos);f.root.rotation.y=f.face;initFeet(f);
  if(f.capeLen){f.cape=new Cape(f);f.casters.push(f.cape.mesh)}f.trail=new Trail(f);if(f.sword2){f.trail2=new Trail(f);f.trail2.node=f.sword2}f.glint=FX.makeGlint();f.meshes.push(f.glint);
  var mz=false;for(var mk in f.moves)if(f.moves[mk].zone)mz=true;
  if(o.champion||o.zone||mz){f.zone=FX.makeZone();f.meshes.push(f.zone)}
  f.ring=BABYLON.MeshBuilder.CreateTorus('ring',{diameter:1.7*f.s,thickness:.09,tessellation:48},scene);f.ring.material=RING_MAT;f.ring.isVisible=false;f.ring.isPickable=false;f.meshes.push(f.ring);
  /* blade material of its own, so blood can stain it */
  f.meshes.forEach(function(m){if(m.parent===f.sword&&m.material&&m.material.name==='steel'){if(!f.bladeMat)f.bladeMat=m.material.clone('blade'+Math.random());m.material=f.bladeMat}});f.blood=0;
  if(team===1){var tg=document.createElement('div');tg.className='tg';tg.innerHTML='<div class="cz" style="font-size:10px;letter-spacing:.12em"></div><div class="bar"><i></i></div><div class="bar g" style="width:70px;margin:2px auto 0"><i></i></div>';tg.firstChild.textContent=f.name;tagsEl.appendChild(tg);f.tag=tg}
  G.fighters.push(f);return f}
function killFighterVisual(f){f.meshes.forEach(function(m){if(m&&!m.isDisposed())m.dispose(false,false)});f.root.dispose(false,false);if(f.mount)f.mount.root.dispose(false,false);if(f.headOff&&f.head)f.head.dispose(false,false);if(f.tag)f.tag.remove()}
function fwd(f){return new V3(Math.sin(f.face),0,Math.cos(f.face))}
function angTo(a,b){return Math.atan2(b.pos.x-a.pos.x,b.pos.z-a.pos.z)}
function angLerp(a,b,k){var d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*k}
function dist(a,b){return Math.hypot(a.pos.x-b.pos.x,a.pos.z-b.pos.z)}
function alive(f){return f.st!=='dead'}
function isP(f){return !!f&&f===G.player}
function foes(f){return G.fighters.filter(function(o){return o.team!==f.team&&alive(o)})}
function free(f){return f.st==='idle'||f.st==='block'}
function invuln(f){return f.st==='counter'||f.st==='exec'||f.st==='executed'||f.st==='paired'||(isP(f)&&f.st==='knock')}
function isDown(f){return f.st==='knock'&&G.t>=f.downFrom&&G.t<=f.downUntil}
var SPING={};function guardSpin(f){var k=f.weapon||'sword';if(!SPING[k]){SPING[k]=copyPose(f.P.guard);SPING[k].ry=-6.283}return SPING[k]}
function dirTo(a,b){return new V3(b.pos.x-a.pos.x,0,b.pos.z-a.pos.z).normalize()}
function addPost(f,x){f.post=clamp(f.post+x,0,f.maxPost);if(x>0)f.lastPostT=G.t}

/* ---------- clips ---------- */
function playClip(f,keys,hold){f.clip=new Clip([{t:0,p:copyPose(f.pose)}].concat(keys));f.clipT=0;f.clipHold=!!hold}
function actionClip(f,a){var P=a.poses,w=a.wind,hold=a.delay||0,ks=[],g=f.P.guard;
  if(a.leap){ks.push({t:w*.35,p:PO.lpW,e:'out'},{t:w*.8,p:PO.lpA,e:'out'},{t:w,p:PO.lpS,e:'in'},{t:w+a.active+a.rec*.4,p:PO.lpS,e:'lin'},{t:w+a.active+a.rec,p:g,e:'io'});playClip(f,ks);return}
  if(hold){ks.push({t:w*.75,p:PO[P[0]],e:'io'},{t:w*.75+hold,p:PO[P[0]],e:'lin'})}else ks.push({t:w*.8,p:PO[P[0]],e:'out'},{t:w,p:PO[P[0]],e:'lin'});
  var W=w+hold;ks.push({t:W+a.active*.5,p:PO[P[1]],e:'in'},{t:W+a.active+a.rec*.3,p:PO[P[2]],e:'out'},{t:W+a.active+a.rec,p:a.spin?guardSpin(f):g,e:'io'});playClip(f,ks)}
function setState(f,st,dur){f.st=st;f.stT=0;f.stDur=dur||0}

/* ---------- actions ---------- */
function startAction(f,def,target,wind){
  var a=Object.assign({},def);if(wind)a.wind=wind;a.t0=G.t;a.impactAt=G.t+a.wind+(a.delay||0);a.target=target;a.done=false;a.lunged=0;a.hitList=[];
  if(!isP(f)&&a.glint&&a.glint!=='white'&&!a.zone&&a.poses){if(f.arch==='brute')a.poses=['bruteW',a.poses[1],a.poses[2]];else if(f.weapon==='spear')a.poses=['spDraw',a.poses[1],a.poses[2]]}
  f.act=a;setState(f,'attack',a.wind+(a.delay||0)+a.active+a.rec);f.blocking=false;actionClip(f,a);
  if(!isP(f))stat('ai_'+f.kindId+'_'+(a.glint||'w'));
  if(!isP(f)&&target===G.player){f.glintPhase=0;showGlint(f,a.glint==='red'?'red':'white',.4);AU.play(a.glint==='red'?'gred':'warn');if(a.zone&&f.zone&&a.glint==='red')f.zone.isVisible=true}
  if(isP(f))AU.play('whoosh',.6);
  if(AU.voice){if(a.glint==='red'||a.glint==='blue'||a.heavy){if(f.mount&&f.mount.type==='gaja'&&(a.zone||a.heavy))AU.animal('trumpet',f);else AU.voice('yell',f,2)}else if(rnd()<.34)AU.voice('grunt',f,0);if(f.mount&&f.mount.type==='ashva'&&(a.dash||a.leap||a.lunge>1.5))AU.animal('neigh',f)}
  if(target&&target.ai&&!isP(target)&&target.ai.tgt!==f&&rnd()<.6){target.ai.tgt=f;target.ai.retT=G.t+2.5}
  if(G.battle&&target&&target.king)G.fighters.forEach(function(g){if(g.team===target.team&&!isP(g)&&g!==target&&alive(g)&&dist(g,target)<9&&rnd()<.5){g.ai.tgt=f;g.ai.retT=G.t+3}});
  if(target&&!isP(target)&&!a.unblock)aiDefend(target,f,a)}
function showGlint(f,kind,scale){f.glint.material=FX.gm[kind]||FX.gm.white;f.glint.isVisible=true;f.glintK=scale;f.glintT=0}
function hideTells(f){if(f.glint)f.glint.isVisible=false;if(f.zone)f.zone.isVisible=false}
function parryWindow(d,kind){var w=.28+(isP(d)&&d.cls.parryB||0);if(G.real<d.penaltyUntil)w*=.7;if(isP(d)&&G.assist)w+=.04;return w}
function resolveAction(f){var a=f.act;a.done=true;var pl=G.player;G.ctxP=isP(f)||isP(a.target)||!!(a.zone&&pl&&dist(f,pl)<a.zone+2);G.volK=G.ctxP||!pl?1:clamp(1.1-(dist(f,pl)-3)/14,.06,.75);
  try{resolveAction2(f,a)}finally{G.ctxP=true;G.volK=1}}
function resolveAction2(f,a){
  var cands=foes(f).filter(function(d){if(invuln(d))return false;var dd=dist(f,d)-d.rad;
    if(a.zone){var c=f.pos.add(fwd(f).scale(f.mount?1.8:1.1*f.s));return Math.hypot(d.pos.x-c.x,d.pos.z-c.z)<a.zone}
    if(dd>a.reach)return false;var dot=V3.Dot(dirTo(f,d),fwd(f));var ca=Math.cos(a.arc*Math.PI/360);return d===a.target?dot>Math.min(ca,-.1):dot>ca});
  if(!isP(f))cands=cands.filter(function(d){return d===a.target||a.zone});
  cands.sort(function(x,y){return (x===a.target?-1:0)-(y===a.target?-1:0)||dist(f,x)-dist(f,y)});
  cands=cands.slice(0,a.multi||(isP(f)?2:1));
  if(a.zone){var zc=f.pos.add(fwd(f).scale(f.mount?1.8:1.1));FX.burst(zc.add(new V3(0,.1,0)),a.rearUp?44:30,'dust',null,a.rearUp?6:4);if(f.mount&&f.mount.type==='gaja')shockRing(zc,a.zone);G.shake=shk(a.rearUp?.8:.5);AU.play('thud',a.rearUp?1.8:1.2);if(f.zone)f.zone.isVisible=false}
  if(!isP(f)&&a.target===G.player){G.impactLog.push(G.t)}
  if(!cands.length&&isP(f))AU.play('whoosh',.4);if(isP(f)&&a.chainIdx!==undefined&&cands.length)IN.chainConn=(IN.chainConn||0)+1;
  cands.forEach(function(d){resolveHit(f,d,a)});
  if(a.chain&&f.act===a&&f.st==='attack'){var nx=Object.assign({},a,{wind:a.chain.wind,poses:a.chain.poses||a.poses,chain:a.chain.next||null});if(!nx.chain&&isP(a.target)&&(f.arch==='duelist'||f.arch==='brute'||f.arch==='cavalry')&&rnd()<.4){nx.glint='blue';stat('blueEnder')}var tgt=a.target;f.act=null;startAction(f,nx,tgt,isP(tgt)?directorWind(nx.wind,0,.3):nx.wind)}}
function contactPoint(a,d){var m=a.pos.add(d.pos).scale(.5);m.y=(1.35*a.s+(a.hOff||0)*.7+1.35*d.s+(d.hOff||0)*.7)/2;return m}
function resolveHit(att,d,a){
  if(!alive(d)||invuln(d))return;
  var dir=dirTo(d,att),dotf=V3.Dot(dir,fwd(d)),frontal=dotf>(isP(d)&&d.cls.blockDot||.26),pfront=dotf>-.34;
  var kind=a.glint||(a.heavy?'heavy':'white');var cp=contactPoint(att,d);
  if(a.unblock||kind==='red')return dealHit(att,d,a,cp);
  /* ---- parry ---- */
  var pw=parryWindow(d,kind==='heavy'?'white':kind);
  if(pfront&&d.blockPressT>0&&G.t-d.blockPressT<=pw&&G.t-d.blockPressT>=-.02&&(free(d)||d.st==='parry'||d.st==='blockHit')){
    d.parries[d.pressId]=(d.parries[d.pressId]||0)+1;d.lastParryOk=d.pressId;var multi=d.parries[d.pressId]>=2;
    var tp=G.t-d.blockPressT,perfect=isP(d)&&tp<=TUNE.perfect+(G.assist?.04:0),canCounter=!(kind==='blue'&&!perfect);
    att.act=null;att.blocking=false;hideTells(att);setState(att,'parried',isP(d)?(perfect?1.0:canCounter?.6:.45):(isP(att)?.7:.9));addPost(att,isP(d)?(perfect?50:25):35);if(isP(d)&&att.ai)att.ai.reads=(att.ai.reads||0)+1;
    playClip(att,[{t:.1,p:isP(d)&&!perfect?PO.parried:PO.parriedBig,e:'snap'},{t:att.stDur*.8,p:PO.parried,e:'lin'},{t:att.stDur+.15,p:att.P.guard,e:'io'}]);att.vel.addInPlace(dir.scale(-3.4));
    setState(d,'parry',.25);addPost(d,-15);playClip(d,[{t:.06,p:d.P.parry||PO.parry,e:'snap'},{t:.3,p:d.blocking?d.P.block:d.P.guard,e:'io'}]);
    var wcp=cp;if(att.trail&&att.trail.tip&&d.shield){wcp=att.trail.tip.add(d.shield.getAbsolutePosition()).scale(.5)}FX.clash(wcp,true);FX.burst(wcp,10,'spark',dir.scale(-1),6);AU.play('clang',1.3);hstop(.08);G.shake=shk(.22);
    stat(isP(d)?'pParry':'aiParry');if(isP(d))stat('pParry_'+kind);if(multi&&isP(d))stat('double');
    if(isP(d)){stat(perfect?'pParryPerfect':'pParryNormal');if(canCounter){openCounter(att,multi,perfect);if(G.assist)G.autoCounter={t:G.t+.14}}else flt('STOPPED',att,'#9fd0ff',2.3);
      addResolve(perfect?.5:.25);if(perfect){AU.play('gblue');if(AU.stinger)AU.stinger('perfect');G.shake=shk(.3)}flt(multi?'DOUBLE PARRY':perfect?'PERFECT PARRY':'PARRY',d,perfect||multi?'#9fd0ff':'#ffe6a8',2.4)}
    else{flt('PARRIED',att,'#ff9a7a',2.3);d.ai.punish=1}
    return}
  /* ---- block ---- */
  if(frontal&&d.blocking&&(free(d)||d.st==='blockHit'||d.st==='parry')){
    if(kind==='blue'){if(isP(d))stat('blueGB_bp'+Math.round((G.t-d.blockPressT)*100));guardBreak(d,cp);return}
    var pv;if(isP(att)&&!isP(d)){pv=a.bash?a.post:(a.heavy||a.finisher)?TUNE.heavyPost:TUNE.lightPost*(d.prof.lightK||1);pv*=mu(att,d);if(a.finisher)stat('finisherBlocked')}
    else if(isP(d)){pv=(a.heavy||a.post>=30||kind==='blue')?TUNE.pBlockHeavy:TUNE.pBlockLight;pv*=d.cls.blockPost||1}else pv=a.heavy?42:a.post;
    addPost(d,pv);if(d.post>=d.maxPost){if(isP(att)){stat('pBrokeGuard');if(AU.stinger)AU.stinger('break')}guardBreak(d,cp);return}
    stat(isP(d)?'pBlock':'aiBlock');if(isP(d))flt('BLOCKED',d,'#e8dcc0',2.3);setState(d,'blockHit',.22);playClip(d,[{t:.05,p:d.P.blockHit,e:'snap'},{t:.24,p:d.P.block,e:'io'}]);
    d.vel.addInPlace(dir.scale(a.heavy?-3.2:-2.2));FX.burst(d.pos.add(new V3(0,.04,0)),a.heavy?10:5,'dust',dir.scale(-1),1.6);var bcp=d.shield?d.shield.getAbsolutePosition():cp;FX.clash(bcp,a.heavy);AU.play(a.bash?'thud':'block',a.heavy?1.3:1);hstop(.035);
    if(a.bash&&!isP(d)&&d.post>=d.maxPost*.6){setState(d,'stagger',.5);d.blocking=false;playClip(d,[{t:.08,p:PO.gbreak,e:'snap'},{t:.6,p:d.P.guard,e:'io'}]);flt('SHIELD BROKEN OPEN',d,'#ffd27a',2.4)}
    else if(isP(att)&&!a.heavy&&!a.bash&&!a.finisher){att.act=null;setState(att,'recoil',.4);playClip(att,[{t:.08,p:PO.recoilUp,e:'snap'},{t:.5,p:att.P.guard,e:'io'}]);stat('recoil');if(rnd()<(d.prof.punish||.2))d.ai.punish=1}
    else if(!isP(att)&&isP(d)&&!a.heavy){att.act=null;hideTells(att);setState(att,'recoil',.45);playClip(att,[{t:.08,p:PO.recoilUp,e:'snap'},{t:.55,p:att.P.guard,e:'io'}])}
    else if(att.act){att.act.rec+=.1;att.stDur+=.1}
    return}
  dealHit(att,d,a,cp)}
function guardBreak(d,cp){stat(isP(d)?'pGB':'aiGB');d.post=d.maxPost;d.blocking=false;setState(d,'gbreak',gbLen(d));if(d.ai)d.ai.punish=0;d.act=null;hideTells(d);
  playClip(d,[{t:.12,p:PO.gbreak,e:'snap'},{t:d.stDur*.8,p:PO.gbreak,e:'lin'},{t:d.stDur+.2,p:d.P.guard,e:'io'}]);d.vel.addInPlace(fwd(d).scale(-2.5));
  FX.clash(cp,true);FX.burst(d.pos.add(new V3(0,.05,0)),8,'dust',null,2);AU.play('clang',1.4);AU.play('thud',.6);hstop(.09);G.shake=shk(.3);flt('GUARD BROKEN',d,isP(d)?'#ff7a6a':'#ffd27a',2.4)}
function hitPoseFor(d,att){var dir=dirTo(d,att),f=fwd(d),r=new V3(f.z,0,-f.x);var lz=V3.Dot(dir,f),lx=V3.Dot(dir,r);if(lz<-.35)return PO.hitBk;if(lx>.5)return PO.hitR;if(lx<-.5)return PO.hitL;return rnd()<.5?PO.hit:PO.hitB}
function knock(d,att){if(d.mount||d.king||d.boss){setState(d,'stagger',.8);d.act=null;d.blocking=false;hideTells(d);playClip(d,[{t:.08,p:PO.gbreak,e:'snap'},{t:.9,p:d.P.guard,e:'io'}]);d.vel.addInPlace(dirTo(att,d).scale(1.5));stat('mountStagger');return}
  var hp=hitPoseFor(d,att),T=isP(d)?.65:1;setState(d,'knock',2.0*T);d.act=null;d.blocking=false;hideTells(d);d.downFrom=G.t+.4;d.downUntil=G.t+1.45*T;
  playClip(d,[{t:.08,p:hp,e:'snap'},{t:.42,p:PO.fallenB,e:'in'},{t:1.3*T,p:PO.fallenB,e:'lin'},{t:1.65*T,p:PO.kneel,e:'io'},{t:2.0*T,p:d.P.guard,e:'io'}]);
  d.vel.addInPlace(dirTo(att,d).scale(4.5));setTimeout(function(){},0);at(.42,function(){if(alive(d)){FX.burst(d.pos.add(new V3(0,.05,0)),10,'dust',null,2.5);AU.play('thud',.8)}});stat(isP(d)?'pKnock':'aiKnock')}
function dealHit(att,d,a,cp){stat(isP(d)?'pHurt':'aiHurt');var wasCh=isP(d)&&d.st==='charge';if(isP(d)){IN.charging=false;IN.heavyReady=false}
  if(d.st==='knock'&&isDown(d)&&!a.groundStab)return;
  var mul=(isP(att)?att.cls.dmg*comboMul():(G.battle&&!isP(d)?.6:1))*(d.st==='gbreak'?TUNE.gbDmg:d.st==='parried'?1.25:1)*(d.king&&G.battle?TUNE.kingTake:1);var dmg=a.dmg*mul;d.hp-=dmg;addPost(d,dmg*.2+a.post*.5);
  var dir=dirTo(att,d);
  var hyper=!isP(d)&&d.arch==='brute'&&!a.heavy&&!a.finisher&&!a.knock&&!a.leap&&!a.bash&&d.st!=='gbreak'&&d.st!=='parried'&&d.st!=='knock';
  if(hyper){d.hyperHits=(d.hyperHits||[]).filter(function(t){return G.t-t<2});d.hyperHits.push(G.t);if(d.hyperHits.length>=3){hyper=false;d.hyperHits=[];stat('hyperBroken')}else stat('hyper')}
  if(!hyper&&!isP(d)&&isP(att)&&!a.heavy&&!a.finisher&&!a.knock&&!a.leap&&!a.counter&&d.st!=='gbreak'&&d.st!=='parried'&&d.st!=='knock'){d.lh=(d.lh||[]).filter(function(t){return G.t-t<1.6});d.lh.push(G.t);
    if(d.lh.length>=3){hyper=true;d.lh=[];d.ai.punish=1;d.ai.turtleUntil=G.t+1.0;stat('poise');flt('UNSHAKEN',d,'#ff9a7a',2.3)}}
  var trade=false;if(d.act&&d.st==='attack'&&!d.act.done){var prog=(G.t-d.act.t0)/Math.max(.01,d.act.impactAt-d.act.t0);if(hyper||d.act.glint==='red'||(!isP(d)&&prog>.5&&!a.heavy&&!a.leap)){trade=true;stat('trade')}else{d.act=null;hideTells(d);stat(!isP(d)?'aiInterrupted':'pInterrupted')}}
  var bigHit=a.heavy||a.leap||a.finisher||d.st==='gbreak'||a.counter;FX.blood(cp,dir,bigHit?24:13,bigHit);if(rnd()<.6)FX.stain(d);
  if(AU.voice){if(d.mount&&rnd()<.5)AU.animal(d.mount.type==='gaja'?'trumpet':d.mount.type==='ashva'?'neigh':'groan',d);else if(rnd()<.6)AU.voice('pain',d,1)}FX.burst(cp,4,'spark',dir,4);AU.play('hit',a.heavy||a.leap?1.3:1);if(a.heavy||a.leap)AU.play('gore',.6);
  hstop(a.heavy||a.leap?.1:.055);G.shake=shk(a.heavy||a.leap?.35:.2);stainBlade(att,.1);
  if(isP(d)){d.lastHurtT=G.t;d.lastHurtReal=G.real;d.lastHurtBlockable=a.glint!=='red'&&!a.unblock;mercy();G.combo=0;G.hits.push(G.t);G.hits=G.hits.filter(function(t){return G.t-t<2});if(G.hits.length>=2)G.breathUntil=G.t+.8;flt('-'+Math.round(dmg),d,'#ff6a5a',2.2)}
  else if(isP(att))addCombo(1);
  if(d.hp<=0){die(d,att,a,V3.Dot(dirTo(d,att),fwd(d))<-.3?'F':'B');return}
  if(d.st==='knock')return;
  if(!trade&&!hyper&&!(d.act&&d.st==='attack')){
    if(wasCh&&a.glint==='blue'){knock(d,att);return}
    if((a.knock&&!isP(d))||(a.glint==='red'&&isP(d))){knock(d,att);return}
    var heavy=a.heavy||a.glint==='blue';setState(d,'stagger',heavy?.6:.36);d.act=null;d.blocking=false;
    playClip(d,[{t:.07,p:hitPoseFor(d,att),e:'snap'},{t:d.stDur+.15,p:d.P.guard,e:'io'}]);d.vel.addInPlace(dir.scale(heavy?4:2.6))}
  if(isP(att))addResolve(.15)}
function stainBlade(f,x){if(!f.bladeMat)return;f.blood=Math.min(1,f.blood+x);var b=f.blood;f.bladeMat.albedoColor=new C3(lerp(.69,.16,b),lerp(.72,.01,b),lerp(.77,.01,b));f.bladeMat.roughness=lerp(.18,.42,b)}
function die(d,att,a,variant){d.hp=0;setState(d,'dead',99);d.act=null;d.blocking=false;hideTells(d);d.ring.isVisible=false;removeCounterTarget(d);stainBlade(att,.25);
  var v=variant||'B';
  if(v==='F')playClip(d,[{t:.12,p:PO.hitBk,e:'snap'},{t:.45,p:PO.kneel,e:'out'},{t:1.0,p:PO.fallenF,e:'in'}],true);
  else if(v==='S')playClip(d,[{t:.2,p:PO.spun,e:'out'},{t:.85,p:PO.fallenS,e:'in'}],true);
  else if(v==='K')playClip(d,[{t:.2,p:PO.fallenB,e:'lin'}],true);
  else playClip(d,[{t:.1,p:PO.hit,e:'snap'},{t:.45,p:PO.kneel,e:'out'},{t:1.0,p:PO.fallenB,e:'in'}],true);
  at(v==='K'?.1:.95,function(){FX.burst(d.pos.add(new V3(0,.05,0)),12,'dust',null,2.5);AU.play('thud',.7);FX.pool(d.pos,.7,2.5)});
  var dir=dirTo(att,d);FX.blood(d.pos.add(new V3(0,1.2*d.s,0)),dir,30,true);
  if(AU.voice){if(d.mount)AU.animal(d.mount.type==='gaja'?'trumpet':d.mount.type==='ashva'?'neigh':'groan',d);AU.voice(d.headOff?'cut':'death',d,2)}
  if(a&&(a.exec||a.counter))FX.spurt(d,1.5);if(d.mount)at(1.0,function(){FX.pool(d.pos,1.4,3.5)});
  if(isP(d)){var allies=G.battle&&!d.king?G.fighters.filter(function(f){return f!==d&&f.team===d.team&&alive(f)&&f.st!=='paired'&&f.st!=='exec'&&f.hp>0}):[];
    if(allies.length){var pool=allies.filter(function(f){return !f.king&&f.st!=='knock'});if(!pool.length)pool=allies;var nf=pool[Math.floor(Math.random()*pool.length)];
      slow(.35,1.1);G.takeover=true;at(.45,function(){takeControl(nf)});return}
    slow(.35,1.6);G.endMsg=G.battle?(d.king?'Your Raja has fallen. Shah mat.':'Your army is lost.'):null;G.endWhy=d.king?'raja':'army';setTimeout(function(){endGame(false)},1900);return}
  if(d.tag)d.tag.style.display='none';var pl=G.player,foeSide=pl&&d.team!==pl.team;
  if(foeSide&&isP(att))G.kills++;
  if(isP(att)){addResolve(.5);AU.play('roar',1)}
  if(G.battle){stat(foeSide?'foeDown':'allyDown');
    if(d.king&&!G.decided){G.decided=true;slow(.22,1.8);setCine(att,d,1.8,1.25,4.2);cine(1.8);AU.play('roar',1.5);
      G.endMsg=foeSide?'The '+ARMY[foeArmy()].name+' Raja has fallen.':'Your Raja has fallen.';setTimeout(function(){endGame(foeSide)},2300);return}
    if(foeSide&&!G.fighters.some(function(f){return f.team!==pl.team&&alive(f)})&&!G.decided){G.decided=true;G.endMsg='The enemy army is wiped from the board.';setTimeout(function(){endGame(true)},2000)}
    else if(isP(att)&&a&&(a.counter||a.exec))slow(.35,.7);return}
  var left=G.fighters.filter(function(f){return f.team===1&&alive(f)}).length;
  if(left===0){slow(.22,1.6);setCine(att,d,1.6,1.25,3.4);cine(1.6)}
  else if(a&&(a.counter||a.exec)){slow(.35,.7)}}
function takeControl(f){var old=G.player;closeCounter();G.autoCounter=null;IN.charging=false;IN.pending=false;IN.buffer=null;IN.cwPending=false;IN.chain=0;IN.heavyReady=false;
  G.used=(G.used||0)+1;G.player=f;G.takeover=false;G.sel=f.kindId;f.ai.tgt=null;f.ai.punish=0;f.resolve=1;f.graceUntil=G.t+2;f.blocking=false;if(f.tag){f.tag.remove();f.tag=null}
  G.yaw=f.face;G.lastCamInput=G.real;stat('takeover');tagMatch();if(window.UI)UI.onTakeover(f);
  toast('You fight on','as the '+f.name,2200);if(AU.voice)AU.voice('yell',f,3)}
function at(dt,fn){G.events.push({t:G.t+dt,fn:fn})}
function runEvents(){for(var i=0;i<G.events.length;i++){if(G.t>=G.events[i].t){var e=G.events.splice(i,1)[0];i--;try{e.fn()}catch(x){console.error(x)}}}}
function addCombo(n){G.combo+=n;G.comboT=G.t;if(G.combo>G.bestCombo)G.bestCombo=G.combo}
function comboMul(){return 1+Math.min(G.combo,15)*.03}
function comboSpeed(){return G.combo>=10?.72:G.combo>=5?.85:1}
function setCine(a,b,realDur,side,r){var mid=a.pos.add(b.pos).scale(.5);var base=Math.atan2(b.pos.x-a.pos.x,b.pos.z-a.pos.z);var s=side||1.3;var y1=base+s,y2=base-s;
  function ok(y){var px=mid.x-Math.sin(y)*(r||3.4),pz=mid.z-Math.cos(y)*(r||3.4);return Math.hypot(px,pz)<ARENA_R}var yaw=ok(y1)?y1:y2;G.cine={until:G.real+realDur,a:a,b:b,yaw:yaw,r:r||3.4}}
function mercy(){G.fighters.forEach(function(e){if(e.st==='attack'&&e.act&&!e.act.done&&e.act.target===G.player&&e.act.glint!=='red'){e.act.impactAt+=.25;e.stDur+=.25;if(e.clip)e.clip.keys.forEach(function(k,i){if(i>0)k.t+=.25})}})}
function addResolve(x){var p=G.player;if(!p)return;p.resolve=Math.min(3,p.resolve+x)}
function hstop(t){if(G.ctxP===false)return;G.stop=Math.max(G.stop,t)}
function shk(x){return G.ctxP===false?G.shake:Math.max(G.shake,x)}
function slow(k,dur){if(G.real<G.slowUntil&&k>G.slowK)return;G.slowK=k;G.slowUntil=G.real+dur}
function cine(dur){var a=document.getElementById('letter'),b=document.getElementById('letter2');a.style.height=b.style.height='7vh';setTimeout(function(){a.style.height=b.style.height='0'},dur*1000)}

/* ---------- counter window ---------- */
function openCounter(att,multi,perfect){var p=G.player;var many=G.cw&&G.t<=G.cw.until&&G.cw.targets.length>=1;var k=many?.35:perfect?TUNE.slowPerfect:TUNE.slowNormal,real=perfect?TUNE.cwPerfect:TUNE.cwNormal;if(G.assist)real+=.25;var until=G.t+real*k;
  if(!G.cw||G.t>G.cw.until)G.cw={until:until,targets:[]};else G.cw.until=Math.max(G.cw.until,until);
  if(G.cw.targets.indexOf(att)<0)G.cw.targets.push(att);att.ring.isVisible=true;att.stDur=Math.max(att.stDur,G.cw.until-G.t+.15);G.slowUntil=0;slow(k,real);AU.play('counter');addCombo(1);
  if((G.hintN||0)<3){G.hintN=(G.hintN||0)+1;flt('STRIKE NOW',p,'#ffffff',2.9)}}
function removeCounterTarget(f){if(!G.cw)return;var i=G.cw.targets.indexOf(f);if(i>=0)G.cw.targets.splice(i,1);f.ring.isVisible=false}
function closeCounter(){if(!G.cw)return;G.cw.targets.forEach(function(f){f.ring.isVisible=false});G.cw=null}
function counterOpen(){return G.cw&&G.t<=G.cw.until&&G.cw.targets.some(function(f){return alive(f)&&f.st==='parried'})}
function pickCounterTarget(p){var id=inputDir(),best=null,bs=-1e9;G.cw.targets.forEach(function(e){if(!alive(e)||e.st!=='parried')return;var s=-dist(p,e)*.5;if(id)s+=V3.Dot(dirTo(p,e),id)*2;if(s>bs){bs=s;best=e}});return best}
function simpleStrike(p,tg,dmg,lbl){removeCounterTarget(tg);var u=dirTo(p,tg);p.face=Math.atan2(u.x,u.z);setState(p,'counter',.6);if(tg.st==='parried')tg.stDur+=.4;
  playClip(p,[{t:.12,p:PO.c3w,e:'io'},{t:.26,p:PO.c3m,e:'in'},{t:.4,p:PO.c3f,e:'out'},{t:.6,p:p.P.guard,e:'io'}]);flt(lbl,p,'#ffd27a',2.5);
  at(.12,function(){p.trail.on=1});at(.26,function(){pairedHit(p,tg,dmg,true);if(tg.hp<=0&&alive(tg))die(tg,p,{counter:1},'B')});at(.42,function(){p.trail.on=0});return true}
function doCounter(exec){var p=G.player;var tg=pickCounterTarget(p);if(!tg)return false;IN.cwPending=false;stat('counterTaken');
  if(tg.mount||p.mount){stat('counter');return simpleStrike(p,tg,exec&&tg.post>=tg.maxPost*.7?60:28,'COUNTER')}
  if(exec&&tg.post>=tg.maxPost*.7)return doExecution(tg);
  stat('counter');G.cw.targets.forEach(function(t){if(t!==tg&&t.st==='parried')t.stDur+=1.2});var v=['A','B','C'][Math.floor(rnd()*3)];G.lastCounter=v;
  if(G.cw)G.cw.until=Math.max(G.cw.until,G.t+1.1+.4);
  var others=G.fighters.some(function(o){return o.team!==p.team&&o!==tg&&alive(o)&&dist(o,p)<4});
  if(!others||rnd()<.35)setCine(p,tg,1.6,1.1,3.6);
  COUNTERS[v](p,tg);flt('COUNTER',p,'#ffd27a',2.5);return true}
function pairStart(p,tg,d){p.act=null;p.blocking=false;tg.act=null;tg.blocking=false;hideTells(tg);removeCounterTarget(tg);if(p.trail)p.trail.on=0;
  var u=dirTo(p,tg);p.face=Math.atan2(u.x,u.z);if(tg.st!=='knock')tg.face=p.face+Math.PI;G.align={f:p,from:p.pos.clone(),to:tg.pos.subtract(u.scale(d*tg.s)),t0:G.t,d:.1}}
function pairedHit(p,tg,dmg,big){if(!alive(tg))return;FX.stain(tg);if(big&&AU.voice)AU.voice('pain',tg,1);if(tg.king&&G.battle)dmg*=TUNE.kingTake;if(tg.king&&dmg>100)dmg=tg.maxHp*.2/((p.cls.dmg||1)*comboMul());var dm=dmg*p.cls.dmg*comboMul();tg.hp-=dm;addCombo(1);var cp=contactPoint(p,tg);var dir=dirTo(p,tg);
  FX.blood(cp,dir,big?26:8,big);FX.burst(cp,big?6:3,'spark',dir,4);AU.play('hit',big?1.4:.8);if(big)AU.play('gore',.9);hstop(big?.11:.05);G.shake=shk(big?.4:.15);stainBlade(p,big?.15:.05)}
function pairEnd(p,tg,v){if(p.st==='counter'||p.st==='exec'){setState(p,'idle');p.trail.on=0}if(tg.hp<=0){if(tg.st!=='dead')die(tg,p,{counter:1},v)}else if(tg.st==='paired'){knock(tg,p)}}
var COUNTERS={
  A:function(p,tg){pairStart(p,tg,1.05);setState(p,'counter',.95);setState(tg,'paired',1.2);
    playClip(p,[{t:.1,p:PO.bashW,e:'io'},{t:.2,p:PO.bashM,e:'snap'},{t:.34,p:PO.ripW,e:'io'},{t:.44,p:PO.ripM,e:'snap'},{t:.72,p:PO.ripM,e:'lin'},{t:.95,p:p.P.guard,e:'io'}]);
    playClip(tg,[{t:.18,p:PO.parriedBig,e:'io'},{t:.3,p:PO.hitB,e:'snap'},{t:.47,p:PO.impaled,e:'snap'},{t:.95,p:PO.impaled,e:'lin'}],true);
    at(.2,function(){AU.play('thud');FX.clash(contactPoint(p,tg),false);tg.vel.addInPlace(dirTo(p,tg).scale(3.4));pairedHit(p,tg,4,false)});
    at(.3,function(){p.vel.addInPlace(fwd(p).scale(3.6));p.trail.on=1});at(.44,function(){pairedHit(p,tg,26,true)});at(.6,function(){p.trail.on=0});
    at(.95,function(){pairEnd(p,tg,'F')})},
  B:function(p,tg){pairStart(p,tg,1.15);setState(p,'counter',1.0);setState(tg,'paired',1.25);
    playClip(p,[{t:.12,p:PO.beatW,e:'snap'},{t:.3,p:PO.c4w,e:'io'},{t:.5,p:PO.c4m,e:'in'},{t:.62,p:PO.c4f,e:'out'},{t:1.0,p:guardSpin(p),e:'io'}]);
    playClip(tg,[{t:.14,p:PO.parriedBig,e:'snap'},{t:.48,p:PO.parriedBig,e:'lin'},{t:.56,p:PO.spun,e:'snap'},{t:1.0,p:PO.spun,e:'lin'}],true);
    at(.12,function(){FX.clash(contactPoint(p,tg),true);AU.play('clang',1.3);addPost(tg,30)});at(.32,function(){p.trail.on=1});
    at(.5,function(){pairedHit(p,tg,26,true)});at(.66,function(){p.trail.on=0});at(1.0,function(){pairEnd(p,tg,'S')})},
  C:function(p,tg){pairStart(p,tg,1.0);setState(p,'counter',1.05);setState(tg,'paired',1.3);
    playClip(p,[{t:.12,p:PO.pmM,e:'snap'},{t:.36,p:PO.c3w,e:'io'},{t:.52,p:PO.c3m,e:'in'},{t:.64,p:PO.c3f,e:'out'},{t:1.05,p:p.P.guard,e:'io'}]);
    playClip(tg,[{t:.14,p:PO.hitHead,e:'snap'},{t:.48,p:PO.kneel,e:'out'},{t:.58,p:PO.hitBk,e:'snap'},{t:1.05,p:PO.hitBk,e:'lin'}],true);
    at(.12,function(){AU.play('thud',1.1);pairedHit(p,tg,5,false);tg.vel.addInPlace(dirTo(p,tg).scale(1.5))});at(.4,function(){p.trail.on=1});
    at(.54,function(){pairedHit(p,tg,26,true)});at(.7,function(){p.trail.on=0});at(1.05,function(){pairEnd(p,tg,'F')})}
};
function doExecution(tg,kind){var p=G.player;stat('exec');if(tg.mount||p.mount)return simpleStrike(p,tg,60,'TAKEDOWN');var v=kind||(rnd()<.5?'impale':'behead');
  if(isDown(tg))v='ground';
  pairStart(p,tg,v==='ground'?.85:1.1);setCine(p,tg,2.4,1.25,3.0);cine(1.6);slow(.45,1.6);AU.play('whoosh',1.3);flt(v==='ground'?'FINISH':'EXECUTION',p,'#ff9a6a',2.6);
  if(v==='ground'){setState(p,'exec',.9);setState(tg,'paired',1.0);
    playClip(p,[{t:.2,p:PO.execW,e:'io'},{t:.36,p:PO.execM,e:'snap'},{t:.62,p:PO.execM,e:'lin'},{t:.9,p:p.P.guard,e:'io'}]);
    playClip(tg,[{t:.1,p:PO.fallenB,e:'lin'}],true);
    at(.36,function(){pairedHit(p,tg,999,true);FX.pool(tg.pos,.8,1.5)});at(.9,function(){pairEnd(p,tg,'K')});return true}
  setState(p,'exec',1.25);setState(tg,'paired',1.4);
  playClip(tg,[{t:.25,p:PO.parriedBig,e:'io'},{t:.45,p:PO.kneel,e:'out'},{t:1.4,p:PO.kneel,e:'lin'}],true);
  if(v==='impale'){playClip(p,[{t:.3,p:PO.execW,e:'io'},{t:.48,p:PO.execM,e:'in'},{t:.92,p:PO.execM,e:'lin'},{t:1.25,p:p.P.guard,e:'io'}]);
    at(.48,function(){pairedHit(p,tg,999,true)});at(1.2,function(){pairEnd(p,tg,'B')})}
  else{playClip(p,[{t:.42,p:PO.d1W,e:'io'},{t:.58,p:PO.d1M,e:'snap'},{t:.9,p:PO.d1M,e:'lin'},{t:1.25,p:p.P.guard,e:'io'}]);
    at(.44,function(){p.trail.on=1});at(.57,function(){var u=dirTo(p,tg);var r=new V3(u.z,0,-u.x);pairedHit(p,tg,999,true);if(FX.gore==='full')FX.decap(tg,r.scale(-1))});at(.75,function(){p.trail.on=0});at(1.2,function(){pairEnd(p,tg,'F')})}
  return true}
/* ---------- AI defence (anti-mash) ---------- */
function aiDefend(e,p,a){
  if(!alive(e)||a.counter||a.unblock)return;
  var front=V3.Dot(dirTo(e,p),fwd(e))>.26;if(!front){if(!isP(e)&&free(e)&&rnd()<.55){e.ai.tgt=p;e.ai.retT=G.t+2.5;stat('turnToFace')}else{stat('flank');return}}
  if(e.st==='attack'){stat('openWindup');return}
  if(!free(e))return;
  e.ai.spam=e.ai.spam.filter(function(t){return G.t-t<1.5});e.ai.spam.push(G.t);var spam=e.ai.spam.length>=3;
  var pr=e.prof,pp=pr.parry+(spam?.4:0)+Math.min(G.round,5)*.01,pb=pr.block*(1-.5*e.post/e.maxPost);
  if(a.heavy)pp*=.5;if(!isP(p)){pp*=.5;pb*=.72}
  var r=rnd();
  if(r<pp){e.blockPressT=a.impactAt-.04;e.blocking=true;e.ai.blockUntil=a.impactAt+.3;stat('aiParryRoll')}
  else if(r<pp+pb){e.blocking=true;e.ai.blockUntil=a.impactAt+.45;e.blockPressT=-9}}

/* ---------- director ---------- */
function maxTokens(){return Math.min(G.diff,G.round<=1?2:4)}
function enemyImpacts(){return G.fighters.filter(function(e){return e.st==='attack'&&e.act&&!e.act.done&&e.act.target===G.player}).map(function(e){return e.act.impactAt})}
function timingOk(T,imps){for(var i=0;i<imps.length;i++){var ad=Math.abs(T-imps[i]);if(ad>.055&&ad<.185)return false}return true}
function directorWind(base,delay,minW){minW=minW||.4;var lo=G.t+minW+(delay||0);var T=Math.max(lo,G.t+base*(.92+rnd()*.2)+(delay||0));var imps=enemyImpacts();
  if(imps.length&&rnd()<.42){var s=imps.filter(function(x){return x>=lo})[0];if(s!==undefined&&timingOk(s,imps))T=s}
  if(!timingOk(T,imps)){var cands=[T];imps.forEach(function(x){cands.push(x,x+.2,x-.2)});cands=cands.filter(function(c){return c>=lo&&timingOk(c,imps)}).sort(function(a,b){return Math.abs(a-T)-Math.abs(b-T)});
    T=cands.length?cands[0]:Math.max.apply(null,imps.concat([lo]))+.2}
  return T-G.t-(delay||0)}

/* ---------- player input ---------- */
var IN={atkDown:false,atkT:0,blkDown:false,blkT:0,pending:false,charging:false,chargeT:0,heavyReady:false,chain:0,lastLightEnd:-9,buffer:null,cwPending:false,cwT:0,bothT:-9};
function pressAttack(){if(IN.atkDown)return;IN.atkDown=true;IN.atkT=G.real;AU.init();var p=G.player;if(!p||G.mode!=='fight')return;
  if(counterOpen()&&(free(p)||p.st==='parry'||p.st==='counter')){IN.cwPending=true;IN.cwT=G.real;return}
  IN.pending=true}
function releaseAttack(){IN.atkDown=false;var p=G.player;if(!p)return;
  if(IN.cwPending){if(!doCounter(false)){IN.cwPending=false;doLight()}return}
  if(IN.charging){IN.charging=false;if(p.st==='charge')setState(p,'idle');if(G.real-IN.chargeT>=.35)doMove('heavy');else doLight()}}
function pressBlock(){if(IN.blkDown)return;IN.blkDown=true;IN.blkT=G.real;AU.init();var p=G.player;if(!p||G.mode!=='fight'||!alive(p))return;
  if(p.st==='stagger'&&p.stT>=.18){setState(p,'idle');p.clip=null}
  if(p.st==='stagger'||p.st==='gbreak'||p.st==='parried'||p.st==='recoil'||p.st==='mend'||invuln(p))return;
  if(p.st==='attack'&&p.act){if(G.t<p.act.t0+(p.act.impactAt-p.act.t0)*TUNE.cancelAt&&!p.act.heavy||G.t>p.act.impactAt+p.act.active){p.act=null;setState(p,'idle');p.clip=null;hideTells(p);p.trail.on=0}else return}
  if(IN.charging){IN.charging=false;p.clip=null;setState(p,'idle')}
  p.pressId++;p.blockPressT=G.t;p.blocking=true;var id=p.pressId;var th=threat(p,.45);if(th)p.face=angTo(p,th);
  if(G.t-(p.lastHurtT||-9)<.2&&p.lastHurtBlockable)flt('TOO LATE',p,'#ff9a7a',2.5);
  var pt=G.t;setTimeout(function(){if(p.lastParryOk!==id&&p.pressId===id&&G.t-pt>.3){var th2=threat(p,1.2);if(th2){p.penaltyUntil=G.real+.8;stat('earlyPress');flt('TOO EARLY',p,'#ffcf7a',2.5)}}},420)}
function threat(p,win){var best=null,bt=1e9;G.fighters.forEach(function(f){if(f.team!==p.team&&f.st==='attack'&&f.act&&!f.act.done&&f.act.target===p&&f.act.glint!=='red'){var r=f.act.impactAt-G.t;if(r<win&&r<bt){bt=r;best=f}}});return best}
function releaseBlock(){IN.blkDown=false;var p=G.player;if(p)p.blocking=false}
function canAct(p){return alive(p)&&(free(p)||p.st==='parry'||(p.st==='attack'&&p.act&&G.t>p.act.impactAt+p.act.active+p.act.rec*.45))}
function inputDir(){var ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x,iz=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)+joy.y;
  var l=Math.hypot(ix,iz);if(l<.3)return null;if(l>1){ix/=l;iz/=l}var fx=Math.sin(G.yaw),fz=Math.cos(G.yaw);var rx=fz,rz=-fx;return new V3(fx*iz+rx*ix,0,fz*iz+rz*ix).normalize()}
function pickTarget(p){var id=inputDir(),best=null,bs=-1e9;foes(p).forEach(function(e){var d=dist(p,e);if(d>7)return;var u=dirTo(p,e);var dirv=id||fwd(p);var s=V3.Dot(u,dirv)*2.2-d*.35;if((e.st==='parried'||e.st==='gbreak'||e.st==='stagger')&&d<3.6)s+=1.5;if(e===p.target)s+=.4;if(s>bs){bs=s;best=e}});return best}
function doLight(){var p=G.player;if(!canAct(p)){IN.buffer={t:G.real};return}
  var tg=pickTarget(p),id=inputDir(),K=kitOf(p),SQ=K.seq;
  if(IN.blkDown&&p.blocking)return doMove(K.bash||'bash');
  if(tg&&isDown(tg)&&dist(p,tg)<3)return doExecution(tg,'ground');
  if(!tg){var idx0=(G.t-IN.lastLightEnd<.6)?(IN.chain+1)%SQ.length:0;IN.chain=idx0;return doMove(SQ[idx0])}
  var d=dist(p,tg)-tg.rad;
  if(id){var dd=V3.Dot(id,dirTo(p,tg));if(dd<-.55&&d<3)return doMove('retreat');if(Math.abs(dd)<.45&&d<3)return doMove(K.side||'c4')}
  if(d>K.leap[0]&&d<=K.leap[1])return doMove('leap');
  if(d<=1.1){IN.close=(IN.close||0)+1;if(tg.blocking||tg.st==='block')return doMove(IN.close%2?(K.bash||'bash'):'pommel');if(IN.close%3===0)return doMove('pommel')}
  var idx=(G.t-IN.lastLightEnd<.6)?(IN.chain+1)%SQ.length:0;IN.chain=idx;doMove(SQ[idx])}
function doMove(id){var p=G.player;if(!canAct(p))return;var tg=pickTarget(p);p.target=tg;var md=kitOf(p).M[id];if(!md)return;var a=Object.assign({id:id},md);if(a.bash&&p.bashCdUntil>G.t)return;if(a.bash)p.bashCdUntil=G.t+.5;
  var sp=comboSpeed();a.wind*=sp;a.rec*=sp;
  var SQ=kitOf(p).seq,ci=SQ.indexOf(id);if(ci>=0&&IN.chain===ci){a.chainIdx=ci;if(ci===0)IN.chainConn=0;if(ci===SQ.length-1&&ci>0&&(IN.chainConn||0)>=ci){a.finisher=1;flt('FINISHER',p,'#ffd27a',2.3);stat('finisher')}}
  if(id==='heavy'&&tg&&tg.st==='gbreak'&&tg.hp<tg.maxHp*.4&&dist(p,tg)<3.2){stat('gbExec');return doExecution(tg)}
  if(id==='heavy'&&G.combo>=8&&tg&&dist(p,tg)<3.2&&alive(tg)&&!(tg.act&&tg.act.glint==='red')){G.combo-=8;flt('TAKEDOWN',p,'#ff9a6a',2.6);return doExecution(tg)}
  startAction(p,a,tg);if(a.heavy)flt('HEAVY',p,'#ffd27a',2.3);if(a.leap)AU.play('whoosh',1.1);if(a.charge){flt('CHARGE',p,'#ffd27a',2.3);AU.play('roar',.4)}stat('p_'+id)}
function doMend(){var p=G.player;if(!p||p.resolve<1||!alive(p)||!(free(p)||p.st==='attack'))return flt(p&&p.resolve<1?'NO RESOLVE':'',p,'#cfa',2.2);
  p.resolve-=1;p.act=null;setState(p,'mend',.9);p.blocking=false;playClip(p,[{t:.25,p:PO.mend,e:'io'},{t:.75,p:PO.mend,e:'lin'},{t:1.0,p:p.P.guard,e:'io'}]);
  setTimeout(function(){if(alive(p)){p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.35);flt('+'+Math.round(p.maxHp*.35),p,'#9fe8a8',2.3);AU.play('heal')}},450)}

/* ---------- Resolve techniques ---------- */
function doResolve(){var p=G.player;if(p&&alive(p)&&p.resolve>=3&&TECH[p.cls.tech]&&(free(p)||p.st==='attack'))return TECH[p.cls.tech](p);doMend()}
function techStart(p,name,dur){p.resolve=0;p.act=null;p.blocking=false;hideTells(p);setState(p,'exec',dur);stat('tech_'+name);flt(TECHNAME[name].toUpperCase(),p,'#ffd27a',2.7);AU.play('counter');cine(Math.min(1.6,dur))}
function stunFoe(e,dur){e.act=null;e.blocking=false;hideTells(e);setState(e,'stagger',dur);playClip(e,[{t:.1,p:PO.gbreak,e:'snap'},{t:dur*.8,p:PO.gbreak,e:'lin'},{t:dur+.15,p:e.P.guard,e:'io'}])}
var TECH={
  phalanx:function(p){techStart(p,'phalanx',.85);slow(.5,.8);
    playClip(p,[{t:.16,p:PO.bashW,e:'io'},{t:.3,p:PO.bashM,e:'snap'},{t:.55,p:PO.bashM,e:'lin'},{t:.85,p:p.P.guard,e:'io'}]);
    at(.12,function(){p.vel.addInPlace(fwd(p).scale(5))});
    at(.3,function(){var n=0;foes(p).forEach(function(e){if(invuln(e)||dist(p,e)>3.6||V3.Dot(dirTo(p,e),fwd(p))<.45)return;n++;e.hp-=10;addPost(e,45);addCombo(1);FX.clash(contactPoint(p,e),true);
        if(e.hp<=0)die(e,p,{exec:1},'B');else knock(e,p)});
      FX.burst(p.pos.add(fwd(p).scale(1.2)).add(new V3(0,.1,0)),26,'dust',fwd(p),4);AU.play('thud',1.4);AU.play('clang',1.2);hstop(.1);G.shake=shk(.55);if(!n)flt('NO ONE IN FRONT',p,'#e8dcc0',2.3)})},
  trample:function(p){var u=fwd(p),hit=[];techStart(p,'trample',.95);G.align={f:p,from:p.pos.clone(),to:p.pos.add(u.scale(8)),t0:G.t,d:.7};slow(.6,1.2);
    playClip(p,[{t:.2,p:PO.c3w,e:'io'},{t:.55,p:PO.c3m,e:'in'},{t:.95,p:p.P.guard,e:'io'}]);p.trail.on=1;AU.play('roar',1.2);
    for(var k=1;k<=8;k++)at(k*.09,function(){foes(p).forEach(function(e){if(hit.indexOf(e)>=0||invuln(e))return;if(dist(p,e)<1.9+e.rad*.5){hit.push(e);e.hp-=18;addPost(e,50);addCombo(1);FX.blood(contactPoint(p,e),u,14,true);AU.play('hit',1.2);if(e.hp<=0)die(e,p,{exec:1},'B');else knock(e,p)}})});
    at(.95,function(){p.trail.on=0;if(!hit.length)flt('NO ONE IN THE PATH',p,'#e8dcc0',2.3)})},
  warcry:function(p){techStart(p,'warcry',1.1);
    playClip(p,[{t:.3,p:PO.roar,e:'io'},{t:.85,p:PO.roar,e:'lin'},{t:1.1,p:p.P.guard,e:'io'}]);
    at(.35,function(){AU.play('roar',1.6);if(AU.voice)AU.voice('roar',p,3);AU.play('gred');G.shake=shk(.6);FX.burst(p.pos.add(new V3(0,.1,0)),30,'dust',null,5);
      foes(p).forEach(function(e){if(invuln(e)||dist(p,e)>8)return;addPost(e,50);stunFoe(e,1.3);e.vel.addInPlace(dirTo(p,e).scale(2.5))});
      p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.15);addCombo(5);flt('+'+Math.round(p.maxHp*.15),p,'#9fe8a8',2.2)})},
  dance:function(p){var tg=foes(p).filter(function(e){return !invuln(e)&&dist(p,e)<8}).sort(function(a,b){return dist(p,a)-dist(p,b)}).slice(0,4);
    if(!tg.length){flt('NO FOES NEAR',p,'#e8dcc0',2.3);return}
    var step=.48,dur=tg.length*step+.45;techStart(p,'dance',dur);slow(.55,dur*1.2);setCine(p,tg[0],dur/.55,1.3,4.2);
    tg.forEach(function(e){e.act=null;e.blocking=false;hideTells(e);removeCounterTarget(e);setState(e,'paired',99)});
    tg.forEach(function(e,i){var T=i*step;
      at(T,function(){if(!alive(e))return;var u=dirTo(p,e);p.face=Math.atan2(u.x,u.z);G.align={f:p,from:p.pos.clone(),to:e.pos.subtract(u.scale(1.05*e.s)),t0:G.t,d:.12};AU.play('whoosh',1);
        var a=i%2?['rxW','rxM','rxF']:['c4w','c4m','c4f'];playClip(p,[{t:.1,p:PO[a[0]],e:'out'},{t:.26,p:PO[a[1]],e:'in'},{t:step,p:PO[a[2]],e:'out'}]);p.trail.on=1});
      at(T+.26,function(){if(!alive(e))return;var open=!e.king&&(e.post>=e.maxPost*.5||e.hp<e.maxHp*.4);
        if(open){pairedHit(p,e,999,true);die(e,p,{exec:1},i%2?'F':'S');if(FX.gore==='full'&&i%2===0&&rnd()<.5)FX.decap(e,new V3(Math.cos(p.face),0,-Math.sin(p.face)))}
        else{pairedHit(p,e,30,true);addPost(e,40);if(e.hp<=0)die(e,p,{exec:1},'B');else knock(e,p)}})});
    at(dur,function(){if(p.st==='exec')setState(p,'idle');p.trail.on=0;playClip(p,[{t:.25,p:p.P.guard,e:'io'}])})}
};

/* ---------- simulation step ---------- */
function feintStop(f){var a=f.act;a.done=true;f.act=null;hideTells(f);setState(f,'idle');playClip(f,[{t:.28,p:f.P.guard,e:'io'}]);if(f.trail)f.trail.on=0;stat('feint');
  var p=a.target;if(isP(p)){if(p.blockPressT>0&&G.t-p.blockPressT<.3&&G.t-p.blockPressT>=0){p.penaltyUntil=G.real+.8;flt('FEINT',f,'#ffcf7a',2.4);stat('feintBait')}f.ai.followUp=G.t+rr(.4,.7)}}
var SHOCKS=[];var shockMat=(function(){var m=new BABYLON.StandardMaterial('shockM',scene);m.emissiveColor=new C3(.75,.6,.42);m.disableLighting=true;m.alpha=.7;return m})();
function shockRing(pos,r){var t=BABYLON.MeshBuilder.CreateTorus('shock',{diameter:1,thickness:.06,tessellation:40},scene);t.material=shockMat.clone('sh');t.position.set(pos.x,.08,pos.z);t.isPickable=false;SHOCKS.push({m:t,t:0,r:r*2});
  var c=BABYLON.MeshBuilder.CreateDisc('crack',{radius:r*.7,tessellation:20},scene);c.rotation.x=Math.PI/2;c.position.set(pos.x,.02,pos.z);var cm=new BABYLON.StandardMaterial('crk',scene);cm.diffuseColor=new C3(.22,.16,.11);cm.specularColor=C3.Black();cm.alpha=.55;c.material=cm;c.isPickable=false;SHOCKS.push({m:c,t:0,crack:1})}
function updShocks(dt){for(var i=SHOCKS.length-1;i>=0;i--){var S=SHOCKS[i];S.t+=dt;if(S.crack){S.m.material.alpha=.55*clamp(1-(S.t-3)/1.5,0,1);if(S.t>4.5){S.m.material.dispose();S.m.dispose();SHOCKS.splice(i,1)}continue}
  var k=Math.min(1,S.t/.45);S.m.scaling.set(.3+S.r*k,1,.3+S.r*k);S.m.material.alpha=.7*(1-k);if(k>=1){S.m.material.dispose();S.m.dispose();SHOCKS.splice(i,1)}}}
function trample(f,a){if(!f.mount||f.mount.type!=='gaja'||!a.dash)return;a.trampled=a.trampled||[];foes(f).forEach(function(e){if(a.trampled.indexOf(e)>=0||invuln(e)||e.mount)return;var u=dirTo(f,e);if(dist(f,e)<f.rad+.9&&V3.Dot(u,fwd(f))>.2){a.trampled.push(e);e.hp-=12*(isP(f)?comboMul():1);FX.blood(contactPoint(f,e),u,10,false);AU.play('thud',.9);if(e.hp<=0)die(e,f,{exec:1},'B');else knock(e,f);stat('trample')}})}
function stepFighter(f,dt){
  f.stT+=dt;
  if(f.st==='attack'){var a=f.act;if(!a){setState(f,'idle')}else{
      if(a.feint&&!a.done&&G.t>=a.t0+(a.impactAt-a.t0)*.7)feintStop(f);
      if(!a.done&&G.t>=a.impactAt)resolveAction(f);
      if(f.act&&f.act===a&&!a.done&&a.target===G.player){var rem=a.impactAt-G.t;if(f.glintPhase===0&&rem<=.42){f.glintPhase=1;showGlint(f,a.glint,1.5);AU.play('g'+a.glint)}}
      if(f.act===a){var ls=a.t0+(a.impactAt-a.t0)*(a.lungeFrom!==undefined?a.lungeFrom:.35),le=a.impactAt+a.active;
        if(G.t>ls&&G.t<le){var want=Math.abs(a.lunge),back=a.lunge<0;if(!back&&a.target&&alive(a.target)&&!a.zone){var dd=dist(f,a.target)-a.target.rad-a.reach*.6;want=clamp(dd+(a.leap?.6:0),0,Math.abs(a.lunge)+(isP(f)&&!a.dash?.9:0))}
          var stepl=Math.min(want/(le-ls)*dt,Math.max(0,want-a.lunged));a.lunged+=stepl;f.pos.addInPlace(fwd(f).scale(back?-stepl:stepl))}
        if(a.dash&&G.t>ls&&G.t<le)trample(f,a);
        if(a.target&&alive(a.target)&&G.t<a.impactAt-.08)f.face=angLerp(f.face,angTo(f,a.target),Math.min(1,dt*(isP(f)?18:7)));
        if(f.trail)f.trail.on=(G.t>a.impactAt-.07&&G.t<a.impactAt+a.active+.05)?1:0}
      if(f.stT>=f.stDur){if(isP(f))IN.lastLightEnd=G.t;f.act=null;setState(f,'idle');if(f.trail)f.trail.on=0;hideTells(f)}}}
  else if(f.st==='stagger'||f.st==='parried'||f.st==='gbreak'||f.st==='blockHit'||f.st==='parry'||f.st==='mend'||f.st==='recoil'||f.st==='exec'||f.st==='counter'||f.st==='knock'||f.st==='paired'){if(f.trail&&f.st!=='exec'&&f.st!=='counter')f.trail.on=0;if(f.stT>=f.stDur){if(f.st==='parried')f.ring.isVisible=false;if(f.st==='gbreak')f.post=f.maxPost*(isP(f)?.5:.3);setState(f,f.blocking?'block':'idle')}}
  else if(f.st==='executed'){}
  else if(f.st==='dead'){f.fallT+=dt;return}
  if(f.st==='idle'&&f.blocking)setState(f,'block');if(f.st==='block'&&!f.blocking)setState(f,'idle');
  if(f.st!=='gbreak'){if(isP(f)){if(!f.blocking&&G.t-f.lastPostT>1)addPost(f,-dt*20)}else if(G.t-f.lastPostT>TUNE.recDelay)addPost(f,-dt*TUNE.recRate)}
  f.pos.addInPlace(f.vel.scale(dt));f.vel.scaleInPlace(Math.exp(-8*dt))}
function stepPlayer(p,dt){
  if(!alive(p))return;
  if(G.align){var A=G.align,k=clamp((G.t-A.t0)/A.d,0,1);k=EASE.out(k);p.pos.x=lerp(A.from.x,A.to.x,k);p.pos.z=lerp(A.from.z,A.to.z,k);if(k>=1)G.align=null}
  if(G.combo>0&&G.t-G.comboT>3.5)G.combo=0;
  if(G.assist&&!G.autoCounter&&counterOpen()&&free(p)&&!IN.cwPending)G.autoCounter={t:G.t+.05};
  if(G.cw&&G.t>G.cw.until&&!IN.cwPending){if(G.cw.targets.some(function(t){return alive(t)&&t.st==='parried'}))stat('counterMissed');closeCounter()}
  if(G.autoCounter&&G.t>=G.autoCounter.t&&!IN.cwPending){if(!counterOpen()){G.autoCounter=null}else if((free(p)||p.st==='parry')&&!threat(p,.3)){G.autoCounter=null;p.blocking=false;doCounter(IN.atkDown);stat('autoCounter')}}
  if(IN.cwPending){if(!counterOpen()&&!(G.cw&&G.cw.targets.length)){IN.cwPending=false;IN.pending=true}else if(IN.atkDown&&G.real-IN.cwT>=.25){doCounter(true)}}
  if(IN.atkDown&&IN.blkDown&&Math.abs(IN.blkT-IN.atkT)<.15&&G.real-Math.max(IN.atkT,IN.blkT)>=.35&&!IN.mended){IN.mended=true;IN.pending=false;IN.charging=false;doResolve()}
  if(!IN.atkDown||!IN.blkDown)IN.mended=false;
  if(IN.pending&&G.real-IN.atkT>=.07){IN.pending=false;if(IN.blkDown&&Math.abs(IN.blkT-IN.atkT)<.15){/* possible mend chord: wait */IN.pending=IN.atkDown}
    else if(IN.atkDown&&canAct(p)&&!(IN.blkDown&&p.blocking)){IN.charging=true;IN.chargeT=G.real;p.blocking=false;playClip(p,[{t:.22,p:PO.charge,e:'io'}],true);setState(p,'charge')}else doLight()}
  if(IN.charging&&G.real-IN.chargeT>.35&&!IN.heavyReady){IN.heavyReady=true;showGlint(p,'gold',.8);AU.play('warn')}
  if(IN.charging&&G.real-IN.chargeT>1.2){IN.charging=false;if(p.st==='charge')setState(p,'idle');doMove('heavy')}
  if(!IN.charging)IN.heavyReady=false;
  if(p.st==='charge'&&!IN.charging)setState(p,'idle');
  if(IN.buffer&&G.real-IN.buffer.t<.25&&canAct(p)){IN.buffer=null;doLight()}
  p.blocking=IN.blkDown&&(free(p)||p.st==='blockHit'||p.st==='parry');
  var id=inputDir(),near=foes(p).filter(function(e){return dist(p,e)<7.5});
  var mobile=(free(p)||p.st==='charge');var spd=0;
  if(id&&mobile){var v=(p.blocking?1.7:p.st==='charge'?1.2:(near.length?3.4:4.6))*p.cls.spd;p.pos.addInPlace(id.scale(v*dt));spd=v}
  p.speed=spd;
  var thb=p.blocking&&threat(p,.8);if(thb)p.face=angLerp(p.face,angTo(p,thb),Math.min(1,dt*14));
  var tgt=pickTarget(p);if(!thb&&near.length&&tgt&&(p.blocking||spd<4||p.st==='charge')&&(free(p)||p.st==='charge'))p.face=angLerp(p.face,angTo(p,tgt),Math.min(1,dt*9));
  else if(id&&mobile)p.face=angLerp(p.face,Math.atan2(id.x,id.z),Math.min(1,dt*10));
  p.lockT=tgt}
function pickMove(e){var m=pickMove0(e),pr=e.prof||{};if(!m||m.glint!=='white'||m.chain||m.zone||m.delay||m.leap)return m;
  if(e.ai.reads>=3){e.ai.reads=0;stat('aiRead');return Object.assign({},m,rnd()<.5?{feint:1,lunge:0}:{delay:.3})}
  if(rnd()<(pr.feint||0))return Object.assign({},m,{feint:1,lunge:0});
  if(e.arch==='duelist'&&rnd()<.15)return Object.assign({},m,{delay:.3});return m}
function pickMove0(e){var pool=[];for(var k in e.moves){var m=e.moves[k];if(m.w>0)pool.push(m)}if(e.veteran&&e.moves===SP)pool.push(Object.assign({},SP.delayed,{w:22}));
  var tot=pool.reduce(function(s,m){return s+m.w},0),r=rnd()*tot;for(var i=0;i<pool.length;i++){r-=pool[i].w;if(r<=0)return pool[i]}return pool[0]}
function attackersOn(o,ex){var n=0;for(var i=0;i<G.fighters.length;i++){var f=G.fighters[i];if(f!==ex&&f.ai&&f.ai.tgt===o&&alive(f)&&!isP(f))n++}return n}
function pickFoe(e){var best=null,bs=1e9;foes(e).forEach(function(o){if(window.__GHOST&&isP(o))return;if(isP(o)&&attackersOn(o,e)>=maxTokens()+1&&e.ai.tgt!==o)return;var d=dist(e,o);
    if(e.king&&e.home&&Math.hypot(o.pos.x-e.home.x,o.pos.z-e.home.z)>7.5&&d>3.5)return;
    var na=attackersOn(o,e);var sc=d+na*2.4-(isP(o)?.5:0)+(isP(o)&&na>=maxTokens()?6:0)+(o.st==='knock'?3:0)+(o.king&&!e.king?1.5:0);if(sc<bs){bs=sc;best=o}});return best}
function stepAI(e,dt){
  if(!alive(e))return;var ai=e.ai;if(G.t<(G.holdUntil||0)){e.speed=0;return}
  if(e.blocking&&G.t>(ai.blockUntil||0)&&G.t>ai.turtleUntil)e.blocking=false;
  if(!free(e))return;
  if(!ai.tgt||!alive(ai.tgt)||G.t>(ai.retT||0)){ai.tgt=pickFoe(e);ai.retT=G.t+rr(1.2,2.2)}
  var p=ai.tgt,ms=e.mspd||1;
  if(!p){e.speed=0;if(e.home){var hx=e.home.x-e.pos.x,hz=e.home.z-e.pos.z,hd=Math.hypot(hx,hz);if(hd>.6){e.pos.x+=hx/hd*1.6*dt;e.pos.z+=hz/hd*1.6*dt;e.face=angLerp(e.face,Math.atan2(hx,hz),dt*4);e.speed=1.6}else e.face=angLerp(e.face,e.team===0?0:Math.PI,dt*2)}return}
  var isPl=isP(p);
  ai.cd-=dt;var d=dist(e,p),dd=d-p.rad*.6-(e.mount?e.rad*.4:0);e.face=angLerp(e.face,angTo(e,p),Math.min(1,dt*(e.mount?3.5:6)));
  var u=dirTo(e,p),side=new V3(u.z,0,-u.x).scale(ai.strafe);
  var engaged=0;for(var q=0;q<G.fighters.length;q++){var o=G.fighters[q];if(o.team!==p.team&&o.st==='attack'&&o.act&&!o.act.done&&o.act.target===p)engaged++}
  var cap=isPl?maxTokens():1;
  if(ai.punish&&dd<2.8&&alive(p)&&!(isPl&&G.t<(p.graceUntil||0))){ai.punish=0;if(p.st==='recoil'||p.st==='parried'||p.st==='gbreak'||engaged<cap){var m0=Object.assign({},basicMove(e));e.blocking=false;startAction(e,m0,p,isPl?directorWind(.34,0,.3):.34);stat('aiPunish');return}}
  var ready=ai.cd<=0&&engaged<cap&&!invuln(p)&&(!isPl||(G.t>G.breathUntil&&G.t>(p.graceUntil||0)));
  if(isPl&&G.battle&&!ready&&ai.cd<=0&&rnd()<dt*1.5)ai.retT=0;
  var reach=(e.weapon==='spear'?2.3:2.0)+(e.mount?.4:0);var mv=new V3(),spd=0;
  if(ai.followUp&&G.t>=ai.followUp){ai.followUp=0;if(alive(p)&&dd<reach+.8&&!invuln(p)){var mf=Object.assign({},basicMove(e));e.blocking=false;startAction(e,mf,p,isPl?directorWind(mf.wind*.85,0,.3):mf.wind);stat('feintFollow');return}}
  if(ready){if(dd>reach){mv=u;spd=2.6*ms}else{var mvd=pickMove(e);e.blocking=false;startAction(e,mvd,p,isPl?directorWind(mvd.wind,mvd.delay):mvd.wind*rr(.9,1.15));ai.cd=isPl?rr(1.3,2.7)-Math.min(G.round,5)*.1:rr(1.4,2.8);
      if(isPl&&mvd.glint!=='red'&&engaged+1<cap&&rnd()<.4){var mate=G.fighters.find(function(o){return o!==e&&o.team===e.team&&!isP(o)&&free(o)&&alive(o)&&o.ai.cd<1&&dist(o,p)<2.8&&!o.champion&&!o.boss&&!o.mount});
        if(mate){var m2=pickMove(mate);if(m2.glint==='red'||m2.delay||m2.chain||m2.leap)m2=basicMove(mate);var w2=e.act.impactAt-G.t;if(w2>=.4){mate.blocking=false;mate.ai.tgt=p;startAction(mate,m2,p,w2);mate.ai.cd=rr(1.3,2.7);stat('pairAttack')}}}
      return}}
  else{var wr=isPl?ai.waitR:Math.max(2.1,reach+.2);if(dd<wr-.6){mv=u.scale(-1);spd=1.8}else if(dd>wr+.6){mv=u;spd=2.4*ms}else{mv=side;spd=1.1}
    if(e.arch==='spear'&&dd<1.7){mv=u.scale(-1);spd=2.6}
    if(G.t>ai.nextTurtle){ai.turtleUntil=G.t+rr(1,2.2);ai.nextTurtle=G.t+rr(3,7);e.blocking=true}
    if(rnd()<dt*.25)ai.strafe*=-1}
  var EL=FIELD_H-2;if(Math.abs(e.pos.x)>EL||Math.abs(e.pos.z)>EL){mv=mv.add(new V3(Math.abs(e.pos.x)>EL?-Math.sign(e.pos.x):0,0,Math.abs(e.pos.z)>EL?-Math.sign(e.pos.z):0).scale(.8));if(spd<1)spd=1}
  e.pos.addInPlace(mv.scale(spd*dt*(e.blocking?.6:1)));e.speed=spd}
function separate(){var fs=G.fighters.filter(alive);for(var i=0;i<fs.length;i++){var a=fs[i];var L=FIELD_H-.4;a.pos.x=clamp(a.pos.x,-L,L);a.pos.z=clamp(a.pos.z,-L,L);
  for(var j=i+1;j<fs.length;j++){var b=fs[j];if(invuln(a)||invuln(b))continue;var dx=b.pos.x-a.pos.x,dz=b.pos.z-a.pos.z,d=Math.hypot(dx,dz),mn=a.rad+b.rad+.25;if(d<mn&&d>1e-4){var k=(mn-d)/d*.5;a.pos.x-=dx*k;a.pos.z-=dz*k;b.pos.x+=dx*k;b.pos.z+=dz*k}}}}

/* ---------- rounds ---------- */
var NUM=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
var ROUNDS=[{s:3},{s:2,r:1},{s:3,vet:1,r:1},{s:2,r:2},{s:2,raja:1}];
function foeArmy(){return G.army==='sun'?'ecl':'sun'}
function startRound(){G.round++;var R=ROUNDS[G.round-1];closeCounter();var EA=foeArmy(),E=ARMY[EA],dk=EA==='ecl',an=E.name;
  var list=[];for(var i=0;i<R.s;i++){var vet=R.vet&&i===0;list.push({k:E.sipahi,o:{arch:i%2?'spear':'shield',name:(vet?'Veteran ':'')+an+' Sipahi',veteran:vet,hpMul:vet?1.4:1,pMul:vet?1.3:1,scale:vet?1.06:1}})}
  for(var j=0;j<(R.r||0);j++)list.push({k:E.rani,o:{name:an+' Rani',moves:RN,prof:PROF.rani}});
  var n=list.length;list.forEach(function(L,i){var a=Math.PI+(i-(n-1)/2)*.4;L.o.x=Math.sin(a)*10.5;L.o.z=Math.cos(a)*10.5;L.o.face=a+Math.PI;L.o.dark=dk;makeFighter(L.k,1,L.o)});
  if(R.raja){makeFighter(E.raja,1,{x:0,z:-12.5,face:0,scale:1.18,champion:true,boss:true,zone:true,moves:RJ,prof:PROF.raja,name:an+' Raja',dark:dk});n++}
  document.getElementById('round').innerHTML='Round '+NUM[G.round-1]+'<small>'+n+' foes stand</small>';
  setTimeout(tagMatch,0);toast('Round '+NUM[G.round-1],R.raja?'The '+an+' Raja takes the field. Leave the ring when it burns red.':R.r?'A Rani fights in threes. Wait out her flurry.':R.vet?'A veteran leads them. Beware delayed strikes.':'Parry, then strike back',2100);AU.play('roar',.8)}
function checkRound(){if(G.mode!=='fight'||G.battle)return;if(G.fighters.some(function(f){return f.team===1&&alive(f)}))return;if(G.roundEnding)return;G.roundEnding=true;
  setTimeout(function(){G.fighters.filter(function(f){return f.team===1}).forEach(function(f){killFighterVisual(f)});G.fighters=G.fighters.filter(function(f){return f.team===0});
    var p=G.player;p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.3);G.roundEnding=false;if(G.round>=ROUNDS.length)endGame(true);else startRound()},2600);toast('Victory','The crowd roars',1800)}
function endGame(won){if(G.mode==='over')return;G.mode='over';G.won=won;closeCounter();
  if(!G.endMsg)G.endMsg=won?'The '+ARMY[foeArmy()].name+' army is broken.':'You fell in round '+NUM[Math.max(0,G.round-1)]+'.';
  try{document.exitPointerLock()}catch(e){}if(window.UI)UI.showResult(won);if(AU.stinger)AU.stinger(won?'win':'lose')}

/* ---------- HUD ---------- */
var toastEl=document.getElementById('toast'),toastTO=0;
function toast(t,sub,ms){toastEl.innerHTML=t+(sub?'<small>'+sub+'</small>':'');toastEl.classList.add('on');clearTimeout(toastTO);toastTO=setTimeout(function(){toastEl.classList.remove('on')},ms||1500)}
function project(p){var tm=scene.getTransformMatrix(),vp=cam.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());var r=V3.Project(p,MX.IdentityReadOnly,tm,vp);var k=canvas.clientWidth/engine.getRenderWidth();return{x:r.x*k,y:r.y*k,z:r.z}}
function flt(txt,f,col,h){if(!txt||!f)return;if(G.player&&f!==G.player&&dist(f,G.player)>9)return;var q=project(new V3(f.pos.x,(h||2.3)*f.s+(f.hOff||0),f.pos.z));if(q.z>1)return;var d=document.createElement('div');d.className='ft';d.textContent=txt;d.style.left=q.x+'px';d.style.top=q.y+'px';d.style.color=col;tagsEl.appendChild(d);setTimeout(function(){d.remove()},1100)}
var hpb=document.getElementById('hpb'),gdb=document.getElementById('gdb'),resEl=document.getElementById('res').children;
function hud(){var p=G.player;if(!p)return;
  if(G.battle&&(G.hudN=(G.hudN||0)+1)%15===0){var a0=0,a1=0;G.fighters.forEach(function(f){if(alive(f)){if(f.team===p.team)a0++;else a1++}});document.getElementById('round').innerHTML=ARMY[G.army].name+' <b>'+a0+'</b> · <b>'+a1+'</b> '+ARMY[foeArmy()].name}hpb.style.transform='scaleX('+Math.max(0,p.hp/p.maxHp)+')';var pf=p.post/p.maxPost;gdb.style.transform='scaleX('+pf+')';gdb.style.background=pf>.7?'linear-gradient(90deg,#a3161a,#ff4a3a)':'';
  for(var i=0;i<3;i++)resEl[i].className=p.resolve>=i+1?'on':'';
  var rdy=p.resolve>=3&&!!p.cls.tech;if(G.rdy!==rdy){G.rdy=rdy;document.getElementById('touch').classList.toggle('ready',rdy)}
  var hf=p.hp/p.maxHp,he=document.getElementById('hurt');if(he){var lo=hf<.3&&alive(p)?(.55+.25*Math.sin(G.real*5))*(1-hf/.3)+.25:0;he.style.opacity=Math.max(lo,(G.real-(p.lastHurtReal||-9))<.35?.45:0)}
  var ce=document.getElementById('combo');if(ce){ce.style.opacity=G.combo>1?1:0;document.getElementById('cbn').textContent=G.combo;ce.classList.toggle('hot',G.combo>=8);ce.classList.toggle('warm',G.combo>=5)}
  var W=canvas.clientWidth,H=canvas.clientHeight;indEl.innerHTML='';
  G.fighters.forEach(function(f){if(f.team!==1)return;var tg=f.tag;if(!tg)return;
    if(!alive(f)){tg.style.display='none';return}
    var q=project(new V3(f.pos.x,2.25*f.s+f.hOff,f.pos.z));var show=q.z<1&&(!G.battle||dist(f,p)<11)&&(f===p.lockT||f.hp<f.maxHp||f.post>1||f.champion||f.veteran);
    tg.style.display=show?'':'none';if(show){tg.style.left=q.x+'px';tg.style.top=q.y+'px';tg.children[1].firstChild.style.transform='scaleX('+f.hp/f.maxHp+')';var ef=f.post/f.maxPost;tg.children[2].firstChild.style.transform='scaleX('+ef+')';tg.children[2].firstChild.style.background=f.st==='gbreak'?(Math.sin(G.real*22)>0?'#ffffff':'#ff5a3a'):ef>.7?'#ff5a3a':'';tg.style.opacity=f===p.lockT?1:.75}
    if(f.st==='attack'&&f.act&&!f.act.done&&f.act.target===p){var off=q.z>1||q.x<0||q.x>W||q.y<0||q.y>H;if(off){var a=angTo(p,f)-G.yaw;var ax=Math.sin(a),ay=-Math.cos(a);var cx=W/2+ax*(W/2-40),cy=H/2+ay*(H/2-40);
      var el=document.createElement('div');el.className='ia';var col=f.act.glint==='red'?'#ff2d3a':f.act.glint==='blue'?'#4da3ff':'#f4f1e8';el.style.borderBottomColor=col;el.style.color=col;el.style.left=(cx-11)+'px';el.style.top=(cy-11)+'px';el.style.transform='rotate('+(a*180/Math.PI)+'deg)';indEl.appendChild(el)}}})}

/* ---------- render side ---------- */
function visual(f,dt,rdt){
  var target;
  if(f.clip){f.clipT+=dt;sampleClip(f.clip,f.clipT,f.tmpPose);target=f.tmpPose;if(f.clipT>=f.clip.dur&&!f.clipHold){f.clip=null;var r=f.pose.ry;f.pose.ry=((r+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI}}
  else target=(f.blocking||f.st==='block')?f.P.block:(G.mode==='menu'&&!f.weapon?PO.idleLow:f.P.guard);
  lerpPoseTo(f.pose,f.pose,target,1-Math.exp(-(f.clip?45:11)*dt));
  var P=f.pose,fall=P.fb+P.ff+P.air;
  f.root.position.x=f.pos.x;f.root.position.z=f.pos.z;f.root.position.y=P.air*.55*f.s;
  f.root.rotation.x=-1.45*P.fb+1.35*P.ff;f.root.rotation.y=f.face+P.ry;
  var vel=new V3();if(f.lastPos&&dt>1e-4){vel=f.pos.subtract(f.lastPos).scale(1/dt);if(vel.length()>9)vel.scaleInPlace(9/vel.length())}f.lastPos=f.pos.clone();
  var spn=vel.length();
  if(f.mount){var bob=animMount(f,dt,spn);var dn=f.mount.down;f.root.position.y=lerp(f.mount.saddle-HB*f.s+.04+bob,0,EASE.io(dn));
    if(f.st!=='dead'){f.root.computeWorldMatrix(true);var gj=f.mount.type==='gaja';f.feet.forEach(function(ft){var q=rootPoint(f,new V3(ft.side*(gj?.24:.31),gj?.6:.34,gj?.3:.08));ft.pos.copyFrom(q);ft.from.copyFrom(q);ft.to.copyFrom(q);ft.t=1})}}
  if(f.mount&&f.st!=='dead'){}
  else if(fall>.04||f.st==='dead'){f.root.computeWorldMatrix(true);f.feet.forEach(function(ft){var lp=ft.side<0?new V3(-.13,0,.17):new V3(.14,0,-.17);var q=rootPoint(f,lp);ft.pos.copyFrom(q);ft.from.copyFrom(q);ft.to.copyFrom(q);ft.t=1})}
  else updateFeet(f,dt,P,vel,spn);
  applyPose(f,P,dt,{lean:Math.min(.18,spn*.035),breath:Math.sin(G.real*2.1+f.s*7)*.018});
  if(f.cape)f.cape.update(rdt,new V3(1.2+Math.sin(G.real*.7)*.8,0,.6));
  if(f.trail)f.trail.update(dt);
  if(f.hp<f.maxHp*.5&&alive(f)&&spn>1&&FX.gore==='full'){f.dripT=(f.dripT||0)+dt;if(f.dripT>.45){f.dripT=0;FX.pool(new V3(f.pos.x+(Math.random()-.5)*.3,0,f.pos.z+(Math.random()-.5)*.3),.05+Math.random()*.05,.3)}}if(f.trail2){f.trail2.on=f.trail.on;f.trail2.update(dt)}
  if(f.glint&&f.glint.isVisible){f.glintT+=rdt;var tip=f.trail&&f.trail.tip;if(tip)f.glint.position.copyFrom(tip);var s=f.glintK*(f.glintT<.07?f.glintT/.07*1.2:Math.max(.35,1.2-(f.glintT-.07)*3.5))*.9*f.s;
    if(isP(f))s=.5+Math.sin(G.real*20)*.1;else s*=1+clamp((G.camR-6)/12,0,1)*1.5;f.glint.scaling.setAll(s);if(isP(f)&&!IN.charging)f.glint.isVisible=false}
  if(f.zone&&f.zone.isVisible&&f.act){var c=f.pos.add(fwd(f).scale(1.1*f.s));f.zone.position.x=c.x;f.zone.position.z=c.z;var pr=clamp((G.t-f.act.t0)/(f.act.impactAt-f.act.t0),0,1);var zr=f.act.zone*2*(.6+.4*pr);f.zone.scaling.set(zr,1,zr);f.zone.material.alpha=.4+.6*pr}
  if(f.ring.isVisible){f.ring.position.set(f.pos.x,.06,f.pos.z);var pu=(1+Math.sin(G.real*14)*.08)*(1+clamp((G.camR-6)/12,0,1)*.6);f.ring.scaling.set(pu,1,pu)}}

/* ---------- camera ---------- */
function updateCamera(rdt){var p=G.player;
  if(G.mode==='menu'){var nar=canvas.clientWidth<700;cam.target=V3.Lerp(cam.target,new V3(0,nar?.6:.8,0),1-Math.exp(-3*rdt));G.menuYaw=(G.menuYaw||0)+rdt*.12;cam.alpha=Math.PI/2+.3+Math.sin(G.menuYaw)*.4+(G.dragYaw||0);cam.beta=1.5;var mf=G.menuF&&G.menuF.mount;cam.radius=lerp(cam.radius,(nar?5.6:4.0)*(mf?(mf.type==='gaja'?2.2:1.6):1),1-Math.exp(-2*rdt));if(mf)cam.target.y=lerp(cam.target.y,mf.saddle*.65,1-Math.exp(-3*rdt));return}
  if(!p)return;
  var dyaw,dR,dpitch,focus;
  if(G.cine&&G.real<G.cine.until&&G.cine.a&&G.cine.b){var C=G.cine;focus=C.a.pos.add(C.b.pos).scale(.5);focus.y=1.2;dyaw=C.yaw;dR=C.r;dpitch=1.38}
  else{G.cine=null;
    if(G.real-G.lastCamInput>1.6&&p.speed>3){G.yaw=angLerp(G.yaw,p.face,rdt*1.1)}
    var near=foes(p).filter(function(e){return dist(p,e)<7});var Z=SET.zoom;dR=lerp(clamp(5.2+near.length*.5,5.2,7.6),18,Z);
    focus=p.pos.clone();if(p.lockT&&alive(p.lockT)){focus=V3.Lerp(p.pos,p.lockT.pos,.32)}var ry=G.yaw+Math.PI/2;focus.x+=Math.sin(ry)*.55;focus.z+=Math.cos(ry)*.55;focus.y=1.45+(p.hOff||0)*.75+Z*.6;dyaw=G.yaw;dpitch=clamp(G.pitch-Z*.42-(window.LOOKPITCH||0),.55,1.5);if(p.mount)dR+=p.mount.type==='gaja'?2.6:1.2}
  var k=1-Math.exp(-(G.cine?5:7)*rdt);
  G.camYaw=G.camYaw===undefined?dyaw:angLerp(G.camYaw,dyaw,G.cine?1-Math.exp(-4*rdt):1-Math.exp(-12*rdt));G.camPitch=G.camPitch===undefined?dpitch:lerp(G.camPitch,dpitch,k);
  G.camR=lerp(G.camR,dR,1-Math.exp(-(G.cine?4:2.5)*rdt));G.camT=V3.Lerp(G.camT,focus,k);
  var sh=SET.shake?G.shake:0;G.shake*=Math.exp(-9*rdt);
  var t=G.camT.add(new V3((Math.random()-.5)*sh*.25,(Math.random()-.5)*sh*.25,0));
  var fx=Math.sin(G.camYaw),fz=Math.cos(G.camYaw),R2=G.camR;
  for(var i=0;i<8;i++){var px=t.x-fx*R2*Math.sin(G.camPitch),pz=t.z-fz*R2*Math.sin(G.camPitch);if(Math.hypot(px,pz)<ARENA_R+20)break;R2*=.88}
  cam.target=t;cam.alpha=Math.atan2(-fz,-fx);cam.beta=G.camPitch;cam.radius=R2}

/* ---------- main loop ---------- */
function tierShadows(){var rl=sg.getShadowMap().renderList,c=cam.target;rl.length=0;ENV_CASTERS.forEach(function(m){rl.push(m)});
  G.fighters.forEach(function(f){if(!f.casters)return;if(SET.quality!=='low'&&Math.hypot(f.pos.x-c.x,f.pos.z-c.z)<(G.battle?13+SET.zoom*10:40))f.casters.forEach(function(m){if(!m.isDisposed())rl.push(m)})})}
var acc=0,STEP=1/60;
scene.onBeforeRenderObservable.add(function(){
  var rdt=(FAST||SIMTEST)?1/30:Math.min(engine.getDeltaTime()/1000,1/20);G.real+=rdt;
  var ts=G.real<G.slowUntil?G.slowK:1;if(G.stop>0){G.stop-=rdt;ts=.04}
  var dt=rdt*ts;if(G.paused){dt=0;ts=0}
  if((G.mode==='fight'||G.mode==='over')&&!G.paused){acc+=dt;var n=0;while(acc>=STEP&&n<6){acc-=STEP;n++;G.t+=STEP;
      runEvents();if(window.__BOT&&G.mode==='fight')window.__BOT(G);if(G.mode==='fight')stepPlayer(G.player,STEP);
      G.fighters.forEach(function(f){if(!isP(f)&&G.mode==='fight')stepAI(f,STEP);stepFighter(f,STEP)});separate()}
    checkRound()}
  else if(G.menuF){menuAnim(rdt)}
  G.fighters.forEach(function(f){visual(f,dt,rdt)});
  if((G.shTick=(G.shTick||0)+1)%12===0)tierShadows();
  FX.update(dt);FX.update2(dt);updShocks(dt);updateCamera(G.paused?0:rdt);if(G.mode!=='menu')hud();if(AU.update)AU.update(rdt);if(window.UI&&UI.frame)UI.frame(rdt)});
var SIMTEST=/sim/.test(location.hash);
engine.runRenderLoop(function(){if(SIMTEST){if(window.__PAUSE){if(window.__RENDER){window.__RENDER=0;scene.render()}return}for(var i=0;i<6;i++)scene.onBeforeRenderObservable.notifyObservers(scene)}else scene.render()});
window.addEventListener('resize',function(){engine.resize()});

/* ---------- menu showcase ---------- */
var MENU_SEQ=[{at:0,c:'idle'},{at:2.6,c:'salute'},{at:4.2,c:'c1'},{at:4.9,c:'c2'},{at:5.6,c:'c3'},{at:6.6,c:'block'},{at:8.0,c:'parry'},{at:8.6,c:'idle'}];
function menuAnim(rdt){var f=G.menuF;G.menuClock=(G.menuClock||0)+rdt;var t=G.menuClock%10;var stage=null;for(var i=MENU_SEQ.length-1;i>=0;i--)if(t>=MENU_SEQ[i].at){stage=MENU_SEQ[i];break}
  if(stage!==G.menuStage){G.menuStage=stage;f.blocking=false;
    if(stage.c==='salute')playClip(f,[{t:.5,p:PO.salute,e:'io'},{t:1.4,p:PO.salute,e:'lin'}],true);
    else if(stage.c==='c1'||stage.c==='c2'||stage.c==='c3'){var KK=kitOf(f),a=KK.M[KK.seq[+stage.c[1]-1]];actionClip(f,Object.assign({},a,{wind:a.wind*1.6,rec:a.rec*.8}));f.trail.on=1;setTimeout(function(){f.trail.on=0},450);AU.play('whoosh',.5)}
    else if(stage.c==='block'){f.clip=null;f.blocking=true}
    else if(stage.c==='parry'){playClip(f,[{t:.07,p:PO.parry,e:'snap'},{t:.45,p:PO.block,e:'io'}]);FX.clash(new V3(.3,1.45,.6),true);AU.play('clang')}
    else f.clip=null}}
function curPieces(){return G.bmode==='battle'?BPIECES:PIECES}
function showChampion(k){if(curPieces().indexOf(k)<0&&ARMY.sun[k])k=curPieces()[0];if(ARMY.sun[k]){G.piece=k;k=ARMY[G.army][k]}G.sel=k;if(G.menuF){killFighterVisual(G.menuF);G.fighters=G.fighters.filter(function(x){return x!==G.menuF})}
  var f=makeFighter(k,0,{x:0,z:0,face:0,dark:G.army==='ecl'});G.menuF=f;G.menuStage=null;G.menuClock=0;if(window.UI)UI.onPiece(k)}
function setArmy(a){G.army=a;document.body.dataset.army=a;FIELD.setSides(a==='sun',a!=='sun');if(G.mode==='menu'&&!G.titleUp)showChampion(G.piece);if(window.UI)UI.onArmy(a)}
function setMode(m){G.bmode=m;if(G.mode==='menu'&&!G.titleUp)showChampion(G.piece);if(window.UI)UI.onMode(m)}
function clearScene(){G.fighters.forEach(killFighterVisual);G.fighters=[];G.menuF=null;FX.pools.forEach(function(p){p.m.dispose()});FX.pools.length=0;SHOCKS.forEach(function(S){S.m.dispose()});SHOCKS.length=0}
function beginFight(){AU.init();G.titleUp=false;clearScene();
  G.seed=777;G.round=0;G.kills=0;G.t=0;G.hits=[];G.breathUntil=0;G.roundEnding=false;G.cw=null;G.impactLog=[];G.events=[];G.combo=0;G.bestCombo=0;G.comboT=0;G.align=null;G.cine=null;G.autoCounter=null;G.camYaw=undefined;G.used=0;G.paused=false;G.takeover=false;G.hintN=SET.hints?0:3;
  for(var k in ST)delete ST[k];
  G.battle=G.bmode==='battle';G.decided=false;G.endMsg=null;G.holdUntil=0;G.hudN=0;G.assist=SET.assist;
  if(G.battle){startBattle();var p=G.player;G.yaw=0;G.camT=p.pos.add(new V3(0,1.4,0))}
  else{var p=makeFighter(G.sel,0,{x:0,z:3,face:Math.PI,name:CLS[G.sel].name,dark:G.army==='ecl'});G.player=p;G.yaw=Math.PI;G.camT=new V3(0,1.35,3);FIELD.setSides(G.army==='sun',foeArmy()==='sun')}
  G.mode='fight';if(window.UI)UI.onFight();
  if(G.battle){G.round=3;G.holdUntil=G.t+3.2;toast('The board is set','Sixteen against sixteen. One king falls.',2600);if(AU.music)AU.music.set(0);
    at(3.2,function(){toast('Charge!','',1200);if(AU.charge)AU.charge();else AU.play('roar',1.4);G.shake=.3})}
  else startRound();tagMatch()}
var SLOT={sipahi:4,ashva:6,ushtra:5,gaja:7,rani:3,raja:4};
function tagMatch(){var p=G.player;if(!p)return;G.fighters.forEach(function(f){if(f.tag&&f.team!==p.team){var m=mu(p,f);f.tag.firstChild.textContent=f.name+' · '+ARCHNAME[f.arch]+(m>1?' \u25B2':m<1?' \u25BC':'')}})}
function startBattle(){var X=[-10.5,-7.5,-4.5,-1.5,1.5,4.5,7.5,10.5],back=['gaja','ashva','ushtra','rani','raja','ushtra','ashva','gaja'];
  [0,1].forEach(function(team){var army=team===0?G.army:foeArmy(),A=ARMY[army],dk=army==='ecl',zb=team===0?-10.5:10.5,zp=team===0?-7.5:7.5,face=team===0?0:Math.PI;
    function spawn(pc,i,z){var kind=A[pc];var me=team===0&&pc===G.piece&&SLOT[pc]===i&&(pc!=='sipahi'?true:z===zp);
      if(me){var p=makeFighter(kind,0,{x:X[i],z:z,face:face,name:CLS[kind].name,dark:dk,ai:false,king:pc==='raja'});G.player=p;G.sel=kind;return}
      var o={x:X[i],z:z,face:face,dark:dk,ai:true,name:A.name+' '+PNAME[pc],moves:AIMOVES[pc]};if(team===1)o.hpMul=TUNE.foeHp;if(pc==='sipahi')o.arch=i%2?'spear':'shield';
      if(pc==='raja'){o.champion=true;o.boss=true;o.zone=true;o.scale=1.18;o.king=true;o.hpMul=1.5*(o.hpMul||1)}
      var f=makeFighter(kind,team,o);if(pc==='raja')f.home={x:X[i],z:z}}
    back.forEach(function(pc,i){if(pc==='raja'&&team===0&&G.piece==='raja'){spawn(pc,i,zb);return}spawn(pc,i,zb)});
    for(var i=0;i<8;i++)spawn('sipahi',i,zp)});
  board.setEnabled(true);FIELD.setSides(G.army==='sun',foeArmy()==='sun')}
/* chessboard laid on the sand */
var board=(function(){var t=dynTex('board',1024,function(g,s){var c=s/8;for(var y=0;y<8;y++)for(var x=0;x<8;x++){g.fillStyle=(x+y)%2?'#7a5a3a':'#d8bf94';g.fillRect(x*c,y*c,c,c)}
    for(var i=0;i<9000;i++){g.fillStyle='rgba(40,20,5,'+(hash(i,31)*.12)+')';g.fillRect(hash(i,32)*s,hash(i,33)*s,2+hash(i,34)*5,2+hash(i,35)*5)}
    g.strokeStyle='#3a2410';g.lineWidth=10;g.strokeRect(5,5,s-10,s-10)});
  var m=pbr('boardM','#ffffff',0,.85,{noEnv:1,albedo:t,bump:bumpClone(NM.sand,4,.4)});m.alpha=.62;m.transparencyMode=2;
  var b=BABYLON.MeshBuilder.CreateGround('board',{width:24,height:24},scene);b.position.y=.012;b.material=m;b.receiveShadows=true;b.isPickable=false;return b})();
/* ---------- input wiring ---------- */
var TOUCH=window.matchMedia&&matchMedia('(pointer:coarse)').matches;
window.addEventListener('keydown',function(e){if(e.repeat)return;keys[e.code]=true;
  if(G.mode==='fight'&&(e.code==='Escape'||e.code==='KeyP')){if(window.UI)UI.togglePause();return}
  if(G.mode!=='fight'||G.paused)return;if(e.code==='KeyJ')pressAttack();else if(e.code==='KeyK')pressBlock();
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code)>=0)e.preventDefault()});
window.addEventListener('keyup',function(e){keys[e.code]=false;if(e.code==='KeyJ')releaseAttack();else if(e.code==='KeyK')releaseBlock()});
window.addEventListener('blur',function(){keys={};if(IN.atkDown)releaseAttack();if(IN.blkDown)releaseBlock()});
canvas.addEventListener('contextmenu',function(e){e.preventDefault()});
var drag=null;
canvas.addEventListener('pointerdown',function(e){AU.init();
  if(G.mode==='fight'&&!G.paused&&e.pointerType==='mouse'){if(!G.locked&&canvas.requestPointerLock){try{var r=canvas.requestPointerLock();if(r&&r.catch)r.catch(function(){})}catch(x){}}
    if(e.button===0)pressAttack();else if(e.button===2)pressBlock();return}
  drag={x:e.clientX,y:e.clientY,id:e.pointerId}});
canvas.addEventListener('pointerup',function(e){if(G.mode==='fight'&&e.pointerType==='mouse'){if(e.button===0)releaseAttack();else if(e.button===2)releaseBlock()}
  if(drag&&G.mode==='menu'&&!G.titleUp&&Math.abs(drag.tot||0)>80&&window.UI){UI.step((drag.tot||0)<0?1:-1)}drag=null});
canvas.addEventListener('pointermove',function(e){
  if(G.mode==='fight'&&G.locked){G.yaw+=e.movementX*.0032*SET.sens;G.pitch=clamp(G.pitch-e.movementY*.0022*SET.sens,.85,1.5);G.lastCamInput=G.real;return}
  if(drag&&e.pointerId===drag.id){var dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;
    if(drag.pinch)return;if(G.mode==='menu'){G.dragYaw=(G.dragYaw||0)+dx*.008;drag.tot=(drag.tot||0)+dx}else{G.yaw+=dx*.006*SET.sens;G.pitch=clamp(G.pitch-dy*.004*SET.sens,.85,1.5);G.lastCamInput=G.real}}});
/* zoom: wheel and pinch */
canvas.addEventListener('wheel',function(e){if(G.mode!=='fight')return;e.preventDefault();SET.zoom=clamp(SET.zoom+(e.deltaY>0?.06:-.06),0,1);saveSet();if(window.UI)UI.syncSettings()},{passive:false});
(function(){var pts={},d0=0,z0=0;canvas.addEventListener('pointerdown',function(e){if(e.pointerType!=='touch')return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(pts);if(k.length===2){var a=pts[k[0]],b=pts[k[1]];d0=Math.hypot(a.x-b.x,a.y-b.y);z0=SET.zoom;if(drag)drag.pinch=1}});
  canvas.addEventListener('pointermove',function(e){if(!pts[e.pointerId])return;pts[e.pointerId]={x:e.clientX,y:e.clientY};var k=Object.keys(pts);if(k.length===2&&d0>0){var a=pts[k[0]],b=pts[k[1]],d=Math.hypot(a.x-b.x,a.y-b.y);SET.zoom=clamp(z0-(d-d0)/300,0,1)}});
  function up(e){if(pts[e.pointerId]){delete pts[e.pointerId];if(Object.keys(pts).length<2&&d0){d0=0;saveSet();if(window.UI)UI.syncSettings()}}}canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up)})();
document.addEventListener('pointerlockchange',function(){G.locked=document.pointerLockElement===canvas});
setInterval(function(){if(G.mode==='fight'){if(keys.KeyQ){G.yaw-=.045;G.lastCamInput=G.real}if(keys.KeyE){G.yaw+=.045;G.lastCamInput=G.real}}},16);
(function(){var j=document.getElementById('joy'),kn=document.getElementById('knob'),pid=null;
  function mv(e){var r=j.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,l=Math.hypot(dx,dy),m=46;if(l>m){dx*=m/l;dy*=m/l}kn.style.left=(38+dx)+'px';kn.style.top=(38+dy)+'px';joy.x=dx/m;joy.y=-dy/m}
  function rs(){pid=null;joy.x=joy.y=0;kn.style.left=kn.style.top='38px'}
  j.addEventListener('pointerdown',function(e){e.preventDefault();pid=e.pointerId;try{j.setPointerCapture(pid)}catch(x){}mv(e)});j.addEventListener('pointermove',function(e){if(e.pointerId===pid)mv(e)});j.addEventListener('pointerup',rs);j.addEventListener('pointercancel',rs);
  function tb(id,dn,up){var el=document.getElementById(id);el.addEventListener('pointerdown',function(e){e.preventDefault();el.classList.add('dn');dn()});['pointerup','pointercancel','pointerleave'].forEach(function(n){el.addEventListener(n,function(){if(el.classList.contains('dn')){el.classList.remove('dn');up()}})})}
  tb('tA',pressAttack,releaseAttack);tb('tB',pressBlock,releaseBlock)})();
window.__G=G;window.__SET=SET;window.__ST=ST;window.__TUNE=TUNE;window.__IN={takeControl:function(f){takeControl(f)},setArmy:setArmy,setMode:setMode,pressAttack:pressAttack,releaseAttack:releaseAttack,pressBlock:pressBlock,releaseBlock:releaseBlock,begin:beginFight,show:showChampion,keys:keys,joy:joy,FX:FX};
