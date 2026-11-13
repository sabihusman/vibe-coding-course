# Engineering Handoff — CRM Companion

**Product:** CRM Companion, Module 3 prototype → production transition (Module 4)
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main baseline:** 8f12b0f (merge of PR #1, Module 3 completed PROMPTS.md + Email attempted fix)
**Living PRD:** `04-production/PRD.md` — read it first. This note is the engineer-ready summary of that PRD.
**Last updated:** 2026-11-12

## What this is

CRM Companion is a rep's Today view for a CRM at 18% adoption. A rep opens one screen, sees 6 follow-ups in ARR order, and calls or emails right from the task, so the work and the log happen in the same place. Saving or sending logs the activity and moves the deal to Updated today. Closing a Call or Email panel without saving counts as attempted, if the timer ran or a draft was typed. There are two more screens, Deal Detail and Activity History, and loading, empty, and error states for both lists, with exact wording. Everything is sample data, in memory only, and resets on reload. No real call is placed, no real email is sent, and nothing is saved to a server.

## Frontend

- A single self-contained HTML file: the Muse artifact `crm-companion-today-view-v3`, exported as the repo's root `index.html` (61,707 bytes at main 19fc70b; Email attempted fix in 4f68201). It is not a Vite / React project, so there is no `src/pages` folder.
- Three screens in one page, switched in place: Today, Deal Detail, Activity History. Navigation is by clicking a follow-up card, a row in Activity History, the Activity feed card, or Back.
- Call and Email open simulated panels over the page. Log activity currently logs instantly, with no panel — see Open questions in the PRD.
- Design system: dark sidebar #1e1e2d, light content #f9fafb, white cards, 8px radius, borders #e5e7eb, blue primary #3b82f6, green success #22c55e for success only. ARR numbers use tabular figures.
- Test controls: Data / Loading / Empty / Error buttons on Today and on Activity History, so a tester can force each list state without turning off the network.
- Admin portal: Orbit Code Explorer, built 2026-11-12 in the Muse artifact after Module 4 Lab 1. An "Admin" entry in the sidebar opens an orbit map of the app: CRM Companion in the centre, Today, Deal Detail, and Activity History orbiting it, with 27 nodes for the panels, data, states, and design system. Clicking a node shows a plain-language explanation, what it connects to, and whether it is real or mocked, plus a "Show code" toggle with a short excerpt of that node's actual code from the single index.html file. Search with jump-to chips, All / Screens / Panels / Data / States filters, a "How to read this" intro, and FAQ and tips are on the same page. The rep flow is untouched.

## Backend / data

**Not built yet. Do not trust any backend claim about this prototype.**

- There is no backend, no database, and no auth in the live build. All data is hard-coded sample data in the page: 6 deals and 12 seeded activities, Oct 28–Nov 4, plus anything logged in the session, held in memory only.
- Proposed Supabase backend, to be set up as the next step, not claimed as live:
  - `deals` — id, contact_name, company, email, phone, sample_arr, due_date, next_step, owner_id.
  - `activities` — id, deal_id, type (call / email / log / attempt), outcome, detail, duration_seconds, created_at, owner_id.
  - `follow_ups` — id, deal_id, status (open / updated_today), updated_at, owner_id. Or derive this from activities; do not build both unless the query needs it.
  - Auth: Supabase Auth, one account per rep, with row-level security so a rep sees only their own deals and activities.
  - The Call and Email panels stay simulated in v1. Do not wire them to a real phone or email service until the product decision is made. The backend only needs to store what was attempted, saved, or sent in the tool.
- Version B, the dispatch-board layout, is a separate Muse artifact, not in this codebase. Do not merge it into this build without a product decision.

## Key flows

Walk these first, in this order:
1. Today → click James Whitfield's card → Deal Detail → Back to Today.
2. Today → Call on James Whitfield, save with a note → deal moves to Updated today, progress 1 of 6, Activity feed shows the call.
3. Today → Email on Daniel Ortiz, send the pre-filled draft → deal moves to Updated today, progress 2 of 6.
4. Today → open a Call panel, close it without saving after the timer runs → "Call attempted" in Activity, deal stays in Follow-ups. Do the same for Email, with a typed draft → "Email attempted".
5. Activity History → search "James Whitfield" → 2 activities → click a row → Deal Detail → Back to Today.
6. Today and Activity History → use the Data / Loading / Empty / Error controls → check the skeleton, the empty message, and the error message with Retry, in the exact wording in the PRD.

## What's solid vs. what's duct tape

| Area | Solid / Rough | Notes |
|---|---|---|
| Today list, ARR order, 6 deals | Solid | Verified live 2026-11-10, in the exact order and amounts in the PRD |
| Call / Email panels, save and send | Solid | Verified live; Call attempted and Email attempted both verified after the 4f68201 fix |
| Deal Detail and Activity History navigation | Solid | Verified live, including pre-filtered Activity History from Deal Detail and search by name and company |
| Loading / empty / error states | Solid | Exact wording verified live on both screens, Retry restores the list |
| Kill-switch line removed, neutral instruction, nav labelled out of scope | Solid | Verified live; no "Test it yourself" text anywhere |
| Single-file structure | Rough | Everything in one HTML file; data arrays are separate from rendering, but there are no separate files for screens, components, or data |
| No README inside the project | Rough | The build summary is on the computer only; PROMPTS.md is the only in-repo record of how the build was made |
| Log activity | Rough | Logs instantly with no panel or form; not specified in the prompts, and not tested against a form-based flow |
| Sample data | Rough | All 6 deals and 12 activities are invented; the history dates are Oct 28–Nov 4 and will go stale |
| Backend, auth, persistence | Duct tape | None exists. In-memory only, resets on reload. The Supabase tables above are proposed, not built |

## Risks & assumptions for the team

- Do not trust the sample history as real rep behaviour. It was seeded to make the screens look real.
- Do not trust that Call and Email are symmetric. The live test found Email attempted did not log while Call attempted did; it was fixed in 4f68201, but Pause/Reset and the No answer / Met outcomes were not clicked in that test.
- Do not trust the sidebar. Deals and Activity are plain text and do nothing by design in this test version. Wiring them up is a product decision, not a bug fix.
- Do not assume the single file will scale. The next refactor should split it by feature before adding a backend, or the data and display logic will tangle further.
- The hypothesis is still unproven. A partner understood it exactly right in Module 2, but no A/B session has run yet. Version B exists for that test, and the test plan is written, but no tester has tried either version against the other.

## How to run it

- Open the live URL: https://vibe-coding-course-weld-omega.vercel.app — no sign-in, no setup. It is sample data only and resets on reload.
- Or open the repo: https://github.com/sabihusman/vibe-coding-course — the live site is the root `index.html` on main (8f12b0f). Vercel deploys main automatically, so a push to main is the go-live decision.
- To run the prompts again, read `03-chaining/PROMPTS.md` in the repo. The chain is Expand, then Behavior, then Refine. The build README (`module3-build-readme.md`) is not in the repo, per the Module 3 lab guide.
- To set up the backend, create a Supabase project, create the three tables above, turn on Auth and row-level security, and replace the in-page data arrays with reads from those tables. Do not claim it is live until the tables, auth, and a persisted activity have been checked on the live site.
