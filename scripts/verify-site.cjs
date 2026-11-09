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
check('live analytics not invented',/provider:"none"/.test(read('assets/tov4r-analytics-config.js')));
console.log('\n'+successes.length+' passed; '+failures.length+' failed');
if(failures.length){
 console.error('Failed checks:',failures.join('; '));
 process.exitCode=1;
}
