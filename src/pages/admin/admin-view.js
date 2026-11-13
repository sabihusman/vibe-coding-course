/* Admin screen markup: intro, tabs, Orbit, Living PRD, Handoff.
   Injects this screen's markup. Loaded before the logic files, so their
   getElementById lookups find these elements. */
document.getElementById("appMain").insertAdjacentHTML("beforeend", `
   <!-- ============ Admin: Orbit Code Explorer ============ -->
   <div id="viewAdmin" hidden>
    <div class="pagehead">
      <div>
        <h1 id="adminTitle" tabindex="-1">Admin</h1>
        <div class="sub">CRM Companion, explained for an engineer who has never seen it: what the app does, where each part lives in the code, and how to run and rebuild it. Three tabs, one app.</div>
      </div>
      <div class="admin-badges">
        <span class="admin-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin only</span>
      </div>
    </div>

    <section class="admin-card admin-intro" aria-label="How the three tabs connect">
      <h2>One app, three views</h2>
      <p>Everything here describes the same app: index.html and the src/ folder behind it. The <b>Living PRD</b> says what the app does and why. The <b>Orbit</b> shows where each part lives in the code. The <b>Handoff</b> says how to run it, what is solid, and what to build next. They cross-link: a PRD block or handoff section that names a part links to that part’s Orbit node, and every Orbit node links back to the PRD block and handoff section that describe it.</p>
      <div class="intro-grid">
        <button type="button" class="intro-card" data-atab-go="orbit"><span class="step-num">1</span><b>Orbit — where it lives</b><span>An orbit map of the app, 30 nodes. Click any part for a plain-language explanation, what it connects to, whether it is real or mocked, and a short piece of its real code.</span></button>
        <button type="button" class="intro-card" data-atab-go="prd"><span class="step-num">2</span><b>Living PRD — what it does</b><span>Eight blocks extracted from the live build: problem, hypothesis, user flow, success metrics, technical reality, risks, scope, and the engineering recommendation.</span></button>
        <button type="button" class="intro-card" data-atab-go="handoff"><span class="step-num">3</span><b>Handoff — how to run it</b><span>The engineer-ready summary: a 60-second overview, the frontend, the backend that is not built yet, the key flows to walk, what is solid vs duct tape, and how to run it.</span></button>
      </div>
    </section>

    <div class="admin-tabs" role="tablist" aria-label="Admin sections">
      <button type="button" class="atab active" role="tab" id="atabOrbit" data-atab="orbit" aria-selected="true" aria-controls="adminTabOrbit">Orbit<small>Code Explorer · 30 nodes</small></button>
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
      <p>The whole app sits in the centre — CRM Companion is index.html plus the src/ folder, grouped by feature, and everything else orbits it. The four screens — Today, Problem statement, Deal Detail and Activity history — sit on the inner orbit, and the panels, data, and states they use sit on the outer orbits. Select any node to see, in plain language, what it does, what it connects to, and whether it is real or mocked.</p>
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
      <h2>All 30 parts</h2>
      <p>The full map, as a list — the same nodes as the orbit. Select any part to open its explanation.</p>
      <div class="orbit-list" id="orbitList"></div>
    </section>

    <section class="admin-card" aria-label="Questions and answers">
      <h2>Questions people ask about this app</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h3>Where do I start reading the app?</h3>
          <p>Start in the centre with CRM Companion itself, then Today: the queue, its sort, and the context panel. From the context panel, Open deal reaches Deal Detail, which links into Activity history for that deal. Problem statement holds the research that explains why the app exists.</p>
        </div>
        <div class="faq-item">
          <h3>Where does the data live?</h3>
          <p>The 6 sample deals are in src/shared/data/sample-deals.js and the 12 seeded activities are in src/shared/data/sample-activities.js, and on the live site each browser’s copy is saved in Supabase (src/shared/data/supabase-source.js), so work survives a reload. Without the Supabase settings, for example opening index.html from disk, the app uses that in-page data and a reload starts over.</p>
        </div>
        <div class="faq-item">
          <h3>Where is the Call, Email and Log logic?</h3>
          <p>In three dialogs that open from the queue, the context panel and Deal Detail: src/shared/components/call-panel.js, email-panel.js and log-activity.js, with shared focus and Escape handling in dialog.js. Only an explicit save creates an activity and moves the deal to Updated today. Opening, cancelling or closing a dialog records nothing; unsent text is kept as a draft.</p>
        </div>
        <div class="faq-item">
          <h3>What is in the sidebar, and why is there no Deals item?</h3>
          <p>Workspace holds Today, Activity history and Problem statement; Admin sits in its own group. A Deals screen has not been built, so it is hidden rather than shown as a link that does nothing. Each view has its own address, so browser Back works.</p>
        </div>
        <div class="faq-item">
          <h3>What is real, and what is mocked?</h3>
          <p>The behaviour is real: the screens, panels, timers, search, and states all work in the browser exactly as you see them. The content is mocked: the names, companies, amounts, and past activities are sample data, no real call is placed, and no real email is sent. What a rep saves is stored in Supabase for their browser.</p>
        </div>
        <div class="faq-item">
          <h3>Where does the loading, empty, and error wording live?</h3>
          <p>In the states of the two lists — the follow-ups list on Today and the activity list in Activity History. Each list can be loading (skeleton cards), empty, or failed, and the exact wording is shown in the state nodes on the orbit. Reviewers can force each state from the Test controls area at the bottom of Today and of Activity history; reps only see the real state, with Retry when a load fails.</p>
        </div>
      </div>
    </section>

    <section class="admin-card" aria-label="Tips for finding your way around">
      <h2>Tips for finding your way around</h2>
      <ol class="tips-list">
        <li><span class="tnum">1</span><span><b>Search, don’t scroll.</b> Type a name in the search box — “error”, “email”, “data” — and use the result chips to jump straight to that part instead of scanning the whole orbit.</span></li>
        <li><span class="tnum">2</span><span><b>Click a node for its connections.</b> Every node’s panel has “Connects to” buttons. Follow them to walk from a screen to its panels, its data, and its states without getting lost.</span></li>
        <li><span class="tnum">3</span><span><b>Follow the rep’s path.</b> Today → context panel → Deal Detail → Activity history → back to Today is the rep’s real path through the app, so it is the safest order to review the build in.</span></li>
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
        <div><b>Product:</b> CRM Companion. A rep's Today view for a CRM that only 18% of reps use.</div>
        <div><b>Stage:</b> Prototype (Modules 1–3) → Production (Module 4)</div>
        <div><b>Owner:</b> Sabih Usman</div>
        <div><b>Last updated:</b> 2026-11-13 (design handoff v1.0 built: focused Today queue, Problem statement, intentional forms)</div>
        <div><b>Live prototype:</b> https://vibe-coding-course-weld-omega.vercel.app</div>
        <div><b>Repo main:</b> c7514e5</div>
      </div>
      <p class="doc-note"><b>Source of truth:</b> the live prototype above. This PRD is extracted from what that build actually does, in the eight blocks below. Where the build is mocked, this PRD says so.</p>
    </section>

    <section class="admin-card doc-block" id="prd-01" aria-label="01 Product Overview">
      <div class="doc-head"><span class="doc-num">01</span><h2>Product Overview</h2></div>
      <p>CRM Companion is a rep's Today view. Each morning, a rep opens one screen, sees who to call or email next, does the call or email right there, and has it logged, with no extra admin.</p>
      <p class="doc-oneliner">“Do the work here, not log it after.”</p>
      <ul>
        <li><b>Surface:</b> a web page with a sidebar. Workspace: Today (the main screen), Activity history, and Problem statement. Deal Detail opens from a deal. Admin, the Orbit Code Explorer with the Living PRD and Handoff, is in its own Admin group, separate from the rep's view.</li>
        <li><b>Primary action:</b> call or email a follow-up, right from the queue.</li>
        <li><b>Who it is for:</b> Sales reps, Account Executives, and Sales Development Representatives. The person on the screen is a sample rep, Alex Rivera.</li>
        <li><b>Job to be done:</b> open one screen, see who to call or email next, do it right there, and have it logged.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button><button type="button" class="olink" data-orbit-link="problem">Problem statement</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-02" aria-label="02 Problem and Hypothesis">
      <div class="doc-head"><span class="doc-num">02</span><h2>Problem &amp; Hypothesis</h2></div>
      <ul>
        <li><b>Problem:</b> Reps have to log every deal in the CRM. Only 18% use it each week. The work happens in email and on the phone. Logging is extra admin after the work. It takes 8 fields and 11 minutes to update a deal. The target is 2 minutes. 63% of reps keep a shadow spreadsheet instead.</li>
        <li><b>Hypothesis:</b> Letting reps call or email right from the task will keep them in the CRM and log as they go, instead of doing the work in email and on the phone, then logging it after.</li>
        <li><b>Risk type:</b> Usability. Will reps actually do the call or email inside the CRM, instead of in their usual email or phone app?</li>
        <li><b>Where the research lives:</b> the hypothesis, the research metrics and the rep quotes are on the Problem statement screen, not on Today. They are supplied research figures, not the rep's own results.</li>
      </ul>
      <p class="doc-kill"><b>Kill switch:</b> If a tester still opens their phone or email app instead of doing the call or email in the tool, or gets stuck more than 30 seconds on Call or Email, Hypothesis B has failed. Fix the flow or pivot. Do not fix the look. The kill-switch rules live in the test plan only. They are never on screen.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="followups">Follow-ups list</button><button type="button" class="olink" data-orbit-link="problem">Problem statement</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-03" aria-label="03 User Flow and Screen Map">
      <div class="doc-head"><span class="doc-num">03</span><h2>User Flow &amp; Screen Map</h2></div>
      <ol>
        <li><b>Today:</b> a quiet summary line (6 follow-ups · 2 overdue · $663k total sample ARR) and progress (0 of 6 updated), then the follow-up queue. Sort is Highest ARR by default, or Overdue first (most days overdue, then ARR). Each row has small labelled Call, Email and Log activity actions.</li>
        <li><b>Select a contact:</b> selecting a row updates the deal context panel beside the queue — company, contact, ARR, due, next step, Call, Open deal, and recent activity. Selecting never changes data.</li>
        <li><b>Call:</b> a named dialog says "Ready when you are". The timer starts only after Start simulated call. An outcome — Connected, No answer or Left voicemail — is required to save. Saving records one activity and moves the deal to Updated today.</li>
        <li><b>Email:</b> a named dialog with an editable subject and message, both required. Sending records one activity and moves the deal to Updated today. Nothing is actually sent.</li>
        <li><b>Log activity:</b> a short note form. A real note is required; saving records one activity and moves the deal to Updated today.</li>
        <li><b>Cancel records nothing:</b> opening, cancelling or closing Call, Email or Log activity creates no activity and no attempted entry. Unsent text is kept as a draft for that deal.</li>
        <li><b>Undo:</b> from the toast or from Updated today. It removes that one activity, restores the progress count, and puts the deal back in its place in the queue.</li>
        <li><b>Deal Detail:</b> Open deal in the context panel (or a row in Activity history, or Updated today) opens the full deal. Back returns to Today.</li>
        <li><b>Activity history:</b> a sidebar destination. Every call, email and note, newest first. Search by name or company. Select a row to open Deal Detail.</li>
        <li><b>Problem statement:</b> a sidebar destination with the full research block. Switching to it and back keeps the queue, sort, selection, progress and history.</li>
        <li><b>Admin:</b> in its own sidebar group. Orbit Code Explorer (30 nodes, each with a "Show code" excerpt), Living PRD and Handoff, with cross-links.</li>
      </ol>
      <p class="doc-note"><b>Screen map:</b> <code>Today → Call / Email / Log dialog → Updated today</code> · <code>Today → context panel → Open deal → Deal Detail → Activity history → Deal Detail</code> · <code>Sidebar → Activity history</code> · <code>Sidebar → Problem statement → Today</code> · <code>Sidebar → Admin → Orbit / Living PRD / Handoff</code></p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="log">Log activity</button><button type="button" class="olink" data-orbit-link="updated">Updated today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button><button type="button" class="olink" data-orbit-link="search">Search by name / company</button><button type="button" class="olink" data-orbit-link="rowopen">Row opens Deal Detail</button><button type="button" class="olink" data-orbit-link="sort">Sort</button><button type="button" class="olink" data-orbit-link="context">Deal context panel</button><button type="button" class="olink" data-orbit-link="problem">Problem statement</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-04" aria-label="04 Success Metrics">
      <div class="doc-head"><span class="doc-num">04</span><h2>Success Metrics</h2></div>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>Metric</th><th>Definition</th><th>Target</th></tr></thead>
        <tbody>
          <tr><td>North Star: work done in the tool</td><td>% of follow-ups where the call or email was done from the task, not outside it</td><td class="num">≥ 70% in a test session (proposed, not yet measured)</td></tr>
          <tr><td>Activation</td><td>% of testers who do at least one Call or Email from a task</td><td class="num">≥ 80% in a test session (proposed)</td></tr>
          <tr><td>Log as you go</td><td>% of calls/emails that are logged in the same step, with no log-after</td><td class="num">≥ 80% (proposed)</td></tr>
          <tr><td>No accidental activity</td><td>% of opened-then-cancelled dialogs that create no activity</td><td class="num">100% — checked by the acceptance tests</td></tr>
          <tr><td>Time to first action</td><td>Time from opening Today to starting the first Call or Email</td><td class="num">Under 30 seconds — the kill-switch floor</td></tr>
          <tr><td>Loading / empty / error</td><td>% of testers who see the right state with the exact wording, when forced</td><td class="num">100% in the test controls</td></tr>
        </tbody>
      </table></div>
      <p><b>Retired:</b> "Attempted, not lost" (% of closed panels counted as attempted). The design handoff replaced the attempted-on-close rule: opening or cancelling a dialog now records nothing.</p>
      <p class="doc-kill"><b>Proposed, not yet measured.</b> No metric above has been measured in a real user session yet. The A/B test plan is written (6–8 testers, each tries Version A and Version B, half A-first). No session has run yet.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="feed">Activity feed</button><button type="button" class="olink" data-orbit-link="loading">Loading state</button><button type="button" class="olink" data-orbit-link="errortoday">Error state — Today</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-05" aria-label="05 Technical Reality">
      <div class="doc-head"><span class="doc-num">05</span><h2>Technical Reality</h2></div>
      <p>Extracted from the prototype, what was actually built.</p>
      <ul>
        <li><b>Frontend:</b> plain HTML, CSS and JavaScript, with no build step and no framework. <code>index.html</code> is a short shell; the code lives in <code>src/</code>, grouped by feature (Lab 2 refactor). Scripts are classic <code>&lt;script&gt;</code> tags loaded in a fixed order.</li>
        <li><b>Screens:</b> Today, Problem statement, Deal Detail, Activity history and Admin, switched in place. Each has its own address (<code>#today</code>, <code>#problem</code>, <code>#history</code>, <code>#admin</code>, <code>#deal-…</code>), so browser Back works.</li>
        <li><b>Call / Email / Log:</b> accessible dialogs with focus kept inside, Escape to cancel, and focus returned afterwards. Call and Email are simulated: no real call is made and no real email is sent.</li>
        <li><b>Data:</b> 6 sample deals and 12 seeded sample activities, Oct 28–Nov 4. On the live site, each browser gets its own copy in Supabase.</li>
        <li><b>State:</b> saved in Supabase for each browser's anonymous rep (project <code>toctukiccnirfkkoaqog</code>, tables <code>deals</code>, <code>activities</code>, <code>follow_ups</code>, with row-level security), so it survives a reload. Without the Supabase settings, the app falls back to in-page sample data that resets on reload.</li>
        <li><b>Naming:</b> screens and functions are named for what they do — <code>showView</code>, <code>openDeal</code>, <code>openHistory</code>, <code>renderTodo</code>, <code>renderContext</code>, <code>sortDeals</code>, <code>completeDeal</code>, <code>undoDeal</code>, <code>openDialog</code>. An engineer can tell what each does from its name.</li>
        <li><b>Separation:</b> sample data in <code>src/shared/data/</code>, calculations (including the sort) in <code>src/shared/model/</code>, dialogs and list states in <code>src/shared/components/</code>, one folder per screen in <code>src/pages/</code>, navigation and start-up in <code>src/app/</code>, and checks in <code>tests/</code>.</li>
        <li><b>Documentation:</b> this PRD, the handoff note, the prompt chain in <code>03-chaining/PROMPTS.md</code>, and the Orbit Code Explorer. The build summary is on the computer only, per the Module 3 lab guide.</li>
        <li><b>Gap to production:</b> real sign-in instead of anonymous reps, and a decision on a Deals screen.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="dealsdata">Deals data — 6 deals</button><button type="button" class="olink" data-orbit-link="actdata">Activities data — 12 activities</button><button type="button" class="olink" data-orbit-link="session">Session state</button><button type="button" class="olink" data-orbit-link="design">Design system</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-06" aria-label="06 Assumptions and Risks">
      <div class="doc-head"><span class="doc-num">06</span><h2>Assumptions &amp; Risks</h2></div>
      <ul>
        <li><b>Assumption:</b> reps will do the call or email inside the CRM, instead of in their usual email or phone app. <i>Risk:</i> if they do not, a faster log screen alone will not fix adoption. That is the kill switch above.</li>
        <li><b>Assumption:</b> Highest ARR is the right default order for the morning list. <i>Risk:</i> some reps work overdue items first. Overdue first is offered as a sort; which default works better is untested.</li>
        <li><b>Assumption:</b> the sample history makes the screens feel real. <i>Risk:</i> the 12 seeded activities are invented, Oct 28–Nov 4, and will go stale. They are useful for testing, not real rep history.</li>
        <li><b>Risk:</b> removing attempted-on-close means a rep who makes a call and then closes the dialog without saving leaves no record. The handoff chose this so that only intentional saves count; the cost is under-counting abandoned attempts.</li>
        <li><b>Risk:</b> the <code>src/</code> files share globals and a fixed load order. Moving one script in <code>index.html</code> can break the app. Converting to ES modules is the next structural step.</li>
        <li><b>Risk:</b> anonymous sign-in gives each browser its own rep. It suits a prototype test; real reps need accounts.</li>
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
            <li>Today as a compact queue: summary and progress, Highest ARR and Overdue first sorts, a selected-deal context panel, small labelled Call, Email and Log activity actions.</li>
            <li>Problem statement screen with the full research block: signal, hypothesis, feedback and attribution, the instruction "Work this follow-up as you normally would.", four metrics and three quotes.</li>
            <li>Call, Email and Log activity dialogs that save only on explicit submission, with required fields, drafts kept on cancel, one activity per save, and Undo.</li>
            <li>Working sidebar: Today, Activity history and Problem statement; Admin in its own group.</li>
            <li>Loading, empty and error states for Today and Activity history, with exact wording and Retry; forced-state controls in a Test controls area.</li>
            <li>Accessible dialogs, keyboard operation, screen-reader announcements, and layouts from 320px to 1366px and at 200% zoom.</li>
            <li>Supabase persistence with anonymous auth and row-level security.</li>
            <li>Admin portal: Orbit Code Explorer, with 30 nodes, search, filters, FAQ and tips, and "Show code" per node; Living PRD and Handoff tabs.</li>
          </ul>
        </div>
        <div class="scope-col out">
          <h3><i></i>Out of scope (this build)</h3>
          <ul>
            <li>Real calls or emails. Call and Email are simulated. Nothing is sent.</li>
            <li>Real CRM data or a CRM link. All names, deals, and amounts are sample data.</li>
            <li>Real accounts. Each browser is an anonymous rep; there is no sign-in screen.</li>
            <li>A Deals screen. It is hidden from the sidebar until it is built.</li>
            <li>Attempted-on-close logging. Retired by the design handoff.</li>
            <li>A dark theme or theme picker.</li>
            <li>Version B, the dispatch-board layout. It is a separate Muse artifact, kept apart for later A/B testing. It is not in this build, not in the repo, and not on the live site.</li>
          </ul>
        </div>
      </div>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button><button type="button" class="olink" data-orbit-link="loading">Loading state</button><button type="button" class="olink" data-orbit-link="emptytoday">Empty — Today</button><button type="button" class="olink" data-orbit-link="errortoday">Error — Today</button><button type="button" class="olink" data-orbit-link="emptyhistory">Empty — Activity History</button><button type="button" class="olink" data-orbit-link="errorhistory">Error — Activity History</button></div></div>
    </section>

    <section class="admin-card doc-block" id="prd-08" aria-label="08 Engineering Recommendation">
      <div class="doc-head"><span class="doc-num">08</span><h2>Engineering Recommendation</h2></div>
      <ul>
        <li><b>Front Door:</b> this PRD lives at <code>04-production/PRD.md</code>. The handoff note lives at <code>04-production/handoff-note.md</code>.</li>
        <li><b>Cleanup:</b> done in Lab 2 — the code is split by feature into <code>src/</code>. Next: convert the classic scripts to ES modules so the load order is explicit.</li>
        <li><b>Memory:</b> done — deals and activities live in Supabase with row-level security. Call and Email stay simulated in v1; the backend only stores what was saved or sent in the tool.</li>
        <li><b>Next spike:</b> run the A/B test, Version A against Version B. The test plan is written. If Version B wins, move the backend to the winning layout.</li>
        <li><b>Handoff:</b> see <code>04-production/handoff-note.md</code> for the engineer-ready summary.</li>
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
        <div><b>Repo main baseline:</b> c7514e5 (Handoff: record the live Supabase backend). This note describes the design handoff v1.0 build on top of it.</div>
        <div><b>Last updated:</b> 2026-11-13 (design handoff v1.0 built: focused Today queue, Problem statement, intentional forms)</div>
      </div>
      <p class="doc-note"><b>Living PRD:</b> <code>04-production/PRD.md</code> — read it first. This note is the engineer-ready summary of that PRD. The <button type="button" class="olink doc" data-prdlink="prd-01">Living PRD tab</button> renders it.</p>
    </section>

    <section class="admin-card doc-block" id="ho-summary" aria-label="What this is">
      <div class="doc-head"><span class="doc-num">60s</span><h2>What this is</h2></div>
      <p>CRM Companion is a rep's Today view for a CRM at 18% adoption. A rep opens Today and sees a compact queue of 6 follow-ups, sorted by ARR or overdue-first, with the selected deal's context beside it. Call, Email and Log activity open dialogs; only an explicit save records one activity and moves the deal to Updated today, and Undo reverses it. Opening or cancelling a dialog records nothing. Activity history and Problem statement (the research block, moved off Today) are sidebar destinations; Deal Detail opens from a deal. Loading, empty and error states keep their exact wording. Everything is sample data. Each browser signs in anonymously as its own rep, and its deals and activities are saved in Supabase, so work survives a reload. No real call is placed and no real email is sent.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="updated">Updated today</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-frontend" aria-label="Frontend">
      <div class="doc-head"><span class="doc-num">FE</span><h2>Frontend</h2></div>
      <ul>
        <li>Plain HTML, CSS and JavaScript, with no build step. <code>index.html</code> is a short shell; the code lives in <code>src/</code>, grouped by feature (Lab 2 refactor). It is not a Vite / React project.
          <ul>
            <li><code>src/pages/</code> — one folder per screen: <code>today/</code>, <code>problem-statement/</code>, <code>deal-detail/</code>, <code>activity-history/</code>, <code>admin/</code>. Each has a <code>*-view.js</code> file (the screen's markup) and its logic and styles.</li>
            <li><code>src/shared/data/</code> — <code>sample-deals.js</code>, <code>sample-activities.js</code>, and <code>supabase-source.js</code> (loads and saves through Supabase when configured).</li>
            <li><code>src/shared/model/</code> — <code>deals-model.js</code> (look-ups and counts), <code>queue-sort.js</code> (Highest ARR and Overdue first), and <code>activity-log.js</code> (save one update, Undo it).</li>
            <li><code>src/shared/components/</code> — the Call, Email and Log activity dialogs (markup and logic), <code>dialog.js</code> (focus, Escape, Cancel, drafts), <code>announcer.js</code> (screen-reader announcements), list states (loading / empty / error), toast, icons.</li>
            <li><code>src/app/</code> — navigation (with addressable views and browser Back), session state, render, sidebar, start-up (<code>boot.js</code>), and the shared and responsive styles.</li>
            <li>Scripts are classic <code>&lt;script&gt;</code> tags loaded in a fixed order from <code>index.html</code>; they share globals, so the load order matters.</li>
          </ul>
        </li>
        <li>Sidebar: Workspace — Today, Activity history, Problem statement; Admin — Admin — Code Explorer. Deals is hidden until a Deals screen exists. Each view has its own address (<code>#today</code>, <code>#history</code>, <code>#problem</code>, <code>#admin</code>, <code>#deal-…</code>).</li>
        <li>Today: summary line and progress, the follow-up queue with Highest ARR (default) and Overdue first sorting, a selected-deal context panel with Open deal, and Updated today with Undo.</li>
        <li>Dialogs: Call starts its timer only after Start simulated call and needs an outcome (Connected, No answer, Left voicemail); Email needs a subject and a message; Log activity needs a real note. One save creates one activity; the save button is disabled on first submit. Cancel, Escape, the close button or a backdrop click records nothing and keeps the draft. Focus stays inside the dialog and returns afterwards; saves, Undo and errors are announced.</li>
        <li>Design system: the handoff tokens in <code>src/app/base.css</code> — navy sidebar #131F32 (selected #283A59), canvas #F5F6F8, surface #FFFFFF, primary #315CE8, selected row #EEF3FF, text #172338 / #637086, divider #E4E8EF, overdue #A52E31 and updated #23705A paired with words; spacing 4–32px; radius 10px panels, 6px controls; system sans. No dark theme.</li>
        <li>Test controls: Data / Loading / Empty / Error switches sit in a collapsed Test controls area at the bottom of Today and Activity history. The real recovery UI (skeletons, empty, error with Retry) stays in the lists.</li>
        <li>Admin portal: Orbit Code Explorer with 30 nodes — CRM Companion in the centre; Today, Problem statement, Deal Detail and Activity history on the inner orbit; panels, data, states and the design system outside. Each node has a plain-language explanation, its connections, whether it is real or mocked, and a "Show code" excerpt cut from its <code>src/</code> file. Two more tabs render the Living PRD and this handoff note, with cross-links.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button><button type="button" class="olink" data-orbit-link="design">Design system</button><button type="button" class="olink" data-orbit-link="log">Log activity</button><button type="button" class="olink" data-orbit-link="problem">Problem statement</button><button type="button" class="olink" data-orbit-link="context">Deal context panel</button><button type="button" class="olink" data-orbit-link="sort">Sort</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-backend" aria-label="Backend and data">
      <div class="doc-head"><span class="doc-num">BE</span><h2>Backend / data</h2></div>
      <p class="doc-note"><b>Live since 2026-11-13.</b> The live site reads and saves through Supabase. Verified on the live site the same day: tables, row-level security, anonymous auth, and a saved activity that persisted after a reload. The data is still sample data.</p>
      <ul>
        <li>Supabase project: <code>toctukiccnirfkkoaqog</code> (region us-west-2), Postgres with Supabase Auth. Storage is not used.</li>
        <li>Schema: <code>supabase/migrations/20261113000000_crm_companion.sql</code>, applied to the project. It creates:
          <ul>
            <li><code>deals</code> — id, contact, company, arr, due, next_step, owner_id.</li>
            <li><code>activities</code> — id, deal_id, type (call / email / log), title, detail, date, time, attempted (plus created_at for ordering).</li>
            <li><code>follow_ups</code> — id, deal_id, status (open / updated_today), updated_at.</li>
            <li>Row-level security is on for all three tables, with one policy each: a rep reads and writes only their own deals, and only the activities and follow-ups for those deals. The anon role has no table access.</li>
            <li><code>seed_my_sample_data()</code> — gives a signed-in rep their own copy of the 6 sample deals ($663k) and the 12 seeded activities (Oct 28–Nov 4), once.</li>
          </ul>
        </li>
        <li>Auth: Supabase Auth with anonymous sign-in, switched on in the project. There is no sign-in screen (adding one would change the rep flow), so each browser becomes its own rep with a private copy of the sample data. The session is kept in the browser, so a reload returns to the same rep.</li>
        <li>App side: <code>src/shared/data/supabase-source.js</code> signs in, seeds, loads deals and activities, and saves every saved call, sent email, logged note and Undo. Nothing is written when a dialog is cancelled. If the load fails, Today shows the error state with Retry.</li>
        <li>Keys: the browser gets the project URL and the public anon key from <code>/api/supabase-config</code>, a Vercel function that reads the <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> environment variables in the Vercel project. Neither is in the repo, and no key was shared in chat. The anon key is meant to be public; row-level security is what protects the data. Never put the service_role key in the app or in Vercel. If the variables are removed, the app falls back to its in-page sample data.</li>
        <li>Live verification, 2026-11-13 (before the design handoff build): a fresh browser signed in anonymously, received its own 6 deals, saved a call on James Whitfield with a unique note, and reloaded. After the reload James was in Updated today, progress read 1 of 6, and the database held that call under that rep with the follow-up marked <code>updated_today</code>.</li>
        <li>The <code>activities.attempted</code> column stays for older rows. Since the design handoff build, the app never writes attempted rows; any from earlier sessions still show in Activity history.</li>
        <li>The Call and Email panels stay simulated in v1. No real call is made and no real email is sent; the backend only stores what was saved or sent in the tool.</li>
        <li>Version B, the dispatch-board layout, is a separate Muse artifact, not in this codebase. Do not merge it into this build without a product decision.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="dealsdata">Deals data — 6 deals</button><button type="button" class="olink" data-orbit-link="actdata">Activities data — 12 activities</button><button type="button" class="olink" data-orbit-link="session">Session state — in memory only</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-flows" aria-label="Key flows">
      <div class="doc-head"><span class="doc-num">1–6</span><h2>Key flows</h2></div>
      <p>Walk these first, in this order:</p>
      <ol>
        <li>Today → select Priya Nair in the queue → the context panel changes; nothing is saved → Open deal → Deal Detail → Back to Today.</li>
        <li>Today → Sort: Overdue first → Maya and Sofia lead → Sort: Highest ARR → James first again.</li>
        <li>Today → Call on James Whitfield → "Ready when you are" → Start simulated call → choose Connected → Save call &amp; update follow-up → James moves to Updated today, progress 1 of 6. Undo → James is back at the top, progress 0 of 6.</li>
        <li>Today → Email on Daniel Ortiz → clear the subject → Send → field error; nothing saved. Add a subject → Send → Updated today.</li>
        <li>Today → Log activity on Priya → Cancel → nothing saved; reopen → the typed note is still there. Save a real note → Updated today.</li>
        <li>Sidebar → Problem statement → every research block is there → Today → the sort, selection and progress are unchanged.</li>
        <li>Sidebar → Activity history → search "James Whitfield" → select a row → Deal Detail.</li>
        <li>Today and Activity history → open Test controls → force Loading, Empty and Error → check the wording and Retry.</li>
      </ol>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="feed">Activity feed</button><button type="button" class="olink" data-orbit-link="search">Search by name / company</button><button type="button" class="olink" data-orbit-link="rowopen">Row opens Deal Detail</button><button type="button" class="olink" data-orbit-link="loading">Loading state</button><button type="button" class="olink" data-orbit-link="errortoday">Error state — Today</button><button type="button" class="olink" data-orbit-link="sort">Sort</button><button type="button" class="olink" data-orbit-link="context">Deal context panel</button><button type="button" class="olink" data-orbit-link="problem">Problem statement</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-solid" aria-label="What is solid vs what is duct tape">
      <div class="doc-head"><span class="doc-num">S/D</span><h2>What’s solid vs. what’s duct tape</h2></div>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>Area</th><th>Solid / Rough</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>Today list, ARR order, 6 deals</td><td><span class="stag solid">Solid</span></td><td>Verified live 2026-11-10, in the exact order and amounts in the PRD</td></tr>
          <tr><td>Call / Email / Log dialogs</td><td><span class="stag solid">Solid</span></td><td>Explicit save only, required fields, one activity per save, drafts kept on cancel, double-click safe; checked by <code>tests/acceptance-checklist.js</code> (handoff section 7)</td></tr>
          <tr><td>Deal Detail and Activity History navigation</td><td><span class="stag solid">Solid</span></td><td>Verified live, including pre-filtered Activity History from Deal Detail and search by name and company</td></tr>
          <tr><td>Loading / empty / error states</td><td><span class="stag solid">Solid</span></td><td>Exact wording verified live on both screens, Retry restores the list</td></tr>
          <tr><td>Problem statement and navigation</td><td><span class="stag solid">Solid</span></td><td>The research block moved off Today intact; Today, Activity history, Problem statement and Admin are working sidebar destinations; Back works. The old kill-switch test line is on no screen</td></tr>
          <tr><td>Accessibility and responsive</td><td><span class="stag solid">Solid</span></td><td>Focus kept in dialogs and returned, Escape cancels, live announcements, contrast at least 4.5:1 for text; checked at 320, 390, 768, 1024, 1366px and 200% zoom with 44px touch targets. Not checked with a real screen reader or on real devices</td></tr>
          <tr><td>Code structure</td><td><span class="stag solid">Solid</span></td><td>Split by feature into <code>src/</code> in Lab 2; pixel-identical to the single-file version on every screen at desktop and phone widths. Still classic scripts with shared globals and a fixed load order, no modules or build step</td></tr>
          <tr><td>No README inside the project</td><td><span class="stag rough">Rough</span></td><td>The build summary is on the computer only; PROMPTS.md is the only in-repo record of how the build was made</td></tr>
          <tr><td>Sample data</td><td><span class="stag rough">Rough</span></td><td>All 6 deals and 12 activities are invented; the history dates are Oct 28–Nov 4 and will go stale</td></tr>
          <tr><td>Backend, auth, persistence</td><td><span class="stag rough">Rough</span></td><td>Live in Supabase with row-level security, verified 2026-11-13. Rough because auth is anonymous (one rep per browser, no real accounts) and there are no backups, migrations tooling or monitoring set up beyond Supabase defaults</td></tr>
          <tr><td>Tests</td><td><span class="stag rough">Rough</span></td><td><code>tests/logic-checks.js</code> (data, model, sort), <code>tests/browser-rep-flow.js</code> (rep flow, Admin, phone), <code>tests/acceptance-checklist.js</code> (design handoff section 7), <code>tests/supabase-mode-mock.js</code> (Supabase path against a stand-in). Run by hand; no CI yet</td></tr>
        </tbody>
      </table></div>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="followups">Follow-ups list</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="log">Log activity</button><button type="button" class="olink" data-orbit-link="dealsdata">Deals data</button><button type="button" class="olink" data-orbit-link="actdata">Activities data</button><button type="button" class="olink" data-orbit-link="session">Session state</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-risks" aria-label="Risks and assumptions for the team">
      <div class="doc-head"><span class="doc-num">!</span><h2>Risks &amp; assumptions for the team</h2></div>
      <ul>
        <li>Do not trust the sample history as real rep behaviour. It was seeded to make the screens look real.</li>
        <li>Do not expect attempted entries. The attempted-on-close rule (Module 3 Refine) is retired by the design handoff: only an explicit save records an activity. A call made and then abandoned without saving leaves no record.</li>
        <li>Do not look for Deals. It is hidden from the sidebar until a Deals screen is built; building one is a product decision.</li>
        <li>Do not assume the load order is optional. The <code>src/</code> files are classic scripts that share globals; <code>index.html</code> loads them in a fixed order, and moving one can break the app. Converting to ES modules is the next structural step.</li>
        <li>Do not trust anonymous sign-in for real reps. It gives each browser a private sample copy, which suits a prototype test. Real reps need a sign-in screen, and anonymous users should then be switched off.</li>
        <li>The hypothesis is still unproven. A partner understood it exactly right in Module 2, but no A/B session has run yet. Version B exists for that test, and the test plan is written, but no tester has tried either version against the other.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="actdata">Activities data</button><button type="button" class="olink" data-orbit-link="call">Call panel</button><button type="button" class="olink" data-orbit-link="email">Email panel</button><button type="button" class="olink" data-orbit-link="backlinks">Back to Today links</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-run" aria-label="How to run it">
      <div class="doc-head"><span class="doc-num">▶</span><h2>How to run it</h2></div>
      <ul>
        <li>Open the live URL: https://vibe-coding-course-weld-omega.vercel.app — no sign-in, no setup. It is sample data only. Your browser becomes an anonymous rep, and your changes persist across reloads in that browser. Clearing site data starts a new rep.</li>
        <li>Or open the repo: https://github.com/sabihusman/vibe-coding-course — the live site is the root <code>index.html</code> on main. Vercel deploys main automatically, so a push to main is the go-live decision.</li>
        <li>To run the prompts again, read <code>03-chaining/PROMPTS.md</code> in the repo. The chain is Expand, then Behavior, then Refine. The build README (<code>module3-build-readme.md</code>) is not in the repo, per the Module 3 lab guide.</li>
        <li>To run the checks: <code>node tests/logic-checks.js</code> (no dependencies), and with Playwright installed, <code>node tests/browser-rep-flow.js</code>, <code>node tests/acceptance-checklist.js</code> and <code>node tests/supabase-mode-mock.js</code>.</li>
        <li>To rebuild the backend in a new Supabase project: run <code>supabase/migrations/20261113000000_crm_companion.sql</code> in its SQL editor, switch on anonymous sign-in under Authentication, then set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> in Vercel and redeploy.</li>
        <li>Test reps add up: every browser, including each automated test run, creates an anonymous user with its own sample rows. Delete old anonymous users in Supabase under Authentication; their deals and activities are removed with them.</li>
      </ul>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="session">Session state</button></div></div>
    </section>

    <section class="admin-card doc-block" id="ho-admin" aria-label="Admin portal">
      <div class="doc-head"><span class="doc-num">A</span><h2>Admin portal</h2></div>
      <p>Orbit Code Explorer with 30 nodes: CRM Companion in the centre; Today, Problem statement, Deal Detail and Activity history on the inner orbit; the panels, data, states and design system outside. Clicking a node shows a plain-language explanation, what it connects to, whether it is real or mocked, and a “Show code” excerpt cut from the <code>src/</code> file it lives in. Search with jump-to chips, All / Screens / Panels / Data / States filters, a “How to read this” intro, and FAQ and tips are on the same page. Two more tabs render the Living PRD and this handoff note, with cross-links both ways.</p>
      <p class="doc-note"><b>Code layout:</b> one folder per screen in <code>src/pages</code>; data, model and components in <code>src/shared</code>; navigation and start-up in <code>src/app</code>; checks in <code>tests</code>. Supabase is live; see Backend / data above.</p>
      <div class="doc-links"><div class="connect-label">In the Orbit</div><div class="connects"><button type="button" class="olink" data-orbit-link="app">CRM Companion</button><button type="button" class="olink" data-orbit-link="today">Today</button><button type="button" class="olink" data-orbit-link="detail">Deal Detail</button><button type="button" class="olink" data-orbit-link="history">Activity History</button></div></div>
    </section>
    </div><!-- /adminTabHandoff -->
   </div><!-- /viewAdmin -->
`);
