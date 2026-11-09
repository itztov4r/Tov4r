/* TOV4R PWA V3 — static local-shell caching, no third-party requests. */
'use strict';
const VERSION='tov4r-shell-v3-20261109-1';
const ESSENTIALS=[
  '/', '/index.html', '/favicon.svg', '/manifest.webmanifest',
  '/icons/tov4r-192.png', '/icons/tov4r-512.png',
  '/assets/tov4r-pro.css?v=2', '/assets/tov4r-hub.css?v=1',
  '/assets/tov4r-v2.css?v=1', '/assets/tov4r-v3.css?v=1',
  '/assets/tov4r-player-data.js?v=1', '/assets/tov4r-pro.js?v=2',
  '/assets/tov4r-hub.js?v=1', '/assets/tov4r-v2.js?v=1',
  '/assets/tov4r-v3.js?v=1', '/assets/tov4r-analytics-config.js'
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
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{
      if(res.ok){const clone=res.clone();event.waitUntil(caches.open(VERSION).then(c=>c.put('/index.html',clone)));}
      return res;
    }).catch(()=>caches.match('/index.html').then(result=>result||Response.error())));
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
