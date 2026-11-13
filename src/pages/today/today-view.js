/* Today screen markup: a compact follow-up queue with a selected-deal context panel.
   The research block (hypothesis, metrics, quotes) lives on the Problem statement screen. */
document.getElementById("appMain").insertAdjacentHTML("beforeend", `
   <!-- ============ Screen: Today ============ -->
   <div id="viewToday">
    <header class="page-head">
      <p class="eyebrow">Thursday, November 5 · Sample day</p>
      <h1 id="todayTitle" tabindex="-1">Make your next move.</h1>
      <p class="page-sub">Your follow-ups, with everything you need to act.</p>
    </header>

    <div class="summary-line">
      <p class="summary-text"><span class="dot" aria-hidden="true"></span><b id="summaryCount">6 follow-ups</b><span class="sep" aria-hidden="true">·</span><span id="summaryOverdue">2 overdue</span><span class="sep" aria-hidden="true">·</span><span id="summaryArr">$663k total sample ARR</span></p>
      <div class="progress">
        <span id="progressLabel">0 of 6 updated</span>
        <span class="pbar" role="progressbar" aria-labelledby="progressLabel" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0" id="progressBar"><i id="progressFill"></i></span>
      </div>
    </div>

    <div class="today-grid">
      <section class="queue" aria-labelledby="queueTitle">
        <div class="queue-head">
          <h2 id="queueTitle" tabindex="-1">Follow-up queue <span class="qcount" id="queueCount">6</span></h2>
          <div class="sort">
            <label for="sortSelect">Sort</label>
            <select id="sortSelect">
              <option value="arr">Highest ARR</option>
              <option value="overdue">Overdue first</option>
            </select>
          </div>
        </div>
        <div class="queue-panel">
          <div id="todoList"></div>
          <p class="queue-foot" id="sortNote">Highest sample ARR first</p>
        </div>
      </section>

      <aside class="context" id="dealContext" aria-label="Deal context"></aside>
    </div>

    <section class="updated" id="updatedSection" aria-labelledby="updatedTitle" hidden>
      <h2 id="updatedTitle">Updated today</h2>
      <div id="updatedList"></div>
    </section>

    <details class="test-area" id="todayTestArea">
      <summary>Test controls</summary>
      <p>For reviewers: force the follow-up list into each state. Reps see the real state, with Retry when a load fails.</p>
      <div class="state-demo" id="followupsDemo" role="group" aria-label="Force follow-up list state">
        <button type="button" data-fstate="ready">Data</button>
        <button type="button" data-fstate="loading" class="active">Loading</button>
        <button type="button" data-fstate="empty">Empty</button>
        <button type="button" data-fstate="error">Error</button>
      </div>
    </details>
   </div><!-- /viewToday -->
`);
