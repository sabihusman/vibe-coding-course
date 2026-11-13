/* Log activity dialog markup. Injected before the logic files, so their getElementById lookups find it. */
document.body.insertAdjacentHTML("beforeend", `
<!-- Log activity dialog -->
<div class="overlay" id="logOverlay">
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="logTitle">
    <form id="logForm" novalidate>
      <div class="sheet-head">
        <div>
          <p class="sheet-eyebrow">Log activity</p>
          <h2 id="logTitle">Log activity</h2>
          <p id="logSub"></p>
        </div>
        <button type="button" class="x" data-close aria-label="Close without saving">✕</button>
      </div>
      <div class="sheet-body">
        <div class="ctx"><p class="ctx-label">Follow-up</p><p id="logNext"></p></div>
        <label class="fieldlabel" for="logNote">Activity note</label>
        <textarea id="logNote" rows="4" placeholder="What happened? What comes next?" aria-describedby="logNoteErr"></textarea>
        <p class="field-error" id="logNoteErr" hidden></p>
      </div>
      <div class="sheet-actions">
        <button type="button" class="btn btn-cancel" data-close>Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveLog">Save note &amp; update follow-up</button>
      </div>
    </form>
  </div>
</div>
`);
