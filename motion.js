"use strict";
(()=>{const root=document.documentElement, toggle=document.getElementById("motion-toggle"),meter=document.querySelector(".scroll-meter"),mq=matchMedia("(prefers-reduced-motion: reduce)");let manual=false,observer=null;
const targets=[...document.querySelectorAll(".section-head,.features article,.steps article,.module-figure,.brand-showcase,.live-strip,.commandlist,.dashboard,.faq details")];
function stopReveal(){observer?.disconnect();observer=null;for(const el of targets){el.classList.remove("reveal-pending");el.classList.add("reveal-ready");}}
function setMotion(){const paused=manual||mq.matches;root.classList.toggle("motion-paused",paused);toggle.hidden=mq.matches;toggle.setAttribute("aria-pressed",String(manual));toggle.textContent=manual?"Reprendre animations":"Pause animations";if(paused)stopReveal();}
toggle.addEventListener("click",()=>{manual=!manual;setMotion();});
if(mq.addEventListener)mq.addEventListener("change",setMotion);
if(!mq.matches&&"IntersectionObserver" in window){observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove("reveal-pending");entry.target.classList.add("reveal-ready");observer?.unobserve(entry.target);}},{threshold:.08});for(const el of targets){if(el.getBoundingClientRect().top>innerHeight+40){el.classList.add("reveal-pending");observer.observe(el);}}}
setMotion();let queued=false;function scroll(){if(queued)return;queued=true;requestAnimationFrame(()=>{const max=root.scrollHeight-innerHeight;meter.style.transform="scaleX("+Math.max(0,Math.min(1,max>0?scrollY/max:0))+")";queued=false;});}
addEventListener("scroll",scroll,{passive:true});addEventListener("resize",scroll);scroll();
document.addEventListener("focusin",e=>{const el=e.target.closest(".reveal-pending");if(el){el.classList.remove("reveal-pending");el.classList.add("reveal-ready");}});
})();