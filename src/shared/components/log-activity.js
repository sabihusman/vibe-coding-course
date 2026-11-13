/* Log activity dialog: a short required note, saved only on explicit submission. */
var logSaving = false;
function logActivity(id){
  var d = dealById(id); if(!d || done[id]) return;
  currentId = id; logSaving = false;
  byId("logTitle").textContent = "Log activity — " + d.contact;
  byId("logSub").textContent = d.company;
  byId("logNext").textContent = d.next;
  byId("logNote").value = (draftFor(id).log || {}).note || "";
  clearFieldErrors(byId("logForm"));
  byId("saveLog").disabled = false;
  openDialog("logOverlay", "logNote");
}
function keepLogDraft(){
  if(!currentId) return;
  var note = byId("logNote").value;
  if(note.trim()) draftFor(currentId).log = { note: note };
  currentId = null;
}
registerDialog("logOverlay", { onDismiss: keepLogDraft });

byId("logForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(!currentId || logSaving) return;
  var note = byId("logNote").value.trim();
  if(note.replace(/[^\p{L}\p{N}]/gu, "").length < 2){
    setFieldError("logNote", "logNoteErr", "Add a short note about what happened — at least a few words.");
    byId("logNote").focus(); return;
  }
  setFieldError("logNote", "logNoteErr", "");
  logSaving = true; byId("saveLog").disabled = true;
  var id = currentId, d = dealById(id);
  currentId = null;
  closeDialog("logOverlay", true);
  completeDeal(id, "log", "Logged activity", "Logged activity — " + d.contact + ", " + d.company, note);
  focusNextTask();
});
