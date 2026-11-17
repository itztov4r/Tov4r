/* TOV4R STUDIO regression checks — dependency-free node script. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const results = [];
function check(description, ok) {
  results.push({ description, ok: Boolean(ok) });
  console.log((ok ? 'PASS ' : 'FAIL ') + description);
}
function local(file) {
  const raw = file.split(/[?#]/)[0];
  if (!raw || raw === '/') return 'index.html';
  const clean = raw.replace(/^\//, '');
  if (clean.startsWith('..') || path.posix.normalize(clean).startsWith('..')) return null;
  return clean;
}
const index = read('index.html');
check('HTML5 homepage', /^<!doctype html>/i.test(index.trim()));
check('Studio branding', /TOV4R STUDIO/.test(index) && /MAKE IT/.test(index));
const ids = [...index.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
check('Unique IDs', ids.length === new Set(ids).size);
check('Balanced sections', (index.match(/<section\b/g)||[]).length === (index.match(/<\/section>/g)||[]).length);
const hashes = [...index.matchAll(/\bhref="#([^"]+)"/g)].map(m=>m[1]);
check('Anchor targets exist', hashes.every(id => ids.includes(id)));
check('New-tab links safe', [...index.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].every(m => /rel="[^"]*noopener[^"]*noreferrer/.test(m[0])));
const links = [...index.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
const localLinks = links.filter(p => /^\//.test(p) && !p.startsWith('//'));
check('All local home links and assets exist', localLinks.every(p => {const f=local(p);return f && exists(f);}));
check('No inline event handlers', !/\s(?:onclick|onload|onerror|onmouseover)\s*=/i.test(index));
check('SEO and social metadata', /rel="canonical"/.test(index) && /name="description"/.test(index) && /property="og:title"/.test(index) && /application\/ld\+json/.test(index));
check('Catalog search + filters + 4 real releases', /id="product-search"/.test(index) && (index.match(/class="product"/g)||[]).length >= 4 && (index.match(/class="filter"/g)||[]).length >= 2);
check('No false download destinations', !/href="#".*download/i.test(index));
check('Legacy archive exists', exists('legacy.html'));
check('Theme downloads exist', ['themes/TOV4R-DeathNote.theme.css','themes/Crimson-Ledger.theme.css'].every(exists));
for (const f of ['themes/TOV4R-DeathNote.theme.css','themes/Crimson-Ledger.theme.css']) {
 const content = read(f);
 check('Valid metadata '+f, content.includes('@name') && content.includes('@author') && content.includes('@version'));
 check('Balanced CSS '+f, (content.match(/{/g)||[]).length===(content.match(/}/g)||[]).length);
}
for (const f of ['templates/noirfolio.html','templates/launchdeck.html']) {
 const content = read(f);
 check('Standalone template '+f, /^<!doctype html>/i.test(content.trim()) && content.includes('<style>') && content.includes('</style>') && content.includes('<main'));
 const inline = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 try {inline.forEach(s=>new vm.Script(s,{filename:f}));check('Template JS parses '+f,true);}
 catch (e) {check('Template JS parses '+f,false);console.error(e.message);}
}
for (const f of ['studio/site.js','service-worker.js']) {
 try{new vm.Script(read(f),{filename:f});check('JS parses '+f,true);}
 catch(e){check('JS parses '+f,false);console.error(e.message);}
}
for (const f of ['studio/site.css']) {
 const content=read(f);
 check('CSS blocks balanced '+f,(content.match(/{/g)||[]).length===(content.match(/}/g)||[]).length);
}
try{const m=JSON.parse(read('manifest.webmanifest'));check('PWA manifest valid',m.name.includes('STUDIO') && m.icons.every(i=>exists(local(i.src))));}
catch(e){check('PWA manifest valid',false);}
const service=read('service-worker.js');
const assets=[...service.matchAll(/'\/(.*?)'/g)].map(m=>m[1]).filter(s=>s && !s.includes('*'));
check('Service worker has offline asset list',/const ASSETS=/.test(service));
check('Social + sitemap available', exists('robots.txt') && read('robots.txt').includes('Sitemap:') && read('sitemap.xml').includes('https://tov4r.xyz/'));
const failures=results.filter(x=>!x.ok);
console.log('\n'+(failures.length?'FAILED':'ALL PASSED')+': '+(results.length-failures.length)+'/'+results.length);
if(failures.length)process.exitCode=1;
