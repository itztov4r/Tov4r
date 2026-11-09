/* TOV4R visual gallery: graceful fallback to original local SVG artwork.
   External moodboard photos are optional, never imply a real personal setup. */
(function(){
  'use strict';
  document.querySelectorAll('img[data-visual-fallback]').forEach(function(img){
    function fallback(){
      var path=img.getAttribute('data-visual-fallback')||'';
      if(!/^assets\/media\/tov4r-(?:premium|discord)-art\.svg$/.test(path))return;
      img.src=path;
      img.setAttribute('data-photo-unavailable','true');
      img.alt='Original TOV4R redline artwork — photo could not be loaded';
    }
    img.addEventListener('error',fallback,{once:true});
    if(img.complete&&img.naturalWidth===0)fallback();
  });
})();