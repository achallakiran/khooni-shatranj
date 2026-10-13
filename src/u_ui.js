/* ================= Khooni Shatranj: screens, settings, title ================= */
var UI=(function(){
  function $(id){return document.getElementById(id)}
  var scr={title:$('title'),home:$('home'),settings:$('settings'),howto:$('howto'),pause:$('pause'),end:$('end'),hud:$('hud'),touch:$('touch')};
  var TOUCHDEV=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
  function show(el,on){el.hidden=!on}
  /* ---------- settings apply ---------- */
  function applySettings(){G.assist=SET.assist;FX.gore=SET.blood;
    var q=SET.quality;try{engine.setHardwareScalingLevel(FAST?5:(q==='low'?1.6:q==='med'?1.2:1)/(q==='high'?Math.min(window.devicePixelRatio||1,1.5):1))}catch(e){}
    if(typeof pipe!=='undefined'&&pipe&&!FAST&&!pipe._disposed){try{pipe.bloomEnabled=q!=='low';pipe.chromaticAberrationEnabled=q==='high';pipe.grainEnabled=q==='high';pipe.sharpenEnabled=q!=='low'}catch(e){}}
    if(typeof vls!=='undefined'&&vls){try{vls.isEnabled=q==='high'}catch(e){}}
    try{sg.getShadowMap().refreshRate=q==='low'?0:1}catch(e){}
    if(AU.setVol)AU.setVol(SET.sfx,SET.voice,SET.music)}
  function syncSettings(){
    $('sZoom').value=Math.round(SET.zoom*100);$('sSens').value=Math.round(SET.sens*100);$('sMusic').value=Math.round(SET.music*100);$('sSfx').value=Math.round(SET.sfx*100);$('sVoice').value=Math.round(SET.voice*100);
    $('sAssist').classList.toggle('on',SET.assist);$('sHints').classList.toggle('on',SET.hints);$('sShake').classList.toggle('on',SET.shake);
    [].forEach.call($('sBlood').children,function(b){b.classList.toggle('on',b.dataset.v===SET.blood)});[].forEach.call($('sQual').children,function(b){b.classList.toggle('on',b.dataset.v===SET.quality)})}
  function bindSettings(){
    function rng(id,key,k){$(id).addEventListener('input',function(e){SET[key]=+e.target.value/k;saveSet();applySettings()})}
    rng('sZoom','zoom',100);rng('sSens','sens',100);rng('sMusic','music',100);rng('sSfx','sfx',100);rng('sVoice','voice',100);
    function tog(id,key){$(id).addEventListener('click',function(){SET[key]=!SET[key];saveSet();syncSettings();applySettings()})}
    tog('sAssist','assist');tog('sHints','hints');tog('sShake','shake');
    function seg(id,key){[].forEach.call($(id).children,function(b){b.addEventListener('click',function(){SET[key]=b.dataset.v;saveSet();syncSettings();applySettings()})})}
    seg('sBlood','blood');seg('sQual','quality');
    $('setClose').addEventListener('click',function(){show(scr.settings,false)})}
  /* ---------- how to play ---------- */
  var ill={
    parry:'<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="40" fill="none" stroke="#f2cf7a55"/><path d="M60 18l6 36 36 6-36 6-6 36-6-36-36-6 36-6z" fill="#f4f1e8"/><circle cx="26" cy="100" r="7" fill="#f4f1e8"/><circle cx="60" cy="100" r="7" fill="#4da3ff"/><circle cx="94" cy="100" r="7" fill="#ff2d3a"/></svg>',
    strike:'<svg viewBox="0 0 120 120"><path d="M20 96 92 24" stroke="#f4f1e8" stroke-width="6"/><path d="M84 18l18 0 0 18" fill="none" stroke="#f2cf7a" stroke-width="4"/><path d="M26 64q20 30 52 28" fill="none" stroke="#ff9a6a" stroke-width="3" stroke-dasharray="5 5"/></svg>',
    guard:'<svg viewBox="0 0 120 120"><rect x="16" y="48" width="88" height="14" fill="none" stroke="#f2cf7a"/><rect x="18" y="50" width="84" height="10" fill="#ff5a3a"/><path d="M60 72l-12 24h24z" fill="#f4f1e8"/><text x="60" y="34" text-anchor="middle" font-family="Cinzel" font-size="12" fill="#f2cf7a">BROKEN</text></svg>',
    counter:'<svg viewBox="0 0 120 120"><ellipse cx="60" cy="88" rx="38" ry="10" fill="none" stroke="#f2cf7a" stroke-width="4"/><path d="M60 20v52" stroke="#f4f1e8" stroke-width="6"/><path d="M44 44h32" stroke="#f2cf7a" stroke-width="4"/></svg>',
    resolve:'<svg viewBox="0 0 120 120"><g fill="#f2cf7a"><rect x="22" y="52" width="16" height="16" transform="rotate(45 30 60)"/><rect x="52" y="52" width="16" height="16" transform="rotate(45 60 60)"/><rect x="82" y="52" width="16" height="16" transform="rotate(45 90 60)"/></g><circle cx="60" cy="60" r="48" fill="none" stroke="#f2cf7a55"/></svg>',
    keys:'<svg viewBox="0 0 120 120"><g fill="none" stroke="#f2cf7a"><rect x="38" y="20" width="20" height="20"/><rect x="14" y="44" width="20" height="20"/><rect x="38" y="44" width="20" height="20"/><rect x="62" y="44" width="20" height="20"/><rect x="74" y="78" width="20" height="20"/><rect x="98" y="78" width="20" height="20"/></g><g font-family="Cinzel" font-size="11" fill="#f4f1e8" text-anchor="middle"><text x="48" y="34">W</text><text x="24" y="58">A</text><text x="48" y="58">S</text><text x="72" y="58">D</text><text x="84" y="92">J</text><text x="108" y="92">K</text></g></svg>'};
  var CARDS=[
    {i:'parry',t:'Block and parry',p:'Hold <kbd>Block</kbd> to guard. Tap it just as the blade flashes to parry. White: block or parry. Blue: parry only. Red: get out of the ring.'},
    {i:'strike',t:'Strike and heavy',p:'Tap <kbd>Strike</kbd> for quick cuts that chain into a finisher. Hold <kbd>Strike</kbd> for a heavy blow. From a distance, strike to leap or charge in.'},
    {i:'guard',t:'Break the guard',p:'Shields stop light cuts. Heavies, finishers and bashes fill the enemy\'s posture bar. When it fills he is Guard Broken: no defence, extra damage.'},
    {i:'counter',t:'Counter',p:'After a parry time slows. Press <kbd>Strike</kbd> to counter, hold it to execute. A last-instant parry gives you a longer window.'},
    {i:'resolve',t:'Resolve',p:'Parries and kills fill three diamonds. Hold <kbd>Strike</kbd> and <kbd>Block</kbd> together: below three you heal, at three you unleash your piece\'s technique.'},
    {i:'keys',t:'Keyboard and mouse',p:'Move <kbd>WASD</kbd> · Strike <kbd>J</kbd> or left click · Block <kbd>K</kbd> or right click · Camera mouse or <kbd>Q</kbd> <kbd>E</kbd> · Zoom wheel · Pause <kbd>Esc</kbd>'}];
  var hi=0;
  function renderHow(){var c=CARDS[hi];$('hcard').innerHTML='<div class="card">'+ill[c.i]+'<div><h5>'+c.t+'</h5><p>'+c.p+'</p></div></div>';
    $('hdots').innerHTML=CARDS.map(function(_,i){return '<b class="'+(i===hi?'on':'')+'"></b>'}).join('');$('hPrev').disabled=hi===0;$('hNext').textContent=hi===CARDS.length-1?'Done':'Next'}
  function openHow(){hi=0;renderHow();show(scr.howto,true)}
  $('hPrev').addEventListener('click',function(){if(hi>0){hi--;renderHow()}});
  $('hNext').addEventListener('click',function(){if(hi<CARDS.length-1){hi++;renderHow()}else{show(scr.howto,false);SET.seenHowto=true;saveSet();if(UI._afterHow){var f=UI._afterHow;UI._afterHow=null;f()}}});
  $('howClose').addEventListener('click',function(){show(scr.howto,false);SET.seenHowto=true;saveSet();if(UI._afterHow){var f=UI._afterHow;UI._afterHow=null;f()}});
  /* ---------- title tableau ---------- */
  var tableau=[];
  function buildTitle(){G.titleUp=true;G.mode='menu';clearScene();
    var L=[['rajaSun',-2.6,-3.2,0,false,1.12],['ashvaSun',-6.5,-5,0,false,1],['sipahiSun',-1,-6.2,0,false,1],['sipahiSun',1.5,-6.4,0,false,1],
      ['rajaEcl',2.6,3.2,Math.PI,true,1.12],['ashvaEcl',6.5,5,Math.PI,true,1],['sipahi',1,6.2,Math.PI,true,1],['sipahi',-1.5,6.4,Math.PI,true,1]];
    L.forEach(function(l){var f=makeFighter(l[0],l[4]?1:0,{x:l[1],z:l[2],face:l[3],dark:l[4],scale:l[5]});if(f.tag){f.tag.remove();f.tag=null}tableau.push(f)});FIELD.setSides(true,false)}
  var tclock=0;
  function frame(rdt){
    if(G.titleUp){tclock+=rdt;var a=tclock*.06;cam.target=new V3(0,1.6,0);cam.alpha=Math.PI*.9+Math.sin(a)*.5;cam.beta=1.28;cam.radius=17}
    if(G.mode==='fight'&&SET.hints===false)G.hintN=3}
  /* ---------- home ---------- */
  function pieceStats(k){var C=CLS[k];var K=KIT[C.kit||(GEARW[C.rider||k])||'sword']||KIT.sword;var r=K.M[K.seq[0]].reach;
    return {v:C.hp/320,p:C.post/220,s:C.spd/1.5,r:r/3.2}}
  var GEARW={sipahi:'spear',sipahiSun:'spear',raniSun:'twin',raniEcl:'twin',rajaSun:'mace',rajaEcl:'mace'};
  function onPiece(k){var C=CLS[k];$('prole').textContent=(C.role||'Champion')+' · '+ARMY[G.army].name;$('ptitle').textContent=C.name;
    var s=pieceStats(k);[['sv',s.v],['sp',s.p],['ss',s.s],['sr',s.r]].forEach(function(x){$(x[0]).style.transform='scaleX('+clamp(x[1],.08,1)+')'});
    $('ptech').innerHTML=C.tech?'Technique: <em>'+TECHNAME[C.tech]+'</em>':'<em>No technique</em> · Mend only';
    var d=document.createElement('div');d.innerHTML=C.desc||'';$('pdesc').textContent=d.textContent.replace(/Resolve technique:.*$/,'');
    var L=curPieces();$('dots').innerHTML=L.map(function(p){return '<b class="'+(p===G.piece?'on':'')+'"></b>'}).join('')}
  function step(dir){var L=curPieces();var i=L.indexOf(G.piece);i=(i+dir+L.length)%L.length;AU.init();showChampion(L[i])}
  function onArmy(a){[].forEach.call($('army').children,function(b){b.classList.toggle('on',b.dataset.a===a)})}
  function onMode(m){[].forEach.call($('bmode').children,function(b){b.classList.toggle('on',b.dataset.m===m)})}
  function goHome(){G.titleUp=false;tableau=[];G.paused=false;G.battle=false;G.player=null;G.mode='menu';clearScene();
    show(scr.title,false);show(scr.hud,false);show(scr.touch,false);show(scr.pause,false);show(scr.end,false);show(scr.home,true);
    onArmy(G.army);onMode(G.bmode);showChampion(G.piece);if(AU.music)AU.music.set(0)}
  $('prevP').addEventListener('click',function(){step(-1)});$('nextP').addEventListener('click',function(){step(1)});
  [].forEach.call($('army').children,function(b){b.addEventListener('click',function(){AU.init();setArmy(b.dataset.a)})});
  [].forEach.call($('bmode').children,function(b){b.addEventListener('click',function(){AU.init();setMode(b.dataset.m)})});
  $('gearBtn').addEventListener('click',function(){syncSettings();show(scr.settings,true)});
  $('helpBtn').addEventListener('click',openHow);
  $('go').addEventListener('click',function(){AU.init();if(!SET.seenHowto){UI._afterHow=startFight;openHow();return}startFight()});
  function startFight(){show(scr.home,false);show(scr.settings,false);beginFight()}
  /* ---------- fight / pause / result ---------- */
  function onFight(){show(scr.title,false);show(scr.home,false);show(scr.hud,true);show(scr.end,false);show(scr.pause,false);show(scr.touch,TOUCHDEV);setName();if(AU.music)AU.music.set(G.battle?0:1)}
  function setName(){var p=G.player;if(!p)return;var C=CLS[p.kindId];$('pname').textContent=C.name+(C.tech?' · '+TECHNAME[C.tech]:'')}
  function onTakeover(f){setName()}
  function togglePause(force){if(G.mode!=='fight')return;G.paused=force!==undefined?force:!G.paused;show(scr.pause,G.paused);if(!G.paused){show(scr.settings,false);show(scr.howto,false)}
    if(G.paused){try{document.exitPointerLock()}catch(e){}if(IN.atkDown)releaseAttack();if(IN.blkDown)releaseBlock()}if(AU.duck)AU.duck(G.paused)}
  $('pauseBtn').addEventListener('click',function(){togglePause(true)});
  $('pResume').addEventListener('click',function(){togglePause(false)});
  $('pSet').addEventListener('click',function(){syncSettings();show(scr.settings,true)});
  $('pHow').addEventListener('click',openHow);
  $('pQuit').addEventListener('click',function(){togglePause(false);goHome()});
  function showResult(won){var t=$('et');t.textContent=won?(G.battle?'Shah Mat':'Victory'):(G.battle&&G.endWhy==='raja'?'Shah Mat':'Defeat');t.className='cz'+(won?'':' lose');
    $('es').textContent=won?(G.endMsg||'Victory.'):(G.endMsg||'You have fallen.');
    var S=window.__ST||{};var st=[['Kills',G.kills],['Perfect parries',S.pParryPerfect||0],['Guard breaks',S.pBrokeGuard||0],['Best combo',G.bestCombo],[G.battle?'Warriors used':'Round',G.battle?(G.used||0)+1:G.round]];
    $('estats').innerHTML=st.map(function(x){return '<div><b>'+x[1]+'</b><span>'+x[0]+'</span></div>'}).join('');
    setTimeout(function(){show(scr.end,true);show(scr.touch,false)},400)}
  $('again').addEventListener('click',function(){show(scr.end,false);beginFight()});
  $('change').addEventListener('click',goHome);
  /* ---------- title tap ---------- */
  scr.title.addEventListener('click',function(){AU.init();if(AU.music)AU.music.start();goHome()});
  /* ---------- init ---------- */
  bindSettings();syncSettings();applySettings();
  var api={onPiece:onPiece,onArmy:onArmy,onMode:onMode,onFight:onFight,onTakeover:onTakeover,showResult:showResult,togglePause:togglePause,syncSettings:syncSettings,step:step,frame:frame,goHome:goHome,applySettings:applySettings};
  setTimeout(function(){G.army='sun';G.bmode='battle';G.piece='sipahi';buildTitle()},0);
  return api})();
