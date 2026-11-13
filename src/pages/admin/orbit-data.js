/* Orbit Code Explorer content: the 27 nodes and their Show code excerpts. */
/* ---------- Admin · Orbit Code Explorer ---------- */
var NODES = [
  { id:"app", name:"CRM Companion", cat:"app", catLabel:"The whole app", ring:0, verdict:"mixed", verdictLabel:"Real behaviour · mocked data",
    about:"The whole app in one place. CRM Companion is index.html plus the src/ folder, grouped by feature — still with no server and no database behind it. Every screen, panel, and piece of sample data on this orbit has its own file; each node's Show code says which.",
    connects:["today","detail","history","design"] },
  { id:"today", name:"Today", cat:"screen", catLabel:"Screen", ring:1, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The rep's home screen and the start of every path through the app. It shows the day's follow-ups, the progress stepper, Updated today, and the Activity feed. Nothing else in the app opens first — Deal Detail and Activity History are both reached from here.",
    connects:["app","followups","stepper","updated","feed","detail"] },
  { id:"detail", name:"Deal Detail", cat:"screen", catLabel:"Screen", ring:1, verdict:"real", verdictLabel:"Real — works in this build",
    about:"One deal on its own screen: who it is, how much it is worth, what is due, and the next step. It is the anchor screen — it opens from a follow-up card, and it links onward into Activity History filtered to this one deal.",
    connects:["app","header","past","seehist","backlinks","call","email","log"] },
  { id:"history", name:"Activity History", cat:"screen", catLabel:"Screen", ring:1, verdict:"real", verdictLabel:"Real — works in this build",
    about:"Every call, email, and log in one list, newest first — the 12 seeded past activities plus anything done in this session. It can be opened on its own from Today's Activity feed, or pre-filtered to one deal from Deal Detail.",
    connects:["app","actlist","search","rowopen","backlinks"] },
  { id:"followups", name:"Follow-ups list", cat:"panel", catLabel:"Panel · Today", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked data",
    about:"The working list on Today: 6 deals, $663k of sample ARR in total, ordered biggest first. Each card carries the due badge, the next step, and the Call, Email, and Log activity actions. When a deal is updated it leaves this list and moves to Updated today.",
    connects:["today","call","email","log","dealsdata","loading","emptytoday","errortoday"] },
  { id:"call", name:"Call panel", cat:"panel", catLabel:"Panel", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked call",
    about:"Opens from a follow-up card or from Deal Detail. It shows the deal's context, runs a call timer, and takes a short note and an outcome (Called, No answer, or Met). Save & log moves the deal to Updated today; closing the panel without saving counts as a Call attempted once the timer has run or a note is typed. No real call is placed.",
    connects:["followups","detail","updated","feed","actdata"] },
  { id:"email", name:"Email panel", cat:"panel", catLabel:"Panel", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked email",
    about:"A small composer that opens from a follow-up card or from Deal Detail, pre-filled with a subject and a draft built from the deal's next step. Send & log email moves the deal to Updated today; closing the panel without sending counts as an Email attempted once the subject or draft has been typed or edited. No real email is sent.",
    connects:["followups","detail","updated","feed","actdata"] },
  { id:"log", name:"Log activity", cat:"panel", catLabel:"Action", ring:2, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The quick action on every follow-up card and on Deal Detail. It logs the deal's next step as done straight away, with no panel or form, and moves the deal to Updated today with a matching entry in the Activity feed and Activity History.",
    connects:["followups","detail","updated","feed"] },
  { id:"stepper", name:"Progress stepper", cat:"panel", catLabel:"Panel · Today", ring:2, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The progress strip at the top of Today. It counts the follow-ups — “0 of 6 updated” at the start — and fills in a step for each deal as it is called, emailed, or logged, ending with an “All caught up” banner at 6 of 6.",
    connects:["today","followups","updated"] },
  { id:"updated", name:"Updated today", cat:"panel", catLabel:"Panel · Today", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The right-hand panel on Today where finished deals collect. Each entry shows how the deal was updated — call, email, or log, with its note or subject — and has an Undo that sends the deal back to the follow-ups list. Selecting an entry opens that deal's Deal Detail.",
    connects:["today","call","email","log","detail"] },
  { id:"feed", name:"Activity feed", cat:"panel", catLabel:"Panel · Today", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The live feed on Today. Every call, email, log, and attempted panel close from this session appears here as it happens, newest first. Its “View all in Activity History” link opens the full Activity History screen.",
    connects:["today","history","session","actlist"] },
  { id:"header", name:"Deal header", cat:"panel", catLabel:"Panel · Deal Detail", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked data",
    about:"The top block of Deal Detail: the contact, the company, the sample ARR, the due badge, and the next step, with Call, Email, and Log activity in the same order as Today — Call first. If the deal was already updated today, it says so here.",
    connects:["detail","dealsdata","call","email","log"] },
  { id:"past", name:"Past activity", cat:"panel", catLabel:"Panel · Deal Detail", ring:3, verdict:"mixed", verdictLabel:"Real behaviour · mocked data",
    about:"The activity list inside Deal Detail, showing only this deal's history — its seeded past activities plus anything logged for it in this session, newest first. The same activities appear in full on the Activity History screen.",
    connects:["detail","actdata","history","seehist"] },
  { id:"backlinks", name:"Back to Today links", cat:"panel", catLabel:"Navigation", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The way back. Both Deal Detail and Activity History open with a “Back to Today” link at the top, because Today is the home screen for this test — the sidebar nav is off, so these links are how a rep returns. Saving a call or email from Deal Detail also returns to Today on its own.",
    connects:["today","detail","history"] },
  { id:"seehist", name:"“See this deal in Activity History”", cat:"panel", catLabel:"Navigation link", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The link on Deal Detail, above Past activity, that carries the deal into Activity History. It opens Activity History with the search already set to this deal's contact, so only that deal's activities show. This is the link that makes Deal Detail the anchor for Activity History.",
    connects:["detail","history","search","past"] },
  { id:"actlist", name:"Activity list", cat:"panel", catLabel:"Panel · Activity History", ring:2, verdict:"mixed", verdictLabel:"Real behaviour · mocked data",
    about:"The list itself on Activity History: 12 seeded activities to start with, plus this session's activity added on top, newest first, with a count line above it. Each row shows the kind of activity, the deal, the detail, and the day and time.",
    connects:["history","actdata","session","rowopen","loading","emptyhistory","errorhistory"] },
  { id:"search", name:"Search by name / company", cat:"panel", catLabel:"Panel · Activity History", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The “Find a deal” box at the top of Activity History. Typing a contact name or a company filters the activity list to matching deals and updates the count line — for example, one contact's name shows just their activities. It is also how the Deal Detail link arrives pre-filtered.",
    connects:["history","actlist","seehist"] },
  { id:"rowopen", name:"Row opens Deal Detail", cat:"panel", catLabel:"Navigation", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"Every row in the Activity History list is a button. Selecting a row opens that row's deal on Deal Detail, so a rep can go from something that happened to the deal it belongs to in one tap — and back again with Back to Today.",
    connects:["history","detail","actlist"] },
  { id:"dealsdata", name:"Deals data — 6 deals", cat:"data", catLabel:"Data", ring:2, verdict:"mocked", verdictLabel:"Mocked — sample data only",
    about:"The sample deals written into the file: James Whitfield at Meridian Legal ($312k), Daniel Ortiz ($148k), Priya Nair ($92k), Maya Chen ($54k), Sofia Reyes ($38k), and Aisha Bello ($19k) — 6 deals, $663k in total. Each carries a due label and a next step. None of it comes from a real CRM.",
    connects:["followups","header","session"] },
  { id:"actdata", name:"Activities data — 12 activities", cat:"data", catLabel:"Data", ring:3, verdict:"mocked", verdictLabel:"Mocked — sample data only",
    about:"The seeded past history written into the file: 12 activities dated Tue, Oct 28 to Tue, Nov 4, covering all 6 deals with a mix of calls, emails, and logs. Activity History and Deal Detail's Past activity both read from this same set.",
    connects:["actlist","past","call","email"] },
  { id:"session", name:"Session state — saved per browser", cat:"data", catLabel:"Data", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"Where the rep's work is kept: which deals are done, the Activity feed entries, and the Undo history. The page holds it in memory while you work, and on the live site each change is also saved to Supabase under this browser's anonymous rep, so a reload brings it back. Without the Supabase settings, for example opening index.html from disk, nothing is saved and a reload starts again from the sample data.",
    connects:["feed","updated","dealsdata","app"] },
  { id:"design", name:"Design system", cat:"panel", catLabel:"Design", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"The shared look every screen uses: a dark sidebar (#1e1e2d), light content (#f9fafb), white cards with 8px radius and #e5e7eb borders, blue (#3b82f6) as the primary colour, and green (#22c55e) kept for success only — a deal updated, a step completed. This Admin portal follows the same system.",
    connects:["app","today","detail","history"] },
  { id:"loading", name:"Loading state — skeletons", cat:"state", catLabel:"State", ring:2, verdict:"real", verdictLabel:"Real — works in this build",
    about:"While a list loads, it shows skeleton cards — grey placeholder bars in the shape of the real content — instead of a blank screen. Today shows three skeleton follow-up cards; Activity History shows skeleton rows. On load, the follow-ups sit in this state briefly before the deals appear.",
    connects:["followups","actlist","emptytoday","errortoday"] },
  { id:"emptytoday", name:"Empty state — Today", cat:"state", catLabel:"State · Today", ring:2, verdict:"real", verdictLabel:"Real — works in this build",
    about:"What the follow-ups list shows when there is nothing left to work. The exact wording from the build is shown below. Testers can force it with the Empty control above the follow-ups list; it also appears on its own when all 6 deals are updated and the list is empty.",
    exact:"All caught up. No follow-ups today.",
    connects:["followups","loading","errortoday"] },
  { id:"errortoday", name:"Error state — Today", cat:"state", catLabel:"State · Today", ring:2, verdict:"real", verdictLabel:"Real — works in this build",
    about:"What the follow-ups list shows when loading fails, with a Retry button that loads the list again. The exact wording from the build is shown below. Testers can force it with the Error control above the follow-ups list.",
    exact:"Couldn't load your follow-ups. Check your connection and try again.",
    connects:["followups","loading","emptytoday"] },
  { id:"emptyhistory", name:"Empty state — Activity History", cat:"state", catLabel:"State · Activity History", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"What the activity list shows when there is no activity to list. The exact wording from the build is shown below. Testers can force it with the Empty control above the list; a search that matches nothing shows a separate “No activity found” message instead.",
    exact:"No activity yet. Call or email a follow-up to see it here.",
    connects:["actlist","loading","errorhistory","search"] },
  { id:"errorhistory", name:"Error state — Activity History", cat:"state", catLabel:"State · Activity History", ring:3, verdict:"real", verdictLabel:"Real — works in this build",
    about:"What the activity list shows when loading fails, with a Retry button that loads the list again — the same pattern as Today's error state. The exact wording from the build is shown below. Testers can force it with the Error control above the list.",
    exact:"Couldn't load your activity. Check your connection and try again.",
    connects:["actlist","loading","emptyhistory"] }
];
/* Short, real code excerpts — one per node, for the "Show code" toggle.
   Each is a trimmed excerpt of the actual code in this file, not the whole file. */
var SNIPPETS = {
  app: { fn:"showView(v)", does:"The file's only router — it shows one view and hides the other three, and moves the sidebar highlight.",
    where:"src/app/navigation.js — showView(). The app is index.html (a short shell that loads everything) plus the src/ folder: screens in src/pages/, shared data, model and components in src/shared/, and navigation and start-up in src/app/.",
    code:`function showView(v){
  currentView = v;
  byId("viewToday").hidden = v!=="today";
  byId("viewDetail").hidden = v!=="detail";
  byId("viewHistory").hidden = v!=="history";
  byId("viewAdmin").hidden = v!=="admin";
  …
}` },
  today: { fn:"render()", does:"Redraws everything on Today at once — stepper, follow-ups list, Updated today, and the Activity feed.",
    where:"src/app/render.js — render(). The screen it fills is built by src/pages/today/today-view.js; its drawing code is in src/pages/today/today.js.",
    code:`<div id='viewToday'> … follow-ups, stepper,
  Updated today, Activity feed … </div>

function render(){
  renderStepper(); renderTodo();
  renderUpdated(); renderFeed(); renderHistory();
  …
}` },
  detail: { fn:"openDeal(id)", does:"Opens one deal — remembers which deal it is, fills the Deal Detail screen, and switches to it.",
    where:"src/app/navigation.js — openDeal(). The screen it fills is built by src/pages/deal-detail/deal-detail-view.js.",
    code:`function openDeal(id){
  if(!dealById(id)) return;
  detailId = id;
  renderDetail();
  showView("detail");
}` },
  history: { fn:"openHistory(preset)", does:"Opens Activity History, with the search box pre-filled if a deal was passed in, and plays the loading state.",
    where:"src/app/navigation.js — openHistory(). The screen it fills is built by src/pages/activity-history/activity-history-view.js.",
    code:`function openHistory(preset){
  if(typeof preset==="string")
    byId("historySearch").value = preset;
  showView("history");
  setHistoryState("loading");
}` },
  followups: { fn:"renderTodo()", does:"Turns the DEALS data into follow-up cards — one card per deal that is not done yet, with Call, Email, and Log activity buttons.",
    where:"src/pages/today/today.js — renderTodo(), reading the deals from src/shared/data/sample-deals.js. It fills the <div id='todoList'> on Today.",
    code:`var pending = DEALS.filter(function(d){
  return !done[d.id]; });
wrap.innerHTML = pending.map(function(d){
  return '<article class="deal clickable" …>'
    + '<div class="deal-name">'
    + esc(d.contact) + '</div> …'
    + '<button class="btn btn-call" '
    + 'data-call="' + d.id + '">Call</button> …'
}).join("");` },
  call: { fn:"openCall(id) — and maybeLogAttempt(\"call\")", does:"openCall fills the panel with the deal's details, resets and starts the timer; if the panel is closed without Save & log, maybeLogAttempt logs the attempt instead.",
    where:"src/shared/components/call-panel.js — openCall() and the timer; maybeLogAttempt() is in src/shared/components/panel-close.js. The markup is src/shared/components/call-panel-view.js.",
    code:`function openCall(id){
  currentId = id; var d = dealById(id);
  byId("callTitle").textContent =
    "Call " + d.contact;
  …
  timerSec = 0;
  byId("callOverlay").classList.add("open");
  startTimer();
}
function startTimer(){
  timerInt = setInterval(function(){
    timerSec++;
    byId("timerDisplay").textContent =
      fmtTimer();
  }, 1000);
}
// closed without Save & log:
addAttempt(currentId, "call",
  "Call attempted — " + d.contact,
  "Panel closed without Save & log · Duration "
    + fmtTimer());` },
  email: { fn:"openEmail(id) — and maybeLogAttempt(\"email\")", does:"openEmail pre-fills the subject and draft from the deal's next step and remembers them; if either is edited and the panel is closed without sending, the close counts as an Email attempted.",
    where:"src/shared/components/email-panel.js — openEmail(); maybeLogAttempt() is in src/shared/components/panel-close.js. The markup is src/shared/components/email-panel-view.js.",
    code:`function openEmail(id){
  currentId = id; var d = dealById(id);
  byId("emailSubject").value =
    "Following up — "
    + d.next.charAt(0).toLowerCase()
    + d.next.slice(1);
  byId("emailBody").value = "Hi "
    + d.contact.split(" ")[0] + ", …";
  emailInitialSubject =
    byId("emailSubject").value;
  emailInitialBody = byId("emailBody").value;
  byId("emailOverlay").classList.add("open");
}
// closed without Send & log:
var draftTyped =
  byId("emailSubject").value
    !== emailInitialSubject
  || byId("emailBody").value
    !== emailInitialBody;
if(draftTyped){ addAttempt(…,
  "Email attempted — " + d.contact, …); }` },
  log: { fn:"logActivity(id)", does:"The whole Log flow in four lines — it completes the deal straight away, using the deal's next step as the logged detail.",
    where:"src/shared/components/log-activity.js — logActivity(). The button is wired by bindCardButtons() in src/pages/today/today.js.",
    code:`function logActivity(id){
  var d = dealById(id);
  completeDeal(id, "log", "Logged activity",
    "Logged activity — " + d.contact
    + ", " + d.company, d.next);
}` },
  stepper: { fn:"renderStepper()", does:"Counts the deals marked done, writes the “n of 6 updated” label, and shows the All caught up banner only at 6 of 6.",
    where:"src/pages/today/today.js — renderStepper(). It fills the <div id='stepper'> strip near the top of Today.",
    code:`function renderStepper(){
  var n = doneCount();
  byId("progressLabel").textContent =
    n + " of 6 updated";
  …
  byId("caughtBanner").className =
    "caught" + (n===6 ? " show" : "");
}` },
  updated: { fn:"renderUpdated()", does:"Lists the deals in the done set, each with how it was updated and an Undo button; before any are done it shows the starter line instead.",
    where:"src/pages/today/today.js — renderUpdated(). It fills the <div id='updatedList'> panel on Today.",
    code:`var list = DEALS.filter(function(d){
  return done[d.id]; });
if(list.length===0){ wrap.innerHTML =
  '<p class="none">Nothing updated yet. '
  + 'Start at the top — James Whitfield, '
  + '$312k.</p>'; return; }
… each row ends with:
'<button class="undo-link" data-undo="'
  + d.id + '">Undo</button>'` },
  feed: { fn:"renderFeed()", does:"Rebuilds the Activity feed from the session feed array, newest first, with an icon per kind of activity.",
    where:"src/pages/today/today.js — renderFeed(). It fills the <div id='feedList'> panel on Today.",
    code:`function renderFeed(){
  var wrap = byId("feedList");
  if(feed.length===0){ wrap.innerHTML =
    '<p class="none">No activity yet '
    + 'today.</p>'; return; }
  wrap.innerHTML = feed.map(function(f){
    …
    return '<div class="feed-item">…'
      + '<b>' + esc(f.title) + '</b>…'
      + '<time>' + esc(f.time)
      + '</time></div>';
  }).join("");
}` },
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
  backlinks: { fn:"detailBack / historyBack click handlers", does:"Both Back buttons do exactly one thing — call showView(\"today\"). Saving from Deal Detail returns the same way, inside completeDeal().",
    where:"src/pages/deal-detail/deal-detail.js and src/pages/activity-history/activity-history.js wire the two Back buttons. The buttons are the <button class='view-back'> in each screen's view file.",
    code:`<button class="view-back" id="detailBack">
  ← Back to Today</button>

byId("detailBack").addEventListener(
  "click", function(){
    showView("today"); });
byId("historyBack").addEventListener(
  "click", function(){
    showView("today"); });` },
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
  session: { fn:"done / feed / undoStack", does:"Three plain variables hold the session — which deals are done, the feed entries, and the Undo stack. supabase-source.js fills them from Supabase on start and saves every change, so on the live site a reload brings them back.",
    where:"src/app/session-state.js — the state block. Loading and saving it is in src/shared/data/supabase-source.js.",
    code:`var done = {};       // id -> {via, detail}
var feed = [];       // newest first:
        // {dealId, via, title, detail, time}
var undoStack = [];  // action stack for Undo
var currentView = "today";
var detailId = null; // deal on Deal Detail

// No localStorage, no database, no server —
// a reload resets all of this.` },
  design: { fn:":root { … } — the design tokens", does:"Every colour, radius, and shadow in the app comes from these CSS variables; components reference the variables, never raw colours.",
    where:"src/app/base.css — the very first rule, loaded before every other stylesheet.",
    code:`:root{
  --bg:#f4f5f7; --panel:#ffffff;
  --ink:#131a26; --ink-2:#3d4759;
  --muted:#6b7688; --line:#e3e6ec;
  --sidebar:#121a2a; --sidebar-2:#1b2740;
  --primary:#1f4fd8;
  --success:#22c55e;
  --radius:14px;
  --shadow:0 1px 2px rgba(16,24,40,.05),
    0 4px 16px rgba(16,24,40,.04);
}` },
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
  emptytoday: { fn:"renderTodo() — the empty branch", does:"When the list is forced empty, or every deal is done, the list is replaced with this one line — the exact string is written into the code, not loaded from anywhere.",
    where:"src/pages/today/today.js — inside renderTodo().",
    code:`if(followupsState==="empty"
    || pending.length===0){
  wrap.innerHTML = '<div class="empty"><span class="empty-plain">All caught up. No follow-ups today.</span></div>';
  return;
}` },
  errortoday: { fn:"renderTodo() — the error branch", does:"When the list state is error, it renders the exact failure string and a Retry button whose click sends the list back through the loading state.",
    where:"src/pages/today/today.js — inside renderTodo(), above the empty branch.",
    code:`if(followupsState==="error"){
  wrap.innerHTML = '<div class="state-error" role="alert"><p>Couldn't load your follow-ups. Check your connection and try again.</p><button type="button" class="btn-retry" id="followupsRetry">Retry</button></div>';
  byId("followupsRetry").addEventListener(
    "click", function(){
      setFollowupsState("loading"); });
  return;
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
