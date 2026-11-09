/* TOV4R Mobile / PWA / Weekly Clip V3.
   Preserves CS2 player data, original clips, audio controls and previous scripts. */
(function () {
  'use strict';
  function get(id){return document.getElementById(id);}
  function report(id,message){var n=get(id);if(n)n.textContent=message;}
  function track(event){
    try{if(window.umami&&typeof window.umami.track==='function')window.umami.track(event);}
    catch(e){}
  }

  // Mobile navigation: accessible, keyboard dismissible; avoids desktop changes.
  var header=document.querySelector('header.tov-header-v3'),toggle=get('tov-menu-toggle'),nav=get('tov-main-nav');
  function setMenu(open,restoreFocus){
    if(!header||!toggle)return;
    header.dataset.menuOpen=String(open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.querySelector('.tov-menu-icon').textContent=open?'×':'☰';
    toggle.querySelector('.tov-menu-label').textContent=open?'CLOSE':'MENU';
    if(restoreFocus)toggle.focus();
  }
  if(header&&toggle&&nav){
    header.dataset.jsReady='true';
    setMenu(false,false);
    toggle.addEventListener('click',function(){setMenu(header.dataset.menuOpen!=='true',false);});
    nav.querySelectorAll('a[href^="#"]').forEach(function(link){
      link.addEventListener('click',function(){setMenu(false,false);});
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&header.dataset.menuOpen==='true')setMenu(false,true);});
    document.addEventListener('pointerdown',function(e){
      if(header.dataset.menuOpen==='true'&&!header.contains(e.target))setMenu(false,false);
    });
    window.addEventListener('resize',function(){if(window.innerWidth>950&&header.dataset.menuOpen==='true')setMenu(false,false);},{passive:true});
  }

  // Weekly editorial rotation among four EXISTING Medal clips; no match statistics.
  var clips=[
    {id:'nMMeT2Agr7tMolF5v',title:'ACE — MIRAGE',label:'MIRAGE / LINKED MEDAL CLIP',poster:'clip-ace.svg'},
    {id:'nLQLmwReRVIpEPWlf',title:'2K — MIRAGE',label:'MIRAGE / LINKED MEDAL CLIP',poster:'clip-2k.svg'},
    {id:'nMIY5uWCzJd8uRgXH',title:'HEADSHOT — MIRAGE',label:'MIRAGE / LINKED MEDAL CLIP',poster:'clip-headshot.svg'},
    {id:'nG9AXx2FXuknOrP24',title:'3K — DUST II',label:'DUST II / LINKED MEDAL CLIP',poster:'clip-3k.svg'}
  ];
  // Optional public Clip Manager configuration. Defaults preserve the original four clips.
  var cfg=window.TOV4R_PUBLIC_CLIPS||{},allowedPosters=['clip-ace.svg','clip-2k.svg','clip-headshot.svg','clip-3k.svg'];
  if(Array.isArray(cfg.clips)){
    var seen=new Set();
    var managed=cfg.clips.filter(function(c){
      if(!c||!(/^[A-Za-z0-9_-]{10,}$/.test(c.id||''))||seen.has(c.id)||typeof c.title!=='string'||!c.title.trim())return false;
      seen.add(c.id);return true;
    }).slice(0,40).map(function(c){
      return {id:c.id,title:c.title.trim().slice(0,70),label:((typeof c.map==='string'&&c.map.trim())?c.map.trim().slice(0,45):'MAP NOT PROVIDED').toUpperCase()+' / LINKED MEDAL CLIP',
        poster:allowedPosters.includes(c.poster)?c.poster:'clip-ace.svg'};
    });
    if(managed.length)clips=managed;
  }
  function weeklyIndex(date){
    var monday=Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate());
    var day=(date.getUTCDay()+6)%7;
    monday-=day*86400000;
    var baseline=Date.UTC(2026,10,9);
    var weeks=Math.floor((monday-baseline)/604800000);
    return ((weeks%clips.length)+clips.length)%clips.length;
  }
  var chosen=clips[weeklyIndex(new Date())];
  if(typeof cfg.featuredId==='string'){
    var pinned=clips.find(function(c){return c.id===cfg.featuredId;});
    if(pinned)chosen=pinned;
  }
  var title=get('tov-weekly-clip-title'),caption=get('tov-weekly-clip-map'),
      original=get('tov-weekly-original'),player=get('tov-weekly-player'),
      frame=get('tov-weekly-iframe'),play=get('tov-weekly-play'),
      close=get('tov-weekly-close'),share=get('tov-weekly-share'),
      music=get('tov-bg-track'),resumeMusic=false;
  var originalUrl='https://medal.tv/clips/'+chosen.id;
  if(title)title.textContent=chosen.title;
  if(caption)caption.textContent=chosen.label;
  var weeklyPoster=get('tov-weekly-poster');
  if(weeklyPoster){
    weeklyPoster.src='assets/media/'+chosen.poster;
    weeklyPoster.alt='Original TOV4R illustration for '+chosen.title+', not a screenshot from the game';
  }
  if(original)original.href=originalUrl;
  function stopPlayback(){
    if(frame)frame.src='about:blank';
    if(player)player.hidden=true;
    if(resumeMusic&&music){
      try{var p=music.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
    resumeMusic=false;
  }
  if(play&&frame&&player){
    play.addEventListener('click',function(){
      if(music&&!music.paused){resumeMusic=true;music.pause();}
      frame.title=chosen.title+' — Medal clip';
      frame.src='https://medal.tv/clip/'+chosen.id+'?autoplay=1&muted=0&loop=0&cta=0';
      player.hidden=false;
      player.scrollIntoView({behavior:window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});
      track('featured_clip_play');
    });
    if(close)close.addEventListener('click',function(){stopPlayback();play.focus();});
    window.addEventListener('pagehide',stopPlayback);
  }
  if(share)share.addEventListener('click',function(){
    var details={title:'TOV4R · '+chosen.title,text:'A TOV4R Medal highlight',url:originalUrl};
    if(navigator.share){
      navigator.share(details).then(function(){track('featured_clip_share');}).catch(function(){});
    }else if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(originalUrl).then(function(){report('tov-weekly-status','Original Medal link copied ✓');track('featured_clip_share');})
        .catch(function(){report('tov-weekly-status','Copy unavailable — open the original link instead.');});
    }else report('tov-weekly-status','Use OPEN MEDAL to share the original link.');
  });

  // PWA. Install prompt is browser-controlled; iOS can use Share > Add to Home Screen.
  var install=get('tov-install-app'),help=get('tov-install-help');
  var deferred=null;
  var standalone=window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches
    ||window.navigator&&window.navigator.standalone===true;
  if(standalone&&install){
    install.textContent='APP INSTALLED';
    install.disabled=true;
  }
  window.addEventListener('beforeinstallprompt',function(event){
    event.preventDefault();
    deferred=event;
    if(install&&!standalone)install.textContent='INSTALL TOV4R APP';
  });
  window.addEventListener('appinstalled',function(){
    deferred=null;
    if(install){install.disabled=true;install.textContent='APP INSTALLED';}
    report('tov-install-status','TOV4R was installed from your browser.');
    track('pwa_installed');
  });
  function instructions(){
    var isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent||'')||
      (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    report('tov-install-status',isIOS?
      'On iPhone: open this page in Safari → Share → Add to Home Screen.':
      'In your browser menu, choose Install app or Add to Home Screen (if supported).');
  }
  if(install&&!standalone)install.addEventListener('click',function(){
    if(!deferred){instructions();return;}
    var event=deferred;
    deferred=null;
    event.prompt();
    Promise.resolve(event.userChoice).then(function(choice){
      if(choice&&choice.outcome==='accepted'){report('tov-install-status','Installation accepted.');track('pwa_install_accepted');}
      else report('tov-install-status','You can install later from your browser.');
    }).catch(instructions);
  });
  if(help)help.addEventListener('click',instructions);

  if('serviceWorker' in navigator&&location.protocol==='https:'){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('/service-worker.js',{scope:'/'})
        .catch(function(){/* Site still works when PWA installation is unavailable. */});
    });
  }

  // Respect Do Not Track/Global Privacy Control. Analytics starts only with a real public Umami site ID.
  var cfg=window.TOV4R_ANALYTICS||{};
  if(cfg.provider==='umami'&&typeof cfg.websiteId==='string'&&
     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cfg.websiteId)
     &&navigator.doNotTrack!=='1'&&navigator.globalPrivacyControl!==true){
    var script=document.createElement('script');
    script.defer=true;
    script.src='https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id',cfg.websiteId);
    document.head.appendChild(script);
  }
})();
