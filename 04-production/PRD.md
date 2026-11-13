# Living PRD — CRM Companion

**Product:** CRM Companion — a rep's Today view for a CRM at 18% adoption
**Stage:** Prototype (Modules 1–3) → Production transition (Module 4)
**Owner:** Sabih Usman
**Last updated:** 2026-11-12
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main baseline:** 8f12b0f (merge of PR #1, Module 3 completed PROMPTS.md + Email attempted fix, on top of 19fc70b live 3-screen version)
**Source of truth:** the live prototype above. This PRD is extracted from what that build actually does, not a wish list. Where the build is mocked, this PRD says so.

## Problem

Reps are expected to log every deal in the CRM, but only 18% use it weekly. The work happens in email and on the phone, and logging is extra admin after the work — 8 required fields, 11 minutes average to update a deal against a 2-minute target, 63% of reps keep a shadow spreadsheet.

Hypothesis B, validated in Module 2 and carried through Module 3: letting reps call or email right from the task will keep them in the CRM and log as they go, instead of doing the work in email and on the phone, then logging it after.

Kill switch: if a tester still opens their phone or email app instead of doing the call or email in the tool, or gets stuck more than 30 seconds on Call or Email, Hypothesis B has failed — fix the flow or pivot, do not fix the look. The kill-switch criteria live in the internal test plan only, never on screen.

## Users & jobs

**Primary user:** Sales reps, Account Executives, and Sales Development Representatives. The person on the screen in the prototype is a sample rep, Alex Rivera.

**Job to be done:** Each morning, open one screen, see who to call or email next, do the call or email right there, and have it logged without extra admin.

## Scope

**In scope — what this build actually covers:**
- Today screen: 6 follow-ups in sample ARR order ($663k total), with Call and Email first on every card, Log activity second.
- Deal Detail screen: one deal — company, contact, sample ARR, due date, next step, past activity — with Call and Email first there too.
- Activity History screen: every call, email, log, and attempted call/email, newest first, with search by name or company, and a row that opens Deal Detail.
- Simulated Call panel (timer, note, outcome Called / No answer / Met) and simulated Email panel (pre-filled draft, subject, Send).
- Loading, empty, and error states for the Today follow-ups list and the Activity History list, with the exact wording written down in PROMPTS.md.
- Attempted counting: closing a Call or Email panel without saving/sending logs an attempted entry in Activity, if the timer ran or a draft was typed. The deal stays in Follow-ups.
- Neutral on-screen instruction: "Work this follow-up as you normally would." Left nav labelled out of scope for this test.

**Out of scope — explicitly not built:**
- Real calls or emails. Both panels are simulated. Nothing is sent.
- Real CRM data or a CRM integration. All names, deals, and amounts are sample data.
- Persistence. Everything is in memory only and resets on reload.
- Auth, accounts, or multi-user support. There is no sign-in.
- Sidebar Deals and Activity tabs. They are plain text, not links, and do nothing by design in this test version.
- Version B, the dispatch-board layout. It is a separate Muse artifact, kept apart for later A/B testing. It is not in this build, not in the repo, and not on the live site.
- Supabase backend. Proposed in the handoff note, not built or connected in this prototype.

## Requirements

| Requirement | Priority | Acceptance criteria |
|---|---|---|
| Today shows 6 follow-ups in ARR order, largest first | Must | James Whitfield $312k, Daniel Ortiz $148k, Priya Nair $92k, Maya Chen $54k, Sofia Reyes $38k, Aisha Bello $19k; header "6 follow-ups today · $663k sample ARR in total" |
| Call and Email are first on every follow-up card, Log activity second | Must | On every card, Call, then Email, then Log activity; verified live 2026-11-10 |
| Call panel is simulated and logs on save | Must | Timer, note, outcome picker; "Save & log call" moves the deal to Updated today, progress 1 of 6, toast and Activity feed entry with note and duration |
| Email panel is simulated and logs on send | Must | Pre-filled draft with contact, company, and next step; "Send & log email" moves the deal to Updated today, progress increases, toast and feed entry with subject |
| Closing a Call or Email panel without saving counts as attempted | Must | "Call attempted" / "Email attempted" with "Panel closed without Save & log" / "Panel closed without Send and log" in Activity; deal stays in Follow-ups, progress does not change; only if the timer ran or a draft was typed |
| Clicking a follow-up card opens Deal Detail for that deal | Must | Company, contact, ARR, due date, next step, past activity shown; Back returns to Today |
| Activity History lists all activity, newest first, with search | Must | 12 seeded activities plus anything logged in the session; search by name or company filters the list; clicking a row opens Deal Detail; Back returns to Today |
| Today follow-ups loading, empty, and error states use exact wording | Must | Loading: skeleton card and "Loading follow-ups…"; Empty: "All caught up. No follow-ups today."; Error: "Couldn't load your follow-ups. Check your connection and try again." with Retry; Retry restores the list |
| Activity History loading, empty, and error states use exact wording | Must | Loading: skeleton rows and "Loading activity…"; Empty: "No activity yet. Call or email a follow-up to see it here."; Error: "Couldn't load your activity. Check your connection and try again." with Retry |
| Kill-switch line is not on screen | Must | No "Test it yourself" text anywhere; neutral line "Work this follow-up as you normally would." in its place, directly under the Hypothesis B strip |
| Left nav is labelled out of scope | Must | Note "Nav is off for this test — only the follow-ups on this screen are in scope." visible in the sidebar; Deals and Activity do nothing when clicked |
| Hypothesis, pack quotes, and metrics stay on screen | Should | Hypothesis B strip, 18% / 8 fields / 11 min vs 2-min target / 63%, and the three rep quotes under "What reps told us" |
| ARR numbers use tabular figures | Should | Digits line up in a column; Call and Email buttons both 8px radius, same size, Call primary filled, Email secondary outline, green #22c55e for success only |
| Test controls force each list state | Should | Data / Loading / Empty / Error controls on Today and on Activity History, so a tester can force the unhappy paths without turning off the network |
| Log activity logs without a panel | Could | Currently logs instantly on click, with no form — noted here because it was observed in the live test, not because it was specified; open question below |

## Data & events

**What gets stored — mocked, in memory only, resets on reload:**
- Deals: 6 sample deals, each with contact name, company, email, phone, sample ARR, due date / overdue status, and next step.
- Activities: 12 seeded sample activities, Oct 28–Nov 4, each with deal, type (call / email / log), outcome, detail, and date/time. Anything logged in the session is added on top, newest first.
- Session state: which deals are in Updated today, progress "x of 6", and the Activity feed. Nothing is saved to a server, a file, or a database.

**What gets tracked — events, in the page only, not sent anywhere:**
- Call started, call saved, call attempted (panel closed without saving, timer ran).
- Email opened, email sent, email attempted (panel closed without sending, draft typed or edited).
- Log activity saved.
- Deal Detail opened, Activity History opened, Activity History searched, row clicked.

**Mocked vs real:** everything above is mocked. No real call is placed, no real email is sent, no real CRM record is written, no data leaves the browser.

## Open questions

- Should "Log activity" open a panel with a note and outcome, like Call and Email, or stay instant? It currently logs with no form, which was not specified in the prompts.
- Should the sidebar Deals and Activity tabs be wired to Deal Detail / Activity History in the next version, or stay out of scope?
- Is Version B, the dispatch-board layout, the version to test next, or should Version A be tested first on its own? The A/B test plan is written (6–8 testers, each tries both, half A-first), but no session has run yet.
- What is the real backend? Supabase tables are proposed in handoff-note.md, but no Supabase project is connected, no auth is set up, and no data is persisted yet.
- How much of the sample history should survive into production? The 12 seeded activities are useful for testing, but they are invented, not real rep history.
- The live test on 2026-11-10 found one bug after the merge (Email attempted did not log) and it was fixed in the artifact and merged as 4f68201. Are there other Call/Email asymmetries that were not tested, for example Pause/Reset on the Call timer, or the No answer / Met outcomes?

## How this was built — honest under-the-hood note

- The prototype is a single self-contained HTML file (the Muse artifact `crm-companion-today-view-v3`, exported as the repo's root `index.html`). It is not a Vite / React project, so there is no `src/pages` folder to refactor in the usual sense.
- Naming: screens and functions are named for what they do — Today, Deal Detail, Activity History, `showView`, `openDeal`, `openHistory`, `renderTodo`, `renderUpdated`, `completeDeal`, `addAttempt`. An engineer can tell what each does from its name. It is not on `Component_1.tsx` naming.
- Separation: the sample data (the 6 deals and the 12 seeded activities) sits in data arrays, separate from the rendering functions, but everything lives in one file. Data logic and display logic are not in separate files, and there is no data service layer yet.
- Documentation: there is no README inside the project itself. The build summary (`module3-build-readme.md`) is on the computer only, per the Module 3 lab guide, and the prompt chain is in `03-chaining/PROMPTS.md`. That is the comprehension debt Lab 2 is meant to pay down.
