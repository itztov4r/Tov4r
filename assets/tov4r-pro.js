
/* TOV4R player UI: public data display and Medal video modal */
(function(){
 'use strict';
 var data=window.TOV4R_PLAYER_DATA||{},settings=data.settings||{},collection=data.collection||{};
 document.querySelectorAll('[data-tov-setting]').forEach(function(el){var key=el.getAttribute('data-tov-setting'),value=settings[key];if(value!==null&&value!==undefined&&String(value).trim())el.textContent=String(value);});
 document.querySelectorAll('[data-tov-collection]').forEach(function(el){var key=el.getAttribute('data-tov-collection'),value=collection[key];if(value!==null&&value!==undefined&&String(value).trim())el.textContent=String(value);});
 var copyBtn=document.getElementById('tov-copy-xhair');
 if(copyBtn&&typeof settings.crosshairCode==='string'&&settings.crosshairCode.trim()){
   copyBtn.disabled=false;
   copyBtn.addEventListener('click',function(){
     if(!navigator.clipboard||!navigator.clipboard.writeText)return;
     navigator.clipboard.writeText(settings.crosshairCode.trim()).then(function(){copyBtn.textContent='COPIED ✓';setTimeout(function(){copyBtn.textContent='COPY CODE';},2100);}).catch(function(){copyBtn.textContent='COPY UNAVAILABLE';});
   });
 }
 var mark=document.getElementById('tov-xhair-mark');
 if(mark){
   var inputs=document.querySelectorAll('[data-tov-demo]'),props={length:'--xh-length',gap:'--xh-gap',thick:'--xh-thick',color:'--xh-color'};
   function render(){inputs.forEach(function(input){var key=input.getAttribute('data-tov-demo');if(!props[key])return;mark.style.setProperty(props[key],key==='color'?input.value:input.value+'px');var output=document.getElementById('tov-demo-'+key);if(output)output.textContent=key==='color'?input.options[input.selectedIndex].text:input.value;});}
   inputs.forEach(function(input){input.addEventListener('input',render);});render();
 }
 var dlg=document.getElementById('tov-medal-modal'),frame=document.getElementById('tov-medal-iframe'),title=document.getElementById('tov-medal-name'),external=document.getElementById('tov-medal-direct'),music=document.getElementById('tov-bg-track'),resume=false;
 if(dlg&&frame&&title&&external&&typeof dlg.showModal==='function'){
   document.querySelectorAll('#highlights .tov-clip-video-btn').forEach(function(card){
     var poster=card.closest('.tov-clip-card').querySelector('.tov-clip-poster');if(poster)poster.addEventListener('click',function(e){if(e.target.closest('button,a'))return;card.click();});
     card.addEventListener('click',function(event){
       if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.defaultPrevented)return;
       var href=card.getAttribute('data-medal-url')||'',match=/^https:\/\/medal\.tv\/clips\/([A-Za-z0-9_-]+)$/.exec(href);
       if(!match)return;
       event.preventDefault();
       var clipTitle=card.closest('.tov-clip-card').querySelector('.tov-clip-info strong');
       title.textContent=clipTitle?clipTitle.textContent:'TOV4R HIGHLIGHT';
       external.href=href;frame.title='Medal video '+title.textContent;
       resume=!!music&&!music.paused;if(resume)music.pause();
       dlg.showModal();frame.src='https://medal.tv/clip/'+match[1]+'?autoplay=1&muted=0&loop=0&cta=0';
       var close=dlg.querySelector('[data-tov-close]');if(close)close.focus();
     });
   });
   var closeBtn=dlg.querySelector('[data-tov-close]');if(closeBtn)closeBtn.addEventListener('click',function(){dlg.close();});
   dlg.addEventListener('click',function(event){if(event.target===dlg)dlg.close();});
   dlg.addEventListener('close',function(){
     frame.src='about:blank';
     if(resume&&music){try{var result=music.play();if(result&&result.catch)result.catch(function(){});}catch(e){}}
     resume=false;
   });
 }
})();
