/* TOV4R site regression check — dependency-free Node.js script.
 * Run: node scripts/verify-site.cjs
 * Checks local assets, navigation, script syntax, SEO/PWA wiring and privacy.
 * No HTTP requests and no fabricated gameplay data.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const failures=[],successes=[];
function check(name,condition){
  (condition?successes:failures).push(name);
  console.log((condition?'PASS ':'FAIL ')+name);
}
function localPath(value,from=''){
  if(!value||/^(?:[a-z]+:|\/\/|#)/i.test(value))return null;
  const clean=value.split(/[?#]/)[0];
  if(!clean)return null;
  const base=value.startsWith('/')?'':from;
  const posix=path.posix.normalize(path.posix.join(base,clean.replace(/^\//,'')));
  if(posix.startsWith('..')||path.posix.isAbsolute(posix))return {unsafe:true,path:posix};
  return {path:posix};
}
const html=read('index.html'),files=fs.readdirSync(path.join(root,'assets'))
  .filter(x=>/\.(?:css|js)$/i.test(x)).map(x=>'assets/'+x);
check('index exists and is HTML5',/^<!doctype html>/i.test(html.trimStart()));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]),idSet=new Set(ids);
check('unique HTML IDs',ids.length===idSet.size);
check('balanced site sections',(html.match(/<section\b/gi)||[]).length===(html.match(/<\/section>/gi)||[]).length);
const hashes=[...html.matchAll(/<a\b[^>]*\bhref="#([^"]+)"[^>]*>/g)].map(x=>x[1]);
check('all internal anchor links exist',hashes.every(id=>idSet.has(id)));
check('all new-tab links are safe',[...html.matchAll(/<a\b[^>]*\btarget="_blank"[^>]*>/g)].every(m=>/\brel="[^"]*\bnoopener\b[^"]*"/.test(m[0])&&/\brel="[^"]*\bnoreferrer\b[^"]*"/.test(m[0])));
check('no inline HTML event handlers',!/\s(?:onclick|onerror|onload|onmouseover)\s*=/i.test(html));
const tagPaths=[...html.matchAll(/<(?:link|img|script|audio|source)\b([^>]+)>/gi)].map(m=>{
  const attrs=m[1];const match=attrs.match(/\b(?:href|src)="([^"]+)"/);
  return match?match[1]:null;
}).filter(Boolean);
const internalTagPaths=tagPaths.map(x=>localPath(x)).filter(Boolean);
check('all linked local HTML assets exist',internalTagPaths.every(x=>!x.unsafe&&exists(x.path)));
const css=files.filter(x=>x.endsWith('.css')),javascript=files.filter(x=>x.endsWith('.js'));
for(const file of css){
  const s=read(file);
  const urls=[...s.matchAll(/url\(\s*["']?([^'")]+)["']?\s*\)/g)].map(m=>m[1]);
  const local=urls.map(x=>localPath(x,path.posix.dirname(file))).filter(Boolean);
  check('CSS asset paths '+file,local.every(x=>!x.unsafe&&exists(x.path)));
  // Simple conservative structural validation; browser CSS parser remains authoritative.
  check('CSS blocks balanced '+file,(s.match(/{/g)||[]).length===(s.match(/}/g)||[]).length);
}
for(const file of javascript.concat('service-worker.js')){
  try{new vm.Script(read(file),{filename:file});check('JS parses '+file,true);}
  catch(e){check('JS parses '+file,false);console.error(e.message);}
}
const snippets=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
for(let i=0;i<snippets.length;i++){
  const [,attrs,body]=snippets[i];
  if(!body.trim())continue;
  try{
    if(/application\/ld\+json/.test(attrs))JSON.parse(body);
    else new vm.Script(body,{filename:'index-inline-'+i});
    check('inline script parses '+i,true);
  }catch(e){check('inline script parses '+i,false);console.error(e.message);}
}
const sw=read('service-worker.js');
const cacheBlock=sw.match(/const ESSENTIALS=\[([\s\S]*?)\];/)?.[1]||'';
const precache=[...cacheBlock.matchAll(/'([^']+)'/g)].map(x=>x[1]);
check('precache list exists and all assets exist',precache.length>=12&&precache.every(p=>{
  const n=localPath(p);return n&&!n.unsafe&&exists(n.path);
}));
check('precache excludes audio and third-party hosts',!precache.some(s=>/mp3|medal\.tv|https?:\/\//i.test(s)));
const manifest=JSON.parse(read('manifest.webmanifest'));
check('installable PWA icons exist',manifest.display==='standalone'&&
 manifest.icons.some(i=>i.sizes==='192x192')&&manifest.icons.some(i=>i.sizes==='512x512')&&
 manifest.icons.every(i=>{const n=localPath(i.src);return n&&!n.unsafe&&exists(n.path);}));
check('structured SEO tags present',/rel="canonical"/.test(html)&&/name="description"/.test(html)&&
 /property="og:title"/.test(html)&&/name="twitter:card"/.test(html)&&
 /application\/ld\+json/.test(html)&&/Sitemap: https:\/\/tov4r\.xyz\/sitemap\.xml/.test(read('robots.txt'))&&/https:\/\/tov4r\.xyz\//.test(read('sitemap.xml')));
check('feature and essential modules preserved',['featured-clip','games','visual-board','highlights','player-profile','cs2-settings','cs2-loadout','setup','journey','achievements','discord-hub','about','connect'].every(id=>idSet.has(id)));
const pdata=read('assets/tov4r-player-data.js');
check('CS2 settings remain explicitly unverified',pdata.includes('dpi:"800 · CONCEPT"')&&pdata.includes('sensitivity:"1.20 · CONCEPT"')&&pdata.includes('resolution:"1280 × 960 · 4:3 IDEA"')&&pdata.includes('crosshairCode:null'));
const allSources=html+read('assets/tov4r-v3.js');
check('existing Medal clips retained',['nMMeT2Agr7tMolF5v','nLQLmwReRVIpEPWlf','nMIY5uWCzJd8uRgXH','nG9AXx2FXuknOrP24'].every(id=>allSources.includes(id)));
const analyticsConfig=read('assets/tov4r-analytics-config.js');
const analyticsModule=read('assets/tov4r-v3.js');
check('Umami ID configured and matches owner-provided ID',
  analyticsConfig.includes('provider:"umami",websiteId:"82bf1d8c-5872-4caa-ac02-0835474a8686"'));
check('Only one privacy-aware Umami script loader',
  !html.includes('src="https://cloud.umami.is/script.js"')&&
  analyticsModule.includes("script.src='https://cloud.umami.is/script.js'")&&
  analyticsModule.includes("navigator.doNotTrack!=='1'")&&
  analyticsModule.includes("navigator.globalPrivacyControl!==true"));
check('Privacy notice and download link exist',
  exists('privacy.html')&&html.includes('href="/privacy.html"')&&html.includes('href="/downloads/"'));
check('Steam avatar uses a trusted local photo fallback',
  html.includes('data-photo-fallback="assets/media/steam-card.jpg"')&&
  read('assets/tov4r-photo-refresh.js').includes("'assets/media/steam-card.jpg'"));
check('Analytics does not fabricate visits',
  html.includes('NO REAL DATA HERE')&&read('assets/tov4r-v5.js').includes('NO REAL VISITOR DATA HERE'));
// V5: public clip config, five UI modules, privacy and QR integrity.
const v5js=read('assets/tov4r-v5.js');
const v3js=read('assets/tov4r-v3.js');
const clipText=read('assets/tov4r-clips.js');
const sandbox={window:{}};
try{vm.runInNewContext(clipText,sandbox,{timeout:1000});}
catch(e){console.error('Invalid public clip config:',e.message);}
const clipCfg=sandbox.window.TOV4R_PUBLIC_CLIPS;
check('V5 published clips are source-backed',!!clipCfg&&Array.isArray(clipCfg.clips)&&clipCfg.clips.length>=4&&
  clipCfg.clips.every(c=>/^[A-Za-z0-9_-]{10,}$/.test(c.id)&&typeof c.title==='string'&&c.title.length>0));
check('V5 public library preserves four verified Medal clips',!!clipCfg&&['nMMeT2Agr7tMolF5v','nLQLmwReRVIpEPWlf','nMIY5uWCzJd8uRgXH','nG9AXx2FXuknOrP24']
  .every(id=>clipCfg.clips.some(c=>c.id===id)));
check('V5 feature sections all exist',['clip-manager','progress-tracker','setup-gallery','share-profile','analytics-dashboard'].every(id=>idSet.has(id)));
check('V5 clip data loads before weekly video',html.indexOf('src="assets/tov4r-clips.js?v=1"')<
  html.indexOf('src="assets/tov4r-v3.js?v=3"')&&html.indexOf('src="assets/tov4r-v3.js?v=3"')<
  html.indexOf('src="assets/tov4r-v5.js?v=3"'));
check('V5 clip management supports local draft and file export',v5js.includes('tov4r-clip-draft-v5')&&
  v5js.includes("tov4r-clips.js")&&v5js.includes('canonicalClip'));
check('V5 progress tracker starts without fake stats',v5js.includes('tov4r-progress-v5')&&
  html.includes('NO ENTRIES YET')&&html.includes('NOT CONNECTED'));
check('V5 QR is local and has 25 compact data rows',(() => {
  const m=v5js.match(/var qrRows=\[([\s\S]*?)\];/);
  return !!m&&(m[1].match(/'[0-9a-f]{8}'/g)||[]).length===25&&
    v5js.includes("SITE='https://tov4r.xyz/'")&&!v5js.includes('qrserver.com');
})());
check('V5 public config is network first for offline clients',sw.includes("tov4r-shell-v9")&&
  sw.includes("url.pathname==='/assets/tov4r-clips.js'")&&sw.includes("cache:'no-cache'"));
check('V5 avoids untrusted HTML insertion and eval',!v5js.includes('.innerHTML')&&!/\beval\s*\(/.test(v5js));

// Photo-first refresh: real licensed images, honest context, local fallback.
const photoCss=read('assets/tov4r-photo-refresh.css');
const photoJs=read('assets/tov4r-photo-refresh.js');
check('photo-first sections include five actual photo covers',
  (html.match(/class="tov-photo-story /g)||[]).length===5 &&
  (html.match(/class="tov-photo-cover"/g)||[]).length===5);
check('real photos are attributed and never framed as personal gameplay',
  (html.match(/PHOTO RÉELLE · UNSPLASH/g)||[]).length===5 &&
  html.includes('pas le setup personnel de TOV4R') &&
  html.includes('Les images de cette collection sont de vraies photographies') &&
  html.includes('pas une capture de tes matchs'));
check('setup keeps its existing local photo and adds two licensed inspiration photos',
  html.includes('data-v5-gallery-src="assets/media/pc-setup.jpg"') &&
  (html.match(/data-v5-gallery-src="https:\/\/images\.unsplash\.com\//g)||[]).length===2);
check('photo fallbacks cannot use arbitrary external paths',
  photoJs.includes("fallbackFiles=new Set") && !photoJs.includes('.innerHTML') &&
  photoJs.includes("assets/media/pc-setup.jpg"));
check('V5 source covers real mood photos and preserves Media IDs',
  v5js.includes("publishedPhotoIds") && v5js.includes('REAL AMBIENCE PHOTO') &&
  v5js.includes('nMMeT2Agr7tMolF5v')===false && clipText.includes('nMMeT2Agr7tMolF5v'));
check('PWA refresh caches new photo CSS and JS',
  sw.includes("'/assets/tov4r-photo-refresh.css?v=1'") &&
  sw.includes("'/assets/tov4r-photo-refresh.js?v=1'") &&
  sw.includes("'/assets/tov4r-v5.js?v=3'"));

// iPhone screenshot fixes: photo-based site sections, live Medal URLs and compact soundtrack.
const photoV6css=read('assets/tov4r-mobile-photo-v6.css');
const photoV6js=read('assets/tov4r-mobile-photo-v6.js');
check('all original Medal card posters are full-frame real photos',
  (html.match(/class="tov-thumb" src="https:\/\/images\.unsplash\.com\//g)||[]).length===4&&
  html.includes('data-photo-fallback="assets/media/pc-setup.jpg"'));
check('no duplicate ARTWORK caption overlay can appear in Highlights',
  photoV6css.includes('tov-real-thumb::after{content:none!important;display:none!important}')&&
  photoV6css.includes('tov-clip-ornament{display:none!important}'));
check('photo-led player, crosshair and achievements preserve game honesty',
  html.includes('Photographie réelle d\'un bureau gaming RGB')&&
  html.includes('The crosshair appears over a real gaming desk photograph')&&
  html.includes('REAL GAMING PHOTOGRAPHY · NOT AN AWARD'));
check('loadout, achievements and Discord show actual hardware backgrounds',
  photoV6css.includes('#cs2-loadout .tov-loadout-slot:nth-child(1)')&&
  photoV6css.includes('#achievements .tov-achievement-card:nth-child(1)')&&
  photoV6css.includes('#discord-hub .tov-discord-main'));
check('iPhone audio dock offers accessible compact expand/collapse',
  html.includes('id="tov-dock-expand"')&&html.includes('aria-controls="tov-music-options"')&&
  html.includes('id="tov-music-options"')&&photoV6js.includes("Escape")&&
  photoV6css.includes('data-expanded="true"'));
check('original audio element, mute, pause and seek remain',
  ['id="tov-bg-track"','id="tov-music-mute"','id="tov-music-toggle"','id="tov-progress"','id="tov-music-volume"'].every(v=>html.includes(v)));
check('updated PWA precaches all screenshot fix modules',
  sw.includes('tov4r-shell-v9')&&
  sw.includes("'/assets/tov4r-mobile-photo-v6.css?v=2'")&&
  sw.includes("'/assets/tov4r-mobile-photo-v6.js?v=1'"));
check('Unsplash photography is attributed as illustration',
  html.includes('Real gaming photography for visual atmosphere')&&
  html.includes('not actual video frames, game inventories or personal hardware')&&
  html.includes('https://unsplash.com/license'));

check('Clip Manager and other remote photo fallbacks are actual local setup photography',
  html.includes('data-photo-fallback="assets/media/pc-setup.jpg"')&&
  !html.includes('data-photo-fallback="assets/media/game-card-3.jpg"')&&
  v5js.includes("data-photo-fallback','assets/media/pc-setup.jpg"));
check('All CSS gaming-photo backdrops have genuine local photo fallback',
  (read('assets/tov4r-mobile-photo-v6.css').match(/url\(media\/pc-setup\.jpg\)!important/g)||[]).length>=20);

console.log('\n'+successes.length+' passed; '+failures.length+' failed');
if(failures.length){
 console.error('Failed checks:',failures.join('; '));
 process.exitCode=1;
}
