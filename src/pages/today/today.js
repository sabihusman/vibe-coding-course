/* Today screen: stepper, follow-up cards, Updated today, Activity feed, and the list-state controls. */
function renderStepper(){
  var n = doneCount();
  byId("progressLabel").textContent = n + " of 6 updated";
  var html = "";
  DEALS.forEach(function(d, i){
    if(i>0){ var pct = done[DEALS[i-1].id] && done[d.id] ? 100 : (done[DEALS[i-1].id] ? 50 : 0); html += '<div class="bar"><i style="width:'+(done[DEALS[i-1].id]?100:0)+'%"></i></div>'; }
    var cls = done[d.id] ? "step done" : (i===n ? "step current" : "step");
    var inner = done[d.id] ? checkSvg : (i+1);
    html += '<div class="'+cls+'"><div class="dot">'+inner+'</div><div class="slabel">'+esc(d.contact.split(" ")[0])+'</div></div>';
  });
  var st = byId("stepper");
  st.innerHTML = html;
  st.setAttribute("aria-label","Progress: "+n+" of 6 follow-ups updated");
  byId("caughtBanner").className = "caught" + (n===6 ? " show" : "");
}

function renderTodo(){
  var wrap = byId("todoList");
  if(!wrap) return;
  if(followupsState==="loading"){
    wrap.innerHTML = followupsSkeletonHtml();
    return;
  }
  if(followupsState==="error"){
    wrap.innerHTML = '<div class="state-error" role="alert"><p>Couldn\'t load your follow-ups. Check your connection and try again.</p><button type="button" class="btn-retry" id="followupsRetry">Retry</button></div>';
    byId("followupsRetry").addEventListener("click", function(){ setFollowupsState("loading"); });
    return;
  }
  var pending = DEALS.filter(function(d){ return !done[d.id]; });
  if(followupsState==="empty" || pending.length===0){
    wrap.innerHTML = '<div class="empty"><span class="empty-plain">All caught up. No follow-ups today.</span></div>';
    return;
  }
  wrap.innerHTML = pending.map(function(d){
    return '<article class="deal clickable" data-open="'+d.id+'" tabindex="0" title="Open deal detail">'
      + '<div class="deal-top"><div class="deal-main">'
      + '<div class="deal-name">'+esc(d.contact)+'</div>'
      + '<div class="deal-co">'+esc(d.company)+'</div>'
      + '</div><div class="arr">'+d.arrLabel+'<small>sample ARR</small></div></div>'
      + '<div class="meta"><span class="badge '+(d.overdue?"over":"due")+'">'+esc(d.due)+'</span>'
      + '<span class="nextstep">'+arrowSvg+'<span><b>Next step:</b> '+esc(d.next)+'</span></span>'
      + '<span class="open-hint">Open deal →</span></div>'
      + '<div class="actions">'
      + '<button class="btn btn-call" data-call="'+d.id+'">'+phoneSvg+' Call</button>'
      + '<button class="btn btn-email" data-email="'+d.id+'">'+mailSvg+' Email</button>'
      + '<button class="btn btn-log" data-log="'+d.id+'">Log activity</button>'
      + '</div></article>';
  }).join("");
  bindCardButtons(wrap);
  bindOpenCards(wrap);
}

function bindOpenCards(scope){
  scope.querySelectorAll("[data-open]").forEach(function(el){
    el.addEventListener("click", function(e){ if(e.target.closest("button")) return; openDeal(el.getAttribute("data-open")); });
    el.addEventListener("keydown", function(e){ if(e.key==="Enter" && e.target===el){ openDeal(el.getAttribute("data-open")); } });
  });
}

function renderUpdated(){
  var wrap = byId("updatedList");
  var list = DEALS.filter(function(d){ return done[d.id]; });
  if(list.length===0){ wrap.innerHTML = '<p class="none">Nothing updated yet. Start at the top — James Whitfield, $312k.</p>'; return; }
  wrap.innerHTML = list.map(function(d){
    var info = done[d.id];
    return '<div class="updated-item clickable" data-open="'+d.id+'" tabindex="0" title="Open deal detail"><div class="check">'+checkSvg+'</div>'
      + '<div><b>'+esc(d.contact)+' · '+esc(d.company)+'</b><span>'+esc(info.summary)+'</span></div>'
      + '<button class="undo-link" data-undo="'+d.id+'">Undo</button></div>';
  }).join("");
  wrap.querySelectorAll("[data-undo]").forEach(function(b){ b.addEventListener("click", function(){ undoDeal(b.getAttribute("data-undo")); }); });
  bindOpenCards(wrap);
}

function renderFeed(){
  var wrap = byId("feedList");
  if(feed.length===0){ wrap.innerHTML = '<p class="none">No activity yet today.</p>'; return; }
  wrap.innerHTML = feed.map(function(f){
    var icon = f.via==="call" ? phoneSvg : (f.via==="email" ? mailSvg : checkSvg);
    return '<div class="feed-item"><div class="feed-ic '+f.via+'">'+icon+'</div>'
      + '<div style="min-width:0"><b>'+esc(f.title)+'</b>'+(f.detail?'<p>'+esc(f.detail)+'</p>':"")+'</div>'
      + '<time>'+esc(f.time)+'</time></div>';
  }).join("");
}

function bindCardButtons(scope){
  scope.querySelectorAll("[data-call]").forEach(function(b){ b.addEventListener("click", function(){ openCall(b.getAttribute("data-call")); }); });
  scope.querySelectorAll("[data-email]").forEach(function(b){ b.addEventListener("click", function(){ openEmail(b.getAttribute("data-email")); }); });
  scope.querySelectorAll("[data-log]").forEach(function(b){ b.addEventListener("click", function(){ logActivity(b.getAttribute("data-log")); }); });
}

document.querySelectorAll("#followupsDemo button").forEach(function(b){
  b.addEventListener("click", function(){ setFollowupsState(b.getAttribute("data-fstate")); });
});
