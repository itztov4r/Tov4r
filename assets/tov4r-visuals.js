/* TOV4R visual moodboard: real photography with a known local photo fallback.
   Photos are illustrative; they do not depict TOV4R's personal equipment. */
(function(){
  'use strict';
  document.querySelectorAll('img[data-visual-fallback]').forEach(function(img){
    function fallback(){
      if(img.dataset.photoFallbackApplied==='true')return;
      var path=img.getAttribute('data-visual-fallback');
      if(path!=='assets/media/pc-setup.jpg')return;
      img.dataset.photoFallbackApplied='true';
      img.src=path;
      img.alt='Real gaming setup photograph saved locally for reliable display; illustrative only';
    }
    img.addEventListener('error',fallback);
    if(img.complete&&img.naturalWidth===0)fallback();
  });
})();
