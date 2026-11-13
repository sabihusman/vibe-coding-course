# Engineering Handoff — CRM Companion

**Product:** CRM Companion, Module 3 prototype → production transition (Module 4)
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main baseline:** 872016c (merge of PR #2: Lab 2 refactor into `src/`, Supabase backend, SonarCloud fixes)
**Living PRD:** `04-production/PRD.md` — read it first. This note is the engineer-ready summary of that PRD.
**Last updated:** 2026-11-13 (Supabase backend verified live)

## What this is

CRM Companion is a rep's Today view for a CRM at 18% adoption. A rep opens one screen, sees 6 follow-ups in ARR order, and calls or emails right from the task, so the work and the log happen in the same place. Saving or sending logs the activity and moves the deal to Updated today. Closing a Call or Email panel without saving counts as attempted, if the timer ran or a draft was typed. There are two more screens, Deal Detail and Activity History, and loading, empty, and error states for both lists, with exact wording. Everything is sample data. Each browser signs in anonymously as its own rep, and its deals and activities are saved in Supabase, so work survives a reload. No real call is placed and no real email is sent.

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

**Live since 2026-11-13.** The live site reads and saves through Supabase. Verified on the live site the same day: tables, row-level security, anonymous auth, and a saved activity that persisted after a reload. The data is still sample data.

- Supabase project: `toctukiccnirfkkoaqog` (region us-west-2), Postgres with Supabase Auth. Storage is not used.
- Schema: `supabase/migrations/20261113000000_crm_companion.sql`, applied to the project. It creates:
  - `deals` — id, contact, company, arr, due, next_step, owner_id.
  - `activities` — id, deal_id, type (call / email / log), title, detail, date, time, attempted (plus created_at for ordering).
  - `follow_ups` — id, deal_id, status (open / updated_today), updated_at.
  - Row-level security is on for all three tables, with one policy each: a rep reads and writes only their own deals, and only the activities and follow-ups for those deals. The anon role has no table access.
  - `seed_my_sample_data()` — gives a signed-in rep their own copy of the 6 sample deals ($663k) and the 12 seeded activities (Oct 28–Nov 4), once.
- Auth: Supabase Auth with anonymous sign-in, switched on in the project. There is no sign-in screen (adding one would change the rep flow), so each browser becomes its own rep with a private copy of the sample data. The session is kept in the browser, so a reload returns to the same rep.
- App side: `src/shared/data/supabase-source.js` signs in, seeds, loads deals and activities, and saves every save, send, Log activity, attempt and Undo. If the load fails, Today shows the error state with Retry.
- Keys: the browser gets the project URL and the public anon key from `/api/supabase-config`, a Vercel function that reads the `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables in the Vercel project. Neither is in the repo, and no key was shared in chat. The anon key is meant to be public; row-level security is what protects the data. Never put the service_role key in the app or in Vercel. If the variables are removed, the app falls back to its in-page sample data.
- Live verification, 2026-11-13: a fresh browser signed in anonymously, received its own 6 deals, saved a call on James Whitfield with a unique note, and reloaded. After the reload James was in Updated today, the note was in the Activity feed, progress read 1 of 6, and the database held that call under that rep with the follow-up marked `updated_today`. The full browser suite (70 checks) also passed against the live site.
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
| Backend, auth, persistence | Rough | Live in Supabase with row-level security, verified 2026-11-13. Rough because auth is anonymous (one rep per browser, no real accounts) and there are no backups, migrations tooling or monitoring set up beyond Supabase defaults |
| Tests | Rough | `tests/logic-checks.js` (data and model), `tests/browser-rep-flow.js` (rep flow, Admin, phone), `tests/supabase-mode-mock.js` (Supabase path against a stand-in). Run by hand; no CI yet |

## Risks & assumptions for the team

- Do not trust the sample history as real rep behaviour. It was seeded to make the screens look real.
- Do not trust that Call and Email are symmetric. The live test found Email attempted did not log while Call attempted did; it was fixed in 4f68201, but Pause/Reset and the No answer / Met outcomes were not clicked in that test.
- Do not trust the sidebar. Deals and Activity are plain text and do nothing by design in this test version. Wiring them up is a product decision, not a bug fix.
- Do not assume the load order is optional. The `src/` files are classic scripts that share globals; `index.html` loads them in a fixed order, and moving one can break the app. Converting to ES modules is the next structural step.
- Do not trust anonymous sign-in for real reps. It gives each browser a private sample copy, which suits a prototype test. Real reps need a sign-in screen, and anonymous users should then be switched off.
- The hypothesis is still unproven. A partner understood it exactly right in Module 2, but no A/B session has run yet. Version B exists for that test, and the test plan is written, but no tester has tried either version against the other.

## How to run it

- Open the live URL: https://vibe-coding-course-weld-omega.vercel.app — no sign-in, no setup. It is sample data only. Your browser becomes an anonymous rep, and your changes persist across reloads in that browser. Clearing site data starts a new rep.
- Or open the repo: https://github.com/sabihusman/vibe-coding-course — the live site is the root `index.html` on main (2144688). Vercel deploys main automatically, so a push to main is the go-live decision.
- To run the prompts again, read `03-chaining/PROMPTS.md` in the repo. The chain is Expand, then Behavior, then Refine. The build README (`module3-build-readme.md`) is not in the repo, per the Module 3 lab guide.
- To run the checks: `node tests/logic-checks.js` (no dependencies), and with Playwright installed, `node tests/browser-rep-flow.js` and `node tests/supabase-mode-mock.js`.
- To rebuild the backend in a new Supabase project: run `supabase/migrations/20261113000000_crm_companion.sql` in its SQL editor, switch on anonymous sign-in under Authentication, then set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel and redeploy.
- Test reps add up: every browser, including each automated test run, creates an anonymous user with its own sample rows. Delete old anonymous users in Supabase under Authentication; their deals and activities are removed with them.
