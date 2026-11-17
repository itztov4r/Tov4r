/* TOV4R STUDIO — network-first navigation, small offline shell. */
'use strict';
const CACHE='tov4r-studio-v1-20261117';
const ASSETS=['/','/index.html','/studio/site.css','/studio/site.js','/favicon.svg','/manifest.webmanifest','/privacy.html','/templates/noirfolio.html','/templates/launchdeck.html','/themes/TOV4R-DeathNote.theme.css','/themes/Crimson-Ledger.theme.css'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key!==CACHE && (key.startsWith('tov4r-shell-') || key.startsWith('tov4r-studio-'))).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET' || url.origin!==self.location.origin || request.headers.has('range')) return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,clone)));}
      return response;
    }).catch(()=>caches.match(request).then(hit=>hit||(url.pathname==='/'||url.pathname==='/index.html'?caches.match('/index.html'):Response.error()))));
    return;
  }
  event.respondWith(fetch(request).then(response=>{
    if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,clone)));}
    return response;
  }).catch(()=>caches.match(request).then(hit=>hit||Response.error())));
});