/* TOV4R Photo Refresh: photograph-first layout with safe, local image fallbacks.
   Original gaming site images are never removed or overwritten. */
(function(){
  'use strict';
  var fallbackFiles=new Set([
    'assets/media/pc-setup.jpg',
    'assets/media/game-card-3.jpg',
    'assets/media/game-card-2.jpg'
  ]);
  function failover(img){
    if(img.dataset.fallbackApplied==='true')return;
    var fallback=img.getAttribute('data-photo-fallback');
    if(!fallbackFiles.has(fallback))return;
    img.dataset.fallbackApplied='true';
    img.src=fallback;
    img.alt='Existing local gaming photo — original Unsplash photo could not be loaded';
  }
  function observe(img){
    img.addEventListener('error',function(){failover(img);},{once:true});
    if(img.complete&&img.naturalWidth===0)failover(img);
  }
  function setup(){
    document.querySelectorAll('img[data-photo-fallback]').forEach(observe);
    var enlarged=document.getElementById('tov-v5-gallery-image');
    if(enlarged){
      enlarged.addEventListener('error',function(){
        if(enlarged.dataset.fallbackApplied==='true')return;
        if(!enlarged.src.startsWith('https://images.unsplash.com/'))return;
        enlarged.dataset.fallbackApplied='true';
        enlarged.src='assets/media/pc-setup.jpg';
        enlarged.alt='Existing TOV4R website setup photo — remote inspiration photo unavailable';
      });
      var buttons=document.querySelectorAll('[data-v5-gallery-src]');
      buttons.forEach(function(b){
        b.addEventListener('click',function(){
          enlarged.dataset.fallbackApplied='false';
        });
      });
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();