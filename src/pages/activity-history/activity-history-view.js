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
        <h1>Activity History</h1>
        <div class="sub">Every call, email, and log, newest first. Select a row to open that deal.</div>
      </div>
      <span class="sample-pill"><i></i> Sample data only — resets on reload</span>
    </div>
    <div class="searchwrap">
      <label class="fieldlabel" for="historySearch" style="margin-top:0">Find a deal</label>
      <input type="text" id="historySearch" placeholder="Search by contact name or company…" autocomplete="off" />
    </div>
    <div class="state-demo" id="historyDemo" aria-label="Preview activity history list states" style="margin-top:14px">
      <span>List state</span>
      <button type="button" data-hstate="ready" class="active">Data</button>
      <button type="button" data-hstate="loading">Loading</button>
      <button type="button" data-hstate="empty">Empty</button>
      <button type="button" data-hstate="error">Error</button>
    </div>
    <p class="hist-count" id="historyCount"></p>
    <section class="panelcard" style="margin-top:10px" aria-label="All activity">
      <div id="historyList" aria-live="polite"></div>
    </section>
   </div><!-- /viewHistory -->
`);
