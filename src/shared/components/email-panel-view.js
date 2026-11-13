/* Email dialog markup. Injected before the logic files, so their getElementById lookups find it. */
document.body.insertAdjacentHTML("beforeend", `
<!-- Email dialog -->
<div class="overlay" id="emailOverlay">
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="emailTitle" aria-describedby="emailSim">
    <form id="emailForm" novalidate>
      <div class="sheet-head">
        <div>
          <p class="sheet-eyebrow">Simulated email</p>
          <h2 id="emailTitle">Email</h2>
          <p id="emailSub"></p>
        </div>
        <button type="button" class="x" data-close aria-label="Close email dialog without sending">✕</button>
      </div>
      <div class="sheet-body">
        <div class="ctx"><p class="ctx-label">Follow-up</p><p id="emailNext"></p></div>
        <label class="fieldlabel" for="emailSubject">Subject</label>
        <input type="text" id="emailSubject" aria-describedby="emailSubjectErr" autocomplete="off" />
        <p class="field-error" id="emailSubjectErr" hidden></p>
        <label class="fieldlabel" for="emailBody">Message</label>
        <textarea id="emailBody" rows="7" aria-describedby="emailBodyErr"></textarea>
        <p class="field-error" id="emailBodyErr" hidden></p>
        <p class="sim" id="emailSim">Simulated email. Nothing is sent; sending records it in the CRM only.</p>
      </div>
      <div class="sheet-actions">
        <button type="button" class="btn btn-cancel" data-close>Cancel</button>
        <button type="submit" class="btn btn-primary" id="sendEmail">Send simulated email &amp; update follow-up</button>
      </div>
    </form>
  </div>
</div>
`);
