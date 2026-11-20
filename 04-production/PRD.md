# Living PRD — CRM Companion

**Product:** CRM Companion. A rep's Today view for a CRM that only 18% of reps use.
**Stage:** Prototype (Modules 1–3) → Production (Module 4) → Full-stack (Module 5) → Iteration (Module 6)
**Owner:** Sabih Usman
**Last updated:** 2026-11-19 (Modules 5–6: full-stack record + iteration sprint; offline-write P0 found, not yet fixed)
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main:** cace521
**Source of truth:** the live prototype above. This PRD is extracted from what that build actually does, in the eight blocks below. Where the build is mocked, this PRD says so.

---

## 01 · Product Overview

CRM Companion is a rep's Today view. Each morning, a rep opens one screen, sees who to call or email next, does the call or email right there, and has it logged, with no extra admin.

- **One-liner:** "Do the work here, not log it after."
- **Surface:** a web page with a sidebar. Workspace: Today (the main screen), Activity history, and Problem statement. Deal Detail opens from a deal. Admin, the Orbit Code Explorer with the Living PRD and Handoff, is in its own Admin group, separate from the rep's view.
- **Primary action:** call or email a follow-up, right from the queue.
- **Who it is for:** Sales reps, Account Executives, and Sales Development Representatives. The person on the screen is a sample rep, Alex Rivera.
- **Job to be done:** open one screen, see who to call or email next, do it right there, and have it logged.

## 02 · Problem & Hypothesis

- **Problem:** Reps have to log every deal in the CRM. Only 18% use it each week. The work happens in email and on the phone. Logging is extra admin after the work. It takes 8 fields and 11 minutes to update a deal. The target is 2 minutes. 63% of reps keep a shadow spreadsheet instead.
- **Hypothesis:** Letting reps call or email right from the task will keep them in the CRM and log as they go, instead of doing the work in email and on the phone, then logging it after.
- **Risk type:** Usability. Will reps actually do the call or email inside the CRM, instead of in their usual email or phone app?
- **Kill switch:** If a tester still opens their phone or email app instead of doing the call or email in the tool, or gets stuck more than 30 seconds on Call or Email, Hypothesis B has failed. Fix the flow or pivot. Do not fix the look. The kill-switch rules live in the test plan only. They are never on screen.
- **Where the research lives:** the hypothesis, the research metrics and the rep quotes are on the Problem statement screen, not on Today. They are supplied research figures, not the rep's own results.

## 03 · User Flow & Screen Map

1. **Today:** a quiet summary line (6 follow-ups · 2 overdue · $663k total sample ARR) and progress (0 of 6 updated), then the follow-up queue. Sort is Highest ARR by default, or Overdue first (most days overdue, then ARR). Each row has small labelled Call, Email and Log activity actions.
2. **Select a contact:** selecting a row updates the deal context panel beside the queue — company, contact, ARR, due, next step, Call, Open deal, and recent activity. Selecting never changes data.
3. **Call:** a named dialog says "Ready when you are". The timer starts only after Start simulated call. An outcome — Connected, No answer or Left voicemail — is required to save. Saving records one activity and moves the deal to Updated today.
4. **Email:** a named dialog with an editable subject and message, both required. Sending records one activity and moves the deal to Updated today. Nothing is actually sent.
5. **Log activity:** a short note form. A real note is required; saving records one activity and moves the deal to Updated today.
6. **Cancel records nothing:** opening, cancelling or closing Call, Email or Log activity creates no activity and no attempted entry. Unsent text is kept as a draft for that deal.
7. **Undo:** from the toast or from Updated today. It removes that one activity, restores the progress count, and puts the deal back in its place in the queue.
8. **Deal Detail:** Open deal in the context panel (or a row in Activity history, or Updated today) opens the full deal. Back returns to Today.
9. **Activity history:** a sidebar destination. Every call, email and note, newest first. Search by name or company. Select a row to open Deal Detail.
10. **Problem statement:** a sidebar destination with the full research block. Switching to it and back keeps the queue, sort, selection, progress and history.
11. **Admin:** in its own sidebar group. Orbit Code Explorer (32 nodes, each with a "Show code" excerpt), Living PRD and Handoff, with cross-links.

*Screen map:* `Today → Call / Email / Log dialog → Updated today` · `Today → context panel → Open deal → Deal Detail → Activity history → Deal Detail` · `Sidebar → Activity history` · `Sidebar → Problem statement → Today` · `Sidebar → Admin → Orbit / Living PRD / Handoff`

## 04 · Success Metrics

| Metric | Definition | Target |
|---|---|---|
| North Star: work done in the tool | % of follow-ups where the call or email was done from the task, not outside it | ≥ 70% in a test session (proposed, not yet measured) |
| Activation | % of testers who do at least one Call or Email from a task | ≥ 80% in a test session (proposed) |
| Log as you go | % of calls/emails that are logged in the same step, with no log-after | ≥ 80% (proposed) |
| No accidental activity | % of opened-then-cancelled dialogs that create no activity | 100% — checked by the acceptance tests |
| Time to first action | Time from opening Today to starting the first Call or Email | Under 30 seconds — the kill-switch floor |
| Loading / empty / error | % of testers who see the right state with the exact wording, when forced | 100% in the test controls |

**Retired:** "Attempted, not lost" (% of closed panels counted as attempted). The design handoff replaced the attempted-on-close rule: opening or cancelling a dialog now records nothing.

No metric above has been measured in a real user session yet. The A/B test plan is written (6–8 testers, each tries Version A and Version B, half A-first). No session has run yet.

**Module 5–6, measured on the live site (Nov 17–18, main `cace521`):** spam-click held — 5 rapid saves wrote exactly 1 activity. Ghost user held — a fresh browser gets its own anonymous rep with the 6 seeded deals, straight into Today, never a blank page. Kill switch FAILED — P0: acting on a follow-up while offline shows it as done, including in Activity history, but the write never reaches Supabase; after reconnecting and reloading, the follow-up is back in the queue with no notification. Verdict: do not ship until the P0 is fixed. Recorded in `05-fullstack/fullstack.md` and `06-iteration/iteration.md` (both on main). Module 6 call: Iterate, not Go.

## 05 · Technical Reality

Extracted from the prototype, what was actually built.

- **Frontend:** plain HTML, CSS and JavaScript, with no build step and no framework. `index.html` is a short shell; the code lives in `src/`, grouped by feature (Lab 2 refactor). Scripts are classic `<script>` tags loaded in a fixed order.
- **Screens:** Today, Problem statement, Deal Detail, Activity history and Admin, switched in place. Each has its own address (`#today`, `#problem`, `#history`, `#admin`, `#deal-…`), so browser Back works.
- **Call / Email / Log:** accessible dialogs with focus kept inside, Escape to cancel, and focus returned afterwards. Call and Email are simulated: no real call is made and no real email is sent.
- **Data:** 6 sample deals and 12 seeded sample activities, Oct 28–Nov 4. On the live site, each browser gets its own copy in Supabase.
- **State:** saved in Supabase for each browser's anonymous rep (project `toctukiccnirfkkoaqog`, tables `deals`, `activities`, `follow_ups`, with row-level security), so it survives a reload — when the save reaches the server. **P0 (Module 5 Lab 2, found Nov 17, not yet fixed):** a save made while offline is shown as done, including in Activity history, but never reaches Supabase; on reload it silently reverts with no notification. A write must only show as done after the server confirms it. Without the Supabase settings, the app falls back to in-page sample data that resets on reload.
- **Auth decision (Module 5, Nov 17):** anonymous auth kept; email login is a future step, not in this build.
- **Known gaps (Module 5, verified live):** same rep in two tabs can save the same deal twice (live test wrote two activities for Aisha Bello); `follow_ups.status` is plain last-write-wins with no version check; no "Get Started" CTA, and a new rep never reaches the empty state because seeding always gives 6 deals. Full record: `05-fullstack/fullstack.md`. Iteration record: `06-iteration/iteration.md`.
- **In-app analytics (Nov 20):** Supabase only, no vendor. Each view change writes one row to `analytics_events` (owner_id, session_id, view, entered_at — no names, companies, deal ids or notes), fire-and-forget: it never blocks the rep and never shows an error, because it is telemetry, not rep data, so the P0 write-confirmation rule does not apply to it. Row-level security: a rep inserts and reads only their own rows; anon has no access. The Admin Analytics tab reads only `get_analytics_summary()` (security definer, totals only) — Visitors, Page Views, Views Per Visit, Duration, Bounce Rate and views per screen, for the last 30 days and all time. Migration: `supabase/migrations/20261120000000_analytics_events.sql`, run by hand in the Supabase SQL editor; until it is run, the tab says "Analytics is not set up yet" and nothing else changes. History starts when it shipped.
- **Naming:** screens and functions are named for what they do — `showView`, `openDeal`, `openHistory`, `renderTodo`, `renderContext`, `sortDeals`, `completeDeal`, `undoDeal`, `openDialog`. An engineer can tell what each does from its name.
- **Separation:** sample data in `src/shared/data/`, calculations (including the sort) in `src/shared/model/`, dialogs and list states in `src/shared/components/`, one folder per screen in `src/pages/`, navigation and start-up in `src/app/`, and checks in `tests/`.
- **Documentation:** this PRD, the handoff note, the prompt chain in `03-chaining/PROMPTS.md`, the full-stack record in `05-fullstack/fullstack.md`, the iteration record in `06-iteration/iteration.md`, and the Orbit Code Explorer. The build summary is on the computer only, per the Module 3 lab guide.
- **Gap to production:** the offline-write P0 (above) must be fixed and re-tested first; then real sign-in instead of anonymous reps, and a decision on a Deals screen.

## 06 · Assumptions & Risks

- **Assumption:** reps will do the call or email inside the CRM, instead of in their usual email or phone app. *Risk:* if they do not, a faster log screen alone will not fix adoption. That is the kill switch above.
- **Assumption:** Highest ARR is the right default order for the morning list. *Risk:* some reps work overdue items first. Overdue first is offered as a sort; which default works better is untested.
- **Assumption:** the sample history makes the screens feel real. *Risk:* the 12 seeded activities are invented, Oct 28–Nov 4, and will go stale. They are useful for testing, not real rep history.
- **Risk:** removing attempted-on-close means a rep who makes a call and then closes the dialog without saving leaves no record. The handoff chose this so that only intentional saves count; the cost is under-counting abandoned attempts.
- **Risk:** the `src/` files share globals and a fixed load order. Moving one script in `index.html` can break the app. Converting to ES modules is the next structural step.
- **Risk:** anonymous sign-in gives each browser its own rep. It suits a prototype test; real reps need accounts.
- **Risk (P0, Module 5 Lab 2):** an offline save is shown as done but never saved, then silently reverts on reload with no notification. A rep who loses one log will stop trusting the tool and go back to their spreadsheet. This is the Module 6 iteration sprint's one fix; do not ship until it is fixed and the kill-switch test is re-run live.
- **Risk:** the same rep in two tabs can save the same deal twice; there is no duplicate guard across tabs.
- **Comprehension debt:** the build was made with prompts, not written by hand. This PRD, the prompt chain in `03-chaining/PROMPTS.md`, and the Orbit Code Explorer in the Admin portal are the first steps in paying that debt down.

## 07 · In vs. Out of Scope

**In scope (this build):**
- Today as a compact queue: summary and progress, Highest ARR and Overdue first sorts, a selected-deal context panel, small labelled Call, Email and Log activity actions.
- Problem statement screen with the full research block: signal, hypothesis, feedback and attribution, the instruction "Work this follow-up as you normally would.", four metrics and three quotes.
- Call, Email and Log activity dialogs that save only on explicit submission, with required fields, drafts kept on cancel, one activity per save, and Undo.
- Working sidebar: Today, Activity history and Problem statement; Admin in its own group.
- Loading, empty and error states for Today and Activity history, with exact wording and Retry; forced-state controls in a Test controls area.
- Accessible dialogs, keyboard operation, screen-reader announcements, and layouts from 320px to 1366px and at 200% zoom.
- Supabase persistence with anonymous auth and row-level security.
- Admin portal: Orbit Code Explorer, with 32 nodes, search, filters, FAQ and tips, and "Show code" per node; Living PRD, Handoff and Analytics tabs.
- In-app analytics: one counts-only event per view change in Supabase (`analytics_events`), and an Admin Analytics tab with five totals and a per-screen table, read only through `get_analytics_summary()`.

**Out of scope (this build):**
- Real calls or emails. Call and Email are simulated. Nothing is sent.
- Real CRM data or a CRM link. All names, deals, and amounts are sample data.
- Real accounts. Each browser is an anonymous rep; there is no sign-in screen.
- A Deals screen. It is hidden from the sidebar until it is built.
- Attempted-on-close logging. Retired by the design handoff.
- A dark theme or theme picker.
- Version B, the dispatch-board layout. It is a separate Muse artifact, kept apart for later A/B testing. It is not in this build, not in the repo, and not on the live site.

## 08 · Engineering Recommendation

- **Front Door:** this PRD lives at `04-production/PRD.md`. The handoff note lives at `04-production/handoff-note.md`.
- **Cleanup:** done in Lab 2 — the code is split by feature into `src/`. Next: convert the classic scripts to ES modules so the load order is explicit.
- **Memory:** done — deals and activities live in Supabase with row-level security. Call and Email stay simulated in v1; the backend only stores what was saved or sent in the tool.
- **Next spike:** fix the offline-write P0 (Module 6 sprint, one fix): a write only shows as done after the server confirms it; on failure, inline error with Retry, keep the follow-up queued, never show it in Activity history, never silently roll back. Then re-run the kill-switch test live and update `05-fullstack/fullstack.md` and `06-iteration/iteration.md` with the result. After that, run the A/B test, Version A against Version B. The test plan is written. If Version B wins, move the backend to the winning layout.
- **Measure:** run `supabase/migrations/20261120000000_analytics_events.sql` in the Supabase SQL editor so the Admin Analytics tab starts counting before the A/B test; it gives Visitors, Page Views, Views Per Visit, Duration and Bounce Rate per period. It counts screens, not outcomes — the kill-switch metrics still need their own measurement.
- **Handoff:** see `04-production/handoff-note.md` for the engineer-ready summary.

---
*Module 4 · Vibe Coding Certification, the prototype is the source of truth; the spec is the output.*
