/* TOV4R iPhone audio UI: compact by default, original audio controls intact. */
(function(){
  'use strict';
  function init(){
    var dock=document.getElementById('tov-music-dock');
    var toggle=document.getElementById('tov-dock-expand');
    var bar=document.getElementById('tov-music-options');
    if(!dock||!toggle||!bar)return;
    function setExpanded(expanded){
      dock.dataset.expanded=expanded?'true':'false';
      toggle.setAttribute('aria-expanded',String(expanded));
      toggle.textContent=expanded?'LESS':'MORE';
    }
    setExpanded(false);
    toggle.addEventListener('click',function(){
      setExpanded(dock.dataset.expanded!=='true');
    });
    dock.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&dock.dataset.expanded==='true'){
        setExpanded(false);toggle.focus();
      }
    });
    window.addEventListener('resize',function(){
      if(window.innerWidth>640&&dock.dataset.expanded==='true')setExpanded(false);
    },{passive:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
