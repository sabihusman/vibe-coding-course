# Living PRD — CRM Companion

**Product:** CRM Companion. A rep's Today view for a CRM that only 18% of reps use.
**Stage:** Prototype (Modules 1–3) → Production (Module 4)
**Owner:** Sabih Usman
**Last updated:** 2026-11-12
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main:** 2144688
**Source of truth:** the live prototype above. This PRD is extracted from what that build actually does, in the eight blocks below. Where the build is mocked, this PRD says so.

---

## 01 · Product Overview

CRM Companion is a rep's Today view. Each morning, a rep opens one screen, sees who to call or email next, does the call or email right there, and has it logged, with no extra admin.

- **One-liner:** "Do the work here, not log it after."
- **Surface:** a web page. Today is the main screen. Deal Detail and Activity History are the other two screens. An Admin portal, the Orbit Code Explorer, is separate from the rep's view.
- **Primary action:** call or email a follow-up, right from the task card.
- **Who it is for:** Sales reps, Account Executives, and Sales Development Representatives. The person on the screen is a sample rep, Alex Rivera.
- **Job to be done:** open one screen, see who to call or email next, do it right there, and have it logged.

## 02 · Problem & Hypothesis

- **Problem:** Reps have to log every deal in the CRM. Only 18% use it each week. The work happens in email and on the phone. Logging is extra admin after the work. It takes 8 fields and 11 minutes to update a deal. The target is 2 minutes. 63% of reps keep a shadow spreadsheet instead.
- **Hypothesis:** Letting reps call or email right from the task will keep them in the CRM and log as they go, instead of doing the work in email and on the phone, then logging it after.
- **Risk type:** Usability. Will reps actually do the call or email inside the CRM, instead of in their usual email or phone app?
- **Kill switch:** If a tester still opens their phone or email app instead of doing the call or email in the tool, or gets stuck more than 30 seconds on Call or Email, Hypothesis B has failed. Fix the flow or pivot. Do not fix the look. The kill-switch rules live in the test plan only. They are never on screen.

## 03 · User Flow & Screen Map

1. **Today:** 6 follow-ups, biggest first ($663k total). Call and Email first on every card. Log activity second.
2. **Call or Email:** a simulated panel opens. Call has a timer, a note, and an outcome (Called / No answer / Met). Email has a pre-filled draft and Send. Saving or sending logs the activity and moves the deal to Updated today.
3. **Attempted:** closing a Call or Email panel without saving logs it as attempted in Activity, if the timer ran or a draft was typed. The deal stays in Follow-ups.
4. **Deal Detail:** click a follow-up card to open that deal. Company, contact, sample ARR, due date, next step, past activity. Call and Email first there too. Back returns to Today.
5. **Activity History:** every call, email, log, and attempted call or email, newest first. Search by name or company. Click a row to open Deal Detail. Back returns to Today.
6. **Admin:** an "Admin" entry in the sidebar opens the Orbit Code Explorer. It maps the app as an orbit, with 27 nodes. Click a node to see what it does, what it connects to, and if it is real or mocked. Each node has a "Show code" toggle with a short piece of that node's real code.

*Screen map:* `Today → Call / Email panel → Updated today` · `Today → Deal Detail → Activity History → Deal Detail` · `Today → Activity History → Today` · `Sidebar → Admin → Orbit Code Explorer`

## 04 · Success Metrics

| Metric | Definition | Target |
|---|---|---|
| North Star: work done in the tool | % of follow-ups where the call or email was done from the task, not outside it | ≥ 70% in a test session (proposed, not yet measured) |
| Activation | % of testers who do at least one Call or Email from a task | ≥ 80% in a test session (proposed) |
| Log as you go | % of calls/emails that are logged in the same step, with no log-after | ≥ 80% (proposed) |
| Attempted, not lost | % of closed panels that are counted as attempted, not as no call | 100% — Call and Email must match (Email was fixed in 4f68201 after it failed this check live) |
| Time to first action | Time from opening Today to starting the first Call or Email | Under 30 seconds — the kill-switch floor |
| Loading / empty / error | % of testers who see the right state with the exact wording, when forced | 100% in the test controls |

No metric above has been measured in a real user session yet. The A/B test plan is written (6–8 testers, each tries Version A and Version B, half A-first). No session has run yet.

## 05 · Technical Reality

Extracted from the prototype, what was actually built.

- **Frontend:** a single self-contained HTML file. The Muse artifact `crm-companion-today-view-v3`, exported as the repo's root `index.html`. It is not a Vite / React project, so there is no `src/pages` folder.
- **Screens:** Today, Deal Detail, and Activity History, switched in place in one page. Admin Orbit is a fourth view, in the same file.
- **Call / Email:** simulated panels only. No real call is made. No real email is sent.
- **Data:** 6 sample deals and 12 seeded sample activities, Oct 28–Nov 4, in data arrays in the file. Anything logged in the session is added on top, newest first.
- **State:** saved in Supabase for each browser's anonymous rep, so it survives a reload. Without the Supabase settings, the app falls back to in-page sample data that resets on reload.
- **Naming:** screens and functions are named for what they do — Today, Deal Detail, Activity History, `showView`, `openDeal`, `openHistory`, `renderTodo`, `renderUpdated`, `completeDeal`, `addAttempt`. An engineer can tell what each does from its name. It is not `Component_1.tsx` naming.
- **Separation:** the sample data sits in data arrays, separate from the functions that draw the screen. But everything lives in one file. Data and display are not in separate files. There is no data service layer yet.
- **Documentation:** there is no README inside the project itself. The build summary is on the computer only, per the Module 3 lab guide. The prompt chain is in `03-chaining/PROMPTS.md`.
- **Gap to production:** needs a real backend and auth, a split into files by feature, and a decision on the sidebar Deals and Activity tabs.

## 06 · Assumptions & Risks

- **Assumption:** reps will do the call or email inside the CRM, instead of in their usual email or phone app. *Risk:* if they do not, a faster log screen alone will not fix adoption. That is the kill switch above.
- **Assumption:** 6 follow-ups in ARR order is the right morning list. *Risk:* a rep may need due-date order, or a mix of due date and ARR, instead.
- **Assumption:** the sample history makes the screens feel real. *Risk:* the 12 seeded activities are invented, Oct 28–Nov 4, and will go stale. They are useful for testing, not real rep history.
- **Risk:** Call and Email may not stay symmetric. The live test found Email attempted did not log while Call attempted did. It was fixed in 4f68201, but Pause/Reset and the No answer / Met outcomes were not clicked in that test.
- **Risk:** Log activity logs instantly, with no panel or form. That was not specified in the prompts. A rep may expect a note and outcome there too.
- **Risk:** the single file will tangle as it grows. The next refactor should split it by feature before adding a backend.
- **Comprehension debt:** the build was made with prompts, not written by hand. This PRD, the prompt chain in `03-chaining/PROMPTS.md`, and the Orbit Code Explorer in the Admin portal are the first steps in paying that debt down.

## 07 · In vs. Out of Scope

**In scope (this build):**
- Today, Deal Detail, and Activity History, with Call and Email first, Log activity second.
- Simulated Call and Email panels, with save/send logging and attempted counting.
- Loading, empty, and error states for Today and Activity History, with exact wording and Retry.
- Neutral line "Work this follow-up as you normally would." Left nav labelled out of scope.
- Admin portal: Orbit Code Explorer, with 27 nodes, search, filters, FAQ and tips, and "Show code" per node.

**Out of scope (this build):**
- Real calls or emails. Both panels are simulated. Nothing is sent.
- Real CRM data or a CRM link. All names, deals, and amounts are sample data.
- Real accounts. Each browser is an anonymous rep; there is no sign-in screen.
- Sign-in, accounts, or multi-user support. There is no sign-in.
- Sidebar Deals and Activity tabs. They are plain text, not links. They do nothing by design in this test.
- Version B, the dispatch-board layout. It is a separate Muse artifact, kept apart for later A/B testing. It is not in this build, not in the repo, and not on the live site.
- Supabase backend. Proposed in the handoff note. Not built or connected yet.

## 08 · Engineering Recommendation

- **Front Door:** this PRD lives at `04-production/PRD.md`. The handoff note lives at `04-production/handoff-note.md`.
- **Cleanup:** split the single HTML file by feature, following the handoff note and your instructor's layout: `src/pages/` with one folder per screen (Today, Deal Detail, Activity History), `src/shared/data/` for the sample deals and activities, `src/shared/model/` for the calculations, `src/shared/components/` for the panels, `src/app/` for navigation, and `tests/` for the logic checks. Do this before adding a backend, or the data and display logic will tangle further.
- **Memory:** move deals and activities to Supabase (PostgreSQL + Auth), with row-level security so a rep sees only their own data. Replace the in-page data arrays. The Call and Email panels stay simulated in v1 — the backend only needs to store what was attempted, saved, or sent in the tool.
- **Next spike:** run the A/B test first, with Version A and Version B, before building the backend. The test plan is written. If Version B wins, build the backend for the winning layout, not for both.
- **Handoff:** see `04-production/handoff-note.md` for the engineer-ready summary.

---
*Module 4 · Vibe Coding Certification, the prototype is the source of truth; the spec is the output.*
