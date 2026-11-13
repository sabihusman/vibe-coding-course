/* Activity History screen markup.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.getElementById("appMain").insertAdjacentHTML("beforeend", `
   <!-- ============ Screen: Activity History ============ -->
   <div id="viewHistory" hidden>
    <button class="view-back" id="historyBack" type="button">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      Back to Today
    </button>
    <div class="pagehead">
      <div>
        <h1 id="historyTitle" tabindex="-1">Activity history</h1>
        <div class="sub">A clear record of your conversations and next steps — every call, email and note, newest first. Select a row to open that deal.</div>
      </div>
    </div>
    <div class="searchwrap">
      <label class="fieldlabel" for="historySearch" style="margin-top:0">Find a deal</label>
      <input type="text" id="historySearch" placeholder="Search by contact name or company…" autocomplete="off" />
    </div>
    <p class="hist-count" id="historyCount" aria-live="polite"></p>
    <section class="panelcard hist-panel" aria-label="All activity">
      <div id="historyList"></div>
    </section>
    <details class="test-area" id="historyTestArea">
      <summary>Test controls</summary>
      <p>For reviewers: force the activity list into each state. Reps see the real state, with Retry when a load fails.</p>
      <div class="state-demo" id="historyDemo" role="group" aria-label="Force activity list state">
        <button type="button" data-hstate="ready" class="active">Data</button>
        <button type="button" data-hstate="loading">Loading</button>
        <button type="button" data-hstate="empty">Empty</button>
        <button type="button" data-hstate="error">Error</button>
      </div>
    </details>
   </div><!-- /viewHistory -->
`);
