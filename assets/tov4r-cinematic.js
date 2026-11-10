/* TOV4R CINEMATIC EXPERIENCE v2 — lightweight, progressively-enhanced motion. */
(function(){
'use strict';
var body=document.body;
if(!body)return;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
if(reduce&&reduce.matches)return;
var hero=document.querySelector('main .hero');
var page=(location.pathname.indexOf('/downloads')===0?'downloads':location.pathname.indexOf('studio')!==-1?'studio':'home');
var isPrivacy=location.pathname.indexOf('privacy')!==-1;
var fine=!!(window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches);
function el(tag,className,parent){var e=document.createElement(tag);if(className)e.className=className;if(parent)parent.appendChild(e);return e;}
function txt(tag,className,content,parent){var e=el(tag,className,parent);e.textContent=content;return e;}
function initIntro(){
 if(isPrivacy)return;
 var already=false;
 try{already=sessionStorage.getItem('tov4r-cinematic-intro-v2')==='yes';sessionStorage.setItem('tov4r-cinematic-intro-v2','yes');}catch(e){}
 if(already)return;
 body.classList.add('tov-cine-active');
 var stage=el('div','tov-cine-stage',body);
 stage.setAttribute('aria-label','Introduction TOV4R');
 var panel=el('div','tov-cine-intro-panel',stage);
 txt('div','tov-cine-intro-kicker','WELCOME TO THE NEXT LEVEL',panel);
 var title=el('h2','tov-cine-intro-title',panel);
 title.appendChild(document.createTextNode('TOV'));
 txt('span','', '4',title);
 title.appendChild(document.createTextNode('R'));
 txt('p','tov-cine-intro-tagline',page==='downloads'?'DISCOVER · DOWNLOAD · PLAY':'GAMING · CLIPS · COMMUNITY',panel);
 var loading=el('div','tov-cine-intro-progress',panel);
 loading.setAttribute('aria-hidden','true');
 el('i','',loading);
 var skip=txt('button','tov-cine-skip','SKIP INTRO ↗',panel);
 skip.type='button';
 var finished=false;
 function close(){
  if(finished)return;
  finished=true;
  stage.classList.add('tov-cine-leaving');
  body.classList.remove('tov-cine-active');
  setTimeout(function(){stage.remove()},650);
 }
 var timeout=setTimeout(close,2250);
 skip.addEventListener('click',function(){clearTimeout(timeout);close()});
 addEventListener('pagehide',function(){clearTimeout(timeout);stage.remove();body.classList.remove('tov-cine-active')},{once:true});
}
initIntro();
if(hero&&!isPrivacy){
 hero.classList.add('tov-cine-hero');
 el('div','tov-cine-aurora',hero).setAttribute('aria-hidden','true');
 var existingTicker=hero.nextElementSibling&&hero.nextElementSibling.matches('.mq,.ticker');
 if(!existingTicker&&hero.parentNode){
  var rail=el('div','tov-cine-marquee');
  rail.setAttribute('aria-hidden','true');
  var track=el('div','tov-cine-marquee-track',rail);
  for(var repeat=0;repeat<2;repeat++){
   var copy=el('div','tov-cine-marquee-copy',track);
   ['TOV4R','✦','COUNTER-STRIKE 2','✦','HIGHLIGHTS','✦','COMMUNITY','✦','LEVEL UP','✦'].forEach(function(word){
    txt(word==='✦'?'b':'span','',word,copy);
   });
  }
  hero.parentNode.insertBefore(rail,hero.nextSibling);
 }
 // Particles are capped and painted only while hero is visible; no heavy WebGL libraries.
 if(window.HTMLCanvasElement&&innerWidth>760){
  var canvas=el('canvas','tov-cine-particles',hero);
  canvas.setAttribute('aria-hidden','true');
  var ctx=canvas.getContext('2d',{alpha:true});
  if(ctx){
   var w=0,h=0,particles=[],active=true,frame=0,last=0;
   function resize(){
    var rect=hero.getBoundingClientRect();
    w=Math.max(1,Math.floor(rect.width));
    h=Math.max(1,Math.floor(rect.height));
    var dpr=Math.min(1.5,devicePixelRatio||1);
    canvas.width=Math.floor(w*dpr);
    canvas.height=Math.floor(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    particles=Array.from({length:Math.min(36,Math.max(17,Math.floor(w/30)))},function(){
     return {x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.4,
      vy:-.15-Math.random()*.28,vx:(Math.random()-.5)*.25,a:.15+Math.random()*.5};
    });
   }
   resize();
   addEventListener('resize',resize,{passive:true});
   if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);
   var io='IntersectionObserver' in window?new IntersectionObserver(function(entries){active=entries[0].isIntersecting;if(active&&!frame&&!document.hidden)frame=requestAnimationFrame(draw)},{threshold:0}):null;
   if(io)io.observe(hero);
   function draw(now){
    frame=0;
    if(document.hidden||!active)return;
    if(now-last<33){frame=requestAnimationFrame(draw);return;}
    last=now;
    ctx.clearRect(0,0,w,h);
    for(var i=0;i<particles.length;i++){
     var p=particles[i];p.y+=p.vy;p.x+=p.vx;
     if(p.y<0){p.y=h;p.x=Math.random()*w;}
     if(p.x<0)p.x=w;if(p.x>w)p.x=0;
     ctx.fillStyle='rgba(255,75,110,'+p.a.toFixed(2)+')';
     ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
     if(i%6===0){ctx.strokeStyle='rgba(255,82,117,'+(p.a*.45).toFixed(2)+')';ctx.beginPath();ctx.moveTo(p.x,p.y+4);ctx.lineTo(p.x-4,p.y+13);ctx.stroke();}
    }
    frame=requestAnimationFrame(draw);
   }
   frame=requestAnimationFrame(draw);
   document.addEventListener('visibilitychange',function(){if(!document.hidden&&!frame&&active)frame=requestAnimationFrame(draw)});
  }else canvas.remove();
 }
 if(fine){
  hero.addEventListener('pointermove',function(e){
   var b=hero.getBoundingClientRect();if(!b.width||!b.height)return;
   hero.style.setProperty('--cine-mouse-x',((e.clientX-b.left)/b.width*100).toFixed(1)+'%');
   hero.style.setProperty('--cine-mouse-y',((e.clientY-b.top)/b.height*100).toFixed(1)+'%');
  },{passive:true});
 }
}
if('IntersectionObserver' in window){
 var ioSections=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('tov-cine-seen');ioSections.unobserve(e.target);}});
 },{rootMargin:'0px 0px -17% 0px',threshold:0.03});
 document.querySelectorAll('main section:not(.hero)').forEach(function(section){
  section.classList.add('tov-cine-section');
  var trace=el('span','tov-cine-trace',section);
  trace.setAttribute('aria-hidden','true');
  ioSections.observe(section);
 });
}
if(fine){
 // Subtle cursor halo; never hides the native cursor.
 var cursor=el('div','tov-cine-cursor',body);
 cursor.setAttribute('aria-hidden','true');
 var mx=-100,my=-100,cx=-100,cy=-100,moving=false,raf=0;
 function tick(){
  raf=0;
  if(document.hidden||!moving)return;
  cx+=(mx-cx)*.21;cy+=(my-cy)*.21;
  cursor.style.transform='translate3d('+cx+'px,'+cy+'px,0) translate(-50%,-50%)';
  if(Math.abs(mx-cx)+Math.abs(my-cy)>.18)raf=requestAnimationFrame(tick);
 }
 document.addEventListener('pointermove',function(e){
  if(e.pointerType&&e.pointerType!=='mouse')return;
  mx=e.clientX;my=e.clientY;moving=true;
  cursor.classList.add('on');
  var target=e.target;
  cursor.classList.toggle('hot',target instanceof Element&&!!target.closest('a,button,[role="button"],input,select,textarea'));
  if(!raf)raf=requestAnimationFrame(tick);
 },{passive:true});
 document.addEventListener('pointerout',function(e){if(!e.relatedTarget)cursor.classList.remove('on')},{passive:true});
 document.addEventListener('visibilitychange',function(){if(document.hidden){cursor.classList.remove('on');moving=false;}else moving=true});
 var selectors='.game-card,.clip-card,.contact-card,.tov-game-card,.tov-visual-card,.tov-clip-card,.tov-v5-setup-tile,.games .game,.link-card';
 var card=null,pending=false,px=0,py=0;
 document.addEventListener('pointermove',function(e){
  var node=e.target instanceof Element?e.target.closest(selectors):null;
  if(!node)return;
  card=node;px=e.clientX;py=e.clientY;
  if(pending)return;
  pending=true;
  requestAnimationFrame(function(){
   pending=false;if(!card||!card.isConnected)return;
   var rect=card.getBoundingClientRect();if(!rect.width||!rect.height)return;
   var x=Math.max(-1,Math.min(1,((px-rect.left)/rect.width-.5)*2));
   var y=Math.max(-1,Math.min(1,((py-rect.top)/rect.height-.5)*2));
   card.style.setProperty('--cine-rx',(-y*3.6).toFixed(2)+'deg');
   card.style.setProperty('--cine-ry',(x*3.6).toFixed(2)+'deg');
   card.classList.add('tov-cine-tilt');
  });
 },{passive:true});
 document.addEventListener('pointerout',function(e){
  if(!(e.target instanceof Element))return;
  var c=e.target.closest(selectors);
  if(c&&!c.contains(e.relatedTarget)){
   c.style.setProperty('--cine-rx','0deg');c.style.setProperty('--cine-ry','0deg');
  }
 },{passive:true});
 var magnets='.hero .btn,.hero .primary,.hero .secondary,.cta .btn,.tov-v5-btn,.hero-actions a';
 document.querySelectorAll(magnets).forEach(function(btn){
  if(!(btn instanceof HTMLElement))return;
  btn.classList.add('tov-cine-magnet');
  var sheen=el('span','tov-cine-sheen',btn);
  sheen.setAttribute('aria-hidden','true');
  btn.addEventListener('pointermove',function(e){
   var box=btn.getBoundingClientRect();
   var x=((e.clientX-box.left)/box.width-.5)*9;
   var y=((e.clientY-box.top)/box.height-.5)*7;
   btn.style.setProperty('--cine-btn-x',x.toFixed(1)+'px');
   btn.style.setProperty('--cine-btn-y',y.toFixed(1)+'px');
  },{passive:true});
  btn.addEventListener('pointerleave',function(){btn.style.setProperty('--cine-btn-x','0px');btn.style.setProperty('--cine-btn-y','0px')});
 });
}
var scrolling=false;
function setScroll(){scrolling=false;body.classList.toggle('tov-cine-scrolled',scrollY>55)}
addEventListener('scroll',function(){if(!scrolling){scrolling=true;requestAnimationFrame(setScroll)}},{passive:true});
setScroll();
if(reduce){
 var clear=function(){if(reduce.matches){document.querySelectorAll('.tov-cine-stage,.tov-cine-cursor,.tov-cine-aurora,.tov-cine-particles').forEach(function(node){node.remove()});body.classList.remove('tov-cine-active');}};
 if(reduce.addEventListener)reduce.addEventListener('change',clear);
 else if(reduce.addListener)reduce.addListener(clear);
}
})();
