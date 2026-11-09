/* TOV4R V5 — Public GitHub Pages + private browser-local editing.
 * No authentication, paid service, fake metrics or made-up match statistics.
 */
(function(){
  'use strict';
  var SITE='https://tov4r.xyz/';
  var localClipKey='tov4r-clip-draft-v5',localProgressKey='tov4r-progress-v5';
  var knownPoster=['clip-ace.svg','clip-2k.svg','clip-headshot.svg','clip-3k.svg'];
  function byId(id){return document.getElementById(id);}
  function say(id,msg){var el=byId(id);if(el)el.textContent=msg;}
  function create(tag,cls,content){
    var el=document.createElement(tag);
    if(cls)el.className=cls;
    if(content!==undefined)el.textContent=String(content);
    return el;
  }
  function read(key){try{var v=localStorage.getItem(key);return v?JSON.parse(v):null;}catch(e){return null;}}
  function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(e){return false;}}
  function clear(key){try{localStorage.removeItem(key);}catch(e){}}
  function link(url,label){
    var a=create('a',null,label);
    a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;
  }
  function clipboard(textValue,statusId){
    if(!navigator.clipboard||!navigator.clipboard.writeText){say(statusId,'Clipboard unavailable — use the manual download instead.');return;}
    navigator.clipboard.writeText(textValue).then(function(){say(statusId,'Copied successfully ✓');})
      .catch(function(){say(statusId,'Copy permission blocked by browser.');});
  }
  function download(textValue,name,type){
    try{
      var blob=new Blob([textValue],{type:type||'text/plain;charset=utf-8'});
      var href=URL.createObjectURL(blob),a=create('a');
      a.href=href;a.download=name;a.style.display='none';
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(href);},1000);
      return true;
    }catch(e){return false;}
  }
  function canonicalClip(value){
    try{
      var u=new URL(String(value).trim());
      if(u.protocol!=='https:'||u.hostname!=='medal.tv')return null;
      var m=/^\/(?:clips|games\/counter-strike-2\/clips)\/([A-Za-z0-9_-]{10,})\/?$/.exec(u.pathname);
      return m?m[1]:null;
    }catch(e){return null;}
  }
  function sanitizeClip(c){
    if(!c||typeof c!=='object'||!(/^[A-Za-z0-9_-]{10,}$/.test(c.id||'')))return null;
    var title=typeof c.title==='string'?c.title.trim().slice(0,70):'';
    if(!title)return null;
    var map=typeof c.map==='string'&&c.map.trim()?c.map.trim().slice(0,45):'Map not provided';
    var poster=knownPoster.includes(c.poster)?c.poster:'clip-ace.svg';
    return {id:c.id,title:title,map:map,poster:poster};
  }
  var publishedCfg=window.TOV4R_PUBLIC_CLIPS||{};
  var publicClips=Array.isArray(publishedCfg.clips)?
    publishedCfg.clips.map(sanitizeClip).filter(Boolean).slice(0,40):[];
  var uniq=new Set();
  publicClips=publicClips.filter(function(c){if(uniq.has(c.id))return false;uniq.add(c.id);return true;});
  // Genuine licensed mood photos. These are deliberately not represented as
  // gameplay frames or photographs of TOV4R's own equipment.
  var publishedPhotoIds=[
    'photo-1636489948870-058e57b5f7d9',
    'photo-1687583326917-530d867c8b2b',
    'photo-1696710257827-75e2e5954059',
    'photo-1703031971880-482e4814c6a3'
  ];
  var publicArea=byId('tov-public-clip-list');
  if(publicArea){
    publicArea.replaceChildren();
    publicClips.forEach(function(c,index){
      var card=create('article','tov-v5-clip');
      var image=create('img');
      image.src='https://images.unsplash.com/'+publishedPhotoIds[index%publishedPhotoIds.length]+'?auto=format&fit=crop&w=850&q=77';
      image.alt='Real gaming atmosphere photo; not an actual frame from '+c.title;
      image.setAttribute('data-photo-fallback','assets/media/game-card-3.jpg');
      image.width=850;image.height=530;image.loading='lazy';image.decoding='async';
      var body=create('div');
      body.appendChild(create('strong',null,c.title));
      body.appendChild(create('small',null,c.map+' · Medal link'));
      body.appendChild(create('small','tov-photo-label','REAL AMBIENCE PHOTO · NOT GAMEPLAY'));
      body.appendChild(link('https://medal.tv/clips/'+c.id,'WATCH ON MEDAL ↗'));
      card.append(image,body);publicArea.appendChild(card);
    });
    if(!publicClips.length)publicArea.appendChild(create('p',null,'No public clip entries available. Original Medal highlights above remain unchanged.'));
  }

  // Public config is not editable by any visitor; the workspace is a local export draft.
  var draft=(function(){
    var d=read(localClipKey);
    if(!d||!Array.isArray(d.clips))return {featuredId:publishedCfg.featuredId||null,clips:publicClips.slice()};
    var seen=new Set();
    var clips=d.clips.map(sanitizeClip).filter(Boolean).filter(function(c){
      if(seen.has(c.id))return false;seen.add(c.id);return true;
    }).slice(0,40);
    return {featuredId:typeof d.featuredId==='string'&&clips.some(c=>c.id===d.featuredId)?d.featuredId:null,clips:clips};
  })();
  var list=byId('tov-clip-draft-list'),featured=byId('tov-clip-featured');
  function repaintDraft(){
    if(!list||!featured)return;
    list.replaceChildren();featured.replaceChildren();
    var auto=create('option',null,'WEEKLY ROTATION (default)');auto.value='';featured.appendChild(auto);
    draft.clips.forEach(function(c){
      var row=create('div','tov-v5-draft');
      var info=create('div');
      info.appendChild(create('strong',null,c.title));
      info.appendChild(create('small',null,c.map+' · '+c.id));
      var del=create('button','tov-v5-btn alt','REMOVE');
      del.type='button';del.setAttribute('aria-label','Remove '+c.title+' from local draft');
      del.addEventListener('click',function(){
        draft.clips=draft.clips.filter(x=>x.id!==c.id);
        if(draft.featuredId===c.id)draft.featuredId=null;
        repaintDraft();say('tov-clip-manager-status','Removed from this local draft only. Public website unchanged.');
      });
      row.append(info,del);list.appendChild(row);
      var option=create('option',null,c.title);option.value=c.id;featured.appendChild(option);
    });
    featured.value=draft.featuredId||'';
  }
  if(featured)featured.addEventListener('change',function(){draft.featuredId=featured.value||null;});
  var clipForm=byId('tov-clip-form');
  if(clipForm)clipForm.addEventListener('submit',function(e){
    e.preventDefault();
    var raw=byId('tov-clip-url').value;
    var id=canonicalClip(raw),title=byId('tov-clip-title').value.trim();
    var map=byId('tov-clip-map').value.trim(),poster=byId('tov-clip-poster').value;
    if(!id){say('tov-clip-manager-status','Please enter a real Medal clip URL (medal.tv/clips/...).');return;}
    if(!title||title.length>70){say('tov-clip-manager-status','Clip title must be 1–70 characters.');return;}
    if(map.length>45){say('tov-clip-manager-status','Map label must be 45 characters or fewer.');return;}
    if(draft.clips.some(c=>c.id===id)){say('tov-clip-manager-status','That Medal clip is already in the draft.');return;}
    if(draft.clips.length>=40){say('tov-clip-manager-status','Maximum 40 clips per public collection.');return;}
    draft.clips.push({id:id,title:title,map:map||'Map not provided',poster:knownPoster.includes(poster)?poster:'clip-ace.svg'});
    repaintDraft();
    clipForm.reset();
    say('tov-clip-manager-status','Added to your local draft. Export and commit the file to publish.');
  });
  if(byId('tov-clip-save'))byId('tov-clip-save').addEventListener('click',function(){
    var saved=save(localClipKey,draft);
    say('tov-clip-manager-status',saved?'Draft saved in this browser only ✓':'Browser storage blocked; export your draft instead.');
  });
  if(byId('tov-clip-reset'))byId('tov-clip-reset').addEventListener('click',function(){
    draft={featuredId:publishedCfg.featuredId||null,clips:publicClips.slice()};
    clear(localClipKey);repaintDraft();
    say('tov-clip-manager-status','Draft reset from the published configuration. Website not modified.');
  });
  function exportedClipSource(){
    return '/* Publish via GitHub: replace assets/tov4r-clips.js; no login/token in source. */\n'+
      'window.TOV4R_PUBLIC_CLIPS = '+JSON.stringify(draft,null,2)+';\n';
  }
  if(byId('tov-clip-export'))byId('tov-clip-export').addEventListener('click',function(){
    if(!draft.clips.length){say('tov-clip-manager-status','Add at least one clip before exporting.');return;}
    var text=exportedClipSource();
    var target=byId('tov-clip-export-text');
    if(target){target.hidden=false;target.value=text;}
    var ok=download(text,'tov4r-clips.js','text/javascript;charset=utf-8');
    say('tov-clip-manager-status',ok?'File downloaded. Commit it to assets/tov4r-clips.js in GitHub to publish.':'Copy the generated code below and replace assets/tov4r-clips.js in GitHub.');
  });
  if(byId('tov-clip-copy'))byId('tov-clip-copy').addEventListener('click',function(){
    clipboard(exportedClipSource(),'tov-clip-manager-status');
  });
  repaintDraft();

  // User-entered CS2 log: local only, intentionally starts EMPTY.
  var validResults=['win','loss','draw','not recorded'];
  function checkedLog(v){
    if(!v||typeof v!=='object'||typeof v.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v.date))return null;
    var date=new Date(v.date+'T00:00:00');
    if(!Number.isFinite(date.valueOf())||date.getFullYear()!==Number(v.date.slice(0,4))||date.getMonth()+1!==Number(v.date.slice(5,7))||date.getDate()!==Number(v.date.slice(8,10))||date>new Date())return null;
    if(!validResults.includes(v.result))return null;
    var map=typeof v.map==='string'?v.map.trim().slice(0,40):'';
    var kills=v.kills,deaths=v.deaths;
    if((kills===null)!==(deaths===null))return null;
    if(kills!==null&&(!Number.isInteger(kills)||!Number.isInteger(deaths)||kills<0||deaths<0||kills>120||deaths>120))return null;
    return {id:String(v.id||'').slice(0,70),date:v.date,map:map||'Unspecified map',result:v.result,kills:kills,deaths:deaths};
  }
  var logs=(function(){
    var v=read(localProgressKey);
    return Array.isArray(v)?v.map(checkedLog).filter(Boolean).slice(0,100):[];
  })();
  var progressList=byId('tov-progress-list');
  function renderProgress(){
    if(!progressList)return;
    progressList.replaceChildren();
    var el=byId('tov-progress-entries'),wl=byId('tov-progress-wl'),ratio=byId('tov-progress-kd');
    if(el)el.textContent=logs.length?String(logs.length)+' manual entries':'NO ENTRIES YET';
    var wins=logs.filter(x=>x.result==='win').length;
    var losses=logs.filter(x=>x.result==='loss').length;
    if(wl)wl.textContent=logs.length?wins+' W / '+losses+' L':'—';
    var stat=logs.filter(x=>x.kills!==null),k=stat.reduce((n,x)=>n+x.kills,0),d=stat.reduce((n,x)=>n+x.deaths,0);
    if(ratio)ratio.textContent=stat.length&&d?String((k/d).toFixed(2)):'—';
    logs.slice().reverse().forEach(function(record){
      var row=create('div','tov-v5-draft');
      var description=create('div');
      description.appendChild(create('strong',null,record.date+' · '+record.map+' · '+record.result.toUpperCase()));
      description.appendChild(create('small',null,record.kills===null?'K/D not provided':record.kills+' kills / '+record.deaths+' deaths (entered by user)'));
      var del=create('button','tov-v5-btn alt','DELETE');
      del.type='button';del.setAttribute('aria-label','Delete manual entry from '+record.date);
      del.addEventListener('click',function(){
        logs=logs.filter(x=>x.id!==record.id);
        save(localProgressKey,logs);renderProgress();
        say('tov-progress-status','Removed from this device.');
      });
      row.append(description,del);progressList.appendChild(row);
    });
    if(!logs.length)progressList.appendChild(create('p','tov-v5-disclaimer','No CS2 matches have been entered here. Nothing is imported from Steam or XPLAY.'));
  }
  var progressForm=byId('tov-progress-form');
  if(progressForm)progressForm.addEventListener('submit',function(e){
    e.preventDefault();
    var date=byId('tov-progress-date').value;
    var map=byId('tov-progress-map').value;
    var result=byId('tov-progress-result').value;
    var kVal=byId('tov-progress-kills').value,dVal=byId('tov-progress-deaths').value;
    if((kVal==='')!==(dVal==='')){say('tov-progress-status','Enter both kills and deaths, or leave both blank.');return;}
    var candidate=checkedLog({
      id:String(Date.now())+'-'+String(Math.random()).slice(2,10),
      date:date,map:map,result:result,kills:kVal===''?null:Number(kVal),deaths:dVal===''?null:Number(dVal)
    });
    if(!candidate){say('tov-progress-status','Check date and values (0–120). Future dates are not accepted.');return;}
    if(logs.length>=100){say('tov-progress-status','Maximum of 100 locally saved entries. Export before clearing.');return;}
    logs.push(candidate);
    var saved=save(localProgressKey,logs);
    renderProgress();progressForm.reset();
    say('tov-progress-status',saved?'Entry saved on this device only. Not a verified API match.':'Entry added for this session; local storage is blocked.');
  });
  if(byId('tov-progress-export'))byId('tov-progress-export').addEventListener('click',function(){
    var data={source:'manual user entries only; no verification',exportedAt:new Date().toISOString(),entries:logs};
    say('tov-progress-status',download(JSON.stringify(data,null,2),'tov4r-progress.json','application/json')?'Local match log exported.':'Export unavailable in this browser.');
  });
  if(byId('tov-progress-clear'))byId('tov-progress-clear').addEventListener('click',function(){
    if(!logs.length){say('tov-progress-status','No entries to clear.');return;}
    if(!window.confirm('Clear all your manually entered matches from this device?'))return;
    logs=[];clear(localProgressKey);renderProgress();say('tov-progress-status','All local entries cleared.');
  });
  renderProgress();

  // QR generated from the fixed 25x25 QR matrix for https://tov4r.xyz/ .
  // It is static, offline and does not send the profile URL to any third party.
  var qrRows=[
    '01fc557f','01055c41','0175d45d','0175b65d','0174995d',
    '0104ed41','01fd557f','00016800','010535ce','00e2863e',
    '00d6928b','019264a9','01c7cc41','01515fa2','0177cefb',
    '010ade2d','013515f4','00010110','01fc5d51','0104a510',
    '017463f5','01745843','01740e8d','01049bf1','01fd39c9'
  ];
  var qrBox=byId('tov-v5-qr');
  if(qrBox&&document.createElementNS){
    var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
    svg.setAttribute('viewBox','0 0 31 31');svg.setAttribute('role','img');
    svg.setAttribute('aria-label','QR code for https://tov4r.xyz/');
    var dQr='';
    qrRows.forEach(function(hex,row){
      var bits=parseInt(hex,16).toString(2).padStart(25,'0').slice(-25);
      for(var col=0;col<25;col++)if(bits[col]==='1')dQr+='M'+(col+3)+' '+(row+3)+'h1v1h-1z';
    });
    path.setAttribute('fill','#151015');path.setAttribute('d',dQr);svg.appendChild(path);qrBox.replaceChildren(svg);
  }
  if(byId('tov-profile-copy'))byId('tov-profile-copy').addEventListener('click',function(){clipboard(SITE,'tov-profile-status');});
  if(byId('tov-profile-share'))byId('tov-profile-share').addEventListener('click',function(){
    if(navigator.share){
      navigator.share({title:'TOV4R Gaming Portfolio',text:'TOV4R | CS2 highlights and gaming portfolio',url:SITE})
        .then(function(){say('tov-profile-status','Profile shared ✓');})
        .catch(function(){say('tov-profile-status','Share cancelled or unavailable.');});
    }else clipboard(SITE,'tov-profile-status');
  });

  // Gallery enlarges only the site's existing, allowed images; never claims concept art is owned gear.
  var galleryAllow=new Set([
    'assets/media/pc-setup.jpg',
    'https://images.unsplash.com/photo-1733945761533-727f49908d70?auto=format&fit=crop&w=1600&q=84',
    'https://images.unsplash.com/photo-1687583326917-530d867c8b2b?auto=format&fit=crop&w=1600&q=84'
  ]);
  var galleryDialog=byId('tov-v5-setup-dialog'),galleryImg=byId('tov-v5-gallery-image'),galleryText=byId('tov-v5-gallery-caption');
  document.querySelectorAll('[data-v5-gallery-src]').forEach(function(button){
    button.addEventListener('click',function(){
      var src=button.getAttribute('data-v5-gallery-src');
      if(!galleryAllow.has(src)||!galleryDialog||!galleryImg)return;
      galleryImg.src=src;galleryImg.alt=button.getAttribute('data-v5-gallery-alt')||'Gaming setup artwork';
      if(galleryText)galleryText.textContent=button.getAttribute('data-v5-gallery-caption')||'Illustrative image';
      if(typeof galleryDialog.showModal==='function')galleryDialog.showModal();
    });
  });
  if(byId('tov-v5-gallery-close'))byId('tov-v5-gallery-close').addEventListener('click',function(){if(galleryDialog)galleryDialog.close();});
  if(galleryDialog)galleryDialog.addEventListener('close',function(){if(galleryImg)galleryImg.removeAttribute('src');});

  // Analytics panel: only actual Umami setup state; no made-up visitor counts.
  var cfg=window.TOV4R_ANALYTICS||{},validId=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var enabled=cfg.provider==='umami'&&validId.test(cfg.websiteId||'');
  say('tov-analytics-state',enabled?'UMAMI CONFIGURED':'NOT CONNECTED');
  say('tov-analytics-data',enabled?'View actual data inside Umami':'NO REAL VISITOR DATA HERE');
  say('tov-analytics-privacy',enabled?'Umami tracking configured · DNT/GPC respected':'TRACKING DISABLED');
  var analyticsForm=byId('tov-analytics-form');
  if(analyticsForm)analyticsForm.addEventListener('submit',function(e){
    e.preventDefault();
    var id=byId('tov-analytics-id').value.trim();
    if(!validId.test(id)){say('tov-analytics-status','Enter the real Website ID (UUID) from your own Umami account.');return;}
    var snippet='window.TOV4R_ANALYTICS={provider:"umami",websiteId:'+JSON.stringify(id)+'};';
    clipboard(snippet,'tov-analytics-status');
    say('tov-analytics-status','Copy the configuration into assets/tov4r-analytics-config.js and commit it. No tracking starts just from this form.');
  });
})();