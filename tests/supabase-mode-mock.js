/* Checks the Supabase data path against an in-memory stand-in for Supabase.
   Run with:  node tests/supabase-mode-mock.js
   Needs Playwright with Chromium. Uses no real project and no keys: every request to
   the fake project URL is answered by this script. It proves the app signs in, seeds,
   loads, saves, and reloads correctly; it does not prove the real project is set up. */
const path = require("path");
const { chromium } = require("playwright");

const APP = "file://" + path.join(__dirname, "..", "index.html");
const FAKE = "https://fake-project.supabase.test";
const db = { users: 0, deals: [], activities: [], follow_ups: [], requests: [] };
let seq = 0; const uid = () => "00000000-0000-4000-8000-" + String(++seq).padStart(12, "0");

const SEED = [
  ["James Whitfield", "Meridian Legal", 312, "Due today", "Confirm renewal terms before legal review"],
  ["Daniel Ortiz", "BluePeak Logistics", 148, "Due today", "Share pilot results and agree rollout date"],
  ["Priya Nair", "Harbor Dental Group", 92, "Due today", "Confirm the decision-maker meeting for next week"],
  ["Maya Chen", "Northwind Retail", 54, "Overdue 2 days", "Reconnect on the expansion plan"],
  ["Sofia Reyes", "Cascade Fitness Co.", 38, "Overdue 1 day", "Send the updated proposal"],
  ["Aisha Bello", "GreenLeaf Grocers", 19, "Due today", "Check the first order timeline"],
];

function seed() {
  if (db.deals.length) return 0;
  SEED.forEach(([contact, company, arr, due, next_step]) => {
    const d = { id: uid(), contact, company, arr, due, next_step, owner_id: "rep-1" };
    db.deals.push(d); db.follow_ups.push({ id: uid(), deal_id: d.id, status: "open", updated_at: new Date().toISOString() });
  });
  db.activities.push({ id: uid(), deal_id: db.deals[3].id, type: "call", title: "Call — Maya Chen, Northwind Retail · No answer",
    detail: "Left a voicemail about the expansion plan", date: "2026-11-04", time: "4:02 PM", attempted: false, created_at: "2026-11-04T16:02:00-08:00" });
  return 6;
}
const filterEq = (rows, url) => {
  for (const [k, v] of url.searchParams) if (v.startsWith("eq.")) rows = rows.filter((r) => String(r[k]) === v.slice(3));
  return rows;
};

async function handle(route) {
  const req = route.request(); const url = new URL(req.url()); const p = url.pathname; const m = req.method();
  db.requests.push(m + " " + p + url.search);
  const json = (status, body) => route.fulfill({ status, contentType: "application/json", body: body === undefined ? "" : JSON.stringify(body) });
  const body = req.postData() ? JSON.parse(req.postData()) : {};
  if (p === "/auth/v1/signup") { db.users++; return json(200, { access_token: "tok-" + db.users, refresh_token: "ref", expires_in: 3600, user: { id: "rep-1" } }); }
  if (!/^Bearer tok-/.test(req.headers()["authorization"] || "")) return json(401, { message: "no session" });
  if (p === "/rest/v1/rpc/seed_my_sample_data") return json(200, seed());
  const table = p.replace("/rest/v1/", "");
  if (!["deals", "activities", "follow_ups"].includes(table)) return json(404, { message: "unknown" });
  if (m === "GET") {
    let rows = filterEq(db[table].slice(), url);
    if (table === "deals") rows.sort((a, b) => b.arr - a.arr);
    if (table === "activities") rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return json(200, rows);
  }
  if (m === "POST") { const row = { id: uid(), created_at: new Date().toISOString(), ...body }; db[table].push(row); return json(201, [row]); }
  if (m === "PATCH") { filterEq(db[table], url).forEach((r) => Object.assign(r, body)); return json(204); }
  if (m === "DELETE") { const kill = new Set(filterEq(db[table], url)); db[table] = db[table].filter((r) => !kill.has(r)); return json(204); }
  return json(405, {});
}

let passed = 0, failed = 0;
const ok = (n, c, d) => { if (c) { passed++; console.log("PASS " + n); } else { failed++; console.log("FAIL " + n + (d ? "  [" + d + "]" : "")); } };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  await ctx.addInitScript((cfg) => { window.CRM_SUPABASE_CONFIG = cfg; }, { url: FAKE, anonKey: "fake-anon-key" });
  await ctx.route(FAKE + "/**", handle);
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(APP); await page.waitForSelector("#todoList article.deal");
  ok("Signs in once, anonymously", db.users === 1);
  ok("Seeds the rep's sample data", db.deals.length === 6 && db.requests.some((r) => r.includes("rpc/seed_my_sample_data")));
  ok("Today shows the 6 deals from Supabase, biggest first",
    (await page.locator("#todoList article.deal").count()) === 6 && (await page.locator("#todoList .deal-name").first().textContent()) === "James Whitfield");
  ok("Seeded activity from Supabase is in Activity History data", await page.evaluate(() => PAST.some((a) => /Maya Chen/.test(a.title))));

  // Save a call
  await page.locator("#todoList article.deal").first().locator("[data-call]").click();
  await page.fill("#callNote", "Renewal confirmed"); await page.click("#saveCall"); await page.waitForTimeout(400);
  const james = db.deals.find((d) => d.contact === "James Whitfield");
  ok("Saved call is stored as an activity", db.activities.some((a) => a.deal_id === james.id && a.type === "call" && !a.attempted && /Renewal confirmed/.test(a.detail)));
  ok("Follow-up marked updated_today", db.follow_ups.find((f) => f.deal_id === james.id).status === "updated_today");

  // Attempted email
  await page.locator("#todoList article.deal").first().locator("[data-email]").click();
  await page.fill("#emailBody", (await page.inputValue("#emailBody")) + " edited"); await page.click("#emailOverlay [data-close]"); await page.waitForTimeout(400);
  ok("Attempted email is stored with attempted = true", db.activities.some((a) => a.type === "email" && a.attempted));

  // Reload: the saved call persists
  await page.reload(); await page.waitForSelector("#todoList article.deal");
  ok("Reload reuses the same rep (no second sign-in)", db.users === 1);
  ok("After reload, James is in Updated today", /James Whitfield/.test(await page.textContent("#updatedList")));
  ok("After reload, Today shows 5 follow-ups", (await page.locator("#todoList article.deal").count()) === 5);
  ok("After reload, progress reads 1 of 6", /1 of 6/.test(await page.textContent("#viewToday")));
  ok("After reload, the call and the attempt are in the Activity feed",
    /Call — James Whitfield/.test(await page.textContent("#feedList")) && /Email attempted/.test(await page.textContent("#feedList")));

  // Undo after reload
  await page.locator("#updatedList [data-undo]").first().click(); await page.waitForTimeout(400);
  ok("Undo deletes the saved call and reopens the follow-up",
    !db.activities.some((a) => a.deal_id === james.id && a.type === "call" && !a.attempted) && db.follow_ups.find((f) => f.deal_id === james.id).status === "open");
  ok("Undo keeps the attempt", db.activities.some((a) => a.type === "email" && a.attempted));

  // Error + Retry
  await ctx.unroute(FAKE + "/**"); await ctx.route(FAKE + "/**", (r) => r.fulfill({ status: 500, body: "down" }));
  await page.click('#followupsDemo [data-fstate="loading"]'); await page.waitForTimeout(400);
  ok("A failed load shows the exact error wording", /Couldn't load your follow-ups\. Check your connection and try again\./.test(await page.textContent("#viewToday")));
  await ctx.unroute(FAKE + "/**"); await ctx.route(FAKE + "/**", handle);
  await page.click("#followupsRetry"); await page.waitForTimeout(500);
  ok("Retry reloads from Supabase", (await page.locator("#todoList article.deal").count()) === 6);

  ok("No JavaScript errors", errors.length === 0, errors.join(" | "));
  await browser.close();
  console.log("\n" + passed + "/" + (passed + failed) + " passed");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error("SCRIPT ERROR", e); process.exit(2); });
