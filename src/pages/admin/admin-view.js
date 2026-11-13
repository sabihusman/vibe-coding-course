/* Admin screen markup: intro, tabs, Orbit, Living PRD, Handoff.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.getElementById("appMain").insertAdjacentHTML("beforeend", `
   <!-- ============ Admin: Orbit Code Explorer ============ -->
   <div id="viewAdmin" hidden>
    <div class="pagehead">
      <div>
        <h1>Admin</h1>
        <div class="sub">CRM Companion, explained for an engineer who has never seen it: what the app does, where each part lives in the code, and how to run and rebuild it. Three tabs, one app.</div>
      </div>
      <div class="admin-badges">
        <span class="admin-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin only</span>
        <span class="sample-pill"><i></i> Sample data only — resets on reload</span>
      </div>
    </div>

    <section class="admin-card admin-intro" aria-label="How the three tabs connect">
      <h2>One app, three views</h2>
      <p>Everything here describes the same app: index.html and the src/ folder behind it. The <b>Living PRD</b> says what the app does and why. The <b>Orbit</b> shows where each part lives in the code. The <b>Handoff</b> says how to run it, what is solid, and what to build next. They cross-link: a PRD block or handoff section that names a part links to that part’s Orbit node, and every Orbit node links back to the PRD block and handoff section that describe it.</p>
      <div class="intro-grid">
        <button type="button" class="intro-card" data-atab-go="orbit"><span class="step-num">1</span><b>Orbit — where it lives</b><span>An orbit map of the app, 27 nodes. Click any part for a plain-language explanation, what it connects to, whether it is real or mocked, and a short piece of its real code.</span></button>
        <button type="button" class="intro-card" data-atab-go="prd"><span class="step-num">2</span><b>Living PRD — what it does</b><span>Eight blocks extracted from the live build: problem, hypothesis, user flow, success metrics, technical reality, risks, scope, and the engineering recommendation.</span></button>
        <button type="button" class="intro-card" data-atab-go="handoff"><span class="step-num">3</span><b>Handoff — how to run it</b><span>The engineer-ready summary: a 60-second overview, the frontend, the backend that is not built yet, the key flows to walk, what is solid vs duct tape, and how to run it.</span></button>
      </div>
    </section>

    <div class="admin-tabs" role="tablist" aria-label="Admin sections">
      <button type="button" class="atab active" role="tab" id="atabOrbit" data-atab="orbit" aria-selected="true" aria-controls="adminTabOrbit">Orbit<small>Code Explorer · 27 nodes</small></button>
      <button type="button" class="atab" role="tab" id="atabPrd" data-atab="prd" aria-selected="false" aria-controls="adminTabPrd">Living PRD<small>8 blocks</small></button>
      <button type="button" class="atab" role="tab" id="atabHandoff" data-atab="handoff" aria-selected="false" aria-controls="adminTabHandoff">Handoff<small>Engineering note</small></button>
    </div>

    <div id="adminTabOrbit" class="admin-tabpanel" role="tabpanel" aria-labelledby="atabOrbit">
    <div class="tab-head">
      <h2>Orbit Code Explorer</h2>
      <div class="sub">How CRM Companion is put together — every part of the app, in plain language. Select any part to see what it does, what it connects to, and whether it is real or mocked.</div>
    </div>

    <section class="admin-card" aria-label="How to read this">
      <h2>How to read this</h2>
      <p>The whole app sits in the centre — CRM Companion is index.html plus the src/ folder, grouped by feature, and everything else orbits it. The three screens sit on the inner orbit, and the panels, data, and states they use sit on the outer orbits. Select any node to see, in plain language, what it does, what it connects to, and whether it is real or mocked.</p>
    </section>

    <div class="orbit-controls">
      <div class="searchbox">
        <label class="fieldlabel" for="orbitSearch" style="margin:0 0 6px">Find a part of the app</label>
        <input type="text" id="orbitSearch" placeholder="Search by name — try “error”, “call”, or “data”…" autocomplete="off" />
      </div>
      <div role="group" aria-label="Filter nodes by type" style="display:flex;gap:6px;flex-wrap:wrap">
        <button type="button" class="ofilter active" data-ofilter="all">All</button>
        <button type="button" class="ofilter" data-ofilter="screen">Screens</button>
        <button type="button" class="ofilter" data-ofilter="panel">Panels</button>
        <button type="button" class="ofilter" data-ofilter="data">Data</button>
        <button type="button" class="ofilter" data-ofilter="state">States</button>
      </div>
    </div>
    <div class="orbit-chips" id="orbitChips" aria-live="polite"></div>

    <div class="orbit-layout">
      <div class="orbit-stage" id="orbitStage" aria-label="Orbit diagram of the app">
        <div class="orbit-ring r1"></div>
        <div class="orbit-ring r2"></div>
        <div class="orbit-ring r3"></div>
      </div>
      <aside class="admin-card orbit-detail" id="orbitDetail" aria-label="Selected part, explained" style="margin-top:0"></aside>
    </div>

    <section class="admin-card" aria-label="All parts of the app">
      <h2>All 27 parts</h2>
      <p>The full map, as a list — the same nodes as the orbit. Select any part to open its explanation.</p>
      <div class="orbit-list" id="orbitList"></div>
    </section>

    <section class="admin-card" aria-label="Questions and answers">
      <h2>Questions people ask about this app</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h3>Where do I start reading the app?</h3>
          <p>Start in the centre with CRM Companion itself, then follow the orbit clockwise: Today, then Deal Detail, then Activity History, then back to Today. That is the same path a rep takes — a follow-up card opens Deal Detail, and Deal Detail links into Activity History for that deal.</p>
        </div>
        <div class="faq-item">
          <h3>Where does the data live?</h3>
          <p>The 6 sample deals are in src/shared/data/sample-deals.js and the 12 seeded activities are in src/shared/data/sample-activities.js, held in memory. Nothing is sent to a server or a database, and anything you do in a session is lost when the page reloads.</p>
        </div>
        <div class="faq-item">
          <h3>Where is the Call and Email logic?</h3>
          <p>In the Call panel and Email panel, which open from the follow-up cards on Today and from Deal Detail. Saving a call or sending an email moves the deal to Updated today and adds it to the Activity feed and Activity History. Closing a panel without saving counts as attempted instead — for a call once the timer has run or a note is typed, and for an email once the draft is typed or edited.</p>
        </div>
        <div class="faq-item">
          <h3>Why are Deals and Activity greyed out in the sidebar?</h3>
          <p>By design, for this test. The note under them says so: nav is off, and only the follow-ups on Today are in scope. Deal Detail and Activity History still exist — you reach them from a follow-up card, a row, or a link, not from the sidebar.</p>
        </div>
        <div class="faq-item">
          <h3>What is real, and what is mocked?</h3>
          <p>The behaviour is real: the screens, panels, timers, search, and states all work in the browser exactly as you see them. The content is mocked: the names, companies, amounts, and past activities are sample data, no real call is placed, no real email is sent, and nothing is saved anywhere.</p>
        </div>
        <div class="faq-item">
          <h3>Where does the loading, empty, and error wording live?</h3>
          <p>In the states of the two lists — the follow-ups list on Today and the activity list in Activity History. Each list can be loading (skeleton cards), empty, or failed, and the exact wording is shown in the state nodes on the orbit. Testers can force each state with the Data / Loading / Empty / Error controls above each list.</p>
        </div>
      </div>
    </section>

    <section class="admin-card" aria-label="Tips for finding your way around">
      <h2>Tips for finding your way around</h2>
      <ol class="tips-list">
        <li><span class="tnum">1</span><span><b>Search, don’t scroll.</b> Type a name in the search box — “error”, “email”, “data” — and use the result chips to jump straight to that part instead of scanning the whole orbit.</span></li>
        <li><span class="tnum">2</span><span><b>Click a node for its connections.</b> Every node’s panel has “Connects to” buttons. Follow them to walk from a screen to its panels, its data, and its states without getting lost.</span></li>
        <li><span class="tnum">3</span><span><b>Follow the orbit clockwise.</b> Today → Deal Detail → Activity History → back to Today is the rep’s real path through the app, so it is the safest order to review the build in.</span></li>
      </ol>
    </section>

    </div><!-- /adminTabOrbit -->

    <div id="adminTabPrd" class="admin-tabpanel" role="tabpanel" aria-labelledby="atabPrd" hidden>
    <div class="tab-head">
      <h2>Living PRD — CRM Companion</h2>
      <div class="sub">What the app does, extracted from what the live build actually does, in eight blocks. Where the build is mocked, this PRD says so. The file lives at <code>04-production/PRD.md</code>.</div>
    </div>

    <section class="admin-card doc-block" id="prd-00" aria-label="PRD header">
      <div class="doc-meta">
        <div><b>Product:</b> CRM Companion. A rep’s Today view for a CRM that only 18% of reps use.</div>
        <div><b>Stage:</b> Prototype (Modules 1–3) → Production (Module 4)</div>
        <div><b>Owner:</b> Sabih Usman</div>
        <div><b>Last updated:</b> 2026-11-12</div>
        <div><b>Live prototype:</b> https://vibe-coding-course-weld-omega.vercel.app</div>
        <div><b>Repo main:</b> 6d44ccf</div>
      </div>
      <p class="doc-note"><b>Source of truth:</b> the live prototype above. This PRD is extracted from what that build actually does, in the eight blocks below. Where the build is mocked, this PRD says so.</p>
    </section>

    <section class="admin-card doc-block" id="prd-01" aria-label="01 Product Overview">
      <div class="doc-head"><span class="doc-num">01</span><h2>Product Overview</h2></div>
      <p>CRM Companion is a rep’s Today view. Each morning, a rep opens one screen, sees who to call or email next, does the call or email right there, and has it logged, with no extra admin.</p>
      <p class="doc-oneliner">“Do the work here, not log it after.”</p>
      <ul>
        <li><b>Surface:</b> a web page. Today is the main screen. Deal Detail and Activity History are the other two screens. An Admin portal, the Orbit Code Explorer, is separate from the rep’s view.</li>
        <li><b>Primary action:</b> call or email a follow-up, right from the task card.</li>
        <li><b>Who it is for:</b> Sales reps, Account Executives, and Sales Development Representatives. The person on the screen is a sample rep, Alex Rivera.</li>
        <li><b>Job to be done:</b> open one screen, see who to call or email next, do it right there, and have it logged.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-02" aria-label="02 Problem and Hypothesis">
      <div class="doc-head"><span class="doc-num">02</span><h2>Problem &amp; Hypothesis</h2></div>
      <ul>
        <li><b>Problem:</b> Reps have to log every deal in the CRM. Only 18% use it each week. The work happens in email and on the phone. Logging is extra admin after the work. It takes 8 fields and 11 minutes to update a deal. The target is 2 minutes. 63% of reps keep a shadow spreadsheet instead.</li>
        <li><b>Hypothesis:</b> Letting reps call or email right from the task will keep them in the CRM and log as they go, instead of doing the work in email and on the phone, then logging it after.</li>
        <li><b>Risk type:</b> Usability. Will reps actually do the call or email inside the CRM, instead of in their usual email or phone app?</li>
      </ul>
      <p class="doc-kill"><b>Kill switch:</b> If a tester still opens their phone or email app instead of doing the call or email in the tool, or gets stuck more than 30 seconds on Call or Email, Hypothesis B has failed. Fix the flow or pivot. Do not fix the look. The kill-switch rules live in the test plan only. They are never on screen.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="followups">Follow-ups list</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-03" aria-label="03 User Flow and Screen Map">
      <div class="doc-head"><span class="doc-num">03</span><h2>User Flow &amp; Screen Map</h2></div>
      <ol>
        <li><b>Today:</b> 6 follow-ups, biggest first ($663k total). Call and Email first on every card. Log activity second.</li>
        <li><b>Call or Email:</b> a simulated panel opens. Call has a timer, a note, and an outcome (Called / No answer / Met). Email has a pre-filled draft and Send. Saving or sending logs the activity and moves the deal to Updated today.</li>
        <li><b>Attempted:</b> closing a Call or Email panel without saving logs it as attempted in Activity, if the timer ran or a draft was typed. The deal stays in Follow-ups.</li>
        <li><b>Deal Detail:</b> click a follow-up card to open that deal. Company, contact, sample ARR, due date, next step, past activity. Call and Email first there too. Back returns to Today.</li>
        <li><b>Activity History:</b> every call, email, log, and attempted call or email, newest first. Search by name or company. Click a row to open Deal Detail. Back returns to Today.</li>
        <li><b>Admin:</b> an “Admin” entry in the sidebar opens the Orbit Code Explorer. It maps the app as an orbit, with 27 nodes. Click a node to see what it does, what it connects to, and if it is real or mocked. Each node has a “Show code” toggle with a short piece of that node’s real code.</li>
      </ol>
      <p class="doc-note"><b>Screen map:</b> <code>Today → Call / Email panel → Updated today</code> · <code>Today → Deal Detail → Activity History → Deal Detail</code> · <code>Today → Activity History → Today</code> · <code>Sidebar → Admin → Orbit Code Explorer</code></p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="log">Log activity</button><button type="button" class="olink" data-orbit-link="updated">Updated today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button><button type="button" class="olink" data-orbit-link="search">Search by name / company</button><button type="button" class="olink" data-orbit-link="rowopen">Row opens Deal Detail</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-04" aria-label="04 Success Metrics">
      <div class="doc-head"><span class="doc-num">04</span><h2>Success Metrics</h2></div>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>Metric</th><th>Definition</th><th>Target</th></tr></thead>
        <tbody>
          <tr><td>North Star: work done in the tool</td><td>% of follow-ups where the call or email was done from the task, not outside it</td><td class="num">≥ 70% in a test session (proposed, not yet measured)</td></tr>
          <tr><td>Activation</td><td>% of testers who do at least one Call or Email from a task</td><td class="num">≥ 80% in a test session (proposed)</td></tr>
          <tr><td>Log as you go</td><td>% of calls/emails that are logged in the same step, with no log-after</td><td class="num">≥ 80% (proposed)</td></tr>
          <tr><td>Attempted, not lost</td><td>% of closed panels that are counted as attempted, not as no call</td><td class="num">100% — Call and Email must match (Email was fixed in 4f68201 after it failed this check live)</td></tr>
          <tr><td>Time to first action</td><td>Time from opening Today to starting the first Call or Email</td><td class="num">Under 30 seconds — the kill-switch floor</td></tr>
          <tr><td>Loading / empty / error</td><td>% of testers who see the right state with the exact wording, when forced</td><td class="num">100% in the test controls</td></tr>
        </tbody>
      </table></div>
      <p class="doc-kill"><b>Proposed, not yet measured.</b> No metric above has been measured in a real user session yet. The A/B test plan is written (6–8 testers, each tries Version A and Version B, half A-first). No session has run yet.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="feed">Activity feed</button><button type="button" class="olink" data-orbit-link="loading">Loading state</button><button type="button" class="olink" data-orbit-link="errortoday">Error state — Today</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-05" aria-label="05 Technical Reality">
      <div class="doc-head"><span class="doc-num">05</span><h2>Technical Reality</h2></div>
      <p>Extracted from the prototype, what was actually built.</p>
      <ul>
        <li><b>Frontend:</b> a single self-contained HTML file. The Muse artifact <code>crm-companion-today-view-v3</code>, exported as the repo’s root <code>index.html</code>. It is not a Vite / React project, so there is no <code>src/pages</code> folder.</li>
        <li><b>Screens:</b> Today, Deal Detail, and Activity History, switched in place in one page. Admin Orbit is a fourth view, in the same file.</li>
        <li><b>Call / Email:</b> simulated panels only. No real call is made. No real email is sent.</li>
        <li><b>Data:</b> 6 sample deals and 12 seeded sample activities, Oct 28–Nov 4, in data arrays in the file. Anything logged in the session is added on top, newest first.</li>
        <li><b>State:</b> in memory only. Nothing is saved to a server, a file, or a database. It resets on reload.</li>
        <li><b>Naming:</b> screens and functions are named for what they do — Today, Deal Detail, Activity History, <code>showView</code>, <code>openDeal</code>, <code>openHistory</code>, <code>renderTodo</code>, <code>renderUpdated</code>, <code>completeDeal</code>, <code>addAttempt</code>. An engineer can tell what each does from its name. It is not <code>Component_1.tsx</code> naming.</li>
        <li><b>Separation:</b> the sample data sits in data arrays, separate from the functions that draw the screen. But everything lives in one file. Data and display are not in separate files. There is no data service layer yet.</li>
        <li><b>Documentation:</b> there is no README inside the project itself. The build summary is on the computer only, per the Module 3 lab guide. The prompt chain is in <code>03-chaining/PROMPTS.md</code>.</li>
        <li><b>Gap to production:</b> needs a real backend and auth, a split into files by feature, and a decision on the sidebar Deals and Activity tabs.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="dealsdata">Deals data — 6 deals</button><button type="button" class="olink" data-orbit-link="actdata">Activities data — 12 activities</button><button type="button" class="olink" data-orbit-link="session">Session state</button><button type="button" class="olink" data-orbit-link="design">Design system</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-06" aria-label="06 Assumptions and Risks">
      <div class="doc-head"><span class="doc-num">06</span><h2>Assumptions &amp; Risks</h2></div>
      <ul>
        <li><b>Assumption:</b> reps will do the call or email inside the CRM, instead of in their usual email or phone app. <i>Risk:</i> if they do not, a faster log screen alone will not fix adoption. That is the kill switch above.</li>
        <li><b>Assumption:</b> 6 follow-ups in ARR order is the right morning list. <i>Risk:</i> a rep may need due-date order, or a mix of due date and ARR, instead.</li>
        <li><b>Assumption:</b> the sample history makes the screens feel real. <i>Risk:</i> the 12 seeded activities are invented, Oct 28–Nov 4, and will go stale. They are useful for testing, not real rep history.</li>
        <li><b>Risk:</b> Call and Email may not stay symmetric. The live test found Email attempted did not log while Call attempted did. It was fixed in 4f68201, but Pause/Reset and the No answer / Met outcomes were not clicked in that test.</li>
        <li><b>Risk:</b> Log activity logs instantly, with no panel or form. That was not specified in the prompts. A rep may expect a note and outcome there too.</li>
        <li><b>Risk:</b> the single file will tangle as it grows. The next refactor should split it by feature before adding a backend.</li>
        <li><b>Comprehension debt:</b> the build was made with prompts, not written by hand. This PRD, the prompt chain in <code>03-chaining/PROMPTS.md</code>, and the Orbit Code Explorer in the Admin portal are the first steps in paying that debt down.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="log">Log activity</button><button type="button" class="olink" data-orbit-link="actdata">Activities data</button><button type="button" class="olink" data-orbit-link="followups">Follow-ups list</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-07" aria-label="07 In vs Out of Scope">
      <div class="doc-head"><span class="doc-num">07</span><h2>In vs. Out of Scope</h2></div>
      <div class="scope-grid">
        <div class="scope-col in">
          <h3><i></i>In scope (this build)</h3>
          <ul>
            <li>Today, Deal Detail, and Activity History, with Call and Email first, Log activity second.</li>
            <li>Simulated Call and Email panels, with save/send logging and attempted counting.</li>
            <li>Loading, empty, and error states for Today and Activity History, with exact wording and Retry.</li>
            <li>Neutral line “Work this follow-up as you normally would.” Left nav labelled out of scope.</li>
            <li>Admin portal: Orbit Code Explorer, with 27 nodes, search, filters, FAQ and tips, and “Show code” per node.</li>
          </ul>
        </div>
        <div class="scope-col out">
          <h3><i></i>Out of scope (this build)</h3>
          <ul>
            <li>Real calls or emails. Both panels are simulated. Nothing is sent.</li>
            <li>Real CRM data or a CRM link. All names, deals, and amounts are sample data.</li>
            <li>Saving data. Everything is in memory only. It resets on reload.</li>
            <li>Sign-in, accounts, or multi-user support. There is no sign-in.</li>
            <li>Sidebar Deals and Activity tabs. They are plain text, not links. They do nothing by design in this test.</li>
            <li>Version B, the dispatch-board layout. It is a separate Muse artifact, kept apart for later A/B testing. It is not in this build, not in the repo, and not on the live site.</li>
            <li>Supabase backend. Proposed in the handoff note. Not built or connected yet.</li>
          </ul>
        </div>
      </div>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button><button type="button" class="olink" data-orbit-link="loading">Loading state</button><button type="button" class="olink" data-orbit-link="emptytoday">Empty — Today</button><button type="button" class="olink" data-orbit-link="errortoday">Error — Today</button><button type="button" class="olink" data-orbit-link="emptyhistory">Empty — Activity History</button><button type="button" class="olink" data-orbit-link="errorhistory">Error — Activity History</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-08" aria-label="08 Engineering Recommendation">
      <div class="doc-head"><span class="doc-num">08</span><h2>Engineering Recommendation</h2></div>
      <ul>
        <li><b>Front Door:</b> this PRD lives at <code>04-production/PRD.md</code>. The handoff note lives at <code>04-production/handoff-note.md</code>.</li>
        <li><b>Cleanup:</b> split the single HTML file by feature, following the handoff note and your instructor’s layout: <code>src/pages/</code> with one folder per screen (Today, Deal Detail, Activity History), <code>src/shared/data/</code> for the sample deals and activities, <code>src/shared/model/</code> for the calculations, <code>src/shared/components/</code> for the panels, <code>src/app/</code> for navigation, and <code>tests/</code> for the logic checks. Do this before adding a backend, or the data and display logic will tangle further.</li>
        <li><b>Memory:</b> move deals and activities to Supabase (PostgreSQL + Auth), with row-level security so a rep sees only their own data. Replace the in-page data arrays. The Call and Email panels stay simulated in v1 — the backend only needs to store what was attempted, saved, or sent in the tool.</li>
        <li><b>Next spike:</b> run the A/B test first, with Version A and Version B, before building the backend. The test plan is written. If Version B wins, build the backend for the winning layout, not for both.</li>
        <li><b>Handoff:</b> see <code>04-production/handoff-note.md</code> for the engineer-ready summary — the <button type="button" class="olink doc" data-holink="ho-summary">Handoff tab</button> renders it.</li>
      </ul>
      <p class="doc-note"><i>Module 4 · Vibe Coding Certification, the prototype is the source of truth; the spec is the output.</i></p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="dealsdata">Deals data</button><button type="button" class="olink" data-orbit-link="actdata">Activities data</button><button type="button" class="olink" data-orbit-link="session">Session state</button></div></div>
    </section>
    </div><!-- /adminTabPrd -->

    <div id="adminTabHandoff" class="admin-tabpanel" role="tabpanel" aria-labelledby="atabHandoff" hidden>
    <div class="tab-head">
      <h2>Engineering Handoff — CRM Companion</h2>
      <div class="sub">The engineer-ready summary of the Living PRD: how to run it, what is solid, what is duct tape, and what to build next. The file lives at <code>04-production/handoff-note.md</code>.</div>
    </div>

    <section class="admin-card doc-block" id="ho-00" aria-label="Handoff header">
      <div class="doc-meta">
        <div><b>Product:</b> CRM Companion, Module 3 prototype → production transition (Module 4)</div>
        <div><b>Live prototype:</b> https://vibe-coding-course-weld-omega.vercel.app</div>
        <div><b>Repo main baseline:</b> 6d44ccf (Module 4: Admin panel with Orbit, Living PRD and Handoff tabs)</div>
        <div><b>Last updated:</b> 2026-11-12</div>
      </div>
      <p class="doc-note"><b>Living PRD:</b> <code>04-production/PRD.md</code> — read it first. This note is the engineer-ready summary of that PRD. The <button type="button" class="olink doc" data-prdlink="prd-01">Living PRD tab</button> renders it.</p>
    </section>

    <section class="admin-card doc-block" id="ho-summary" aria-label="What this is">
      <div class="doc-head"><span class="doc-num">60s</span><h2>What this is</h2></div>
      <p>CRM Companion is a rep’s Today view for a CRM at 18% adoption. A rep opens one screen, sees 6 follow-ups in ARR order, and calls or emails right from the task, so the work and the log happen in the same place. Saving or sending logs the activity and moves the deal to Updated today. Closing a Call or Email panel without saving counts as attempted, if the timer ran or a draft was typed. There are two more screens, Deal Detail and Activity History, and loading, empty, and error states for both lists, with exact wording. Everything is sample data, in memory only, and resets on reload. No real call is placed, no real email is sent, and nothing is saved to a server.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="updated">Updated today</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-frontend" aria-label="Frontend">
      <div class="doc-head"><span class="doc-num">FE</span><h2>Frontend</h2></div>
      <ul>
        <li>A single self-contained HTML file: the Muse artifact <code>crm-companion-today-view-v3</code>, exported as the repo’s root <code>index.html</code> (61,707 bytes at main 19fc70b; Email attempted fix in 4f68201). It is not a Vite / React project, so there is no <code>src/pages</code> folder.</li>
        <li>Three screens in one page, switched in place: Today, Deal Detail, Activity History. Navigation is by clicking a follow-up card, a row in Activity History, the Activity feed card, or Back.</li>
        <li>Call and Email open simulated panels over the page. Log activity currently logs instantly, with no panel — see Open questions in the PRD.</li>
        <li>Design system: dark sidebar #1e1e2d, light content #f9fafb, white cards, 8px radius, borders #e5e7eb, blue primary #3b82f6, green success #22c55e for success only. ARR numbers use tabular figures.</li>
        <li>Test controls: Data / Loading / Empty / Error buttons on Today and on Activity History, so a tester can force each list state without turning off the network.</li>
        <li>Admin portal: Orbit Code Explorer — see the <button type="button" class="olink doc" data-holink="ho-admin">Admin portal</button> section below.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button><button type="button" class="olink" data-orbit-link="design">Design system</button><button type="button" class="olink" data-orbit-link="log">Log activity</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-backend" aria-label="Backend and data">
      <div class="doc-head"><span class="doc-num">BE</span><h2>Backend / data</h2></div>
      <p class="doc-warn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg><span>Not built yet. Do not trust any backend claim about this prototype.</span></p>
      <ul>
        <li>There is no backend, no database, and no auth in the live build. All data is hard-coded sample data in the page: 6 deals and 12 seeded activities, Oct 28–Nov 4, plus anything logged in the session, held in memory only.</li>
        <li>Proposed Supabase backend, to be set up as the next step, <b>not claimed as live</b>:
          <ul>
            <li><code>deals</code> — id, contact_name, company, email, phone, sample_arr, due_date, next_step, owner_id.</li>
            <li><code>activities</code> — id, deal_id, type (call / email / log / attempt), outcome, detail, duration_seconds, created_at, owner_id.</li>
            <li><code>follow_ups</code> — id, deal_id, status (open / updated_today), updated_at, owner_id. Or derive this from activities; do not build both unless the query needs it.</li>
            <li>Auth: Supabase Auth, one account per rep, with row-level security so a rep sees only their own deals and activities.</li>
            <li>The Call and Email panels stay simulated in v1. Do not wire them to a real phone or email service until the product decision is made. The backend only needs to store what was attempted, saved, or sent in the tool.</li>
          </ul>
        </li>
        <li>Version B, the dispatch-board layout, is a separate Muse artifact, not in this codebase. Do not merge it into this build without a product decision.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="dealsdata">Deals data — 6 deals</button><button type="button" class="olink" data-orbit-link="actdata">Activities data — 12 activities</button><button type="button" class="olink" data-orbit-link="session">Session state — in memory only</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-flows" aria-label="Key flows">
      <div class="doc-head"><span class="doc-num">1–6</span><h2>Key flows</h2></div>
      <p>Walk these first, in this order:</p>
      <ol>
        <li>Today → click James Whitfield’s card → Deal Detail → Back to Today.</li>
        <li>Today → Call on James Whitfield, save with a note → deal moves to Updated today, progress 1 of 6, Activity feed shows the call.</li>
        <li>Today → Email on Daniel Ortiz, send the pre-filled draft → deal moves to Updated today, progress 2 of 6.</li>
        <li>Today → open a Call panel, close it without saving after the timer runs → “Call attempted” in Activity, deal stays in Follow-ups. Do the same for Email, with a typed draft → “Email attempted”.</li>
        <li>Activity History → search “James Whitfield” → 2 activities → click a row → Deal Detail → Back to Today.</li>
        <li>Today and Activity History → use the Data / Loading / Empty / Error controls → check the skeleton, the empty message, and the error message with Retry, in the exact wording in the PRD.</li>
      </ol>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="feed">Activity feed</button><button type="button" class="olink" data-orbit-link="search">Search by name / company</button><button type="button" class="olink" data-orbit-link="rowopen">Row opens Deal Detail</button><button type="button" class="olink" data-orbit-link="loading">Loading state</button><button type="button" class="olink" data-orbit-link="errortoday">Error state — Today</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-solid" aria-label="What is solid vs what is duct tape">
      <div class="doc-head"><span class="doc-num">S/D</span><h2>What’s solid vs. what’s duct tape</h2></div>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>Area</th><th>Solid / Rough</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Today list, ARR order, 6 deals</td><td><span class="stag solid">Solid</span></td><td>Verified live 2026-11-10, in the exact order and amounts in the PRD</td></tr>
          <tr><td>Call / Email panels, save and send</td><td><span class="stag solid">Solid</span></td><td>Verified live; Call attempted and Email attempted both verified after the 4f68201 fix</td></tr>
          <tr><td>Deal Detail and Activity History navigation</td><td><span class="stag solid">Solid</span></td><td>Verified live, including pre-filtered Activity History from Deal Detail and search by name and company</td></tr>
          <tr><td>Loading / empty / error states</td><td><span class="stag solid">Solid</span></td><td>Exact wording verified live on both screens, Retry restores the list</td></tr>
          <tr><td>Kill-switch line removed, neutral instruction, nav labelled out of scope</td><td><span class="stag solid">Solid</span></td><td>Verified live; the old kill-switch test line is gone from every screen</td></tr>
          <tr><td>Single-file structure</td><td><span class="stag rough">Rough</span></td><td>Everything in one HTML file; data arrays are separate from rendering, but there are no separate files for screens, components, or data</td></tr>
          <tr><td>No README inside the project</td><td><span class="stag rough">Rough</span></td><td>The build summary is on the computer only; PROMPTS.md is the only in-repo record of how the build was made</td></tr>
          <tr><td>Log activity</td><td><span class="stag rough">Rough</span></td><td>Logs instantly with no panel or form; not specified in the prompts, and not tested against a form-based flow</td></tr>
          <tr><td>Sample data</td><td><span class="stag rough">Rough</span></td><td>All 6 deals and 12 activities are invented; the history dates are Oct 28–Nov 4 and will go stale</td></tr>
          <tr><td>Backend, auth, persistence</td><td><span class="stag duct">Duct tape</span></td><td>None exists. In-memory only, resets on reload. The Supabase tables above are proposed, not built</td></tr>
        </tbody>
      </table></div>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="followups">Follow-ups list</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="log">Log activity</button><button type="button" class="olink" data-orbit-link="dealsdata">Deals data</button><button type="button" class="olink" data-orbit-link="actdata">Activities data</button><button type="button" class="olink" data-orbit-link="session">Session state</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-risks" aria-label="Risks and assumptions for the team">
      <div class="doc-head"><span class="doc-num">!</span><h2>Risks &amp; assumptions for the team</h2></div>
      <ul>
        <li>Do not trust the sample history as real rep behaviour. It was seeded to make the screens look real.</li>
        <li>Do not trust that Call and Email are symmetric. The live test found Email attempted did not log while Call attempted did; it was fixed in 4f68201, but Pause/Reset and the No answer / Met outcomes were not clicked in that test.</li>
        <li>Do not trust the sidebar. Deals and Activity are plain text and do nothing by design in this test version. Wiring them up is a product decision, not a bug fix.</li>
        <li>Do not assume the single file will scale. The next refactor should split it by feature before adding a backend, or the data and display logic will tangle further.</li>
        <li>The hypothesis is still unproven. A partner understood it exactly right in Module 2, but no A/B session has run yet. Version B exists for that test, and the test plan is written, but no tester has tried either version against the other.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="actdata">Activities data</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="backlinks">Back to Today links</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-run" aria-label="How to run it">
      <div class="doc-head"><span class="doc-num">▶</span><h2>How to run it</h2></div>
      <ul>
        <li>Open the live URL: https://vibe-coding-course-weld-omega.vercel.app — no sign-in, no setup. It is sample data only and resets on reload.</li>
        <li>Or open the repo: https://github.com/sabihusman/vibe-coding-course — the live site is the root <code>index.html</code> on main (6d44ccf). Vercel deploys main automatically, so a push to main is the go-live decision.</li>
        <li>To run the prompts again, read <code>03-chaining/PROMPTS.md</code> in the repo. The chain is Expand, then Behavior, then Refine. The build README (<code>module3-build-readme.md</code>) is not in the repo, per the Module 3 lab guide.</li>
        <li>To set up the backend, create a Supabase project, create the three tables above, turn on Auth and row-level security, and replace the in-page data arrays with reads from those tables. Do not claim it is live until the tables, auth, and a persisted activity have been checked on the live site.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="session">Session state</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-admin" aria-label="Admin portal">
      <div class="doc-head"><span class="doc-num">A</span><h2>Admin portal</h2></div>
      <p>Orbit Code Explorer, built 2026-11-12 in the Muse artifact after Module 4 Lab 1. An “Admin” entry in the sidebar opens an orbit map of the app: CRM Companion in the centre, Today, Deal Detail, and Activity History orbiting it, with 27 nodes for the panels, data, states, and design system. Clicking a node shows a plain-language explanation, what it connects to, and whether it is real or mocked, plus a “Show code” toggle with a short excerpt of that node’s actual code from the single index.html file. Search with jump-to chips, All / Screens / Panels / Data / States filters, a “How to read this” intro, and FAQ and tips are on the same page. The rep flow is untouched.</p>
      <p class="doc-note"><b>Code layout:</b> the Lab 2 refactor split the single file by feature: one folder per screen in <code>src/pages</code>, data, model and components in <code>src/shared</code>, navigation and start-up in <code>src/app</code>, and logic checks in <code>tests</code>. Each Orbit node’s Show code names the file it lives in. Likewise, Supabase is proposed above, not live.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button></div></div>
    </section>
    </div><!-- /adminTabHandoff -->
   </div><!-- /viewAdmin -->
`);
