# Engineering Handoff — CRM Companion

**Product:** CRM Companion, Module 3 prototype → production transition (Module 4)
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main baseline:** 2144688 (Update main SHA references to 6d44ccf; add sidebar hide/show toggle)
**Living PRD:** `04-production/PRD.md` — read it first. This note is the engineer-ready summary of that PRD.
**Last updated:** 2026-11-13 (Module 4 Lab 2: refactor done; Supabase backend written but not yet applied — see Backend / data)

## What this is

CRM Companion is a rep's Today view for a CRM at 18% adoption. A rep opens one screen, sees 6 follow-ups in ARR order, and calls or emails right from the task, so the work and the log happen in the same place. Saving or sending logs the activity and moves the deal to Updated today. Closing a Call or Email panel without saving counts as attempted, if the timer ran or a draft was typed. There are two more screens, Deal Detail and Activity History, and loading, empty, and error states for both lists, with exact wording. Everything is sample data, in memory only, and resets on reload. No real call is placed, no real email is sent, and nothing is saved to a server.

## Frontend

- Plain HTML, CSS and JavaScript, with no build step. `index.html` is a short shell; the code lives in `src/`, grouped by feature (Lab 2 refactor). It is not a Vite / React project.
  - `src/pages/` — one folder per screen: `today/`, `deal-detail/`, `activity-history/`, `admin/`. Each has a `*-view.js` file (the screen's markup) and a logic file.
  - `src/shared/data/` — `sample-deals.js`, `sample-activities.js`, and `supabase-source.js` (loads and saves through Supabase when configured).
  - `src/shared/model/` — `deals-model.js` (look-ups and counts) and `activity-log.js` (complete, undo, attempted).
  - `src/shared/components/` — the Call panel, Email panel, Log activity, list states (loading / empty / error), toast, icons.
  - `src/app/` — navigation, session state, render, sidebar, start-up (`boot.js`), and the shared and responsive styles.
  - Scripts are classic `<script>` tags loaded in a fixed order from `index.html`; they share globals, so the load order matters. Every screen renders pixel-identical to the single-file version.
- Three screens in one page, switched in place: Today, Deal Detail, Activity History. Navigation is by clicking a follow-up card, a row in Activity History, the Activity feed card, or Back.
- Call and Email open simulated panels over the page. Log activity currently logs instantly, with no panel — see Open questions in the PRD.
- Design system: dark sidebar #1e1e2d, light content #f9fafb, white cards, 8px radius, borders #e5e7eb, blue primary #3b82f6, green success #22c55e for success only. ARR numbers use tabular figures.
- Test controls: Data / Loading / Empty / Error buttons on Today and on Activity History, so a tester can force each list state without turning off the network.
- Admin portal: Orbit Code Explorer, built 2026-11-12 in the Muse artifact after Module 4 Lab 1. An "Admin" entry in the sidebar opens an orbit map of the app: CRM Companion in the centre, Today, Deal Detail, and Activity History orbiting it, with 27 nodes for the panels, data, states, and design system. Clicking a node shows a plain-language explanation, what it connects to, and whether it is real or mocked, plus a "Show code" toggle with a short excerpt of that node's actual code and the `src/` file it lives in. Search with jump-to chips, All / Screens / Panels / Data / States filters, a "How to read this" intro, and FAQ and tips are on the same page. Two more tabs render the Living PRD and this handoff note. The rep flow is untouched.

## Backend / data

**Not live yet. Do not trust any backend claim about this prototype.** The Supabase schema and the app's Supabase code are written and tested, but they have not been applied to the project, and the live site still runs on in-page sample data.

- Supabase project: `toctukiccnirfkkoaqog` (region us-west-2). Reachable and healthy on 2026-11-13. Its database is still empty: the migration below has not been run against it.
- Schema: `supabase/migrations/20261113000000_crm_companion.sql`. It creates:
  - `deals` — id, contact, company, arr, due, next_step, owner_id.
  - `activities` — id, deal_id, type (call / email / log), title, detail, date, time, attempted (plus created_at for ordering).
  - `follow_ups` — id, deal_id, status (open / updated_today), updated_at.
  - Row-level security on all three: a rep reads and writes only their own deals, and only activities and follow-ups for those deals. The anon role has no table access.
  - `seed_my_sample_data()` — gives a signed-in rep their own copy of the 6 sample deals ($663k) and the 12 seeded activities (Oct 28–Nov 4), once.
  - Tested on a local Postgres 2026-11-13: seeding, a second rep seeing none of the first rep's rows, and a cross-rep write being refused all behaved as intended. Not yet tested on the real project.
- Auth: anonymous sign-in. There is no sign-in screen (adding one would change the rep flow), so each browser becomes its own rep with a private copy of the sample data. Anonymous sign-in must be switched on in the project (Authentication → Sign In / Providers → Anonymous). It is currently off.
- App side: `src/shared/data/supabase-source.js` signs in, seeds, loads deals and activities, and saves every save, send, Log activity, attempt and Undo. Tested against an in-memory stand-in (`tests/supabase-mode-mock.js`): a saved call persists after a reload. Not yet tested against the real project.
- Keys: the browser gets the project URL and the public anon key from `/api/supabase-config`, a Vercel function that reads the `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables. No key is in the repo. Until those variables are set in Vercel, the app falls back to the in-page sample data, exactly as before. Never put the service_role key in the app or in Vercel's public settings.
- The Call and Email panels stay simulated in v1. No real call is made and no real email is sent; the backend only stores what was attempted, saved, or sent in the tool.
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
| Code structure | Solid | Split by feature into `src/` in Lab 2; pixel-identical to the single-file version on every screen at desktop and phone widths. Still classic scripts with shared globals and a fixed load order, no modules or build step |
| No README inside the project | Rough | The build summary is on the computer only; PROMPTS.md is the only in-repo record of how the build was made |
| Log activity | Rough | Logs instantly with no panel or form; not specified in the prompts, and not tested against a form-based flow |
| Sample data | Rough | All 6 deals and 12 activities are invented; the history dates are Oct 28–Nov 4 and will go stale |
| Backend, auth, persistence | Duct tape | Schema, row-level security and app code are written and tested locally, but not applied to the Supabase project. The live site is still in-memory only and resets on reload |
| Tests | Rough | `tests/logic-checks.js` (data and model), `tests/browser-rep-flow.js` (rep flow, Admin, phone), `tests/supabase-mode-mock.js` (Supabase path against a stand-in). Run by hand; no CI yet |

## Risks & assumptions for the team

- Do not trust the sample history as real rep behaviour. It was seeded to make the screens look real.
- Do not trust that Call and Email are symmetric. The live test found Email attempted did not log while Call attempted did; it was fixed in 4f68201, but Pause/Reset and the No answer / Met outcomes were not clicked in that test.
- Do not trust the sidebar. Deals and Activity are plain text and do nothing by design in this test version. Wiring them up is a product decision, not a bug fix.
- Do not assume the load order is optional. The `src/` files are classic scripts that share globals; `index.html` loads them in a fixed order, and moving one can break the app. Converting to ES modules is the next structural step.
- Do not trust anonymous sign-in for real reps. It gives each browser a private sample copy, which suits a prototype test. Real reps need a sign-in screen, and anonymous users should then be switched off.
- The hypothesis is still unproven. A partner understood it exactly right in Module 2, but no A/B session has run yet. Version B exists for that test, and the test plan is written, but no tester has tried either version against the other.

## How to run it

- Open the live URL: https://vibe-coding-course-weld-omega.vercel.app — no sign-in, no setup. It is sample data only and resets on reload.
- Or open the repo: https://github.com/sabihusman/vibe-coding-course — the live site is the root `index.html` on main (2144688). Vercel deploys main automatically, so a push to main is the go-live decision.
- To run the prompts again, read `03-chaining/PROMPTS.md` in the repo. The chain is Expand, then Behavior, then Refine. The build README (`module3-build-readme.md`) is not in the repo, per the Module 3 lab guide.
- To run the checks: `node tests/logic-checks.js` (no dependencies), and with Playwright installed, `node tests/browser-rep-flow.js` and `node tests/supabase-mode-mock.js`.
- To turn on the backend: (1) run `supabase/migrations/20261113000000_crm_companion.sql` in the Supabase SQL editor for project `toctukiccnirfkkoaqog`; (2) switch on anonymous sign-in under Authentication; (3) in Vercel, under Project → Settings → Environment Variables, add `SUPABASE_URL` (the project URL) and `SUPABASE_ANON_KEY` (the anon public key from Supabase Project Settings → API), then redeploy. Do not claim it is live until the tables, auth, and a persisted activity have been checked on the live site.
