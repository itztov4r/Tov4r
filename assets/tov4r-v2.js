/* TOV4R WEBSITE V2 · additive interactions; player settings are never overwritten. */
(function(){
  'use strict';

  function byId(id){return document.getElementById(id);}
  function safeRead(key){try{return localStorage.getItem(key);}catch(e){return null;}}
  function safeWrite(key,value){try{localStorage.setItem(key,value);return true;}catch(e){return false;}}
  function safeRemove(key){try{localStorage.removeItem(key);}catch(e){}}
  function status(id,message){var node=byId(id);if(node)node.textContent=message;}

  // Premium appearance is a site-only effect, independent from all CS2 configs.
  var modeButton=byId('tov-visual-mode'),modeKey='tov4r-v2-theme';
  function applyTheme(stealth){
    document.body.classList.toggle('tov-stealth',stealth);
    if(modeButton){
      modeButton.setAttribute('aria-pressed',String(stealth));
      modeButton.textContent=stealth?'◈ STEALTH MODE':'◆ REDLINE MODE';
      modeButton.title=stealth?'Switch to Redline mode':'Switch to Stealth mode';
    }
  }
  applyTheme(safeRead(modeKey)==='stealth');
  if(modeButton)modeButton.addEventListener('click',function(){
    var stealth=!document.body.classList.contains('tov-stealth');
    applyTheme(stealth);
    safeWrite(modeKey,stealth?'stealth':'redline');
  });

  // Crosshair Studio modifies only the illustrative preview — never a real CS2 share code.
  var mark=byId('tov-xhair-mark'),studio=byId('crosshair-studio'),studioKey='tov4r-crosshair-demo-v2';
  if(mark&&studio){
    var knobs={},keys=['length','gap','thick','color'];
    keys.forEach(function(key){knobs[key]=document.querySelector('[data-tov-demo="'+key+'"]');});
    var dot=byId('tov-studio-dot'),outline=byId('tov-studio-outline');
    var presets={
      redline:{length:6,gap:4,thick:2,color:'#ff5e75',dot:false,outline:false},
      focus:{length:5,gap:3,thick:2,color:'#4bf5b6',dot:false,outline:true},
      micro:{length:3,gap:5,thick:1,color:'#ffffff',dot:true,outline:true},
      bright:{length:10,gap:7,thick:3,color:'#f3d574',dot:false,outline:true}
    };
    var presetButtons=[].slice.call(document.querySelectorAll('[data-studio-preset]'));
    function snapshot(){
      var result={};
      keys.forEach(function(key){if(knobs[key])result[key]=key==='color'?knobs[key].value:Number(knobs[key].value);});
      result.dot=!!dot&&dot.checked;
      result.outline=!!outline&&outline.checked;
      return result;
    }
    function isValid(s){
      if(!s||typeof s!=='object'||Array.isArray(s))return false;
      var limits={length:[2,16],gap:[2,12],thick:[1,5]};
      var numbers=Object.keys(limits).every(function(key){return Number.isInteger(s[key])&&s[key]>=limits[key][0]&&s[key]<=limits[key][1];});
      var select=knobs.color;
      var options=select?Array.prototype.map.call(select.options,function(o){return o.value;}):[];
      return numbers&&options.includes(s.color)&&typeof s.dot==='boolean'&&typeof s.outline==='boolean';
    }
    function updateDecorations(){
      mark.dataset.outline=String(!!outline&&outline.checked);
      var center=byId('tov-xhair-dot');if(center)center.hidden=!(dot&&dot.checked);
    }
    function updatePresetState(active){
      presetButtons.forEach(function(button){
        button.setAttribute('aria-pressed',String(active===button.getAttribute('data-studio-preset')));
      });
    }
    function applyPreview(s,active){
      if(!isValid(s))return;
      keys.forEach(function(key){
        var control=knobs[key];
        if(!control)return;
        control.value=String(s[key]);
        // Existing tov4r-pro.js already listens for the 'input' event.
        control.dispatchEvent(new Event('input',{bubbles:true}));
      });
      if(dot)dot.checked=s.dot;
      if(outline)outline.checked=s.outline;
      updateDecorations();
      updatePresetState(active||'');
    }
    presetButtons.forEach(function(button){
      button.addEventListener('click',function(){
        var name=button.getAttribute('data-studio-preset');
        if(!Object.prototype.hasOwnProperty.call(presets,name))return;
        applyPreview(presets[name],name);
        status('tov-studio-status',name.toUpperCase()+' preview loaded · visual demo only');
      });
    });
    keys.forEach(function(key){
      if(knobs[key])knobs[key].addEventListener('input',function(){updatePresetState('');});
    });
    [dot,outline].forEach(function(control){
      if(control)control.addEventListener('change',function(){
        updateDecorations();
        updatePresetState('');
      });
    });
    var save=byId('tov-studio-save'),reset=byId('tov-studio-reset'),copy=byId('tov-studio-copy');
    if(save)save.addEventListener('click',function(){
      var saved=safeWrite(studioKey,JSON.stringify(snapshot()));
      status('tov-studio-status',saved?'Preview saved on this device ✓':'Local storage unavailable. Your preview still works.');
    });
    if(reset)reset.addEventListener('click',function(){
      applyPreview(presets.redline,'redline');
      safeRemove(studioKey);
      status('tov-studio-status','Restored REDLINE V1 demo · saved customization cleared');
    });
    if(copy)copy.addEventListener('click',function(){
      var s=snapshot();
      var summary='TOV4R VISUAL CROSSHAIR DEMO (not an official CS2 import code)\n'+
        'Length: '+s.length+' | Gap: '+s.gap+' | Thickness: '+s.thick+
        ' | Color: '+s.color+' | Center dot: '+(s.dot?'on':'off')+
        ' | Outline: '+(s.outline?'on':'off');
      if(!navigator.clipboard||!navigator.clipboard.writeText){
        status('tov-studio-status','Clipboard unavailable. Check browser permissions.');
        return;
      }
      navigator.clipboard.writeText(summary).then(function(){
        status('tov-studio-status','Demo settings copied ✓ · NOT a CS2 share code');
      }).catch(function(){
        status('tov-studio-status','Clipboard access blocked by browser');
      });
    });
    var stored=safeRead(studioKey);
    if(stored){
      try{var parsed=JSON.parse(stored);if(isValid(parsed)){applyPreview(parsed,'');status('tov-studio-status','Restored saved visual preview from this browser');}}
      catch(e){}
    }else{
      updateDecorations();
      updatePresetState('redline');
    }
  }

  // Community invite: do not invent event times, membership counts or channels.
  var invite='https://discord.gg/ScxyVUb7m';
  var copyInvite=byId('tov-discord-copy');
  if(copyInvite)copyInvite.addEventListener('click',function(){
    if(!navigator.clipboard||!navigator.clipboard.writeText){
      status('tov-discord-status','Copy unavailable. Use JOIN DISCORD instead.');return;
    }
    navigator.clipboard.writeText(invite).then(function(){
      status('tov-discord-status','Invite copied to clipboard ✓');
    }).catch(function(){status('tov-discord-status','Copy blocked. Use JOIN DISCORD instead.');});
  });

  // Public clip showcase and future ideas are separate, explicitly labeled categories.
  var achievementCards=[].slice.call(document.querySelectorAll('[data-tov-achievement-kind]'));
  var filterButtons=[].slice.call(document.querySelectorAll('[data-achievements-filter]'));
  var counter=byId('tov-achievement-count');
  function showAchievements(filter){
    var visible=0;
    achievementCards.forEach(function(card){
      var kind=card.getAttribute('data-tov-achievement-kind');
      var show=filter==='all'||kind===filter;
      card.hidden=!show;
      if(show)visible++;
    });
    filterButtons.forEach(function(button){button.setAttribute('aria-pressed',String(button.getAttribute('data-achievements-filter')===filter));});
    if(counter)counter.textContent=visible+' of '+achievementCards.length+' cards shown · clips and ideas are separate';
  }
  filterButtons.forEach(function(button){
    button.addEventListener('click',function(){
      var kind=button.getAttribute('data-achievements-filter');
      if(kind==='all'||kind==='clip'||kind==='goal')showAchievements(kind);
    });
  });
  if(achievementCards.length)showAchievements('all');
})();