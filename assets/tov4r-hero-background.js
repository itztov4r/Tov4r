/* TOV4R / Living Hero v2 — subtle mouse-driven parallax, no added image request. */
(function(){
  'use strict';
  var hero=document.getElementById('home');
  if(!hero||!hero.classList.contains('hero-flex'))return;
  if(!window.matchMedia||
     window.matchMedia('(prefers-reduced-motion: reduce)').matches||
     !window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  var pending=0,px=0,py=0;
  function update(){
    pending=0;
    hero.style.setProperty('--tov-bg-x',(px*22).toFixed(1)+'px');
    hero.style.setProperty('--tov-bg-y',(py*14).toFixed(1)+'px');
    hero.style.setProperty('--tov-art-x',(px*-10).toFixed(1)+'px');
    hero.style.setProperty('--tov-art-y',(py*-7).toFixed(1)+'px');
  }
  hero.addEventListener('pointermove',function(event){
    if(event.pointerType&&event.pointerType!=='mouse')return;
    var rect=hero.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    px=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
    py=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
    if(!pending)pending=requestAnimationFrame(update);
  },{passive:true});
  hero.addEventListener('pointerleave',function(){
    px=0;py=0;
    if(!pending)pending=requestAnimationFrame(update);
  },{passive:true});
})();
