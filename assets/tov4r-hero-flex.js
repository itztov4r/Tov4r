/* TOV4R Hero Flex — reveal after cinematic intro, without blocking navigation or links. */
(function(){
 'use strict';
 var hero=document.getElementById('home');
 if(!hero||!hero.classList.contains('hero-flex'))return;
 var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce)return;
 hero.classList.add('tov-flex-pending');
 var started=false;
 var observer=null;
 var safety=null;
 function start(){
  if(started)return;
  started=true;
  if(observer)observer.disconnect();
  if(safety)clearTimeout(safety);
  hero.classList.remove('tov-flex-pending');
  // Allow the browser to commit the initial reveal state before starting animations.
  requestAnimationFrame(function(){hero.classList.add('tov-flex-play')});
 }
 if(document.body.classList.contains('tov-cine-active')&&window.MutationObserver){
  observer=new MutationObserver(function(){
   if(!document.body.classList.contains('tov-cine-active'))start();
  });
  observer.observe(document.body,{attributes:true,attributeFilter:['class']});
  safety=setTimeout(start,3400);
 }else requestAnimationFrame(start);
 document.addEventListener('visibilitychange',function(){
  if(!document.hidden&&hero.classList.contains('tov-flex-pending'))start();
 });
})();
