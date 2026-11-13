/* Orbit Code Explorer content: the 30 nodes and their Show code excerpts.
   Excerpts are cut from the real source files (see where:) and should be refreshed when that code changes. */
/* ---------- Admin · Orbit Code Explorer ---------- */
var NODES = [
  { id:"app", name:"CRM Companion", cat:"app", catLabel:"The whole app", ring:0, verdict:"mixed", verdictLabel:"Real behaviour · mocked data", about:"The whole app: index.html (a short shell) plus the src/ folder, grouped by feature. Screens are in src/pages/, shared data, model and components in src/shared/, and navigation and start-up in src/app/. On the live site the rep's work is saved in Supabase; without the Supabase settings it falls back to in-page sample data.", connects:["today","problem","detail","history","design"] },
  { id:"today", name:"Today", cat:"screen", catLabel:"Screen", ring:1, verdict:"real", verdictLabel:"Real — works in this build", about:"The rep's home screen and the default view. A quiet summary and progress line, then the follow-up queue with its sort control and the selected-deal context panel beside it. Updated today appears after the first saved update. It contains none of the research block — that lives on Problem statement.", connects:["app","followups","sort","context","stepper","updated","detail"] },
  { id:"problem", name:"Problem statement", cat:"screen", catLabel:"Screen", ring:1, verdict:"mocked", verdictLabel:"Supplied research — not live data", about:"A sidebar destination holding the research and product context that used to sit on Today: the 18% signal, Hypothesis B, the swap feedback and its attribution, the instruction, the four research metrics, and the three rep quotes. It is hidden on first load, and opening it never resets the queue, sort, selection or progress. These are supplied research figures, not the rep's own results.", connects:["app","today","design"] },
  { id:"detail", name:"Deal Detail", cat:"screen", catLabel:"Screen", ring:1, verdict:"real", verdictLabel:"Real — works in this build", about:"One deal on its own screen: who it is, its sample ARR, what is due, the next step, and its past activity, with Call, Email and Log activity. It opens from Open deal in the context panel, from Updated today, or from an Activity history row, and it links onward into Activity history filtered to this deal.", connects:["app","header","past","seehist","backlinks","call","email","log"] },
  { id:"history", name:"Activity history", cat:"screen", catLabel:"Screen", ring:1, verdict:"real", verdictLabel:"Real — works in this build", about:"Every call, email and note in one list, newest first — the 12 seeded activities plus the rep's saved updates. It is a working sidebar destination, and it can also open pre-filtered to one deal from Deal Detail or the context panel. Name and company search and row-to-deal access are unchanged.", connects:["app","actlist","search","rowopen","backlinks"] },
  { id:"followups", name:"Follow-up queue", cat:"panel", catLabel:"Panel · Today", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked data", about:"The working list on Today: aligned rows with subtle dividers, each with the contact, company, sample ARR, next step, due label, and small labelled Call, Email and Log activity actions. Selecting a contact only changes the context panel. When a deal is updated it leaves the queue; Undo puts it back in its place under the current sort.", connects:["today","sort","context","call","email","log","dealsdata","loading","emptytoday","errortoday"] },
  { id:"sort", name:"Sort — Highest ARR / Overdue first", cat:"panel", catLabel:"Control · Today", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"The Sort control above the queue. Highest ARR is the default (James, Daniel, Priya, Maya, Sofia, Aisha). Overdue first puts the most days overdue on top, then the larger ARR, so Maya and Sofia lead. Sorting never changes the deals, and the choice is kept when switching views.", connects:["followups","today","dealsdata"] },
  { id:"context", name:"Deal context panel", cat:"panel", catLabel:"Panel · Today", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked data", about:"The panel beside the queue showing the selected deal: company, contact, sample ARR, due label, next step, a primary Call button, a separate Open deal button that reaches the full Deal Detail, and the deal's three most recent activities with a link into Activity history. Selecting a contact updates this panel only; it never changes data.", connects:["today","followups","detail","history","call"] },
  { id:"call", name:"Call dialog", cat:"panel", catLabel:"Panel", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked call", about:"A named dialog for one deal, showing the contact, company and follow-up. It says “Ready when you are” until the rep chooses Start simulated call; only then does the timer run. An outcome — Connected, No answer or Left voicemail — is required to save. Saving creates one activity and moves the deal to Updated today. Opening, cancelling or closing records nothing, and the note and outcome are kept as a draft. No real call is placed.", connects:["followups","context","detail","updated","actdata"] },
  { id:"email", name:"Email dialog", cat:"panel", catLabel:"Panel", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked email", about:"A named dialog with an editable subject and message, pre-filled from the deal's next step. Both are required. Sending creates one activity and moves the deal to Updated today. Closing without sending records nothing and keeps the edited draft for next time. Nothing is actually sent.", connects:["followups","detail","updated","actdata"] },
  { id:"log", name:"Log activity dialog", cat:"panel", catLabel:"Panel", ring:2, verdict:"real", verdictLabel:"Real — works in this build", about:"A short note form. The note is required — whitespace alone cannot be saved — and saving happens only on explicit submission. Saving creates one activity with the note and moves the deal to Updated today. Cancel leaves the queue, progress and history unchanged and keeps the typed note as a draft.", connects:["followups","detail","updated","actdata"] },
  { id:"stepper", name:"Summary and progress line", cat:"panel", catLabel:"Panel · Today", ring:2, verdict:"real", verdictLabel:"Real — works in this build", about:"The quiet line above the queue: “6 follow-ups · 2 overdue · $663k total sample ARR”, and “0 of 6 updated” with a thin bar. Progress counts follow-ups updated today — not deals won or contacts reached — and the six-item total stays stable for the sample day.", connects:["today","followups","updated"] },
  { id:"updated", name:"Updated today", cat:"panel", catLabel:"Panel · Today", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"The section on Today that appears after the first saved update. Each entry shows how the deal was updated, an Open deal button, and Undo. Undo removes that one activity, restores the progress count, and puts the deal back in its place in the queue.", connects:["today","call","email","log","detail"] },
  { id:"feed", name:"Recent activity", cat:"panel", catLabel:"Panel · Today", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"The selected deal's three most recent activities, shown inside the context panel, newest first, with a link into Activity history for the rest. It replaces the old Today-wide Activity feed; every activity is still listed on Activity history.", connects:["context","history","session","actlist"] },
  { id:"header", name:"Deal header", cat:"panel", catLabel:"Panel · Deal Detail", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked data", about:"The top block of Deal Detail: the contact, the company, the sample ARR, the due badge, and the next step, with Call, Email, and Log activity in the same order as Today — Call first. If the deal was already updated today, it says so here.", connects:["detail","dealsdata","call","email","log"] },
  { id:"past", name:"Past activity", cat:"panel", catLabel:"Panel · Deal Detail", ring:3, verdict:"mixed", verdictLabel:"Real behaviour · mocked data", about:"The activity list inside Deal Detail, showing only this deal's history — its seeded past activities plus anything logged for it in this session, newest first. The same activities appear in full on the Activity History screen.", connects:["detail","actdata","history","seehist"] },
  { id:"backlinks", name:"Back to Today links", cat:"panel", catLabel:"Navigation", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"The way back. Deal Detail and Activity history have a “Back to Today” link, and the sidebar is now fully working: Today, Activity history and Problem statement in Workspace, and Admin in its own group. Each view has its own address, so browser Back works too.", connects:["today","detail","history"] },
  { id:"seehist", name:"“See this deal in Activity History”", cat:"panel", catLabel:"Navigation link", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"The link on Deal Detail, above Past activity, that carries the deal into Activity History. It opens Activity History with the search already set to this deal's contact, so only that deal's activities show. This is the link that makes Deal Detail the anchor for Activity History.", connects:["detail","history","search","past"] },
  { id:"actlist", name:"Activity list", cat:"panel", catLabel:"Panel · Activity History", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked data", about:"The list itself on Activity History: 12 seeded activities to start with, plus this session's activity added on top, newest first, with a count line above it. Each row shows the kind of activity, the deal, the detail, and the day and time.", connects:["history","actdata","session","rowopen","loading","emptyhistory","errorhistory"] },
  { id:"search", name:"Search by name / company", cat:"panel", catLabel:"Panel · Activity History", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"The “Find a deal” box at the top of Activity History. Typing a contact name or a company filters the activity list to matching deals and updates the count line — for example, one contact's name shows just their activities. It is also how the Deal Detail link arrives pre-filtered.", connects:["history","actlist","seehist"] },
  { id:"rowopen", name:"Row opens Deal Detail", cat:"panel", catLabel:"Navigation", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"Every row in the Activity History list is a button. Selecting a row opens that row's deal on Deal Detail, so a rep can go from something that happened to the deal it belongs to in one tap — and back again with Back to Today.", connects:["history","detail","actlist"] },
  { id:"dealsdata", name:"Deals data — 6 deals", cat:"data", catLabel:"Data", ring:2, verdict:"mocked", verdictLabel:"Mocked — sample data only", about:"The sample deals written into the file: James Whitfield at Meridian Legal ($312k), Daniel Ortiz ($148k), Priya Nair ($92k), Maya Chen ($54k), Sofia Reyes ($38k), and Aisha Bello ($19k) — 6 deals, $663k in total. Each carries a due label and a next step. None of it comes from a real CRM.", connects:["followups","header","session"] },
  { id:"actdata", name:"Activities data — 12 activities", cat:"data", catLabel:"Data", ring:3, verdict:"mocked", verdictLabel:"Mocked — sample data only", about:"The seeded past history written into the file: 12 activities dated Tue, Oct 28 to Tue, Nov 4, covering all 6 deals with a mix of calls, emails, and logs. Activity History and Deal Detail's Past activity both read from this same set.", connects:["actlist","past","call","email"] },
  { id:"session", name:"Session state — saved per browser", cat:"data", catLabel:"Data", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"Where the rep's work is kept: which deals are updated, the activity entries, Undo, the sort, the selected deal and unsent drafts. The page holds it while you work; on the live site each saved update is also stored in Supabase under this browser's anonymous rep, so a reload brings it back. Without the Supabase settings nothing is saved and a reload starts the sample day again.", connects:["feed","updated","dealsdata","app"] },
  { id:"design", name:"Design system", cat:"panel", catLabel:"Design", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"The shared tokens from the design handoff: navy sidebar #131F32 with #283A59 for the selected item, canvas #F5F6F8 and white surfaces, primary blue #315CE8 with #EEF3FF for the selected row, text #172338 and #637086, dividers #E4E8EF, overdue #A52E31 and updated #23705A always paired with words. Spacing 4/8/12/16/24/32px, 10px panels and 6px controls.", connects:["app","today","detail","history"] },
  { id:"loading", name:"Loading state — skeletons", cat:"state", catLabel:"State", ring:2, verdict:"real", verdictLabel:"Real — works in this build", about:"While a list loads it shows skeletons in the shape of the real rows — three queue rows on Today, activity rows on Activity history — instead of a blank screen. The forced Data / Loading / Empty / Error switches now sit in a collapsed Test controls area, out of the rep's way.", connects:["followups","actlist","emptytoday","errortoday"] },
  { id:"emptytoday", name:"Empty state — Today", cat:"state", catLabel:"State · Today", ring:2, verdict:"real", verdictLabel:"Real — works in this build", about:"What the queue shows when there is nothing left to work, or every follow-up is updated. The exact wording is below. Reviewers can force it from the Test controls area at the bottom of Today.", exact:"All caught up. No follow-ups today.", connects:["followups","loading","errortoday"] },
  { id:"errortoday", name:"Error state — Today", cat:"state", catLabel:"State · Today", ring:2, verdict:"real", verdictLabel:"Real — works in this build", about:"What the queue shows when loading fails, with a Retry button. It is announced to screen readers, keeps existing activity, and never shows a false success. The exact wording is below. Reviewers can force it from the Test controls area.", exact:"Couldn't load your follow-ups. Check your connection and try again.", connects:["followups","loading","emptytoday"] },
  { id:"emptyhistory", name:"Empty state — Activity History", cat:"state", catLabel:"State · Activity History", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"What the activity list shows when there is no activity. The exact wording is below. Reviewers can force it from the Test controls area on Activity history; a search that matches nothing shows a separate message.", exact:"No activity yet. Call or email a follow-up to see it here.", connects:["actlist","loading","errorhistory","search"] },
  { id:"errorhistory", name:"Error state — Activity History", cat:"state", catLabel:"State · Activity History", ring:3, verdict:"real", verdictLabel:"Real — works in this build", about:"What the activity list shows when loading fails, with a Retry button — the same pattern as Today. The exact wording is below. Reviewers can force it from the Test controls area on Activity history.", exact:"Couldn't load your activity. Check your connection and try again.", connects:["actlist","loading","emptyhistory"] }
];
/* Short, real code excerpts — one per node, for the "Show code" toggle. */
var SNIPPETS = {
  app: { fn:"showView(v, opts)", does:"The router: shows one view, marks the matching sidebar item as the current page, sets the page title, and records the view's address so Back works.",
    where:"src/app/navigation.js — showView().",
    code:`function showView(v, opts){
  opts = opts || {};
  if(!VIEW_IDS[v]) v = "today";
  currentView = v;
  Object.keys(VIEW_IDS).forEach(function(k){ byId(VIEW_IDS[k]).hidden = k !== v; });
  ["navTodayLink","navHistoryLink","navProblemLink","navAdminLink"].forEach(function(nid){
    var a = byId(nid); var on = nid === NAV_FOR_VIEW[v];
    a.classList.toggle("active", on);
    if(on){ a.setAttribute("aria-current", "page"); } else { a.removeAttribute("aria-current"); }
  });
  var title = v === "detail" && dealById(detailId) ? dealById(detailId).contact : VIEW_TITLES[v];
  document.title = title + " · CRM Companion";
  var hash = v === "detail" ? "#deal-" + detailId : "#" + v;
  if(!opts.fromHistory && location.hash !== hash){
    try { history.pushState(null, "", hash); } catch(e){ /* file:// in some browsers */ }
  …` },
  today: { fn:"render()", does:"Redraws Today and the other lists after any change — progress, queue, Updated today, and history.",
    where:"src/app/render.js — render(). The screen markup is src/pages/today/today-view.js; its logic is src/pages/today/today.js.",
    code:`function render(){
  renderProgress(); renderTodo(); renderUpdated(); renderHistory();
  if(detailId) renderDetailActivity();
  byId("navCount").textContent = String(DEALS.length - doneCount());
}` },
  problem: { fn:"showView(\"problem\")", does:"Problem statement is just another view: navigating to it hides Today without touching the queue, sort, selection or progress, which live in session state.",
    where:"src/pages/problem-statement/problem-statement-view.js holds the content; src/pages/problem-statement/problem-statement.css styles it; navigation is in src/app/navigation.js.",
    code:`document.querySelectorAll("[data-nav]").forEach(function(a){
  a.addEventListener("click", function(e){
    e.preventDefault();
    var v = a.getAttribute("data-nav");
    if(v === "history"){ openHistory(null, { focusHeading: true }); }
    else { showView(v, { focusHeading: true }); }
  });
});` },
  detail: { fn:"openDeal(id)", does:"Opens one deal: remembers it, fills Deal Detail, and switches to it.",
    where:"src/app/navigation.js — openDeal().",
    code:`function openDeal(id, opts){
  if(!dealById(id)) return;
  detailId = id;
  renderDetail();
  showView("detail", opts);
}` },
  history: { fn:"openHistory(preset)", does:"Opens Activity history, optionally pre-filtered to a deal, and plays the loading state.",
    where:"src/app/navigation.js — openHistory().",
    code:`function openHistory(preset, opts){
  if(typeof preset==="string") byId("historySearch").value = preset;
  showView("history", opts);
  setHistoryState("loading");
}` },
  followups: { fn:"renderTodo()", does:"Builds the queue rows from the pending deals in the current sort order. Each row has a select button and the three labelled actions.",
    where:"src/pages/today/today.js — renderTodo().",
    code:`function renderTodo(){
  var wrap = byId("todoList");
  if(!wrap) return;
  var pending = pendingDeals();
  byId("queueCount").textContent = String(followupsState === "ready" ? pending.length : 0);
  byId("sortNote").textContent = SORT_NOTES[sortMode];
  if(followupsState==="loading"){ wrap.innerHTML = followupsSkeletonHtml(); renderContext(); return; }
  if(followupsState==="error"){
    wrap.innerHTML = '<div class="state-error" role="alert"><p>Couldn\\'t load your follow-ups. Check your connection and try again.</p><button type="button" class="btn-retry" id="followupsRetry">Retry</button></div>';
    byId("followupsRetry").addEventListener("click", function(){ setFollowupsState("loading"); });
    renderContext(); return;
  }
  if(followupsState==="empty" || pending.length===0){
    wrap.innerHTML = '<div class="empty"><span class="empty-plain">All caught up. No follow-ups today.</span></div>';
    renderContext(); return;
  }
  ensureSelection();
  …` },
  sort: { fn:"sortDeals(list, mode)", does:"Highest ARR sorts by ARR; Overdue first sorts by days overdue, then ARR. It sorts a copy and never changes the deals.",
    where:"src/shared/model/queue-sort.js — sortDeals() and daysOverdue(). The control is the Sort select in src/pages/today/today-view.js.",
    code:`function sortDeals(list, mode){
  var copy = list.slice();
  if(mode === "overdue"){
    copy.sort(function(a, b){ return (daysOverdue(b) - daysOverdue(a)) || (b.arr - a.arr); });
  } else {
    copy.sort(function(a, b){ return b.arr - a.arr; });
  }
  return copy;
}` },
  context: { fn:"selectDeal(id) and renderContext()", does:"Selecting a contact only changes selectedId and redraws; renderContext() then fills the panel for that deal.",
    where:"src/pages/today/today.js — selectDeal() and renderContext().",
    code:`function selectDeal(id){
  if(!dealById(id) || done[id]) return;
  selectedId = id;
  renderTodo();
  var b = document.querySelector('#todoList [data-select="' + id + '"]');
  if(b) b.focus();
}` },
  call: { fn:"the Call form's submit handler", does:"An outcome is required. The save button is disabled on first submit, so a double-click cannot save twice, then completeDeal() records one activity.",
    where:"src/shared/components/call-panel.js. Markup: src/shared/components/call-panel-view.js. Focus, Escape and Cancel: src/shared/components/dialog.js.",
    code:`byId("callForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(!currentId || callSaving) return;
  var outcome = byId("callOutcome").value;
  if(!outcome){
    setFieldError("callOutcome", "callOutcomeErr", "Choose an outcome before saving: Connected, No answer or Left voicemail.");
    byId("callOutcome").focus(); return;
  }
  setFieldError("callOutcome", "callOutcomeErr", "");
  callSaving = true; byId("saveCall").disabled = true;
  var id = currentId, d = dealById(id);
  var note = byId("callNote").value.trim(), dur = fmtTimer();
  stopTimer(); currentId = null;
  closeDialog("callOverlay", true);
  completeDeal(id, "call", "Call · " + outcome + " · " + dur,
    "Call — " + d.contact + ", " + d.company + " · " + outcome,
    (note ? "“" + note + "” · " : "") + "Duration " + dur);
  …` },
  email: { fn:"the Email form's submit handler", does:"Subject and message are both required; sending records one activity. Closing without sending keeps the draft instead.",
    where:"src/shared/components/email-panel.js. Markup: src/shared/components/email-panel-view.js.",
    code:`byId("emailForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(!currentId || emailSaving) return;
  var subj = byId("emailSubject").value.trim(), body = byId("emailBody").value.trim();
  setFieldError("emailSubject", "emailSubjectErr", subj ? "" : "Add a subject before sending.");
  setFieldError("emailBody", "emailBodyErr", body ? "" : "Write a message before sending.");
  if(!subj){ byId("emailSubject").focus(); return; }
  if(!body){ byId("emailBody").focus(); return; }
  emailSaving = true; byId("sendEmail").disabled = true;
  var id = currentId, d = dealById(id);
  currentId = null;
  closeDialog("emailOverlay", true);
  completeDeal(id, "email", "Email sent", "Email — " + d.contact + ", " + d.company, "Subject: " + subj);
  focusNextTask();
});` },
  log: { fn:"the Log activity form's submit handler", does:"Whitespace-only or near-empty notes are refused with a field error; a real note is saved once.",
    where:"src/shared/components/log-activity.js. Markup: src/shared/components/log-panel-view.js.",
    code:`byId("logForm").addEventListener("submit", function(e){
  e.preventDefault();
  if(!currentId || logSaving) return;
  var note = byId("logNote").value.trim();
  if(note.replace(/[^\\p{L}\\p{N}]/gu, "").length < 2){
    setFieldError("logNote", "logNoteErr", "Add a short note about what happened — at least a few words.");
    byId("logNote").focus(); return;
  }
  setFieldError("logNote", "logNoteErr", "");
  logSaving = true; byId("saveLog").disabled = true;
  var id = currentId, d = dealById(id);
  currentId = null;
  closeDialog("logOverlay", true);
  completeDeal(id, "log", "Logged activity", "Logged activity — " + d.contact + ", " + d.company, note);
  focusNextTask();
});` },
  stepper: { fn:"renderProgress()", does:"Writes the summary line and “n of 6 updated”, and sets the progress bar's value for screen readers.",
    where:"src/pages/today/today.js — renderProgress().",
    code:`function renderProgress(){
  var n = doneCount(), total = DEALS.length;
  byId("summaryCount").textContent = total + (total === 1 ? " follow-up" : " follow-ups");
  byId("summaryOverdue").textContent = overdueCount() + " overdue";
  byId("summaryArr").textContent = "$" + totalArr() + "k total sample ARR";
  byId("progressLabel").textContent = n + " of " + total + " updated";
  var bar = byId("progressBar");
  bar.setAttribute("aria-valuemax", String(total));
  bar.setAttribute("aria-valuenow", String(n));
  byId("progressFill").style.width = (total ? Math.round(100 * n / total) : 0) + "%";
}` },
  updated: { fn:"undoDeal(id)", does:"Undo removes that one activity, restores the deal and the counts, announces the change, and focuses the restored row.",
    where:"src/shared/model/activity-log.js — undoDeal(). The list is drawn by renderUpdated() in src/pages/today/today.js.",
    code:`function undoDeal(id){
  if(!done[id]) return false;
  delete done[id];
  for(var i=0;i<feed.length;i++){ if(feed[i].dealId===id && !feed[i].attempt){ feed.splice(i,1); break; } }
  undoStack = undoStack.filter(function(h){ return h!==id; });
  hideToast();
  selectedId = id;
  render();
  if(currentView==="detail" && detailId===id) renderDetail();
  var d = dealById(id);
  announce("Undone. " + d.contact + " is back in your queue. " + doneCount() + " of " + DEALS.length + " updated.");
  var row = document.querySelector('#todoList [data-select="' + id + '"]');
  if(row && currentView==="today") row.focus();
  return true;
}` },
  feed: { fn:"renderContext() — recent activity", does:"Takes all activity, keeps this deal's, and shows the newest three.",
    where:"src/pages/today/today.js — inside renderContext().",
    code:`function renderContext(){
  var box = byId("dealContext"); if(!box) return;
  var d = followupsState === "ready" ? dealById(selectedId) : null;
  if(!d || done[d.id]){
    box.innerHTML = '<p class="ctx-eyebrow">Deal context</p><p class="ctx-empty">' +
      (followupsState === "ready" && pendingDeals().length === 0 ? "All follow-ups are updated. Undo any of them from Updated today." : "Select a follow-up to see its context.") + '</p>';
    return;
  }
  var recent = allActivity().filter(function(f){ return f.dealId === d.id; }).slice(0, 3);
  box.innerHTML = '<p class="ctx-eyebrow">Deal context <span class="chip">Selected</span></p>'
    + '<h3 class="ctx-company">' + esc(d.company) + '</h3><p class="ctx-contact">' + esc(d.contact) + '</p>'
  …` },
  header: { fn:"renderDetail()", does:"Fills the Deal Detail header from the selected deal — name, company, ARR, due badge — and flags it if the deal was already updated today.",
    where:"src/pages/deal-detail/deal-detail.js — renderDetail(). It fills the header built by src/pages/deal-detail/deal-detail-view.js.",
    code:`function renderDetail(){
  var d = dealById(detailId);
  if(!d) return;
  byId("detailName").textContent = d.contact;
  byId("detailCompany").textContent =
    d.company + " · " + d.due;
  byId("detailArr").textContent = d.arrLabel;
  due.className = "badge "
    + (d.overdue ? "over" : "due");
  …
}` },
  past: { fn:"renderDetailActivity()", does:"Takes the full activity list and keeps only the rows for this deal, newest first.",
    where:"src/pages/deal-detail/deal-detail.js — renderDetailActivity(). It fills the <div id='detailActivity'> panel.",
    code:`function renderDetailActivity(){
  var items = allActivity().filter(
    function(f){
      return f.dealId===detailId; });
  if(items.length===0){ wrap.innerHTML =
    '<p class="none">No activity yet '
    + 'for this deal.</p>'; return; }
  wrap.innerHTML = items.map(function(f){
    return activityRowHtml(f, false);
  }).join("");
}` },
  backlinks: { fn:"routeFromHash()", does:"Reads the address (#today, #history, #problem, #admin or #deal-…) on start and on Back/Forward, so every view is addressable.",
    where:"src/app/navigation.js — routeFromHash().",
    code:`function routeFromHash(opts){
  var h = (location.hash || "#today").slice(1);
  if(h.indexOf("deal-") === 0 && dealById(h.slice(5))){ openDeal(h.slice(5), opts); return; }
  if(h === "history"){ openHistory(null, opts); return; }
  showView(VIEW_IDS[h] ? h : "today", opts);
}` },
  seehist: { fn:"detailHistoryLink click handler", does:"Passes the deal's contact name into Activity History as its search, so the history opens already filtered to this deal.",
    where:"src/pages/deal-detail/deal-detail.js — right after the Back button wiring.",
    code:`byId("detailHistoryLink").addEventListener(
  "click", function(){
    var d = dealById(detailId);
    openHistory(d ? d.contact : "");
    /* Deal Detail anchors into Activity
       History, filtered to this deal */
});` },
  actlist: { fn:"renderHistory()", does:"Builds the Activity History rows from the full activity list and makes each row a button that opens its deal.",
    where:"src/pages/activity-history/activity-history.js — renderHistory(). It fills the <div id='historyList'> panel.",
    code:`wrap.innerHTML = items.map(function(f){
  return activityRowHtml(f, true);
}).join("");
wrap.querySelectorAll("[data-deal]")
  .forEach(function(b){
    b.addEventListener("click", function(){
      openDeal(b.getAttribute("data-deal"));
    });
  });` },
  search: { fn:"The filter at the top of renderHistory()", does:"Reads the search box, lower-cases it, and keeps only activities whose deal's contact or company contains it. The box re-runs this on every keystroke.",
    where:"src/pages/activity-history/activity-history.js — the top of renderHistory(). The box is the <input id='historySearch'> in src/pages/activity-history/activity-history-view.js.",
    code:`var q = byId("historySearch").value
  .trim().toLowerCase();
var items = allActivity().filter(
  function(f){
    if(!q) return true;
    var d = dealById(f.dealId);
    return d && (d.contact.toLowerCase()
        .indexOf(q)>=0
      || d.company.toLowerCase()
        .indexOf(q)>=0);
  });
byId("historySearch").addEventListener(
  "input", renderHistory);` },
  rowopen: { fn:"activityRowHtml(f, clickable)", does:"When clickable is true, the row is built as a <button> carrying the deal's id — and renderHistory wires that button to openDeal().",
    where:"src/pages/deal-detail/deal-detail.js — activityRowHtml(), shared by both activity lists.",
    code:`function activityRowHtml(f, clickable){
  …
  if(clickable) return
    '<button type="button" '
    + 'class="hist-row" data-deal="'
    + f.dealId + '" '
    + 'aria-label="Open deal: …">'
    + inner + '</button>';
  return '<div class="feed-item">'
    + inner + '</div>';
}` },
  dealsdata: { fn:"var DEALS = [ … ]", does:"The 6 sample deals as plain data — each with an id, contact, company, ARR, due label, and next step. Every list and header in the app reads from this one array.",
    where:"src/shared/data/sample-deals.js — the whole file is this one array.",
    code:`var DEALS = [
  { id:"james", contact:"James Whitfield",
    company:"Meridian Legal", arr:312,
    arrLabel:"$312k", due:"Due today",
    overdue:false,
    next:"Confirm renewal terms before legal review" },
  { id:"daniel", contact:"Daniel Ortiz",
    … arrLabel:"$148k" … },
  … Priya $92k · Maya $54k · Sofia $38k …
  { id:"aisha", contact:"Aisha Bello",
    company:"GreenLeaf Grocers", arr:19,
    arrLabel:"$19k", … }
];   // 6 deals · $663k in total` },
  actdata: { fn:"var PAST = [ … ]", does:"The 12 seeded past activities as plain data. allActivity() is the one place session activity and this seed data are joined, newest first.",
    where:"src/shared/data/sample-activities.js — the whole file is this one array. allActivity() is in src/shared/model/deals-model.js.",
    code:`var PAST = [
  { dealId:"james", via:"email",
    title:"Email — James Whitfield, Meridian Legal",
    detail:"Subject: Renewal terms — draft for legal review",
    date:"Tue, Nov 4", time:"9:41 AM" },
  { dealId:"james", via:"call",
    title:"Call — James Whitfield, Meridian Legal · Called",
    detail:"Walked through renewal timeline · Duration 09:37",
    date:"Mon, Nov 3", time:"2:15 PM" },
  … 10 more · Tue, Oct 28 – Tue, Nov 4 …
];
function allActivity(){
  return feed.concat(PAST); }` },
  session: { fn:"session state", does:"The session's state in one place, now including the sort, the selected deal and unsent drafts. With Supabase, supabase-source.js loads and saves it.",
    where:"src/app/session-state.js.",
    code:`var done = {};       // id -> {via, summary}` },
  design: { fn:":root { … } — the design tokens", does:"Every colour, spacing step and radius comes from these variables; components never use raw colours for state.",
    where:"src/app/base.css — the first rule, loaded before every other stylesheet.",
    code:`  :root{
    /* Handoff tokens */
    --nav:#131F32; --nav-selected:#283A59;
    --canvas:#F5F6F8; --surface:#FFFFFF;
    --primary:#315CE8; --primary-hover:#2449C4; --selected-surface:#EEF3FF;
    --text:#172338; --text-2:#637086; --divider:#E4E8EF;
    --overdue:#A52E31; --overdue-bg:#FBEDED; --updated:#23705A; --updated-bg:#E6F2ED;
    --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px;
    --radius:10px; --radius-sm:6px;
    --font:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    /* Names used across the existing screens, mapped to the tokens above */
  …` },
  loading: { fn:"followupsSkeletonHtml() + setFollowupsState(\"loading\")", does:"The skeleton builder makes three grey placeholder cards in the shape of a follow-up card; the state setter shows them, then swaps to the real list after 750 ms.",
    where:"src/shared/components/list-states.js — the skeleton builders and state setters. The .sk skeleton styles are in src/pages/today/today.css.",
    code:`function followupsSkeletonHtml(){
  var card =
    '<div class="skeleton-card" …>'
    + '<div class="sk sk-line w55"></div>'
    + ' … </div>';
  return '<div role="status" '
    + 'aria-label="Loading follow-ups">'
    + card + card + card + '</div>';
}
if(state==="loading"){
  renderTodo();
  followupsTimer = setTimeout(function(){
    followupsState="ready"; renderTodo();
  }, 750);
}` },
  emptytoday: { fn:"renderTodo() — the empty branch", does:"Shown when the list is empty or every deal is updated.",
    where:"src/pages/today/today.js — inside renderTodo().",
    code:`  if(followupsState==="empty" || pending.length===0){
    wrap.innerHTML = '<div class="empty"><span class="empty-plain">All caught up. No follow-ups today.</span></div>';
    renderContext(); return;
  }` },
  errortoday: { fn:"renderTodo() — the error branch", does:"Renders the exact failure text with role=alert and a Retry that reloads.",
    where:"src/pages/today/today.js — inside renderTodo(), above the empty branch.",
    code:`  if(followupsState==="error"){
    wrap.innerHTML = '<div class="state-error" role="alert"><p>Couldn\\'t load your follow-ups. Check your connection and try again.</p><button type="button" class="btn-retry" id="followupsRetry">Retry</button></div>';
    byId("followupsRetry").addEventListener("click", function(){ setFollowupsState("loading"); });
    renderContext(); return;
  }` },
  emptyhistory: { fn:"renderHistory() — the empty branch", does:"When the history state is empty, the count line is set to zero and the list is replaced with the exact empty string from the build.",
    where:"src/pages/activity-history/activity-history.js — inside renderHistory().",
    code:`if(historyState==="empty"){
  byId("historyCount").textContent =
    "0 activities · newest first";
  wrap.innerHTML = '<div class="empty" style="border:0"><span class="empty-plain">No activity yet. Call or email a follow-up to see it here.</span></div>';
  return;
}` },
  errorhistory: { fn:"renderHistory() — the error branch", does:"When the history state is error, it renders the exact failure string and a Retry button whose click sends the list back through the loading state — the same pattern as Today.",
    where:"src/pages/activity-history/activity-history.js — inside renderHistory(), near the top of the function.",
    code:`if(historyState==="error"){
  byId("historyCount").textContent = "";
  wrap.innerHTML = '<div class="state-error" role="alert" …><p>Couldn't load your activity. Check your connection and try again.</p><button type="button" class="btn-retry" id="historyRetry">Retry</button></div>';
  byId("historyRetry").addEventListener(
    "click", function(){
      setHistoryState("loading"); });
  return;
}` }
};
