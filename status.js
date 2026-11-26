"use strict";
(async()=>{
  const status=document.getElementById("bot-online"), servers=document.getElementById("bot-servers"), info=document.getElementById("stats-info");
  try{
    const response=await fetch("https://tov4r-bot-production.up.railway.app/public/stats",{cache:"no-store",credentials:"omit",signal:AbortSignal.timeout(8000)});
    if(!response.ok) throw Error("unavailable");
    const data=await response.json();
    if(typeof data.online!=="boolean") throw Error("invalid");
    status.textContent=data.online?"En ligne":"Connexion en cours";
    servers.textContent=data.online&&Number.isSafeInteger(data.servers)&&data.servers>=0?String(data.servers):"—";
    info.textContent="Données agrégées du bot au chargement de la page.";
  }catch{
    status.textContent="Statut indisponible";
    servers.textContent="—";
    info.textContent="Les statistiques ne sont pas disponibles actuellement.";
  }
})();
