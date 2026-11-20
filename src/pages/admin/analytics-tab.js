/* Admin · Analytics tab. Reads only get_analytics_summary(), which returns totals, never rows.
   States: loading, not set up (no Supabase, or the table/function missing), empty, data. */
var ANALYTICS_NOT_SET_UP = "Analytics is not set up yet — run the migration in Supabase.";

function fmtDuration(sec){
  sec = Math.max(0, Math.round(Number(sec) || 0));
  var m = Math.floor(sec / 60), s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}
function fmtNum(n, digits){ var x = Number(n) || 0; return digits ? x.toFixed(digits) : String(Math.round(x)); }

function analyticsCards(p, all){
  var card = function(label, value, allValue){
    return '<div class="an-card"><span class="an-label">' + label + '</span><b>' + value + '</b><span class="an-all">All time: ' + allValue + '</span></div>';
  };
  return '<div class="an-cards">'
    + card("Visitors", fmtNum(p.visitors), fmtNum(all.visitors))
    + card("Page Views", fmtNum(p.page_views), fmtNum(all.page_views))
    + card("Views Per Visit", fmtNum(p.views_per_visit, 2), fmtNum(all.views_per_visit, 2))
    + card("Duration", fmtDuration(p.avg_duration_seconds), fmtDuration(all.avg_duration_seconds))
    + card("Bounce Rate", fmtNum(p.bounce_rate, 1) + "%", fmtNum(all.bounce_rate, 1) + "%")
    + '</div>';
}
function analyticsTable(p, all){
  var allBy = {}; (all.by_view || []).forEach(function(r){ allBy[r.view] = r; });
  return '<div class="doc-table-wrap"><table class="doc-table an-table">'
    + '<caption class="sr-only">Page views by screen</caption>'
    + '<thead><tr><th scope="col">Screen</th><th scope="col">Views (30 days)</th><th scope="col">Share</th><th scope="col">Views (all time)</th></tr></thead><tbody>'
    + (p.by_view || []).map(function(r){
        return '<tr><td>' + esc(r.label) + '</td><td class="num">' + fmtNum(r.views) + '</td><td class="num">' + fmtNum(r.share, 1) + '%</td><td class="num">' + fmtNum((allBy[r.view] || {}).views) + '</td></tr>';
      }).join("")
    + '</tbody></table></div>';
}
function renderAnalytics(html){ var b = byId("analyticsBody"); if(b) b.innerHTML = html; }

function loadAnalyticsTab(){
  if(typeof SB === "undefined" || !SB.cfg || !SB.connected || !SB.session){
    renderAnalytics('<p class="an-status">' + ANALYTICS_NOT_SET_UP + '</p>'); return;
  }
  renderAnalytics('<p class="an-status">Loading analytics…</p>');
  fetch(SB.cfg.url + "/rest/v1/rpc/get_analytics_summary", {
    method: "POST",
    headers: { "apikey": SB.cfg.anonKey, "Authorization": "Bearer " + SB.session.access_token, "Content-Type": "application/json" },
    body: "{}"
  }).then(function(r){
    if(!r.ok) throw new Error("summary " + r.status);
    return r.json();
  }).then(function(d){
    var p = d && d.periods && d.periods.last_30_days, all = d && d.periods && d.periods.all_time;
    if(!p || !all) throw new Error("bad summary");
    if(!Number(all.page_views)){ renderAnalytics('<p class="an-status an-empty">No visits recorded yet.</p>'); return; }
    renderAnalytics(analyticsCards(p, all) + '<h3 class="an-sub">By screen</h3>' + analyticsTable(p, all));
  }).catch(function(){
    renderAnalytics('<p class="an-status">' + ANALYTICS_NOT_SET_UP + '</p>');
  });
}
