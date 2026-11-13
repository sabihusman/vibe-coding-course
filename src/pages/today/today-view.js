/* Today screen markup.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.getElementById("appMain").insertAdjacentHTML("beforeend", `
   <div id="viewToday">
    <div class="pagehead">
      <div>
        <h1>Today</h1>
        <div class="sub">Thursday, November 5 · Your follow-ups, in the order to work them</div>
      </div>
      <span class="sample-pill"><i></i> Sample data only — resets on reload</span>
    </div>

    <!-- Hypothesis B strip -->
    <section class="hypo" aria-label="What this version tests">
      <div class="big">18%<small>use the CRM today</small></div>
      <div>
        <h2>Hypothesis B — do the work here</h2>
        <p>Letting reps call or email right from the task will keep them in the CRM, so they log as they go — instead of doing the work in email and on the phone, then logging it after.</p>
      </div>
      <blockquote>
        “Reps asked to do the work here, not log it after.”
        <cite>— From real swap feedback, Module 2</cite>
      </blockquote>
      <p class="testline">Work this follow-up as you normally would.</p>
    </section>

    <!-- Context Data Pack — metrics -->
    <section class="metrics" aria-label="Metrics from the Context Data Pack">
      <div class="metric">
        <div class="num">18%</div>
        <div class="label">Weekly active adoption <span>across licensed seats</span></div>
      </div>
      <div class="metric">
        <div class="num">8</div>
        <div class="label">Required fields <span>to log a single deal update</span></div>
      </div>
      <div class="metric">
        <div class="num">11 <em>min</em></div>
        <div class="label">Average task time for &ldquo;update a deal&rdquo;, <span>vs. a 2-min target</span></div>
      </div>
      <div class="metric">
        <div class="num">63%</div>
        <div class="label">Of reps keep a shadow spreadsheet <span>alongside the CRM</span></div>
      </div>
    </section>

    <!-- Context Data Pack — What reps told us -->
    <section class="reps" aria-label="What reps told us">
      <div class="reps-head">
        <h2>What reps told us</h2>
        <span>Real quotes · Context Data Pack</span>
      </div>
      <div class="quotes-grid">
        <blockquote class="quote-card">
          <p>&ldquo;Logging activity feels like data entry for management, not something that helps me sell.&rdquo;</p>
          <cite>&mdash; Senior AE</cite>
        </blockquote>
        <blockquote class="quote-card">
          <p>&ldquo;If it could just tell me who to call next, I&rsquo;d open it every morning.&rdquo;</p>
          <cite>&mdash; SDR, occasional user</cite>
        </blockquote>
        <blockquote class="quote-card">
          <p>&ldquo;It&rsquo;s faster to keep my deals in a spreadsheet than to fight the CRM&rsquo;s eight required fields.&rdquo;</p>
          <cite>&mdash; Account exec, 2 logins / month</cite>
        </blockquote>
      </div>
    </section>

    <!-- Progress stepper -->
    <section class="stepper-card" aria-label="Progress today">
      <div class="stepper-top">
        <b>6 follow-ups today · $663k sample ARR in total</b>
        <span id="progressLabel">0 of 6 updated</span>
      </div>
      <div class="stepper" id="stepper" role="img" aria-label="Progress: 0 of 6 follow-ups updated"></div>
      <div class="caught" id="caughtBanner">🎉 All caught up — 6 of 6 updated today. Nice work.</div>
    </section>

    <div class="grid">
      <!-- Follow-ups -->
      <section aria-label="Follow-ups">
        <div class="colhead">
          <h2>Follow-ups</h2>
          <span class="ordernote">Ordered by sample ARR, biggest first</span>
        </div>
        <div class="state-demo" id="followupsDemo" aria-label="Preview follow-ups list states">
          <span>List state</span>
          <button type="button" data-fstate="ready">Data</button>
          <button type="button" data-fstate="loading" class="active">Loading</button>
          <button type="button" data-fstate="empty">Empty</button>
          <button type="button" data-fstate="error">Error</button>
        </div>
        <div id="todoList" aria-live="polite"></div>
      </section>

      <!-- Right column -->
      <div>
        <section class="sidecard" aria-label="Updated today">
          <h3>Updated today</h3>
          <p class="hint">Deals you’ve called, emailed, or logged move here.</p>
          <div id="updatedList"><p class="none">Nothing updated yet. Start at the top — James Whitfield, $312k.</p></div>
        </section>
        <section class="sidecard" aria-label="Activity feed">
          <h3>Activity feed</h3>
          <p class="hint">Every call, email, and log, as it happens.</p>
          <div id="feedList"><p class="none">No activity yet today.</p></div>
          <button class="textlink" id="feedHistoryLink" type="button">View all in Activity History
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </section>
      </div>
    </div>
   </div><!-- /viewToday -->
`);
