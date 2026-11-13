/* Navigation: showView, openDeal, openHistory. */
/* ---------- Views & navigation ---------- */
function showView(v){
  currentView = v;
  byId("viewToday").hidden = v!=="today";
  byId("viewDetail").hidden = v!=="detail";
  byId("viewHistory").hidden = v!=="history";
  byId("viewAdmin").hidden = v!=="admin";
  byId("navTodayLink").classList.toggle("active", v!=="admin");
  byId("navAdminLink").classList.toggle("active", v==="admin");
  window.scrollTo(0,0);
}
function openDeal(id){
  if(!dealById(id)) return;
  detailId = id;
  renderDetail();
  showView("detail");
}
function openHistory(preset){
  if(typeof preset==="string") byId("historySearch").value = preset;
  showView("history");
  setHistoryState("loading");
}
