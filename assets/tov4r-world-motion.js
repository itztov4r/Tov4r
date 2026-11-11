/* Full-site TOV4R living wallpaper. One fixed layer behind all sections. */
(function(){
 'use strict';
 if(!document.body)return;
 var body=document.body;
 if(document.querySelector('.tov-world-scene'))return;
 var path=location.pathname;
 var type=path.indexOf('/downloads')===0?'downloads':path.indexOf('studio')!==-1?'studio':'home';
 var privacy=/privacy\.html$/i.test(path);
 body.classList.add('tov-world-motion','tov-world-motion-'+type);
 if(privacy)body.classList.add('tov-world-motion-privacy');
 var scene=document.createElement('div');
 scene.className='tov-world-scene';
 scene.setAttribute('aria-hidden','true');
 ['tov-world-photo','tov-world-figure','tov-world-vignette','tov-world-aura','tov-world-film'].forEach(function(name){
  var node=document.createElement('div');node.className=name;scene.appendChild(node);
 });
 body.insertBefore(scene,body.firstChild);
 document.addEventListener('visibilitychange',function(){
  body.classList.toggle('tov-world-sleeping',document.hidden);
 });
})();
