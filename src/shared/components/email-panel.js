/* Email dialog. Simulated: nothing is sent.
   Subject and message are required. Closing without sending records nothing and keeps the draft. */
var emailSaving = false;
function defaultEmail(d){
  var step = d.next.charAt(0).toLowerCase() + d.next.slice(1);
  return { subject: "Following up — " + step,
           body: "Hi " + d.contact.split(" ")[0] + ",\n\nFollowing up on " + d.company + ". Next step on my side: " + step + ".\n\nCould we lock in a time this week?\n\nThanks,\nAlex" };
}
function openEmail(id){
  var d = dealById(id); if(!d || done[id]) return;
  currentId = id; emailSaving = false;
  var draft = draftFor(id).email || defaultEmail(d);
  byId("emailTitle").textContent = "Email " + d.contact;
  byId("emailSub").textContent = d.company;
  byId("emailNext").textContent = d.next;
  byId("emailSubject").value = draft.subject;
  byId("emailBody").value = draft.body;
  clearFieldErrors(byId("emailForm"));
  byId("sendEmail").disabled = false;
  openDialog("emailOverlay", "emailSubject");
}
function keepEmailDraft(){
  if(!currentId) return;
  draftFor(currentId).email = { subject: byId("emailSubject").value, body: byId("emailBody").value };
  currentId = null;
}
registerDialog("emailOverlay", { onDismiss: keepEmailDraft });

byId("emailForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(!currentId || emailSaving) return;
  var subj = byId("emailSubject").value.trim(), body = byId("emailBody").value.trim();
  setFieldError("emailSubject", "emailSubjectErr", subj ? "" : "Add a subject before sending.");
  setFieldError("emailBody", "emailBodyErr", body ? "" : "Write a message before sending.");
  if(!subj){ byId("emailSubject").focus(); return; }
  if(!body){ byId("emailBody").focus(); return; }
  emailSaving = true; byId("sendEmail").disabled = true;
  var id = currentId, d = dealById(id);
  currentId = null;
  closeDialog("emailOverlay", true);
  completeDeal(id, "email", "Email sent", "Email — " + d.contact + ", " + d.company, "Subject: " + subj);
  focusNextTask();
});
