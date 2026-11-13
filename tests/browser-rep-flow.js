const { chromium } = require('playwright');
/* Browser check of the whole rep flow, Admin tabs, sidebar, and phone layout.
   Run with:  node tests/browser-rep-flow.js [url]
   Needs Playwright with Chromium. Default url: this repo's index.html.
   Screenshots go to tests/screenshots/ (ignored by git). */
const path = require('path'), fs = require('fs');
const URL = process.argv[2] || ('file://' + path.join(__dirname, '..', 'index.html'));
const SHOTS = path.join(__dirname, 'screenshots'); fs.mkdirSync(SHOTS, { recursive: true });
const results = [];
function ok(name, cond, detail) { results.push({ name, pass: !!cond, detail: detail || '' }); }

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(URL, { waitUntil: 'load' });
  const vis = sel => page.isVisible(sel);
  const txt = sel => page.textContent(sel);

  // --- Admin portal ---
  ok('Sidebar shows Admin entry', await vis('#navAdminLink') && /Admin/.test(await txt('#navAdminLink')), (await txt('#navAdminLink')).trim());
  await page.click('#navAdminLink');
  ok('Admin opens with Orbit Code Explorer in the first tab', await vis('#viewAdmin') && (await txt('#viewAdmin h1')).trim()==='Admin' && /Orbit Code Explorer/.test(await txt('#adminTabOrbit .tab-head h2')));
  const nodeCount = await page.locator('#orbitStage .onode').count();
  const centre = await page.locator('#orbitStage .onode.centre').count();
  ok('Orbit renders 30 nodes incl. CRM Companion centre', nodeCount === 30 && centre === 1, 'onode count ' + nodeCount + ', centre ' + centre);
  ok('Admin only badge present', /Admin only/.test(await txt('#viewAdmin')));
  ok('One persistent sample-data notice, in the sidebar', /Sample data/.test(await txt('#sampleNotice')) && (await page.locator('.sample-pill').count()) === 0);
  await page.locator('#orbitStage .onode', { hasText: 'Today' }).first().click();
  const detailText = await txt('#orbitDetail');
  ok('Clicking a node shows detail panel', detailText.length > 100 && /connect|Connects/i.test(detailText), detailText.slice(0, 80));
  ok('Detail shows real/mocked', /real|mocked/i.test(detailText));
  const toggle = page.locator('#orbitDetail [data-codetoggle]');
  ok('Show code toggle present', (await toggle.count()) === 1 && /^Show code/.test((await toggle.textContent()).trim()), (await toggle.textContent()).trim());
  await toggle.click();
  const codeVisible = await page.locator('#orbitDetail .codebox pre, #orbitDetail .codebox code').first().isVisible().catch(() => false);
  ok('Show code reveals a snippet', codeVisible && /^Hide code/.test((await toggle.textContent()).trim()), (await toggle.textContent()).trim());
  await page.fill('#orbitSearch', 'error');
  await page.waitForTimeout(200);
  const chipCount = await page.locator('#orbitChips button').count();
  ok('Search "error" shows jump-to chips', chipCount > 0, 'chips ' + chipCount);
  await page.locator('#orbitChips button').first().click();
  ok('Chip click selects a node', /error/i.test(await txt('#orbitDetail')));
  await page.screenshot({ path: SHOTS + '/admin.png' });

  // --- Admin tabs ---
  const tabs = await page.locator('.admin-tabs [data-atab]').allTextContents();
  ok('Admin shows three tabs in order', tabs.length === 3 && /^Orbit/.test(tabs[0]) && /^Living PRD/.test(tabs[1]) && /^Handoff/.test(tabs[2]), tabs.map(t => t.split('\n')[0]).join(' | '));
  ok('Intro explains the three tabs', /Living PRD.*says what the app does/.test(await txt('.admin-intro')) && /Orbit.*where each part lives/.test(await txt('.admin-intro')) && /Handoff.*how to run/.test(await txt('.admin-intro')));
  ok('Orbit tab visible by default, others hidden', await vis('#adminTabOrbit') && !(await vis('#adminTabPrd')) && !(await vis('#adminTabHandoff')));
  await page.click('[data-atab="prd"]');
  ok('PRD tab opens', await vis('#adminTabPrd') && !(await vis('#adminTabOrbit')));
  const prdHeads = await page.locator('#adminTabPrd .doc-head h2').allTextContents();
  ok('PRD shows all eight blocks', prdHeads.length === 8 && prdHeads[0] === 'Product Overview' && prdHeads[7] === 'Engineering Recommendation', prdHeads.join(' | '));
  const prdText = await txt('#adminTabPrd');
  ok('PRD keeps the figures', /18%/.test(prdText) && /8 fields/.test(prdText) && /11 minutes/.test(prdText) && /2 minutes/.test(prdText) && /63%/.test(prdText) && /\$663k/.test(prdText));
  ok('PRD keeps Hypothesis B + kill switch + proposed note', /Kill switch:/.test(prdText) && /Hypothesis B has failed/.test(prdText) && /proposed, not yet measured/.test(prdText) && /No metric above has been measured/.test(prdText));
  ok('PRD metrics table has 6 rows', (await page.locator('#prd-04 tbody tr').count()) === 6);
  const prdLinks = await page.locator('#adminTabPrd [data-orbit-link]').count();
  ok('PRD blocks link to Orbit nodes', prdLinks >= 8, 'links ' + prdLinks);
  await page.locator('#prd-03 [data-orbit-link="call"]').click();
  await page.waitForTimeout(300);
  ok('PRD link opens Orbit tab and selects Call dialog', await vis('#adminTabOrbit') && /^Call dialog/.test((await txt('#orbitDetail h2')).trim()) && (await page.locator('#orbitStage .onode.selected').textContent()).trim() === 'Call dialog');
  const backLinks = await page.locator('#orbitDetail [data-prdlink]').allTextContents();
  ok('Orbit node links back to PRD block', backLinks.length >= 1 && /03 · User Flow/.test(backLinks.join(' ')), backLinks.join(' | '));
  await page.locator('#orbitDetail [data-prdlink]').first().click();
  await page.waitForTimeout(300);
  ok('Back-link opens PRD tab at block 03', await vis('#adminTabPrd') && (await page.locator('#prd-03.flash').count()) === 1);
  await page.click('[data-atab="handoff"]');
  ok('Handoff tab opens', await vis('#adminTabHandoff') && !(await vis('#adminTabPrd')));
  const hoHeads = await page.locator('#adminTabHandoff .doc-head h2').allTextContents();
  ok('Handoff shows all sections incl. Admin portal', hoHeads.length === 8 && hoHeads[0] === 'What this is' && hoHeads[2] === 'Backend / data' && hoHeads[7] === 'Admin portal', hoHeads.join(' | '));
  const hoText = await txt('#adminTabHandoff');
  ok('Backend section states Supabase is live', /Live since 2026-11-13\./.test(hoText) && await vis('#ho-backend .doc-note'));
  ok('Handoff keeps the honest limits', /Call and Email panels stay simulated in v1/.test(hoText) && /sample data/.test(hoText) && /anonymous/.test(hoText));
  ok('Handoff describes the src/ code layout', /one folder per screen/.test(hoText) && /src\/pages/.test(hoText));
  ok('Solid/duct-tape table has 11 rows', (await page.locator('#ho-solid tbody tr').count()) === 11);
  await page.locator('#ho-backend [data-orbit-link="dealsdata"]').click();
  await page.waitForTimeout(300);
  ok('Handoff link selects Deals data node', await vis('#adminTabOrbit') && /^Deals data/.test((await txt('#orbitDetail h2')).trim()));
  const hoBack = await page.locator('#orbitDetail [data-holink]').allTextContents();
  ok('Orbit node links back to Handoff section', /Backend \/ data/.test(hoBack.join(' ')), hoBack.join(' | '));
  await page.locator('#orbitDetail [data-holink]').first().click();
  await page.waitForTimeout(300);
  ok('Back-link opens Handoff at Backend', await vis('#adminTabHandoff') && (await page.locator('#ho-backend.flash').count()) === 1);
  await page.screenshot({ path: SHOTS + '/handoff.png' });
  await page.click('[data-atab="prd"]'); await page.waitForTimeout(100);
  await page.screenshot({ path: SHOTS + '/prd.png' });
  await page.click('[data-atab="orbit"]');
  await page.waitForTimeout(200);
  ok('Orbit still renders after tab switching', (await page.locator('#orbitStage .onode').count()) === 30);

  // --- Sidebar hide / show ---
  const sbBefore = await page.locator('.sidebar').boundingBox();
  await page.click('#hideNavBtn');
  ok('Hide sidebar collapses it', !(await vis('.sidebar')) && await vis('#showNavBtn'), 'sidebar width before ' + Math.trunc(sbBefore.width));
  const mainBox = await page.locator('.main').boundingBox();
  ok('Main content uses full width when collapsed', mainBox.x < 60 && mainBox.width > 1000, 'main x=' + Math.trunc(mainBox.x) + ' w=' + Math.trunc(mainBox.width));
  await page.click('#showNavBtn');
  ok('Show sidebar restores it', await vis('.sidebar') && !(await vis('#showNavBtn')));
  ok('Sidebar keeps its destinations and notice', /Problem statement/.test(await txt('.sidebar')) && /Admin — Code Explorer/.test(await txt('.sidebar')) && /Prototype workspace/.test(await txt('.sidebar')));

  // --- Phone reflow ---
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await phone.goto(URL, { waitUntil: 'load' });
  await phone.click('#navAdminLink');
  const tabBox = await phone.locator('.admin-tabs').boundingBox();
  const t1 = await phone.locator('[data-atab="orbit"]').boundingBox();
  const t2 = await phone.locator('[data-atab="prd"]').boundingBox();
  ok('Phone: tabs stack vertically', t2.y > t1.y + t1.height - 1 && tabBox.width <= 390, `tab1 y=${Math.trunc(t1.y)} tab2 y=${Math.trunc(t2.y)}`);
  ok('Phone: orbit stage hidden, list shown', !(await phone.isVisible('#orbitStage')) && (await phone.locator('#orbitList .lnode').count()) === 30);
  ok('Phone: no horizontal overflow', await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await phone.click('[data-atab="prd"]');
  ok('Phone: PRD tab works', await phone.isVisible('#adminTabPrd'));
  ok('Phone: no horizontal overflow on PRD', await phone.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await phone.screenshot({ path: SHOTS + '/phone-prd.png' });
  await phone.click('#hideNavBtn');
  ok('Phone: hide sidebar works', !(await phone.isVisible('.sidebar')) && await phone.isVisible('#showNavBtn'));
  await phone.click('#showNavBtn');
  ok('Phone: show sidebar works', await phone.isVisible('.sidebar'));
  await phone.close();

  // --- Rep flow ---
  await page.click('#navTodayLink');
  ok('Back to Today', await vis('#viewToday') && !(await vis('#viewAdmin')));
  await page.waitForSelector('#todoList .qrow', { timeout: 5000 });
  const rows = await page.locator('#todoList .qrow').count();
  ok('Today shows 6 follow-ups in the queue', rows === 6, 'rows ' + rows);
  const firstName = (await txt('#todoList .qrow:first-child .deal-name')).trim();
  ok('First row is James Whitfield', firstName === 'James Whitfield', firstName);
  ok('Research block is not on Today', !/Hypothesis B/.test(await txt('#viewToday')) && !/What reps told us/.test(await txt('#viewToday')));
  ok('No kill-switch text anywhere', !/Test it yourself/.test(await page.content()));
  ok('Deals is not shown as a broken link', (await page.locator('.sidebar .navitem', { hasText: 'Deals' }).count()) === 0);

  // Problem statement keeps the neutral instruction and the research
  await page.click('#navProblemLink');
  ok('Problem statement holds the neutral instruction', /Work this follow-up as you normally would\./.test(await txt('#viewProblem')));
  await page.click('#navTodayLink');

  // Select, then Open deal reaches Deal Detail
  await page.locator('#todoList [data-select]').first().click();
  ok('Selecting a contact fills the context panel', (await txt('#dealContext .ctx-company')).trim() === 'Meridian Legal');
  await page.click('#contextOpenDeal');
  ok('Open deal opens Deal Detail', await vis('#viewDetail') && (await txt('#detailName')).trim() === 'James Whitfield', (await txt('#detailName')).trim());
  await page.click('#detailBack');
  ok('Back returns to Today', await vis('#viewToday'));

  // Call: start, outcome, save
  await page.locator('#todoList .qrow').first().locator('[data-call]').click();
  ok('Call dialog opens ready, timer not running', await vis('#callOverlay') && !(await vis('#timerBox')));
  await page.click('#startCall');
  await page.selectOption('#callOutcome', 'Connected');
  await page.fill('#callNote', 'Test note');
  await page.click('#saveCall');
  await page.waitForTimeout(300);
  ok('Saved call moves the deal to Updated today', (await page.locator('#updatedList .updated-item').count()) === 1 && /James Whitfield/.test(await txt('#updatedList')));
  ok('Progress 1 of 6', /1 of 6/.test(await txt('#progressLabel')));
  ok('Context panel shows the next deal', (await txt('#dealContext .ctx-company')).trim() === 'BluePeak Logistics');

  // Email: send the pre-filled draft
  await page.locator('#todoList .qrow', { hasText: 'Daniel Ortiz' }).locator('[data-email]').click();
  ok('Email dialog opens with a pre-filled draft', await vis('#emailOverlay') && (await page.inputValue('#emailBody')).length > 20);
  await page.click('#sendEmail');
  await page.waitForTimeout(300);
  ok('Send -> 2 of 6', /2 of 6/.test(await txt('#progressLabel')) && (await page.locator('#updatedList .updated-item').count()) === 2);

  // Cancel records nothing (the attempted-on-close rule is retired)
  const before = await page.evaluate(() => ({ f: feed.length, d: Object.keys(done).length }));
  await page.locator('#todoList .qrow').first().locator('[data-call]').click();
  await page.click('#startCall'); await page.waitForTimeout(1200);
  await page.click('#callOverlay .x');
  await page.locator('#todoList .qrow').first().locator('[data-email]').click();
  await page.fill('#emailBody', (await page.inputValue('#emailBody')) + ' edited');
  await page.keyboard.press('Escape');
  const after = await page.evaluate(() => ({ f: feed.length, d: Object.keys(done).length }));
  ok('Closing Call or Email without saving records nothing', before.f === after.f && before.d === after.d && !/attempted/i.test(await txt('#viewToday')));

  // Log activity: note required
  await page.locator('#todoList .qrow').first().locator('[data-log]').click();
  await page.click('#saveLog');
  ok('Log activity needs a note', await vis('#logNoteErr') && /2 of 6/.test(await txt('#progressLabel')));
  await page.fill('#logNote', 'Confirmed the decision-maker meeting.');
  await page.click('#saveLog'); await page.waitForTimeout(300);
  ok('Log activity -> 3 of 6', /3 of 6/.test(await txt('#progressLabel')));

  // Undo
  await page.locator('#updatedList [data-undo]').last().click(); await page.waitForTimeout(200);
  ok('Undo -> 2 of 6', /2 of 6/.test(await txt('#progressLabel')));

  // Activity history from the sidebar
  await page.click('#navHistoryLink');
  ok('Activity history opens from the sidebar', await vis('#viewHistory'));
  await page.waitForSelector('#historyList .hist-row', { timeout: 5000 });
  const rowsAll = await page.locator('#historyList .hist-row').count();
  await page.fill('#historySearch', 'James Whitfield');
  await page.waitForTimeout(300);
  const rowsJW = await page.locator('#historyList .hist-row').count();
  ok('Search filters history', rowsJW > 0 && rowsJW < rowsAll, `all ${rowsAll}, James ${rowsJW}`);
  await page.locator('#historyList .hist-row').first().click();
  ok('History row opens Deal Detail', await vis('#viewDetail') && (await txt('#detailName')).trim() === 'James Whitfield');
  await page.click('#detailBack');

  // State controls, now in the test area
  await page.click('#todayTestArea summary');
  await page.click('#followupsDemo [data-fstate="empty"]');
  await page.waitForTimeout(200);
  ok('Empty state wording', /All caught up\. No follow-ups today\./.test(await txt('#viewToday')));
  await page.click('#followupsDemo [data-fstate="error"]');
  await page.waitForTimeout(200);
  ok('Error state wording + Retry', /Couldn't load your follow-ups\. Check your connection and try again\./.test(await txt('#viewToday')) && await vis('#followupsRetry'));
  await page.click('#followupsRetry');
  await page.waitForTimeout(1200);
  ok('Retry restores list', (await page.locator('#todoList .qrow').count()) > 0);

  ok('No JS page errors', errors.length === 0, errors.join(' | ').slice(0, 200));
  await browser.close();

  let fails = 0;
  for (const r of results) { if (!r.pass) fails++; console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.detail ? '  [' + r.detail + ']' : '')); }
  console.log(`\n${results.length - fails}/${results.length} passed`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('SCRIPT ERROR', e); process.exit(2); });
