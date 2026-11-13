/* Design handoff v1.0, section 7 acceptance checklist, run against the real app.
   Run with:  node tests/acceptance-checklist.js [url]
   Needs Playwright with Chromium. Default url: this repo's index.html (in-page sample data). */
const path = require("node:path");
const { chromium } = require("playwright");

const URL = process.argv[2] || "file://" + path.join(__dirname, "..", "index.html");
let passed = 0, failed = 0;
function ok(name, cond, detail) {
  if (cond) { passed++; console.log("PASS " + name); }
  else { failed++; console.log("FAIL " + name + (detail ? "  [" + detail + "]" : "")); }
}

const RESEARCH = [
  "Hypothesis B — do the work here",
  "Letting reps call or email right from the task will keep them in the CRM, so they log as they go — instead of doing the work in email and on the phone, then logging it after.",
  "“Reps asked to do the work here, not log it after.”",
  "— From real swap feedback, Module 2",
  "Work this follow-up as you normally would.",
  "use the CRM today",
  "Weekly active adoption across licensed seats",
  "Required fields to log a single deal update",
  "Average task time for “update a deal”, vs. a 2-min target",
  "Of reps keep a shadow spreadsheet alongside the CRM",
  "What reps told us",
  "Real quotes · Context Data Pack",
  "“Logging activity feels like data entry for management, not something that helps me sell.”",
  "— Senior AE",
  "“If it could just tell me who to call next, I’d open it every morning.”",
  "— SDR, occasional user",
  "“It’s faster to keep my deals in a spreadsheet than to fight the CRM’s eight required fields.”",
  "— Account exec, 2 logins / month",
];

async function fresh(browser, viewport) {
  const page = await browser.newPage({ viewport: viewport || { width: 1366, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(URL);
  await page.waitForSelector("#todoList .qrow");
  return { page, errors };
}
const names = (page) => page.$$eval("#todoList .qrow .deal-name", (els) => els.map((e) => e.textContent));
const state = (page) => page.evaluate(() => ({
  done: Object.keys(done).length, feed: feed.length, all: allActivity().length,
  queue: document.querySelectorAll("#todoList .qrow").length,
  progress: document.getElementById("progressLabel").textContent,
}));

(async () => {
  const browser = await chromium.launch();

  // 1. Content relocation
  {
    const { page } = await fresh(browser);
    const today = await page.textContent("#viewToday");
    const leaked = RESEARCH.filter((t) => today.includes(t));
    ok("1. Today contains none of the research block", leaked.length === 0, leaked.join(" | "));
    ok("1. Problem statement is hidden on first load", await page.isHidden("#viewProblem"));
    ok("1. Today: first contact and its actions visible without scrolling at 1366×900", await page.evaluate(() => {
      const r = document.querySelector("#todoList .qrow").getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight;
    }));
    await page.click("#navProblemLink");
    const ps = await page.textContent("#viewProblem");
    const missing = RESEARCH.filter((t) => !ps.includes(t));
    ok("1. Problem statement has every block, number, unit, quote and attribution", missing.length === 0, missing.join(" | "));
    const nums = await page.$$eval("#viewProblem .ps-metric b, #viewProblem .ps-signal b", (els) => els.map((e) => e.textContent.trim()));
    ok("1. Signal 18% and all four metrics (18%, 8, 11 min, 63%) shown", JSON.stringify(nums) === JSON.stringify(["18%", "18%", "8", "11 min", "63%"]), nums.join(", "));
    ok("1. Sidebar destination is named exactly “Problem statement”", (await page.textContent("#navProblemLink")).trim() === "Problem statement");
    await page.close();
  }

  // 2. State preservation + 3. Queue ordering
  {
    const { page } = await fresh(browser);
    ok("3. Highest ARR is the default sort", (await page.inputValue("#sortSelect")) === "arr");
    ok("3. Highest ARR order: James, Daniel, Priya, Maya, Sofia, Aisha",
      JSON.stringify(await names(page)) === JSON.stringify(["James Whitfield", "Daniel Ortiz", "Priya Nair", "Maya Chen", "Sofia Reyes", "Aisha Bello"]), (await names(page)).join(", "));
    await page.selectOption("#sortSelect", "overdue");
    const od = await names(page);
    ok("3. Overdue first: Maya, Sofia, then by ARR; all six remain",
      JSON.stringify(od) === JSON.stringify(["Maya Chen", "Sofia Reyes", "James Whitfield", "Daniel Ortiz", "Priya Nair", "Aisha Bello"]), od.join(", "));
    await page.click('#todoList [data-select] >> text=Priya Nair');
    ok("2. Selecting a contact updates the context panel only", (await page.textContent("#dealContext .ctx-company")) === "Harbor Dental Group" && (await state(page)).done === 0);
    ok("2. Selected row has an accessible pressed state", (await page.getAttribute('#todoList .qrow.selected [data-select]', "aria-pressed")) === "true");
    await page.locator("#todoList .qrow", { hasText: "Aisha Bello" }).locator("[data-log]").click();
    await page.fill("#logNote", "Confirmed the first order ships Monday.");
    await page.click("#saveLog"); await page.waitForTimeout(200);
    await page.click("#navProblemLink"); await page.click("#navTodayLink");
    const s = await state(page);
    ok("2. After Problem statement and back: sort kept", (await page.inputValue("#sortSelect")) === "overdue");
    ok("2. After Problem statement and back: selected contact kept", (await page.textContent("#dealContext .ctx-company")) === "Harbor Dental Group");
    ok("2. After Problem statement and back: progress and queue kept", s.progress === "1 of 6 updated" && s.queue === 5 && s.done === 1);
    ok("2. After Problem statement and back: history kept", s.feed === 1 && s.all === 13);
    await page.close();
  }

  // 4. No accidental activity
  {
    const { page } = await fresh(browser);
    const before = await state(page);
    await page.locator("#todoList [data-call]").first().click();
    ok("4. Call opens a named dialog showing “Ready when you are”",
      (await page.getAttribute("#callOverlay [role=dialog]", "aria-labelledby")) === "callTitle" && /Ready when you are/.test(await page.textContent("#callStatus")));
    ok("4. Call timer does not start before Start simulated call", await page.isHidden("#timerBox"));
    await page.click("#startCall"); await page.waitForTimeout(1200);
    ok("4. Timer runs after Start simulated call", (await page.textContent("#timerDisplay")) !== "00:00");
    await page.click("#callOverlay .x");
    await page.locator("#todoList [data-email]").first().click();
    await page.fill("#emailBody", "Edited draft"); await page.keyboard.press("Escape");
    await page.locator("#todoList [data-log]").first().click();
    await page.fill("#logNote", "A note I did not save"); await page.click("#logOverlay .btn-cancel");
    await page.locator("#todoList [data-call]").nth(1).click();
    await page.mouse.click(5, 5); // backdrop
    const after = await state(page);
    ok("4. Open/close Call, Email and Log without saving: no update, no activity", JSON.stringify(before) === JSON.stringify(after), JSON.stringify(after));
    await page.locator("#todoList [data-email]").first().click();
    ok("4. A dismissed email draft is kept for that deal", (await page.inputValue("#emailBody")) === "Edited draft");
    await page.keyboard.press("Escape");
    await page.locator("#todoList [data-log]").first().click();
    ok("4. A dismissed activity note is kept for that deal", (await page.inputValue("#logNote")) === "A note I did not save");
    await page.keyboard.press("Escape");
    await page.close();
  }

  // 5. Save and Undo, each action type, with double-click protection
  for (const kind of ["call", "email", "log"]) {
    const { page } = await fresh(browser);
    await page.selectOption("#sortSelect", "arr");
    const before = await names(page);
    const target = "Priya Nair", origIndex = before.indexOf(target);
    const row = page.locator("#todoList .qrow", { hasText: target });
    if (kind === "call") {
      await row.locator("[data-call]").click();
      await page.click("#startCall"); await page.selectOption("#callOutcome", "Connected");
      await page.fill("#callNote", "Agreed the meeting.");
      await page.dblclick("#saveCall");
    } else if (kind === "email") {
      await row.locator("[data-email]").click();
      await page.dblclick("#sendEmail");
    } else {
      await row.locator("[data-log]").click();
      await page.fill("#logNote", "Booked the decision-maker meeting.");
      await page.dblclick("#saveLog");
    }
    await page.waitForTimeout(250);
    ok(`5. ${kind}: the second click of a double-click opens nothing else`, (await page.locator(".overlay.open").count()) === 0);
    const s = await state(page);
    ok(`5. ${kind}: save creates exactly one update and one event (double-click included)`, s.done === 1 && s.feed === 1 && s.all === 13, JSON.stringify(s));
    ok(`5. ${kind}: Updated today lists it once`, (await page.locator("#updatedList .updated-item").count()) === 1);
    ok(`5. ${kind}: save is announced`, /for Priya Nair/.test(await page.textContent("#liveRegion")));
    await page.click("#updatedList [data-undo]"); await page.waitForTimeout(150);
    const u = await state(page);
    ok(`5. ${kind}: Undo removes only that event`, u.done === 0 && u.feed === 0 && u.all === 12, JSON.stringify(u));
    ok(`5. ${kind}: Undo restores the original queue position`, (await names(page)).indexOf(target) === origIndex);
    ok(`5. ${kind}: Undo restores progress`, u.progress === "0 of 6 updated");
    ok(`5. ${kind}: Undo is announced`, /Undone/.test(await page.textContent("#liveRegion")));
    await page.close();
  }

  // 6. Required fields
  {
    const { page } = await fresh(browser);
    await page.locator("#todoList [data-call]").first().click();
    await page.click("#saveCall");
    ok("6. Call without an outcome cannot save, with a field error",
      (await state(page)).done === 0 && (await page.isVisible("#callOutcomeErr")) && (await page.getAttribute("#callOutcome", "aria-invalid")) === "true");
    await page.keyboard.press("Escape");
    await page.locator("#todoList [data-email]").first().click();
    await page.fill("#emailSubject", "   "); await page.click("#sendEmail");
    ok("6. Email with a blank subject cannot send, with a field error", (await state(page)).done === 0 && (await page.isVisible("#emailSubjectErr")));
    await page.fill("#emailSubject", "Renewal terms"); await page.fill("#emailBody", ""); await page.click("#sendEmail");
    ok("6. Email with a blank message cannot send, with a field error", (await state(page)).done === 0 && (await page.isVisible("#emailBodyErr")));
    await page.keyboard.press("Escape");
    await page.locator("#todoList [data-log]").first().click();
    await page.fill("#logNote", "    \n  "); await page.click("#saveLog");
    ok("6. Whitespace-only activity note cannot save, with a field error", (await state(page)).done === 0 && (await page.isVisible("#logNoteErr")));
    await page.close();
  }

  // 7. Keyboard
  {
    const { page } = await fresh(browser);
    await page.focus("#sortSelect"); await page.keyboard.press("ArrowDown"); await page.waitForTimeout(100);
    ok("7. Sort changes from the keyboard", (await page.inputValue("#sortSelect")) === "overdue");
    await page.focus('#todoList [data-select]:nth-of-type(1)');
    const second = page.locator("#todoList .qrow").nth(1).locator("[data-select]");
    await second.focus(); await page.keyboard.press("Enter");
    ok("7. Contact selection works with Enter", (await page.textContent("#dealContext .ctx-company")) === "Cascade Fitness Co.");
    const callBtn = page.locator("#todoList .qrow").first().locator("[data-call]");
    await callBtn.focus(); await page.keyboard.press("Enter"); await page.waitForTimeout(100);
    ok("7. Dialog takes focus", await page.evaluate(() => document.getElementById("callOverlay").contains(document.activeElement)));
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
    ok("7. Tab stays inside the dialog", await page.evaluate(() => document.getElementById("callOverlay").contains(document.activeElement)));
    ok("7. Page behind the dialog is inert", await page.evaluate(() => document.querySelector(".app").hasAttribute("inert")));
    await page.keyboard.press("Escape");
    ok("7. Escape closes and returns focus to the Call button", await page.evaluate(() => document.activeElement && document.activeElement.matches("#todoList .qrow:first-child [data-call]")));
    await page.locator("#todoList .qrow").first().locator("[data-log]").focus(); await page.keyboard.press("Enter");
    await page.keyboard.type("Spoke with Maya about expansion."); await page.keyboard.press("Enter").catch(() => {});
    await page.focus("#saveLog"); await page.keyboard.press("Enter"); await page.waitForTimeout(200);
    ok("7. A form can be completed and saved from the keyboard", (await state(page)).done === 1);
    ok("7. After save, focus moves to the next task", await page.evaluate(() => document.activeElement && document.activeElement.matches("#todoList [data-select]")));
    await page.focus("#updatedList [data-undo]"); await page.keyboard.press("Enter"); await page.waitForTimeout(150);
    ok("7. Undo works from the keyboard", (await state(page)).done === 0);
    ok("7. Navigation works from the keyboard", await (async () => { await page.focus("#navHistoryLink"); await page.keyboard.press("Enter"); return page.isVisible("#viewHistory"); })());
    ok("7. Active nav item and page title match", (await page.getAttribute("#navHistoryLink", "aria-current")) === "page" && /^Activity history/.test(await page.title()));
    await page.goBack(); await page.waitForTimeout(150);
    ok("7. Browser Back returns to Today", await page.isVisible("#viewToday"));
    await page.close();
  }

  // 8. Responsive: 320, 390, 768, 1024, 1366, and 200% zoom (1366×900 at 2× = 683×450 CSS px)
  for (const vp of [{ w: 320, h: 720 }, { w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1024, h: 768 }, { w: 1366, h: 900 }, { w: 683, h: 450, zoom: true }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.zoom ? 2 : 1 });
    await page.goto(URL); await page.waitForSelector("#todoList .qrow");
    const label = vp.zoom ? "200% zoom" : vp.w + "px";
    const check = async (where) => page.evaluate(() => {
      const over = document.documentElement.scrollWidth > innerWidth + 1;
      const clipped = [...document.querySelectorAll("#todoList .act, .navitem, #dealContext .btn, .sheet .btn, .x")]
        .filter((e) => e.offsetParent !== null).filter((e) => { const r = e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).length;
      const small = [...document.querySelectorAll("#todoList .act, #todoList [data-select], .navitem, #sortSelect, .sheet .btn, .x, .undo-link")]
        .filter((e) => e.offsetParent !== null).filter((e) => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).length;
      return { over, clipped, small };
    });
    let r = await check();
    ok(`8. ${label}: Today has no page-wide horizontal scroll, no clipped actions`, !r.over && r.clipped === 0, JSON.stringify(r));
    ok(`8. ${label}: touch targets at least 44×44px`, r.small === 0, JSON.stringify(r));
    await page.locator("#todoList [data-call]").first().click();
    r = await check();
    ok(`8. ${label}: Call dialog fits with no horizontal scroll`, !r.over && r.clipped === 0, JSON.stringify(r));
    await page.keyboard.press("Escape");
    await page.click("#navProblemLink");
    r = await check();
    ok(`8. ${label}: Problem statement fits, reached from the same navigation`, !r.over && await page.isVisible("#viewProblem"), JSON.stringify(r));
    if (vp.w === 320) {
      const fs = await page.evaluate(() => getComputedStyle(document.getElementById("logNote")).fontSize);
      ok("8. Editable text is at least 16px on touch screens", parseFloat(fs) >= 16, fs);
    }
    await page.close();
  }

  // 9. States
  {
    const { page } = await fresh(browser);
    ok("9. Test controls are tucked into a test area", (await page.getAttribute("#todayTestArea", "open")) === null && await page.isHidden("#followupsDemo button"));
    await page.click("#todayTestArea summary");
    await page.click('#followupsDemo [data-fstate="loading"]');
    ok("9. Loading shows queue-shaped skeletons", (await page.locator("#todoList .skeleton-card").count()) > 0);
    await page.click('#followupsDemo [data-fstate="empty"]');
    ok("9. Empty shows All caught up", /All caught up\. No follow-ups today\./.test(await page.textContent("#todoList")));
    await page.click('#followupsDemo [data-fstate="error"]');
    ok("9. Error shows the message, Retry, and is announced (role=alert)",
      /Couldn't load your follow-ups\. Check your connection and try again\./.test(await page.textContent("#todoList")) && (await page.locator("#todoList [role=alert] #followupsRetry").count()) === 1);
    ok("9. Error does not show success: queue count is 0, progress unchanged", (await page.textContent("#queueCount")) === "0" && (await page.textContent("#progressLabel")) === "0 of 6 updated");
    await page.click("#followupsRetry"); await page.waitForSelector("#todoList .qrow", { timeout: 3000 });
    ok("9. Retry restores the list", (await page.locator("#todoList .qrow").count()) === 6);
    await page.click("#navHistoryLink"); await page.waitForSelector("#historyList .hist-row");
    await page.click("#historyTestArea summary");
    await page.click('#historyDemo [data-hstate="error"]');
    ok("9. History error with Retry", (await page.locator("#historyList [role=alert] #historyRetry").count()) === 1);
    await page.click("#historyRetry"); await page.waitForSelector("#historyList .hist-row", { timeout: 3000 });
    ok("9. History Retry restores the list", (await page.locator("#historyList .hist-row").count()) === 12);
    await page.close();
  }

  // 10. Regression
  {
    const { page, errors } = await fresh(browser);
    await page.click("#contextOpenDeal");
    ok("10. Open deal reaches the full Deal Detail", await page.isVisible("#viewDetail") && (await page.textContent("#detailName")) === "James Whitfield");
    await page.click("#detailHistoryLink"); await page.waitForSelector("#historyList .hist-row");
    ok("10. History search by name still filters", (await page.locator("#historyList .hist-row").count()) < 12 && (await page.inputValue("#historySearch")) === "James Whitfield");
    await page.fill("#historySearch", "Northwind"); await page.waitForTimeout(100);
    ok("10. History search by company still works", (await page.locator("#historyList .hist-row").count()) > 0);
    await page.locator("#historyList .hist-row").first().click();
    ok("10. History row opens Deal Detail", (await page.textContent("#detailName")) === "Maya Chen");
    await page.click("#navAdminLink");
    const tabs = await page.$$eval(".admin-tabs [data-atab]", (els) => els.map((e) => e.dataset.atab));
    ok("10. Admin keeps Orbit, Living PRD and Handoff", JSON.stringify(tabs) === JSON.stringify(["orbit", "prd", "handoff"]));
    await page.click('[data-atab="prd"]'); await page.locator("#prd-03 [data-orbit-link]").first().click();
    ok("10. Cross-links still work", await page.isVisible("#adminTabOrbit"));
    ok("10. Deals is not presented as a broken link", (await page.locator(".sidebar .navitem", { hasText: "Deals" }).count()) === 0);
    await page.click("#navTodayLink");
    await page.locator("#todoList [data-log]").first().click(); await page.fill("#logNote", "Reload test note"); await page.click("#saveLog");
    await page.reload(); await page.waitForSelector("#todoList .qrow");
    ok("10. Without Supabase settings, reload resets to the sample day", (await state(page)).done === 0 && /resets on reload/.test(await page.textContent("#sampleNotice")));
    ok("10. Simulation disclosures shown before a simulated send", /No real call is placed/.test(await page.textContent("#callSim")) && /Nothing is sent/.test(await page.textContent("#emailSim")));
    ok("10. No JavaScript errors", errors.length === 0, errors.join(" | "));
    await page.close();
  }

  await browser.close();
  console.log("\n" + passed + "/" + (passed + failed) + " passed");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error("SCRIPT ERROR", e); process.exit(2); });
