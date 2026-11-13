/* Toast with Undo. */
/* ---------- Toast ---------- */
function showToast(text, id){
  byId("toastText").textContent = text;
  byId("toastUndo").onclick = function(){ undoDeal(id); };
  var t = byId("toast"); t.classList.add("show"); t.setAttribute("aria-hidden","false");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 8000);
}
function hideToast(){ var t = byId("toast"); t.classList.remove("show"); t.setAttribute("aria-hidden","true"); }
