/* Checks in-app analytics against an in-memory stand-in for Supabase.
   Run with:  node tests/analytics-mock.js
   Needs Playwright with Chromium. No real project and no keys. It proves the app side:
   one counts-only event per view change, fire-and-forget, a new tab is a new session,
   the Admin Analytics tab and its states, and that a missing table leaves the rep flow alone.
   The SQL itself (RLS, totals only) is checked against Postgres, not here. */
const path = require("path");
const { chromium } = require("playwright");

const APP = "file://" + path.join(__dirname, "..", "index.html");
const FAKE = "https://fake-project.supabase.test";
const NOT_SET_UP = "Analytics is not set up yet — run the migration in Supabase.";
const NOTE = "Counts only — no personal data. History starts when this shipped; nothing before that is counted.";
const LABELS = { today: "Today", history: "Activity history", problem: "Problem statement", deal: "Deal Detail", admin: "Admin" };
const SEED = [["James Whitfield", "Meridian Legal", 312], ["Daniel Ortiz", "BluePeak Logistics", 148], ["Priya Nair", "Harbor Dental Group", 92],
  ["Maya Chen", "Northwind Retail", 54], ["Sofia Reyes", "Cascade Fitness Co.", 38], ["Aisha Bello", "GreenLeaf Grocers", 19]];

const db = { analyticsSetUp: false, users: 0, deals: {}, activities: [], follow_ups: [], events: [], bodies: [] };
let seq = 0; const uid = () => "00000000-0000-4000-8000-" + String(++seq).padStart(12, "0");
const repOf = (req) => { const m = /^Bearer tok-(\d+)$/.exec(req.headers()["authorization"] || ""); return m ? "rep-" + m[1] : null; };

function summary(rows) {
  const sess = {};
  rows.forEach((e) => { (sess[e.session_id] = sess[e.session_id] || []).push(Date.parse(e.entered_at)); });
  const s = Object.values(sess), pv = rows.length, n = s.length;
  const avg = n ? s.reduce((t, a) => t + (Math.max(...a) - Math.min(...a)) / 1000, 0) / n : 0;
  return { visitors: new Set(rows.map((e) => e.owner_id)).size, page_views: pv, sessions: n,
    views_per_visit: n ? +(pv / n).toFixed(2) : 0, avg_duration_seconds: Math.round(avg),
    bounce_rate: n ? +(100 * s.filter((a) => a.length === 1).length / n).toFixed(1) : 0,
    by_view: Object.keys(LABELS).map((v) => { const c = rows.filter((e) => e.view === v).length; return { view: v, label: LABELS[v], views: c, share: pv ? +(100 * c / pv).toFixed(1) : 0 }; }) };
}

async function handle(route) {
  const req = route.request(); const url = new URL(req.url()); const p = url.pathname; const m = req.method();
  const json = (status, body) => route.fulfill({ status, contentType: "application/json", body: body === undefined ? "" : JSON.stringify(body) });
  const body = req.postData() ? JSON.parse(req.postData()) : {};
  if (p === "/auth/v1/signup") { db.users++; return json(200, { access_token: "tok-" + db.users, refresh_token: "ref", expires_in: 3600, user: { id: "rep-" + db.users } }); }
  const rep = repOf(req); if (!rep) return json(401, { message: "no session" });
  if (p === "/rest/v1/analytics_events" || p === "/rest/v1/rpc/get_analytics_summary") {
    if (!db.analyticsSetUp) return json(404, { code: p.includes("rpc") ? "PGRST202" : "42P01", message: "not found" });
    if (m === "POST" && p.endsWith("analytics_events")) { db.bodies.push(body); db.events.push({ ...body, owner_id: rep }); return json(201); }
    return json(200, { generated_at: new Date().toISOString(), periods: { last_30_days: summary(db.events), all_time: summary(db.events) } });
  }
  if (p === "/rest/v1/rpc/seed_my_sample_data") {
    if (db.deals[rep]) return json(200, 0);
    db.deals[rep] = SEED.map(([contact, company, arr]) => ({ id: uid(), contact, company, arr, due: "Due today", next_step: "Follow up", owner_id: rep }));
    db.deals[rep].forEach((d) => db.follow_ups.push({ id: uid(), deal_id: d.id, status: "open", owner: rep }));
    return json(200, 6);
  }
  const table = p.replace("/rest/v1/", "");
  const mine = new Set((db.deals[rep] || []).map((d) => d.id));
  if (m === "GET") {
    if (table === "deals") return json(200, (db.deals[rep] || []).slice().sort((a, b) => b.arr - a.arr));
    if (table === "activities" || table === "follow_ups") return json(200, db[table].filter((r) => mine.has(r.deal_id)));
    return json(404, {});
  }
  if (m === "POST") { const row = { id: uid(), created_at: new Date().toISOString(), ...body }; db[table].push(row); return json(201, [row]); }
  if (m === "PATCH") { db[table].filter((r) => [...url.searchParams].every(([k, v]) => !v.startsWith("eq.") || String(r[k]) === v.slice(3))).forEach((r) => Object.assign(r, body)); return json(204); }
  if (m === "DELETE") return json(204);
  return json(405, {});
}

let passed = 0, failed = 0;
const ok = (n, c, d) => { if (c) { passed++; console.log("PASS " + n); } else { failed++; console.log("FAIL " + n + (d ? "  [" + d + "]" : "")); } };
const settle = (page) => page.waitForTimeout(500);

async function rep(browser) {
  const ctx = await browser.newContext();
  await ctx.addInitScript((cfg) => { window.CRM_SUPABASE_CONFIG = cfg; }, { url: FAKE, anonKey: "fake-anon-key" });
  await ctx.route(FAKE + "/**", handle);
  const page = await ctx.newPage();
  page.errors = []; page.on("pageerror", (e) => page.errors.push(String(e)));
  await page.goto(APP); await page.waitForSelector("#todoList .qrow"); await settle(page);
  return { ctx, page };
}
async function openAnalytics(page) {
  await page.evaluate(() => showView("admin")); await settle(page);
  await page.click("#atabAnalytics"); await page.waitForFunction(() => !/Loading/.test(document.getElementById("analyticsBody").textContent));
  return page.textContent("#analyticsBody");
}

(async () => {
  const browser = await chromium.launch();

  // (d) Analytics off — table and function missing. The rep flow must be untouched.
  const off = await rep(browser);
  await off.page.locator("#todoList .qrow").first().locator("[data-call]").click();
  await off.page.click("#startCall"); await off.page.selectOption("#callOutcome", "Connected");
  await off.page.fill("#callNote", "Renewal confirmed"); await off.page.click("#saveCall"); await settle(off.page);
  await off.page.evaluate(() => { showView("history"); showView("problem"); showView("today"); }); await settle(off.page);
  ok("(d) Table missing: the call still saves", db.activities.some((a) => /Renewal confirmed/.test(a.detail)));
  ok("(d) Table missing: James moves to Updated today", /James Whitfield/.test(await off.page.textContent("#updatedList")));
  ok("(d) Table missing: no error shown to the rep", !(await off.page.locator("#viewToday").textContent()).match(/analytics|couldn.t save|not saved/i));
  ok("(d) Table missing: no JavaScript errors", off.page.errors.length === 0, off.page.errors.join(" | "));
  const offText = await openAnalytics(off.page);
  ok("(d) Analytics tab says it is not set up", offText.trim() === NOT_SET_UP, offText);
  ok("(d) Note is shown", (await off.page.textContent("#adminTabAnalytics")).includes(NOTE));
  await off.ctx.close();

  // (e) Set up, zero events.
  db.analyticsSetUp = true;
  const a = await rep(browser);
  await a.page.evaluate(() => showView("admin")); await settle(a.page);
  db.events = []; db.bodies = [];
  await a.page.click("#atabAnalytics"); await a.page.waitForFunction(() => !/Loading/.test(document.getElementById("analyticsBody").textContent));
  ok("(e) Zero events shows the empty state", (await a.page.textContent("#analyticsBody")).trim() === "No visits recorded yet.");

  // Logging: one event per view change, counts only.
  await a.page.evaluate(() => { showView("today"); showView("today"); openDeal(DEALS[0].id); openHistory(); showView("problem"); showView("admin"); });
  await settle(a.page);
  ok("One event per view change, repeats ignored", db.events.map((e) => e.view).join(",") === "today,deal,history,problem,admin", db.events.map((e) => e.view).join(","));
  ok("Event holds only session_id, view and entered_at", db.bodies.every((b) => Object.keys(b).sort().join(",") === "entered_at,session_id,view"), JSON.stringify(db.bodies[0]));
  const sessA = db.events[0].session_id;
  ok("One session id across the tab", db.events.every((e) => e.session_id === sessA));
  await a.page.reload(); await a.page.waitForSelector("#todoList .qrow", { state: "attached" }); await settle(a.page);
  ok("A reload keeps the session", db.events[db.events.length - 1].session_id === sessA);
  const tab2 = await a.ctx.newPage(); await tab2.goto(APP); await tab2.waitForSelector("#todoList .qrow"); await settle(tab2);
  ok("A new tab is a new session", db.events[db.events.length - 1].session_id !== sessA);
  await tab2.close();

  // (a) Two browsers: 2 visitors, per-view counts add up.
  const b = await rep(browser);
  await b.page.evaluate(() => { openDeal(DEALS[1].id); openHistory(); }); await settle(b.page);
  const text = await openAnalytics(a.page);
  const cards = await a.page.$$eval(".an-card", (els) => els.map((e) => [e.querySelector(".an-label").textContent, e.querySelector("b").textContent]));
  const card = Object.fromEntries(cards);
  const rows = await a.page.$$eval(".an-table tbody tr", (trs) => trs.map((tr) => [...tr.cells].map((c) => c.textContent)));
  const sumRows = rows.reduce((t, r) => t + Number(r[1]), 0);
  ok("(a) Five cards in order", cards.map((c) => c[0]).join("|") === "Visitors|Page Views|Views Per Visit|Duration|Bounce Rate", cards.map((c) => c[0]).join("|"));
  ok("(a) Two browsers give 2 visitors", card.Visitors === "2", card.Visitors);
  ok("(a) Page Views matches the events stored", Number(card["Page Views"]) === db.events.length, card["Page Views"] + " vs " + db.events.length);
  ok("(a) Per-view counts add up to Page Views", sumRows === Number(card["Page Views"]), sumRows + " vs " + card["Page Views"]);
  ok("(a) Table lists the five screens", rows.map((r) => r[0]).join("|") === "Today|Activity history|Problem statement|Deal Detail|Admin");
  ok("(a) Duration shown as mm:ss", /^\d\d:\d\d$/.test(card.Duration), card.Duration);
  ok("(a) Bounce rate shown as a %", /^\d+(\.\d)?%$/.test(card["Bounce Rate"]), card["Bounce Rate"]);
  ok("(a) Shares add up to about 100%", Math.abs(rows.reduce((t, r) => t + parseFloat(r[2]), 0) - 100) < 1);
  ok("(a) No names or companies on the tab", !/Whitfield|Meridian|Ortiz|rep-\d/.test(text));
  ok("No JavaScript errors", a.page.errors.length + b.page.errors.length === 0, a.page.errors.concat(b.page.errors).join(" | "));

  await browser.close();
  console.log("\n" + passed + "/" + (passed + failed) + " passed");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error("SCRIPT ERROR", e); process.exit(2); });
