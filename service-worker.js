/* TOV4R PWA V3 — static local-shell caching, no third-party requests. */
'use strict';
const VERSION='tov4r-shell-v9-20261111-worldwall-char-v2';
const ESSENTIALS=[
  '/', '/index.html', '/favicon.svg', '/manifest.webmanifest',
  '/assets/tov4r-motion.css?v=1', '/assets/tov4r-motion.js?v=1',
  '/assets/tov4r-cinematic.css?v=2', '/assets/tov4r-cinematic.js?v=2',
  '/assets/tov4r-hero-flex.css?v=2', '/assets/tov4r-hero-flex.js?v=1',
  '/assets/tov4r-hero-background.css?v=2', '/assets/tov4r-hero-background.js?v=2',
  '/assets/tov4r-world-motion.css?v=2', '/assets/tov4r-world-motion.js?v=1',
  '/icons/tov4r-192.png', '/icons/tov4r-512.png',
  '/assets/tov4r-core.css?v=4', '/assets/tov4r-music.css?v=4',
  '/assets/tov4r-pro.css?v=2', '/assets/tov4r-hub.css?v=1',
  '/assets/tov4r-v2.css?v=1', '/assets/tov4r-v3.css?v=1', '/assets/tov4r-visuals.css?v=1', '/assets/tov4r-v4.css?v=1', '/assets/tov4r-v5.css?v=1', '/assets/tov4r-photo-refresh.css?v=1', '/assets/tov4r-mobile-photo-v6.css?v=2',
  '/assets/tov4r-player-data.js?v=1', '/assets/tov4r-pro.js?v=2',
  '/assets/tov4r-hub.js?v=1', '/assets/tov4r-v2.js?v=1',
  '/assets/tov4r-clips.js?v=1', '/assets/tov4r-v3.js?v=3', '/assets/tov4r-visuals.js?v=1', '/assets/tov4r-v5.js?v=3', '/assets/tov4r-photo-refresh.js?v=1', '/assets/tov4r-mobile-photo-v6.js?v=1', '/assets/tov4r-analytics-config.js',
  '/assets/media/clip-ace.svg', '/assets/media/clip-2k.svg', '/assets/media/clip-headshot.svg', '/assets/media/clip-3k.svg',
  '/assets/media/hero-visual.jpg', '/assets/media/hero-overlay.jpg', '/assets/media/bg-ambient.jpg',
  '/assets/media/tov4r-premium-art.svg', '/assets/media/tov4r-discord-art.svg', '/assets/media/tov4r-crosshair-art.svg', '/assets/media/tov4r-achievements-art.svg',
  '/assets/media/game-card-1.jpg', '/assets/media/game-card-2.jpg', '/assets/media/game-card-3.jpg', '/assets/media/game-card-4.jpg',
  '/assets/media/pc-setup.jpg', '/assets/media/about-me.jpg', '/assets/media/discord-card.jpg'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(ESSENTIALS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(key=>key.startsWith('tov4r-shell-')&&key!==VERSION).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;
  // Never cache music streaming, requests with byte ranges, or any third-party content.
  if(req.headers.has('range')||/\.(?:mp3|mp4|wav|m4a)$/i.test(url.pathname))return;
  // Read public site configuration from the network first, so owner-edited
  // clip/analytics config is not indefinitely stale after GitHub publishing.
  if(url.pathname==='/assets/tov4r-clips.js'||url.pathname==='/assets/tov4r-analytics-config.js'){
    event.respondWith(fetch(req,{cache:'no-cache'}).then(res=>{
      if(res.ok){const copy=res.clone();event.waitUntil(caches.open(VERSION).then(c=>c.put(req,copy)));}
      return res;
    }).catch(()=>caches.match(req).then(cached=>cached||Response.error())));
    return;
  }
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{
      if(res.ok){const clone=res.clone();event.waitUntil(caches.open(VERSION).then(c=>c.put('/index.html',clone)));}
      return res;
    }).catch(()=>{
      // Only the homepage may use the homepage offline fallback.
      if(url.pathname==='/'||url.pathname==='/index.html')
        return caches.match('/index.html').then(result=>result||Response.error());
      return caches.match(req).then(result=>result||Response.error());
    }));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>{
    if(cached)return cached;
    return fetch(req).then(res=>{
      if(res.ok&&res.type==='basic'){
        const clone=res.clone();
        event.waitUntil(caches.open(VERSION).then(cache=>cache.put(req,clone)));
      }
      return res;
    });
  }));
});
