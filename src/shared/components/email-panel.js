/* Email panel: pre-filled draft, Send & log email. Simulated: no real email is sent. */
/* ---------- Email composer ---------- */
function openEmail(id){
  currentId = id; var d = dealById(id);
  byId("emailTitle").textContent = "Email " + d.contact;
  byId("emailSub").textContent = d.company + " · " + d.arrLabel + " sample ARR · " + d.due;
  byId("emailTo").textContent = d.contact;
  byId("emailCompany").textContent = d.company;
  byId("emailNext").textContent = d.next;
  byId("emailSubject").value = "Following up — " + d.next.charAt(0).toLowerCase() + d.next.slice(1);
  byId("emailBody").value = "Hi " + d.contact.split(" ")[0] + ",\n\nFollowing up on " + d.company + ". Next step on my side: " + d.next.charAt(0).toLowerCase() + d.next.slice(1) + ".\n\nCould we lock in a time this week?\n\nThanks,\nAlex";
  emailInitialSubject = byId("emailSubject").value;
  emailInitialBody = byId("emailBody").value;
  byId("emailOverlay").classList.add("open");
  setTimeout(function(){ byId("emailBody").focus(); }, 60);
}
byId("sendEmail").addEventListener("click", function(){
  if(!currentId) return;
  var d = dealById(currentId);
  var subj = byId("emailSubject").value.trim() || "Following up";
  byId("emailOverlay").classList.remove("open");
  completeDeal(currentId, "email", "Email sent", "Email — " + d.contact + ", " + d.company, "Subject: " + subj);
  currentId = null;
});
