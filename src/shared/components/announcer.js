/* Screen-reader announcements for saves, Undo and errors (a polite live region). */
function announce(text){
  var r = byId("liveRegion"); if(!r) return;
  r.textContent = "";
  setTimeout(function(){ r.textContent = text; }, 30);
}
