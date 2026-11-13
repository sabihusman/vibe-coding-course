/* Call dialog markup. Injected before the logic files, so their getElementById lookups find it. */
document.body.insertAdjacentHTML("beforeend", `
<!-- Call dialog -->
<div class="overlay" id="callOverlay">
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="callTitle" aria-describedby="callSim">
    <form id="callForm" novalidate>
      <div class="sheet-head">
        <div>
          <p class="sheet-eyebrow">Simulated call</p>
          <h2 id="callTitle">Call</h2>
          <p id="callSub"></p>
        </div>
        <button type="button" class="x" data-close aria-label="Close call dialog without saving">✕</button>
      </div>
      <div class="sheet-body">
        <div class="ctx"><p class="ctx-label">Follow-up</p><p id="callNext"></p></div>
        <div class="callstart">
          <p id="callStatus" role="status">Ready when you are</p>
          <button type="button" class="btn btn-secondary" id="startCall">Start simulated call</button>
        </div>
        <div class="timerbox" id="timerBox" hidden>
          <div class="timer" id="timerDisplay" aria-label="Call timer">00:00</div>
          <div class="tbtns">
            <button type="button" class="tbtn" id="timerToggle">Pause</button>
            <button type="button" class="tbtn" id="timerReset">Reset</button>
          </div>
        </div>
        <label class="fieldlabel" for="callOutcome">Outcome</label>
        <select id="callOutcome" aria-describedby="callOutcomeErr">
          <option value="">Select an outcome</option>
          <option value="Connected">Connected</option>
          <option value="No answer">No answer</option>
          <option value="Left voicemail">Left voicemail</option>
        </select>
        <p class="field-error" id="callOutcomeErr" hidden></p>
        <label class="fieldlabel" for="callNote">Activity note <span class="optional">(optional)</span></label>
        <textarea id="callNote" rows="3" placeholder="What happened? What comes next?"></textarea>
        <p class="sim" id="callSim">Simulated call. No real call is placed; saving records it in the CRM only.</p>
      </div>
      <div class="sheet-actions">
        <button type="button" class="btn btn-cancel" data-close>Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveCall">Save call &amp; update follow-up</button>
      </div>
    </form>
  </div>
</div>
`);
