/* Loading skeletons, and the Data / Loading / Empty / Error switches for both lists. */
/* ---------- List states: loading (skeleton) / empty / error ---------- */
function syncDemo(containerId, attr, state){
  var c = byId(containerId); if(!c) return;
  c.querySelectorAll("button").forEach(function(b){ b.classList.toggle("active", b.getAttribute(attr)===state); });
}
function followupsSkeletonHtml(){
  var card = '<div class="skeleton-card" aria-hidden="true"><div class="sk-row"><div style="flex:1"><div class="sk sk-line w55"></div><div class="sk sk-line w40" style="margin-bottom:0"></div></div><div class="sk sk-arr"></div></div><div class="sk sk-line w85" style="margin-top:16px"></div><div class="sk-actions"><div class="sk sk-btn"></div><div class="sk sk-btn"></div><div class="sk sk-btn small"></div></div></div>';
  return '<div role="status" aria-label="Loading follow-ups"><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Loading follow-ups…</span>' + card + card + card + '</div>';
}
function historySkeletonHtml(){
  var row = '<div class="sk-row"><div class="sk sk-avatar"></div><div style="flex:1"><div class="sk sk-line w70"></div><div class="sk sk-line w55" style="margin-bottom:0"></div></div><div class="sk" style="width:58px;height:12px"></div></div>';
  return '<div class="hist-skeleton" role="status" aria-label="Loading activity"><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Loading activity…</span>' + row + row + row + row + '</div>';
}
function setFollowupsState(state){
  followupsState = state;
  syncDemo("followupsDemo","data-fstate",state);
  if(state==="loading"){
    renderTodo();
    clearTimeout(followupsTimer);
    followupsTimer = setTimeout(function(){ followupsState="ready"; syncDemo("followupsDemo","data-fstate","ready"); renderTodo(); }, 750);
    return;
  }
  renderTodo();
}
function setHistoryState(state){
  historyState = state;
  syncDemo("historyDemo","data-hstate",state);
  if(state==="loading"){
    renderHistory();
    clearTimeout(historyTimer);
    historyTimer = setTimeout(function(){ historyState="ready"; syncDemo("historyDemo","data-hstate","ready"); renderHistory(); }, 750);
    return;
  }
  renderHistory();
}
