/* Call panel: timer, note, outcome, Save & log call. Simulated: no real call is placed. */
/* ---------- Call panel + timer ---------- */
var timerSec = 0, timerInt = null, timerRunning = false;
function fmtTimer(){ var m=Math.floor(timerSec/60), s=timerSec%60; return (m<10?"0":"")+m+":"+(s<10?"0":"")+s; }
function startTimer(){
  stopTimer(); timerRunning = true; byId("timerToggle").textContent = "Pause";
  timerInt = setInterval(function(){ timerSec++; byId("timerDisplay").textContent = fmtTimer(); }, 1000);
}
function stopTimer(){ if(timerInt) clearInterval(timerInt); timerInt = null; }
byId("timerToggle").addEventListener("click", function(){
  if(timerRunning){ stopTimer(); timerRunning=false; this.textContent="Resume"; }
  else{ startTimer(); }
});
byId("timerReset").addEventListener("click", function(){ timerSec=0; byId("timerDisplay").textContent="00:00"; });

var selectedOutcome = "Called";
byId("outcomeRow").querySelectorAll(".outcome").forEach(function(b){
  b.addEventListener("click", function(){
    byId("outcomeRow").querySelectorAll(".outcome").forEach(function(x){ x.classList.remove("sel"); });
    b.classList.add("sel"); selectedOutcome = b.getAttribute("data-outcome");
  });
});

function openCall(id){
  currentId = id; var d = dealById(id);
  byId("callTitle").textContent = "Call " + d.contact;
  byId("callSub").textContent = d.company + " · " + d.arrLabel + " sample ARR · " + d.due;
  byId("callContact").textContent = d.contact;
  byId("callCompany").textContent = d.company;
  byId("callNext").textContent = d.next;
  byId("callNote").value = "";
  selectedOutcome = "Called";
  byId("outcomeRow").querySelectorAll(".outcome").forEach(function(x){ x.classList.toggle("sel", x.getAttribute("data-outcome")==="Called"); });
  timerSec = 0; byId("timerDisplay").textContent = "00:00";
  byId("callOverlay").classList.add("open");
  startTimer();
  setTimeout(function(){ byId("callNote").focus(); }, 60);
}
byId("saveCall").addEventListener("click", function(){
  if(!currentId) return;
  var d = dealById(currentId);
  var note = byId("callNote").value.trim();
  var dur = fmtTimer();
  stopTimer(); timerRunning = false;
  byId("callOverlay").classList.remove("open");
  var summary = "Call · " + selectedOutcome + " · " + dur;
  var detail = (note ? "“"+note+"” · " : "") + "Duration " + dur;
  completeDeal(currentId, "call", summary, "Call — " + d.contact + ", " + d.company + " · " + selectedOutcome, detail);
  currentId = null;
});
