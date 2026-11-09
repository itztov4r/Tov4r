(function(){
'use strict';
const games=Array.isArray(window.TOV4R_DOWNLOAD_GAMES)?window.TOV4R_DOWNLOAD_GAMES:[];
const $=id=>document.getElementById(id);
const listing=$('games'),search=$('search'),os=$('os'),result=$('result-count'),empty=$('empty');
let category='Tous';
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function buttonLink(game){const a=el('a',null,'TÉLÉCHARGER ↗');a.href=game.url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Télécharger '+game.name+' sur le site officiel');return a;}
function imageFor(game,cls){const img=el('img',cls);img.src=game.image;img.alt='Capture réelle du jeu '+game.name;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>{img.style.display='none';},{once:true});return img;}
function card(game){
 const article=el('article','game');
 const visual=el('div','game-cover');visual.style.setProperty('--card',game.color);
 visual.append(el('div','cover-fallback',game.name.toUpperCase().slice(0,9)),imageFor(game,null),el('span','tag',game.tag));
 const body=el('div','game-body'),heading=el('div','game-heading');
 heading.append(el('h3',null,game.name),el('span','free-label','GRATUIT'));
 body.append(heading,el('div','game-sub',game.genre.toUpperCase()),el('p','game-text',game.description));
 const platforms=el('div','platforms');for(const platform of game.os)platforms.append(el('span',null,platform));
 body.append(platforms);
 const actions=el('div','card-actions'),details=el('button',null,'DÉTAILS +');details.type='button';details.addEventListener('click',()=>openDetails(game));
 actions.append(buttonLink(game),details);body.append(actions);article.append(visual,body);return article;
}
function render(){
 const term=search.value.trim().toLocaleLowerCase('fr');
 const visible=games.filter(g=>(category==='Tous'||g.genre===category)&&(os.value==='Tous'||g.os.includes(os.value))&&[g.name,g.genre,g.description].join(' ').toLocaleLowerCase('fr').includes(term));
 listing.replaceChildren(...visible.map(card));result.textContent=visible.length+' JEU'+(visible.length!==1?'X':'')+' DISPONIBLE'+(visible.length!==1?'S':'');empty.hidden=visible.length!==0;
}
function openDetails(game){
 $('detail-name').textContent=game.name;$('detail-genre').textContent=game.genre.toUpperCase()+' / GRATUIT';
 $('detail-description').textContent=game.details;$('detail-install').textContent=game.install;
 $('detail-os').textContent=game.os.join(' • ');
 const link=$('detail-download');link.href=game.url;
 const source=$('detail-source');source.href=game.creditUrl;source.textContent=game.credit+' ↗';
 const img=$('detail-image');img.style.display='block';img.src=game.image;img.alt='Capture du jeu '+game.name;img.onerror=()=>{img.style.display='none';};
 const dialog=$('detail-dialog');if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}
document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{
 category=btn.dataset.category;document.querySelectorAll('[data-category]').forEach(b=>{const selected=b===btn;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});render();
}));
search.addEventListener('input',render);os.addEventListener('change',render);
$('close-dialog').addEventListener('click',()=>$('detail-dialog').close());
$('detail-dialog').addEventListener('click',e=>{if(e.target===$('detail-dialog'))$('detail-dialog').close()});
$('year').textContent=String(new Date().getFullYear());
render();
})();