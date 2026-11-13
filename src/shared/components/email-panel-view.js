/* Email panel markup.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.body.insertAdjacentHTML("beforeend", `
<!-- Email composer -->
<div class="overlay" id="emailOverlay" role="dialog" aria-modal="true" aria-labelledby="emailTitle">
  <div class="sheet">
    <div class="sheet-head">
      <div>
        <h3 id="emailTitle">Email</h3>
        <p id="emailSub"></p>
      </div>
      <button class="x" data-close aria-label="Close email composer">✕</button>
    </div>
    <div class="ctx">
      <div class="row"><span>To</span><b id="emailTo"></b></div>
      <div class="row"><span>Company</span><b id="emailCompany"></b></div>
      <div class="row"><span>Next step</span><b id="emailNext"></b></div>
    </div>
    <label class="fieldlabel" for="emailSubject">Subject</label>
    <input type="text" id="emailSubject" />
    <label class="fieldlabel" for="emailBody">Draft</label>
    <textarea id="emailBody" rows="6"></textarea>
    <p class="sim">Simulated email — no real email is sent from this prototype. Sending logs the activity in the CRM only.</p>
    <div class="sheet-actions">
      <button class="btn btn-cancel" data-close>Cancel</button>
      <button class="btn btn-save email" id="sendEmail">Send &amp; log email</button>
    </div>
  </div>
</div>

`);
