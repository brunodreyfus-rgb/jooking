/* Jooking V2.5.21 - search UI cleanup */
(function(){
  function countFromText(){
    const el=document.getElementById("resultCount");
    const m=el && (el.textContent||"").match(/(\d+)/);
    return m ? Number(m[1]) : null;
  }
  function countCards(){
    const grid=document.getElementById("resultsGrid");
    if(!grid) return 0;
    return [...grid.children].filter(el=>!el.classList.contains("empty-state")).length;
  }
  function updateHint(){
    const title=document.querySelector(".search-title");
    if(!title) return;
    let hint=title.querySelector(".search-result-hint");
    if(!hint){hint=document.createElement("div");hint.className="search-result-hint";title.appendChild(hint);}
    const n=countFromText() ?? countCards();
    hint.textContent=`${n} reported place${n===1?"":"s"} below`;
  }
  function cleanCopy(){
    document.querySelectorAll("p,div,span").forEach(el=>{
      if(el.childElementCount) return;
      el.textContent=el.textContent
        .replace("Live approved reports from Supabase + real-source cases. Fictional demo data is hidden.","Search verified travel reports. Results appear below.")
        .replace("Admin approves in Supabase","Admin approves");
    });
  }
  function run(){
    cleanCopy(); updateHint();
    const rc=document.getElementById("resultCount");
    if(rc) new MutationObserver(updateHint).observe(rc,{childList:true,characterData:true,subtree:true});
    const grid=document.getElementById("resultsGrid");
    if(grid) new MutationObserver(updateHint).observe(grid,{childList:true,subtree:false});
  }
  document.addEventListener("DOMContentLoaded",run);
  window.addEventListener("load",run);
  document.addEventListener("click",()=>setTimeout(updateHint,150));
})();
