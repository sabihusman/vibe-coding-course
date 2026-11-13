/* Call dialog. Simulated: no real call is placed.
   The timer starts only after "Start simulated call". An outcome is required to save.
   Opening, cancelling or closing records nothing; the note and outcome are kept as a draft. */
var timerSec = 0, timerInt = null, timerRunning = false, callSaving = false;
function fmtTimer(){ var m=Math.floor(timerSec/60), s=timerSec%60; return (m<10?"0":"")+m+":"+(s<10?"0":"")+s; }
function startTimer(){
  stopTimer(); timerRunning = true; byId("timerToggle").textContent = "Pause";
  timerInt = setInterval(function(){ timerSec++; byId("timerDisplay").textContent = fmtTimer(); }, 1000);
}
function stopTimer(){ if(timerInt) clearInterval(timerInt); timerInt = null; timerRunning = false; }
function resetCallTimer(){
  stopTimer(); timerSec = 0;
  byId("timerDisplay").textContent = "00:00";
  byId("timerBox").hidden = true;
  byId("startCall").hidden = false;
  byId("callStatus").textContent = "Ready when you are";
}
byId("startCall").addEventListener("click", function(){
  byId("startCall").hidden = true;
  byId("timerBox").hidden = false;
  byId("callStatus").textContent = "Simulated call in progress";
  startTimer();
  byId("timerToggle").focus();
});
byId("timerToggle").addEventListener("click", function(){
  if(timerRunning){ stopTimer(); this.textContent = "Resume"; byId("callStatus").textContent = "Simulated call paused"; }
  else { startTimer(); byId("callStatus").textContent = "Simulated call in progress"; }
});
byId("timerReset").addEventListener("click", function(){ timerSec = 0; byId("timerDisplay").textContent = "00:00"; });

function openCall(id){
  var d = dealById(id); if(!d || done[id]) return;
  currentId = id; callSaving = false;
  var draft = draftFor(id).call || {};
  byId("callTitle").textContent = "Call " + d.contact;
  byId("callSub").textContent = d.company;
  byId("callNext").textContent = d.next;
  byId("callNote").value = draft.note || "";
  byId("callOutcome").value = draft.outcome || "";
  clearFieldErrors(byId("callForm"));
  resetCallTimer();
  byId("saveCall").disabled = false;
  openDialog("callOverlay", "startCall");
}
function keepCallDraft(){
  if(!currentId) return;
  var note = byId("callNote").value, outcome = byId("callOutcome").value;
  if(note.trim() || outcome) draftFor(currentId).call = { note: note, outcome: outcome };
  stopTimer(); currentId = null;
}
registerDialog("callOverlay", { onDismiss: keepCallDraft });

byId("callForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(!currentId || callSaving) return;
  var outcome = byId("callOutcome").value;
  if(!outcome){
    setFieldError("callOutcome", "callOutcomeErr", "Choose an outcome before saving: Connected, No answer or Left voicemail.");
    byId("callOutcome").focus(); return;
  }
  setFieldError("callOutcome", "callOutcomeErr", "");
  callSaving = true; byId("saveCall").disabled = true;
  var id = currentId, d = dealById(id);
  var note = byId("callNote").value.trim(), dur = fmtTimer();
  stopTimer(); currentId = null;
  closeDialog("callOverlay", true);
  completeDeal(id, "call", "Call · " + outcome + " · " + dur,
    "Call — " + d.contact + ", " + d.company + " · " + outcome,
    (note ? "“" + note + "” · " : "") + "Duration " + dur);
  focusNextTask();
});
