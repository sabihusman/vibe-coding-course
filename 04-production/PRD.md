# Living PRD — CRM Companion

**Product:** CRM Companion. A rep's Today view for a CRM that only 18% of reps use.
**Stage:** Prototype (Modules 1–3) → Production (Module 4)
**Owner:** Sabih Usman
**Last updated:** 2026-11-13 (design handoff v1.0 built: focused Today queue, Problem statement, intentional forms)
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main:** c7514e5
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
11. **Admin:** in its own sidebar group. Orbit Code Explorer (30 nodes, each with a "Show code" excerpt), Living PRD and Handoff, with cross-links.

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

## 05 · Technical Reality

Extracted from the prototype, what was actually built.

- **Frontend:** plain HTML, CSS and JavaScript, with no build step and no framework. `index.html` is a short shell; the code lives in `src/`, grouped by feature (Lab 2 refactor). Scripts are classic `<script>` tags loaded in a fixed order.
- **Screens:** Today, Problem statement, Deal Detail, Activity history and Admin, switched in place. Each has its own address (`#today`, `#problem`, `#history`, `#admin`, `#deal-…`), so browser Back works.
- **Call / Email / Log:** accessible dialogs with focus kept inside, Escape to cancel, and focus returned afterwards. Call and Email are simulated: no real call is made and no real email is sent.
- **Data:** 6 sample deals and 12 seeded sample activities, Oct 28–Nov 4. On the live site, each browser gets its own copy in Supabase.
- **State:** saved in Supabase for each browser's anonymous rep (project `toctukiccnirfkkoaqog`, tables `deals`, `activities`, `follow_ups`, with row-level security), so it survives a reload. Without the Supabase settings, the app falls back to in-page sample data that resets on reload.
- **Naming:** screens and functions are named for what they do — `showView`, `openDeal`, `openHistory`, `renderTodo`, `renderContext`, `sortDeals`, `completeDeal`, `undoDeal`, `openDialog`. An engineer can tell what each does from its name.
- **Separation:** sample data in `src/shared/data/`, calculations (including the sort) in `src/shared/model/`, dialogs and list states in `src/shared/components/`, one folder per screen in `src/pages/`, navigation and start-up in `src/app/`, and checks in `tests/`.
- **Documentation:** this PRD, the handoff note, the prompt chain in `03-chaining/PROMPTS.md`, and the Orbit Code Explorer. The build summary is on the computer only, per the Module 3 lab guide.
- **Gap to production:** real sign-in instead of anonymous reps, and a decision on a Deals screen.

## 06 · Assumptions & Risks

- **Assumption:** reps will do the call or email inside the CRM, instead of in their usual email or phone app. *Risk:* if they do not, a faster log screen alone will not fix adoption. That is the kill switch above.
- **Assumption:** Highest ARR is the right default order for the morning list. *Risk:* some reps work overdue items first. Overdue first is offered as a sort; which default works better is untested.
- **Assumption:** the sample history makes the screens feel real. *Risk:* the 12 seeded activities are invented, Oct 28–Nov 4, and will go stale. They are useful for testing, not real rep history.
- **Risk:** removing attempted-on-close means a rep who makes a call and then closes the dialog without saving leaves no record. The handoff chose this so that only intentional saves count; the cost is under-counting abandoned attempts.
- **Risk:** the `src/` files share globals and a fixed load order. Moving one script in `index.html` can break the app. Converting to ES modules is the next structural step.
- **Risk:** anonymous sign-in gives each browser its own rep. It suits a prototype test; real reps need accounts.
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
- Admin portal: Orbit Code Explorer, with 30 nodes, search, filters, FAQ and tips, and "Show code" per node; Living PRD and Handoff tabs.

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
- **Next spike:** run the A/B test, Version A against Version B. The test plan is written. If Version B wins, move the backend to the winning layout.
- **Handoff:** see `04-production/handoff-note.md` for the engineer-ready summary.

---
*Module 4 · Vibe Coding Certification, the prototype is the source of truth; the spec is the output.*
