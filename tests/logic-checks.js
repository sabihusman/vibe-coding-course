/* Logic checks for CRM Companion's data, model and queue sort.
   Run with:  node tests/logic-checks.js
   No dependencies. Loads the real data and model files, with the
   screen-drawing functions replaced by no-op stubs. */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.join(__dirname, "..");
const files = [
  "src/shared/data/sample-deals.js",
  "src/shared/data/sample-activities.js",
  "src/app/session-state.js",
  "src/shared/model/deals-model.js",
  "src/shared/model/queue-sort.js",
  "src/shared/model/activity-log.js",
];

/* The app files are classic browser scripts that share globals. To test them in Node
   without evaluating strings, this writes them, unchanged, into the body of one
   factory function in a temporary CommonJS module, then loads it with require.
   Each call to the factory gives a fresh app, with the screen functions stubbed. */
const bundle = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "crm-logic-")), "app-bundle.js");
fs.writeFileSync(bundle,
  "module.exports = function createApp(render, renderHistory, renderDetail, syncDemo, hideToast, showView, showToast, announce) {\n" +
  "var document = { querySelector: function(){ return null; } };\n" +
  files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n;\n") +
  "\nreturn { DEALS, PAST, done, feed, get undoStack(){ return undoStack; }, get selectedId(){ return selectedId; }," +
  " setSort: function(m){ sortMode = m; }, dealById, doneCount, allActivity, completeDeal, undoDeal, sortDeals, daysOverdue," +
  " pendingDeals, overdueCount, totalArr };\n};\n");
const createApp = require(bundle);

function freshApp() {
  const calls = { render: 0, toast: [], view: [], announce: [] };
  const noop = () => {};
  const app = createApp(
    () => { calls.render++; }, noop, noop, noop, noop,
    (v) => { calls.view.push(v); },
    (t) => { calls.toast.push(t); },
    (t) => { calls.announce.push(t); });
  return { app, calls };
}

let passed = 0, failed = 0;
function check(name, cond, detail) {
  if (cond) { passed++; console.log("PASS " + name); }
  else { failed++; console.log("FAIL " + name + (detail ? "  [" + detail + "]" : "")); }
}

// ---------------------------------------------------------------- data
{
  const { app } = freshApp();
  const names = app.DEALS.map((d) => d.contact);
  check("6 sample deals", app.DEALS.length === 6, String(app.DEALS.length));
  check("Deals are in ARR order, biggest first",
    JSON.stringify(names) === JSON.stringify(["James Whitfield", "Daniel Ortiz", "Priya Nair", "Maya Chen", "Sofia Reyes", "Aisha Bello"]), names.join(", "));
  check("ARR adds up to $663k", app.DEALS.reduce((s, d) => s + d.arr, 0) === 663);
  check("Each ARR label matches its number", app.DEALS.every((d) => d.arrLabel === "$" + d.arr + "k"));
  check("12 seeded activities", app.PAST.length === 12, String(app.PAST.length));
  check("Every seeded activity points at a real deal", app.PAST.every((a) => app.dealById(a.dealId)));
  check("Seeded activity dates run Oct 28 to Nov 4", /Nov 4/.test(app.PAST[0].date) && /Oct 28/.test(app.PAST[app.PAST.length - 1].date),
    app.PAST[0].date + " … " + app.PAST[app.PAST.length - 1].date);
}

// ---------------------------------------------------------------- saving a call
{
  const { app, calls } = freshApp();
  const ok = app.completeDeal("james", "call", "Call · Connected · 00:42", "Call — James Whitfield, Meridian Legal · Connected", "Duration 00:42");
  check("Saving a call marks the deal done", ok === true && !!app.done.james && app.doneCount() === 1);
  check("Saving a call adds one activity at the top", app.feed.length === 1 && app.feed[0].dealId === "james");
  check("Saving shows a toast and announces it", calls.toast.length === 1 && /1 of 6 updated/.test(calls.announce.join(" ")));
  check("Saved activity appears first in all activity", app.allActivity()[0].dealId === "james" && app.allActivity().length === 13);
  check("The selection moves to the next pending deal", app.selectedId === "daniel" || app.selectedId === null);
}

// ---------------------------------------------------------------- one save, no duplicates
{
  const { app } = freshApp();
  const first = app.completeDeal("daniel", "email", "Email sent", "Email — Daniel Ortiz, BluePeak Logistics", "Subject: Pilot");
  const second = app.completeDeal("daniel", "email", "Email sent", "Email — Daniel Ortiz, BluePeak Logistics", "Subject: Pilot");
  check("A repeated save is refused: one update, one activity", first === true && second === false && app.doneCount() === 1 && app.feed.length === 1);
  check("An unknown deal cannot be saved", app.completeDeal("nobody", "log", "x", "x", "x") === false);
}

// ---------------------------------------------------------------- undo
{
  const { app, calls } = freshApp();
  app.completeDeal("priya", "log", "Logged activity", "Logged activity — Priya Nair, Harbor Dental Group", "Booked the meeting");
  const undone = app.undoDeal("priya");
  check("Undo puts the deal back in the queue", undone === true && !app.done.priya && app.doneCount() === 0);
  check("Undo removes only that activity", app.feed.length === 0 && app.allActivity().length === 12);
  check("Undo clears the Undo stack for that deal", !app.undoStack.includes("priya"));
  check("Undo selects the restored deal and announces it", app.selectedId === "priya" && calls.announce.some((t) => /Undone/.test(t)));
  check("Undo on a deal that is not updated does nothing", app.undoDeal("priya") === false);
}

// ---------------------------------------------------------------- sorting
{
  const { app } = freshApp();
  const order = (mode) => app.sortDeals(app.DEALS, mode).map((d) => d.contact.split(" ")[0]).join(",");
  check("Highest ARR: James, Daniel, Priya, Maya, Sofia, Aisha", order("arr") === "James,Daniel,Priya,Maya,Sofia,Aisha", order("arr"));
  check("Overdue first: days overdue, then ARR", order("overdue") === "Maya,Sofia,James,Daniel,Priya,Aisha", order("overdue"));
  check("Days overdue is read from the due label",
    app.daysOverdue(app.dealById("maya")) === 2 && app.daysOverdue(app.dealById("sofia")) === 1 && app.daysOverdue(app.dealById("james")) === 0);
  check("Sorting does not change the deals", app.DEALS.map((d) => d.id).join(",") === "james,daniel,priya,maya,sofia,aisha");
  check("Summary figures: 2 overdue, $663k total", app.overdueCount() === 2 && app.totalArr() === 663);
  app.setSort("overdue");
  app.completeDeal("maya", "call", "Call · Connected · 00:10", "Call — Maya Chen, Northwind Retail · Connected", "Duration 00:10");
  check("Pending queue keeps the chosen sort and drops updated deals",
    app.pendingDeals().map((d) => d.id).join(",") === "sofia,james,daniel,priya,aisha", app.pendingDeals().map((d) => d.id).join(","));
  app.undoDeal("maya");
  check("Undo restores the original position under the current sort", app.pendingDeals()[0].id === "maya");
}

console.log("\n" + passed + "/" + (passed + failed) + " passed");
process.exit(failed ? 1 : 0);
