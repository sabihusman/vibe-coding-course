/* Deal Detail screen markup.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.getElementById("appMain").insertAdjacentHTML("beforeend", `
   <!-- ============ Screen: Deal Detail ============ -->
   <div id="viewDetail" hidden>
    <button class="view-back" id="detailBack" type="button">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      Back to Today
    </button>
    <div class="pagehead">
      <div>
        <h1 id="detailName">Deal</h1>
        <div class="sub" id="detailCompany"></div>
      </div>
      <span class="sample-pill"><i></i> Sample data only — resets on reload</span>
    </div>

    <article class="deal" style="margin-top:20px;cursor:default">
      <div class="deal-top">
        <div class="deal-main">
          <div class="deal-name" id="detailContact"></div>
          <div class="deal-co" id="detailCompanyLine"></div>
        </div>
        <div class="arr"><span id="detailArr"></span><small>sample ARR</small></div>
      </div>
      <div class="meta">
        <span class="badge" id="detailDue"></span>
        <span class="badge done" id="detailStatus" hidden>Updated today</span>
        <span class="nextstep" id="detailNext"></span>
      </div>
      <div class="actions" id="detailActions">
        <button class="btn btn-call" id="detailCallBtn" type="button"></button>
        <button class="btn btn-email" id="detailEmailBtn" type="button"></button>
        <button class="btn btn-log" id="detailLogBtn" type="button">Log activity</button>
      </div>
      <p class="hint" style="font-size:12.5px;color:var(--muted);font-weight:600;margin:12px 0 0;line-height:1.45">Call and Email come first here too — do the work in the CRM, and saving logs it and takes you back to Today.</p>
    </article>

    <section class="panelcard" aria-label="Past activity for this deal">
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <h3>Past activity</h3>
        <button class="textlink" id="detailHistoryLink" type="button">See this deal in Activity History
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
      <p class="hint">Every call, email, and log for this deal, newest first.</p>
      <div id="detailActivity"></div>
    </section>
   </div><!-- /viewDetail -->
`);
