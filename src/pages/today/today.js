/* Today screen: summary and progress line, the follow-up queue, sorting, the selected-deal
   context panel, and Updated today. Selecting a contact only changes the context panel. */
var calendarSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/></svg>';
var clockSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
var SORT_NOTES = { arr: "Highest sample ARR first", overdue: "Most days overdue first, then highest sample ARR" };

function dueBadgeHtml(d){
  var over = daysOverdue(d) > 0;
  return '<span class="badge ' + (over ? "over" : "due") + '">' + (over ? clockSvg : calendarSvg) + esc(d.due) + '</span>';
}

function renderProgress(){
  var n = doneCount(), total = DEALS.length;
  byId("summaryCount").textContent = total + (total === 1 ? " follow-up" : " follow-ups");
  byId("summaryOverdue").textContent = overdueCount() + " overdue";
  byId("summaryArr").textContent = "$" + totalArr() + "k total sample ARR";
  byId("progressLabel").textContent = n + " of " + total + " updated";
  var bar = byId("progressBar");
  bar.setAttribute("aria-valuemax", String(total));
  bar.setAttribute("aria-valuenow", String(n));
  byId("progressFill").style.width = (total ? Math.round(100 * n / total) : 0) + "%";
}

function ensureSelection(){
  var pending = pendingDeals();
  if(!selectedId || done[selectedId] || !dealById(selectedId)){ selectedId = pending.length ? pending[0].id : null; }
}

function renderTodo(){
  var wrap = byId("todoList");
  if(!wrap) return;
  var pending = pendingDeals();
  byId("queueCount").textContent = String(followupsState === "ready" ? pending.length : 0);
  byId("sortNote").textContent = SORT_NOTES[sortMode];
  if(followupsState==="loading"){ wrap.innerHTML = followupsSkeletonHtml(); renderContext(); return; }
  if(followupsState==="error"){
    wrap.innerHTML = '<div class="state-error" role="alert"><p>Couldn\'t load your follow-ups. Check your connection and try again.</p><button type="button" class="btn-retry" id="followupsRetry">Retry</button></div>';
    byId("followupsRetry").addEventListener("click", function(){ setFollowupsState("loading"); });
    renderContext(); return;
  }
  if(followupsState==="empty" || pending.length===0){
    wrap.innerHTML = '<div class="empty"><span class="empty-plain">All caught up. No follow-ups today.</span></div>';
    renderContext(); return;
  }
  ensureSelection();
  wrap.innerHTML = pending.map(function(d){
    var sel = d.id === selectedId;
    return '<article class="deal qrow' + (sel ? ' selected' : '') + '" data-row="' + d.id + '">'
      + '<div class="qrow-top">'
      +   '<button type="button" class="qrow-select" data-select="' + d.id + '" aria-pressed="' + sel + '" aria-label="Show context for ' + esc(d.contact) + ', ' + esc(d.company) + '">'
      +     '<span class="deal-name">' + esc(d.contact) + '</span><span class="qco">' + esc(d.company) + '</span></button>'
      +   '<div class="qarr"><b>' + d.arrLabel + '</b><span>sample ARR</span></div>'
      + '</div>'
      + '<p class="qnext">' + esc(d.next) + '</p>'
      + '<div class="qfoot">' + dueBadgeHtml(d)
      +   '<div class="qactions" role="group" aria-label="Actions for ' + esc(d.contact) + '">'
      +     '<button type="button" class="act" data-call="' + d.id + '">' + phoneSvg + ' Call</button>'
      +     '<button type="button" class="act" data-email="' + d.id + '">' + mailSvg + ' Email</button>'
      +     '<button type="button" class="act" data-log="' + d.id + '">Log activity</button>'
      +   '</div></div></article>';
  }).join("");
  wrap.querySelectorAll("[data-select]").forEach(function(b){
    b.addEventListener("click", function(){ selectDeal(b.getAttribute("data-select")); });
  });
  bindCardButtons(wrap);
  renderContext();
}

function selectDeal(id){
  if(!dealById(id) || done[id]) return;
  selectedId = id;
  renderTodo();
  var b = document.querySelector('#todoList [data-select="' + id + '"]');
  if(b) b.focus();
}

function renderContext(){
  var box = byId("dealContext"); if(!box) return;
  var d = followupsState === "ready" ? dealById(selectedId) : null;
  if(!d || done[d.id]){
    box.innerHTML = '<p class="ctx-eyebrow">Deal context</p><p class="ctx-empty">' +
      (followupsState === "ready" && pendingDeals().length === 0 ? "All follow-ups are updated. Undo any of them from Updated today." : "Select a follow-up to see its context.") + '</p>';
    return;
  }
  var recent = allActivity().filter(function(f){ return f.dealId === d.id; }).slice(0, 3);
  box.innerHTML = '<p class="ctx-eyebrow">Deal context <span class="chip">Selected</span></p>'
    + '<h3 class="ctx-company">' + esc(d.company) + '</h3><p class="ctx-contact">' + esc(d.contact) + '</p>'
    + '<div class="ctx-arr"><span>Sample ARR</span><b>' + d.arrLabel + '</b></div>'
    + '<div class="ctx-due">' + dueBadgeHtml(d) + '</div>'
    + '<p class="ctx-label">Next step</p><p class="ctx-next">' + esc(d.next) + '</p>'
    + '<div class="ctx-actions">'
    +   '<button type="button" class="btn btn-primary" data-call="' + d.id + '">' + phoneSvg + ' Call ' + esc(d.contact.split(" ")[0]) + '</button>'
    +   '<button type="button" class="btn btn-secondary" id="contextOpenDeal" data-opendeal="' + d.id + '">Open deal</button>'
    + '</div>'
    + '<p class="ctx-label">Recent activity</p>'
    + (recent.length ? '<ul class="ctx-recent">' + recent.map(function(f){
        var icon = f.via === "call" ? phoneSvg : (f.via === "email" ? mailSvg : checkSvg);
        return '<li><span class="ri" aria-hidden="true">' + icon + '</span><div><b>' + esc(f.title.split(" — ")[0]) + '</b>'
          + (f.detail ? '<p>' + esc(f.detail) + '</p>' : '') + '<span class="rw">' + esc((f.date || "Today") + (f.time ? " · " + f.time : "")) + '</span></div></li>';
      }).join("") + '</ul>' : '<p class="ctx-empty">No activity yet for this deal.</p>')
    + '<button type="button" class="textlink" data-history="' + esc(d.contact) + '">View activity history <span aria-hidden="true">→</span></button>';
  bindCardButtons(box);
  box.querySelector("[data-opendeal]").addEventListener("click", function(){ openDeal(d.id); });
  box.querySelector("[data-history]").addEventListener("click", function(){ openHistory(d.contact); });
}

function renderUpdated(){
  var wrap = byId("updatedList"), section = byId("updatedSection");
  var list = DEALS.filter(function(d){ return done[d.id]; });
  section.hidden = list.length === 0;
  wrap.innerHTML = list.map(function(d){
    var info = done[d.id];
    return '<div class="updated-item"><div class="check" aria-hidden="true">' + checkSvg + '</div>'
      + '<div class="ui-text"><b>' + esc(d.contact) + ' · ' + esc(d.company) + '</b><span><span class="badge done">Updated</span> ' + esc(info.summary) + '</span></div>'
      + '<button type="button" class="btn btn-secondary btn-sm" data-opendeal="' + d.id + '">Open deal</button>'
      + '<button type="button" class="undo-link" data-undo="' + d.id + '" aria-label="Undo update for ' + esc(d.contact) + '">Undo</button></div>';
  }).join("");
  wrap.querySelectorAll("[data-undo]").forEach(function(b){ b.addEventListener("click", function(){ undoDeal(b.getAttribute("data-undo")); }); });
  wrap.querySelectorAll("[data-opendeal]").forEach(function(b){ b.addEventListener("click", function(){ openDeal(b.getAttribute("data-opendeal")); }); });
}

function bindCardButtons(scope){
  scope.querySelectorAll("[data-call]").forEach(function(b){ b.addEventListener("click", function(){ openCall(b.getAttribute("data-call")); }); });
  scope.querySelectorAll("[data-email]").forEach(function(b){ b.addEventListener("click", function(){ openEmail(b.getAttribute("data-email")); }); });
  scope.querySelectorAll("[data-log]").forEach(function(b){ b.addEventListener("click", function(){ logActivity(b.getAttribute("data-log")); }); });
}

/* After a save the opener has left the queue: focus the next task instead. */
function focusNextTask(){
  if(currentView !== "today") return;
  var b = document.querySelector("#todoList .qrow.selected [data-select]") || document.querySelector("#todoList [data-select]");
  (b || byId("queueTitle")).focus();
}

byId("sortSelect").addEventListener("change", function(){
  sortMode = this.value === "overdue" ? "overdue" : "arr";
  renderTodo();
  announce("Sorted: " + SORT_NOTES[sortMode] + ".");
});
document.querySelectorAll("#followupsDemo button").forEach(function(b){
  b.addEventListener("click", function(){ setFollowupsState(b.getAttribute("data-fstate")); });
});
