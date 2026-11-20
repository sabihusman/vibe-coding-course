/* In-app analytics: one event per view change, counts only.
   Telemetry, not rep data: fire-and-forget, never blocks the rep flow, never shows an error.
   If the insert fails (offline, table not created yet, any error) it fails silently.
   The P0 write-confirmation rule is for rep data only and does not apply here.
   Sends nothing but a session id (one per tab) and the view name; owner_id is set by the database. */
var ANALYTICS_VIEWS = { today:"today", history:"history", problem:"problem", detail:"deal", admin:"admin" };
var analyticsQueue = [];      // events logged before Supabase finished connecting
var analyticsLastView = null;

function analyticsSessionId(){
  var key = "crm-companion-analytics-session";
  try {
    var id = sessionStorage.getItem(key);   // a reload in the same tab keeps it; a new tab gets a new one
    if(!id){ id = (crypto.randomUUID ? crypto.randomUUID() : analyticsUuid()); sessionStorage.setItem(key, id); }
    return id;
  } catch(e){
    if(!window.__analyticsSessionFallback) window.__analyticsSessionFallback = analyticsUuid();
    return window.__analyticsSessionFallback;
  }
}
function analyticsUuid(){
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c){
    var r = Math.floor(Math.random() * 16); return (c === "x" ? r : (r % 4) + 8).toString(16); });
}
function analyticsSend(ev){
  try {
    fetch(SB.cfg.url + "/rest/v1/analytics_events", {
      method: "POST", keepalive: true,
      headers: { "apikey": SB.cfg.anonKey, "Authorization": "Bearer " + SB.session.access_token,
                 "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(ev)
    }).catch(function(){});
  } catch(e){ /* telemetry only: ignore */ }
}
/* Record one view. Queued until Supabase is connected; dropped if it never connects. */
function logView(view){
  var v = ANALYTICS_VIEWS[view]; if(!v) return;
  var ev = { session_id: analyticsSessionId(), view: v, entered_at: new Date().toISOString() };
  if(typeof SB !== "undefined" && SB.connected && SB.session){ analyticsSend(ev); }
  else if(analyticsQueue.length < 20){ analyticsQueue.push(ev); }
}
/* Called once the rep's data has loaded from Supabase. */
function analyticsFlush(){
  if(!(SB.connected && SB.session)) return;
  var q = analyticsQueue; analyticsQueue = [];
  q.forEach(analyticsSend);
}
(function(){
  var baseShowView = showView;
  showView = function(v, opts){
    baseShowView(v, opts);
    var key = currentView === "detail" ? "detail:" + detailId : currentView;
    if(key === analyticsLastView) return;  /* same view again (e.g. a re-render) is not a new page view */
    analyticsLastView = key;
    logView(currentView);
  };
})();
