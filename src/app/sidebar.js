/* Hide and show the sidebar. */
/* ---------- Sidebar hide / show (session only, resets on reload) ---------- */
function setNavCollapsed(collapsed){
  document.querySelector(".app").classList.toggle("nav-collapsed", !!collapsed);
  var target = byId(collapsed ? "showNavBtn" : "hideNavBtn");
  if(target && target.focus) target.focus({ preventScroll:true });
}
byId("hideNavBtn").addEventListener("click", function(){ setNavCollapsed(true); });
byId("showNavBtn").addEventListener("click", function(){ setNavCollapsed(false); });
