/* TOV4R Motion System — progressive scroll, hover and navigation feedback. No third-party libraries. */
(function(){
 'use strict';
 var body=document.body;
 if(!body)return;
 var media=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
 if((media&&media.matches)||!('IntersectionObserver' in window))return;
 var isDownloads=location.pathname.indexOf('/downloads')===0;
 var isStudio=location.pathname.indexOf('/studio')===0;
 var isPrivacy=location.pathname.indexOf('privacy')!==-1;
 body.classList.add('tov4r-motion-enabled');
 body.classList.add(isDownloads?'tov4r-motion-downloads':isStudio?'tov4r-motion-studio':'tov4r-motion-home');

 var cardSelector=[
  '.game-card','.clip-card','.link-card','.contact-card','.spec','.setup-box',
  '.tov-game-card','.tov-visual-card','.tov-clip-card','.tov-v5-setup-tile',
  '.tov-v5-metric','.tov-achievement-card','.tov-discord-card','.tov-photo-story',
  '.tov-loadout-slot','.tov-setting-item','.tov-player-mode','.tov-v5-workspace',
  '.tov-pro-panel','.tov-v5-draft','.tov-v5-clip-card','.g',
  '.games .game','.steps article','.faqs details'
 ].join(',');
 var targetSelector=cardSelector+',main .section-heading,main .section-top,main .tov-v5-lead,main section h2,main section > h3,main .sh';
 if(isPrivacy)targetSelector+=',main h1,main h2,main p';
 var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
   if(entry.isIntersecting){
    entry.target.classList.add('tov4r-motion-in');
    observer.unobserve(entry.target);
   }
  });
 },{rootMargin:'0px 0px -26px 0px',threshold:.08});

 function enhance(node){
  if(!(node instanceof Element))return;
  var isCard=node.matches(cardSelector);
  if(isCard&&!node.classList.contains('tov4r-motion-card')){
   node.classList.add('tov4r-motion-card');
   var shine=document.createElement('span');
   shine.className='tov4r-motion-shine';
   shine.setAttribute('aria-hidden','true');
   node.appendChild(shine);
  }
  if(!node.matches(targetSelector)||node.classList.contains('tov4r-motion-target'))return;
  // Preserve original reveal logic and avoid hiding nested interactive components.
  if(node.matches('.rv,.tov-reveal')||node.closest('.rv,.tov-reveal,.tov4r-motion-target'))return;
  if(node.closest('dialog,[hidden],[aria-hidden="true"]'))return;
  node.classList.add('tov4r-motion-target');
  if(node.matches('h1,h2,h3,.section-heading,.section-top,.sh'))node.classList.add('tov4r-motion-heading');
  var siblings=node.parentElement?Array.prototype.indexOf.call(node.parentElement.children,node):0;
  node.style.setProperty('--tov4r-delay',Math.min(Math.max(siblings,0)%5*70,280)+'ms');
  var rect=node.getBoundingClientRect();
  if(rect.top<innerHeight*.84&&rect.bottom>0){
   node.classList.add('tov4r-motion-in');
  }else{
   observer.observe(node);
  }
 }
 function scan(root){
  if(!root||root.nodeType!==1)return;
  if(root.matches(targetSelector))enhance(root);
  root.querySelectorAll(targetSelector).forEach(enhance);
 }
 scan(document.querySelector('main'));
 if(isPrivacy)scan(document.querySelector('main'));
 var footer=document.querySelector('footer');
 if(footer&&footer.children.length){
  Array.prototype.forEach.call(footer.children,function(node){
   if(node.matches&&node.matches('div,p')&&!node.classList.contains('tov4r-motion-target')){
    node.classList.add('tov4r-motion-target');
    observer.observe(node);
   }
  });
 }
 // Downloaded game cards are re-rendered after search/filter selections.
 var main=document.querySelector('main');
 if(main&&window.MutationObserver){
  var pending=[];
  var scheduled=false;
  new MutationObserver(function(records){
   records.forEach(function(record){
    record.addedNodes.forEach(function(node){
     if(node.nodeType===1&&!node.classList.contains('tov4r-motion-shine'))pending.push(node);
    });
   });
   if(scheduled||!pending.length)return;
   scheduled=true;
   requestAnimationFrame(function(){
    scheduled=false;
    var nodes=pending.splice(0);
    nodes.forEach(scan);
   });
  }).observe(main,{subtree:true,childList:true});
 }
 // Subtle, real-time hover lighting only for precision pointers.
 if(window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  var motionFrame=0,lastCard=null,lastX=0,lastY=0;
  document.addEventListener('pointermove',function(event){
   var target=event.target;
   if(!(target instanceof Element))return;
   var card=target.closest('.tov4r-motion-card');
   if(!card)return;
   lastCard=card;lastX=event.clientX;lastY=event.clientY;
   if(motionFrame)return;
   motionFrame=requestAnimationFrame(function(){
    motionFrame=0;
    if(!lastCard||!lastCard.isConnected)return;
    var box=lastCard.getBoundingClientRect();
    if(!box.width||!box.height)return;
    lastCard.style.setProperty('--tov4r-x',((lastX-box.left)/box.width*100).toFixed(1)+'%');
    lastCard.style.setProperty('--tov4r-y',((lastY-box.top)/box.height*100).toFixed(1)+'%');
   });
  },{passive:true});
 }
 var buttonSelector='.btn,.primary,.secondary,.tab,.tov-v5-btn,.card-actions button,.card-actions a,.tov-menu-toggle,.tov-clip-video-btn';
 document.querySelectorAll(buttonSelector).forEach(function(btn){btn.classList.add('tov4r-motion-click')});
 document.addEventListener('pointerdown',function(event){
  if(event.button!==0)return;
  var element=event.target;
  if(!(element instanceof Element))return;
  var btn=element.closest(buttonSelector);
  if(!btn||btn.closest('[disabled]'))return;
  btn.classList.add('tov4r-motion-click');
  var bounds=btn.getBoundingClientRect();
  if(!bounds.width||!bounds.height)return;
  var ripple=document.createElement('span');
  ripple.className='tov4r-motion-ripple';
  ripple.setAttribute('aria-hidden','true');
  ripple.style.setProperty('--tov4r-ripple-x',(event.clientX-bounds.left)+'px');
  ripple.style.setProperty('--tov4r-ripple-y',(event.clientY-bounds.top)+'px');
  btn.appendChild(ripple);
  ripple.addEventListener('animationend',function(){ripple.remove()},{once:true});
  setTimeout(function(){if(ripple.isConnected)ripple.remove()},850);
 },{passive:true});
 // Slim reading-position indicator on pages without the existing Studio indicator.
 if(!document.querySelector('.tov-page-progress')){
  var bar=document.createElement('div');
  bar.className='tov4r-motion-progress';
  bar.setAttribute('aria-hidden','true');
  body.appendChild(bar);
  var scrolling=false;
  var updateProgress=function(){
   scrolling=false;
   var max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
   bar.style.setProperty('--tov4r-progress',Math.max(0,Math.min(1,scrollY/max)).toFixed(4));
  };
  addEventListener('scroll',function(){
   if(scrolling)return;
   scrolling=true;
   requestAnimationFrame(updateProgress);
  },{passive:true});
  addEventListener('resize',updateProgress,{passive:true});
  updateProgress();
 }
 if(isDownloads&&!isPrivacy){
  document.querySelectorAll('.hero-content > *').forEach(function(node,i){
   node.style.setProperty('--tov4r-hero-delay',(i*125+110)+'ms');
  });
 }
 // If the visitor turns on reduced motion while on the page, reveal every element.
 if(media){
  var change=function(){
   if(!media.matches)return;
   observer.disconnect();
   body.classList.remove('tov4r-motion-enabled');
   document.querySelectorAll('.tov4r-motion-target').forEach(function(node){node.classList.add('tov4r-motion-in')});
  };
  if(media.addEventListener)media.addEventListener('change',change);
  else if(media.addListener)media.addListener(change);
 }
})();
