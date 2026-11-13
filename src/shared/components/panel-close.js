/* Closing either panel; counts an attempted call or email when the timer ran or the draft changed. */
/* ---------- Close handling ---------- */
/* The one logic change in this polish: closing a Call or Email panel without
   saving counts as attempted in Activity when the timer ran (call) or a
   draft was typed or edited (call note, or the email subject or body
   changed from what the composer opened with). Email mirrors Call through
   the same close paths — Cancel, the X button, a backdrop click, or
   Escape. The deal is NOT moved to Updated today. */
function maybeLogAttempt(kind){
  if(!currentId || done[currentId]) return;
  var d = dealById(currentId);
  if(kind==="call"){
    var note = byId("callNote").value.trim();
    if(timerSec>0 || note!==""){
      addAttempt(currentId, "call", "Call attempted — " + d.contact + ", " + d.company, "Panel closed without Save & log · Duration " + fmtTimer());
    }
  } else {
    var draftTyped = byId("emailSubject").value !== emailInitialSubject || byId("emailBody").value !== emailInitialBody;
    if(draftTyped){
      addAttempt(currentId, "email", "Email attempted — " + d.contact + ", " + d.company, "Panel closed without Send and log");
    }
  }
}
function closePanel(overlay){
  if(!overlay || !overlay.classList.contains("open")) return;
  maybeLogAttempt(overlay.id==="callOverlay" ? "call" : "email");
  overlay.classList.remove("open");
  stopTimer(); timerRunning = false; currentId = null;
}
document.querySelectorAll("[data-close]").forEach(function(b){
  b.addEventListener("click", function(){ closePanel(b.closest(".overlay")); });
});
["callOverlay","emailOverlay"].forEach(function(oid){
  byId(oid).addEventListener("click", function(e){ if(e.target===this){ closePanel(this); } });
});
document.addEventListener("keydown", function(e){
  if(e.key==="Escape"){ closePanel(byId("callOverlay")); closePanel(byId("emailOverlay")); }
});
