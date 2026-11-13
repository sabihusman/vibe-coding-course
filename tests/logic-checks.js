/* Logic checks for CRM Companion's data and model.
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
  "src/shared/model/activity-log.js",
  "src/shared/components/log-activity.js",
];

/* The app files are classic browser scripts that share globals. To test them in Node
   without evaluating strings, this writes them, unchanged, into the body of one
   factory function in a temporary CommonJS module, then loads it with require.
   Each call to the factory gives a fresh app, with the screen functions stubbed. */
const bundle = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "crm-logic-")), "app-bundle.js");
fs.writeFileSync(bundle,
  "module.exports = function createApp(render, renderFeed, renderHistory, renderDetail, renderDetailActivity, syncDemo, hideToast, showView, showToast) {\n" +
  files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n;\n") +
  "\nreturn { DEALS, PAST, done, feed, get undoStack(){ return undoStack; }, dealById, doneCount, allActivity, completeDeal, undoDeal, addAttempt, logActivity };\n};\n");
const createApp = require(bundle);

function freshApp() {
  const calls = { render: 0, toast: [], view: [] };
  const noop = () => {};
  const app = createApp(
    () => { calls.render++; }, noop, noop, noop, noop, noop, noop,
    (v) => { calls.view.push(v); },
    (t) => { calls.toast.push(t); });
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
  app.completeDeal("james", "call", "Call logged", "Call — James Whitfield, Meridian Legal · Called", "Note");
  check("Saving a call marks the deal done", !!app.done.james && app.doneCount() === 1);
  check("Saving a call adds one feed entry at the top", app.feed.length === 1 && app.feed[0].dealId === "james");
  check("Saving returns to Today and shows a toast", calls.view.includes("today") && calls.toast.length === 1);
  check("Saved activity appears first in all activity", app.allActivity()[0].dealId === "james" && app.allActivity().length === 13);
}

// ---------------------------------------------------------------- attempted
{
  const { app } = freshApp();
  app.addAttempt("daniel", "email", "Email attempted — Daniel Ortiz, BluePeak Logistics", "Panel closed without Send and log");
  check("An attempt does not mark the deal done", !app.done.daniel && app.doneCount() === 0);
  check("An attempt is logged in the feed, flagged as attempt", app.feed.length === 1 && app.feed[0].attempt === true);
}

// ---------------------------------------------------------------- undo keeps attempts
{
  const { app } = freshApp();
  app.addAttempt("priya", "call", "Call attempted — Priya Nair", "Panel closed without Save & log");
  app.completeDeal("priya", "call", "Call logged", "Call — Priya Nair", "");
  app.undoDeal("priya");
  check("Undo puts the deal back in Follow-ups", !app.done.priya && app.doneCount() === 0);
  check("Undo removes the saved entry but keeps the attempt", app.feed.length === 1 && app.feed[0].attempt === true);
  check("Undo clears the Undo stack for that deal", !app.undoStack.includes("priya"));
}

// ---------------------------------------------------------------- log activity
{
  const { app } = freshApp();
  app.logActivity("aisha");
  check("Log activity completes the deal straight away", app.done.aisha && app.done.aisha.via === "log");
  check("Log activity records the next step as the detail", app.feed[0].detail === app.dealById("aisha").next);
}

console.log("\n" + passed + "/" + (passed + failed) + " passed");
process.exit(failed ? 1 : 0);
