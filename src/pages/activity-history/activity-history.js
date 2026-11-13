/* Activity History screen: search, rows that open Deal Detail, Back, and its list-state controls. */
/* ---------- Activity History ---------- */
function renderHistory(){
  var wrap = byId("historyList"); if(!wrap) return;
  if(historyState==="loading"){
    byId("historyCount").textContent = "";
    wrap.innerHTML = historySkeletonHtml();
    return;
  }
  if(historyState==="error"){
    byId("historyCount").textContent = "";
    wrap.innerHTML = '<div class="state-error" role="alert" style="box-shadow:none;border:0;padding:12px 4px"><p>Couldn\'t load your activity. Check your connection and try again.</p><button type="button" class="btn-retry" id="historyRetry">Retry</button></div>';
    byId("historyRetry").addEventListener("click", function(){ setHistoryState("loading"); });
    return;
  }
  var q = byId("historySearch").value.trim().toLowerCase();
  var items = allActivity().filter(function(f){
    if(!q) return true;
    var d = dealById(f.dealId);
    return d && (d.contact.toLowerCase().indexOf(q)>=0 || d.company.toLowerCase().indexOf(q)>=0);
  });
  if(historyState==="empty"){
    byId("historyCount").textContent = "0 activities · newest first";
    wrap.innerHTML = '<div class="empty" style="border:0"><span class="empty-plain">No activity yet. Call or email a follow-up to see it here.</span></div>';
    return;
  }
  byId("historyCount").textContent = items.length + (items.length===1 ? " activity" : " activities") + (q ? " matching “" + byId("historySearch").value.trim() + "”" : " · newest first");
  if(items.length===0){
    if(q){
      wrap.innerHTML = '<div class="empty"><b>No activity found</b>Nothing matches “' + esc(byId("historySearch").value.trim()) + '”. Try a contact name or company.</div>';
    } else {
      wrap.innerHTML = '<div class="empty"><span class="empty-plain">No activity yet. Call or email a follow-up to see it here.</span></div>';
    }
    return;
  }
  wrap.innerHTML = items.map(function(f){ return activityRowHtml(f, true); }).join("");
  wrap.querySelectorAll("[data-deal]").forEach(function(b){
    b.addEventListener("click", function(){ openDeal(b.getAttribute("data-deal")); });
  });
}
byId("historySearch").addEventListener("input", renderHistory);
byId("historyBack").addEventListener("click", function(){ showView("today"); });
document.querySelectorAll("#historyDemo button").forEach(function(b){
  b.addEventListener("click", function(){ setHistoryState(b.getAttribute("data-hstate")); });
});
