/* TOV4R HUB: progressive enhancements; no invented CS2 settings or data */
(function () {
  'use strict';
  var clipCards=[].slice.call(document.querySelectorAll('#highlights .tov-clip-card'));
  var filterButtons=[].slice.call(document.querySelectorAll('[data-tov-filter]'));
  var search=document.getElementById('tov-clip-search');
  var counter=document.getElementById('tov-clip-count');
  var filter='all';
  function updateClips(){
    var term=search?search.value.trim().toLocaleLowerCase():'';
    var visible=0;
    clipCards.forEach(function(card){
      var map=(card.querySelector('.tov-clip-map')||{}).textContent||'';
      var name=(card.querySelector('.tov-clip-info strong')||{}).textContent||'';
      var text=(name+' '+map).toLocaleLowerCase();
      var matchMap=filter==='all'||map.toLowerCase().includes(filter==='dust'?'dust':'mirage');
      var show=matchMap&&(!term||text.includes(term));
      card.hidden=!show;
      if(show)visible++;
    });
    if(counter)counter.textContent=visible+' / '+clipCards.length+' CLIPS SHOWN';
  }
  filterButtons.forEach(function(button){
    button.addEventListener('click',function(){
      filter=button.getAttribute('data-tov-filter')||'all';
      filterButtons.forEach(function(b){b.setAttribute('aria-pressed',String(b===button));});
      updateClips();
    });
  });
  if(search)search.addEventListener('input',updateClips);
  updateClips();

  // Personal labels are entirely local. They do NOT prove in-game inventory ownership.
  var slots=['agent','gloves','musicKit','badge'],storageKey='tov4r-loadout-local-v1';
  var save=document.getElementById('tov-save-loadout');
  var reset=document.getElementById('tov-reset-loadout');
  var feedback=document.getElementById('tov-loadout-feedback');
  function readValues(){
    var obj={};
    slots.forEach(function(slot){
      var input=document.querySelector('[data-hub-slot="'+slot+'"]');
      obj[slot]=input?input.value.trim().slice(0,60):'';
    });
    return obj;
  }
  function showValues(obj){
    slots.forEach(function(slot){
      var preview=document.querySelector('[data-hub-preview="'+slot+'"]');
      if(preview)preview.textContent=typeof obj[slot]==='string'&&obj[slot].trim()?obj[slot].trim().slice(0,60):'NOT SET';
    });
  }
  function applyValues(obj){
    slots.forEach(function(slot){
      var input=document.querySelector('[data-hub-slot="'+slot+'"]');
      if(input)input.value=typeof obj[slot]==='string'?obj[slot].slice(0,60):'';
    });
    showValues(readValues());
  }
  if(save&&reset){
    try{
      var saved=localStorage.getItem(storageKey);
      if(saved){
        var decoded=JSON.parse(saved);
        if(decoded&&typeof decoded==='object'&&!Array.isArray(decoded))applyValues(decoded);
      }
    }catch(e){ if(feedback)feedback.textContent='Local storage is unavailable; editing still works.'; }
    slots.forEach(function(slot){
      var input=document.querySelector('[data-hub-slot="'+slot+'"]');
      if(input)input.addEventListener('input',function(){showValues(readValues());});
    });
    save.addEventListener('click',function(){
      try{localStorage.setItem(storageKey,JSON.stringify(readValues()));if(feedback)feedback.textContent='SAVED ON THIS DEVICE ONLY ✓';}
      catch(e){if(feedback)feedback.textContent='Storage blocked — values are visible until this page closes.';}
    });
    reset.addEventListener('click',function(){
      try{localStorage.removeItem(storageKey);}catch(e){}
      applyValues({});
      if(feedback)feedback.textContent='LOCAL DISPLAY RESET';
    });
  }

  // Throttled reading progress, avoids unnecessary style changes every scroll event.
  var bar=document.querySelector('.tov-page-progress>span');
  var topButton=document.getElementById('tov-back-top');
  var queued=false;
  function paintScroll(){
    var max=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
    var progress=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    if(bar)bar.style.transform='scaleX('+progress+')';
    if(topButton)topButton.dataset.visible=String(window.scrollY>450);
    queued=false;
  }
  function queueScroll(){
    if(queued)return;
    queued=true;
    window.requestAnimationFrame(paintScroll);
  }
  if(bar||topButton){
    window.addEventListener('scroll',queueScroll,{passive:true});
    window.addEventListener('resize',queueScroll,{passive:true});
    paintScroll();
  }
  if(topButton)topButton.addEventListener('click',function(){
    window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
})();
