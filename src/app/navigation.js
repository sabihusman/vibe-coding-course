/* Navigation: sidebar destinations, Deal Detail, browser Back, and addressable views.
   Each top-level view has a hash (#today, #history, #problem, #admin); a deal is #deal-<id>.
   Switching views never resets the queue, sort, selection, progress or history. */
var VIEW_IDS = { today:"viewToday", detail:"viewDetail", history:"viewHistory", problem:"viewProblem", admin:"viewAdmin" };
var VIEW_TITLES = { today:"Today", detail:"Deal", history:"Activity history", problem:"Problem statement", admin:"Admin — Code Explorer" };
var NAV_FOR_VIEW = { today:"navTodayLink", detail:"navTodayLink", history:"navHistoryLink", problem:"navProblemLink", admin:"navAdminLink" };

function showView(v, opts){
  opts = opts || {};
  if(!VIEW_IDS[v]) v = "today";
  currentView = v;
  Object.keys(VIEW_IDS).forEach(function(k){ byId(VIEW_IDS[k]).hidden = k !== v; });
  ["navTodayLink","navHistoryLink","navProblemLink","navAdminLink"].forEach(function(nid){
    var a = byId(nid); var on = nid === NAV_FOR_VIEW[v];
    a.classList.toggle("active", on);
    if(on){ a.setAttribute("aria-current", "page"); } else { a.removeAttribute("aria-current"); }
  });
  var title = v === "detail" && dealById(detailId) ? dealById(detailId).contact : VIEW_TITLES[v];
  document.title = title + " · CRM Companion";
  var hash = v === "detail" ? "#deal-" + detailId : "#" + v;
  if(!opts.fromHistory && location.hash !== hash){
    try { history.pushState(null, "", hash); } catch(e){ /* file:// in some browsers */ }
  }
  window.scrollTo(0, 0);
  if(opts.focusHeading){
    var h = byId({ today:"todayTitle", history:"historyTitle", problem:"problemTitle", admin:"adminTitle", detail:"detailName" }[v]);
    if(h) h.focus({ preventScroll: true });
  }
}
function openDeal(id, opts){
  if(!dealById(id)) return;
  detailId = id;
  renderDetail();
  showView("detail", opts);
}
function openHistory(preset, opts){
  if(typeof preset==="string") byId("historySearch").value = preset;
  showView("history", opts);
  setHistoryState("loading");
}
/* Route from the address: used on start, on Back/Forward, and for sidebar links. */
function routeFromHash(opts){
  var h = (location.hash || "#today").slice(1);
  if(h.indexOf("deal-") === 0 && dealById(h.slice(5))){ openDeal(h.slice(5), opts); return; }
  if(h === "history"){ openHistory(null, opts); return; }
  showView(VIEW_IDS[h] ? h : "today", opts);
}
window.addEventListener("popstate", function(){ routeFromHash({ fromHistory: true }); });
document.querySelectorAll("[data-nav]").forEach(function(a){
  a.addEventListener("click", function(e){
    e.preventDefault();
    var v = a.getAttribute("data-nav");
    if(v === "history"){ openHistory(null, { focusHeading: true }); }
    else { showView(v, { focusHeading: true }); }
  });
});
