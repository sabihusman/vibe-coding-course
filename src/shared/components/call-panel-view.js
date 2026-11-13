/* Call panel markup.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.body.insertAdjacentHTML("beforeend", `
<!-- Call panel -->
<div class="overlay" id="callOverlay" role="dialog" aria-modal="true" aria-labelledby="callTitle">
  <div class="sheet">
    <div class="sheet-head">
      <div>
        <h3 id="callTitle">Call</h3>
        <p id="callSub"></p>
      </div>
      <button class="x" data-close aria-label="Close call panel">✕</button>
    </div>
    <div class="ctx">
      <div class="row"><span>Contact</span><b id="callContact"></b></div>
      <div class="row"><span>Company</span><b id="callCompany"></b></div>
      <div class="row"><span>Next step</span><b id="callNext"></b></div>
    </div>
    <span class="fieldlabel">Call timer</span>
    <div class="timerbox">
      <div class="timer" id="timerDisplay">00:00</div>
      <div class="tbtns">
        <button class="tbtn" id="timerToggle">Pause</button>
        <button class="tbtn" id="timerReset">Reset</button>
      </div>
    </div>
    <label class="fieldlabel" for="callNote">Short note</label>
    <textarea id="callNote" rows="3" placeholder="e.g. Spoke briefly — wants the revised terms before Friday."></textarea>
    <span class="fieldlabel">Outcome</span>
    <div class="outcomes" id="outcomeRow">
      <button class="outcome sel" data-outcome="Called">Called</button>
      <button class="outcome" data-outcome="No answer">No answer</button>
      <button class="outcome" data-outcome="Met">Met</button>
    </div>
    <p class="sim">Simulated call — no real call is placed from this prototype. Saving logs the activity in the CRM only.</p>
    <div class="sheet-actions">
      <button class="btn btn-cancel" data-close>Cancel</button>
      <button class="btn btn-save call" id="saveCall">Save &amp; log call</button>
    </div>
  </div>
</div>

`);
