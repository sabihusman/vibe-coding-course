# Engineering Handoff — CRM Companion

**Product:** CRM Companion, Module 3 prototype → production transition (Module 4)
**Live prototype:** https://vibe-coding-course-weld-omega.vercel.app
**Repo main baseline:** c7514e5 (Handoff: record the live Supabase backend). This note describes the design handoff v1.0 build on top of it.
**Living PRD:** `04-production/PRD.md` — read it first. This note is the engineer-ready summary of that PRD.
**Last updated:** 2026-11-13 (design handoff v1.0 built: focused Today queue, Problem statement, intentional forms)

## What this is

CRM Companion is a rep's Today view for a CRM at 18% adoption. A rep opens Today and sees a compact queue of 6 follow-ups, sorted by ARR or overdue-first, with the selected deal's context beside it. Call, Email and Log activity open dialogs; only an explicit save records one activity and moves the deal to Updated today, and Undo reverses it. Opening or cancelling a dialog records nothing. Activity history and Problem statement (the research block, moved off Today) are sidebar destinations; Deal Detail opens from a deal. Loading, empty and error states keep their exact wording. Everything is sample data. Each browser signs in anonymously as its own rep, and its deals and activities are saved in Supabase, so work survives a reload. No real call is placed and no real email is sent.

## Frontend

- Plain HTML, CSS and JavaScript, with no build step. `index.html` is a short shell; the code lives in `src/`, grouped by feature (Lab 2 refactor). It is not a Vite / React project.
    - `src/pages/` — one folder per screen: `today/`, `problem-statement/`, `deal-detail/`, `activity-history/`, `admin/`. Each has a `*-view.js` file (the screen's markup) and its logic and styles.
  - `src/shared/data/` — `sample-deals.js`, `sample-activities.js`, and `supabase-source.js` (loads and saves through Supabase when configured).
  - `src/shared/model/` — `deals-model.js` (look-ups and counts), `queue-sort.js` (Highest ARR and Overdue first), and `activity-log.js` (save one update, Undo it).
  - `src/shared/components/` — the Call, Email and Log activity dialogs (markup and logic), `dialog.js` (focus, Escape, Cancel, drafts), `announcer.js` (screen-reader announcements), list states (loading / empty / error), toast, icons.
  - `src/app/` — navigation (with addressable views and browser Back), session state, render, sidebar, start-up (`boot.js`), and the shared and responsive styles.
  - Scripts are classic `<script>` tags loaded in a fixed order from `index.html`; they share globals, so the load order matters.
- Sidebar: Workspace — Today, Activity history, Problem statement; Admin — Admin — Code Explorer. Deals is hidden until a Deals screen exists. Each view has its own address (`#today`, `#history`, `#problem`, `#admin`, `#deal-…`).
- Today: summary line and progress, the follow-up queue with Highest ARR (default) and Overdue first sorting, a selected-deal context panel with Open deal, and Updated today with Undo.
- Dialogs: Call starts its timer only after Start simulated call and needs an outcome (Connected, No answer, Left voicemail); Email needs a subject and a message; Log activity needs a real note. One save creates one activity; the save button is disabled on first submit. Cancel, Escape, the close button or a backdrop click records nothing and keeps the draft. Focus stays inside the dialog and returns afterwards; saves, Undo and errors are announced.
- Design system: the handoff tokens in `src/app/base.css` — navy sidebar #131F32 (selected #283A59), canvas #F5F6F8, surface #FFFFFF, primary #315CE8, selected row #EEF3FF, text #172338 / #637086, divider #E4E8EF, overdue #A52E31 and updated #23705A paired with words; spacing 4–32px; radius 10px panels, 6px controls; system sans. No dark theme.
- Test controls: Data / Loading / Empty / Error switches sit in a collapsed Test controls area at the bottom of Today and Activity history. The real recovery UI (skeletons, empty, error with Retry) stays in the lists.
- Admin portal: Orbit Code Explorer with 30 nodes — CRM Companion in the centre; Today, Problem statement, Deal Detail and Activity history on the inner orbit; panels, data, states and the design system outside. Each node has a plain-language explanation, its connections, whether it is real or mocked, and a "Show code" excerpt cut from its `src/` file. Two more tabs render the Living PRD and this handoff note, with cross-links.

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
- App side: `src/shared/data/supabase-source.js` signs in, seeds, loads deals and activities, and saves every saved call, sent email, logged note and Undo. Nothing is written when a dialog is cancelled. If the load fails, Today shows the error state with Retry.
- Keys: the browser gets the project URL and the public anon key from `/api/supabase-config`, a Vercel function that reads the `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables in the Vercel project. Neither is in the repo, and no key was shared in chat. The anon key is meant to be public; row-level security is what protects the data. Never put the service_role key in the app or in Vercel. If the variables are removed, the app falls back to its in-page sample data.
- Live verification, 2026-11-13 (before the design handoff build): a fresh browser signed in anonymously, received its own 6 deals, saved a call on James Whitfield with a unique note, and reloaded. After the reload James was in Updated today, progress read 1 of 6, and the database held that call under that rep with the follow-up marked `updated_today`.
- The `activities.attempted` column stays for older rows. Since the design handoff build, the app never writes attempted rows; any from earlier sessions still show in Activity history.
- The Call and Email panels stay simulated in v1. No real call is made and no real email is sent; the backend only stores what was saved or sent in the tool.
- Version B, the dispatch-board layout, is a separate Muse artifact, not in this codebase. Do not merge it into this build without a product decision.

## Key flows

Walk these first, in this order:
1. Today → select Priya Nair in the queue → the context panel changes; nothing is saved → Open deal → Deal Detail → Back to Today.
2. Today → Sort: Overdue first → Maya and Sofia lead → Sort: Highest ARR → James first again.
3. Today → Call on James Whitfield → "Ready when you are" → Start simulated call → choose Connected → Save call & update follow-up → James moves to Updated today, progress 1 of 6. Undo → James is back at the top, progress 0 of 6.
4. Today → Email on Daniel Ortiz → clear the subject → Send → field error; nothing saved. Add a subject → Send → Updated today.
5. Today → Log activity on Priya → Cancel → nothing saved; reopen → the typed note is still there. Save a real note → Updated today.
6. Sidebar → Problem statement → every research block is there → Today → the sort, selection and progress are unchanged.
7. Sidebar → Activity history → search "James Whitfield" → select a row → Deal Detail.
8. Today and Activity history → open Test controls → force Loading, Empty and Error → check the wording and Retry.

## What's solid vs. what's duct tape

| Area | Solid / Rough | Notes |
|---|---|---|
| Today list, ARR order, 6 deals | Solid | Verified live 2026-11-10, in the exact order and amounts in the PRD |
| Call / Email / Log dialogs | Solid | Explicit save only, required fields, one activity per save, drafts kept on cancel, double-click safe; checked by `tests/acceptance-checklist.js` (handoff section 7) |
| Deal Detail and Activity History navigation | Solid | Verified live, including pre-filtered Activity History from Deal Detail and search by name and company |
| Loading / empty / error states | Solid | Exact wording verified live on both screens, Retry restores the list |
| Problem statement and navigation | Solid | The research block moved off Today intact; Today, Activity history, Problem statement and Admin are working sidebar destinations; Back works. The old kill-switch test line is on no screen |
| Accessibility and responsive | Solid | Focus kept in dialogs and returned, Escape cancels, live announcements, contrast at least 4.5:1 for text; checked at 320, 390, 768, 1024, 1366px and 200% zoom with 44px touch targets. Not checked with a real screen reader or on real devices |
| Code structure | Solid | Split by feature into `src/` in Lab 2; pixel-identical to the single-file version on every screen at desktop and phone widths. Still classic scripts with shared globals and a fixed load order, no modules or build step |
| No README inside the project | Rough | The build summary is on the computer only; PROMPTS.md is the only in-repo record of how the build was made |
| Sample data | Rough | All 6 deals and 12 activities are invented; the history dates are Oct 28–Nov 4 and will go stale |
| Backend, auth, persistence | Rough | Live in Supabase with row-level security, verified 2026-11-13. Rough because auth is anonymous (one rep per browser, no real accounts) and there are no backups, migrations tooling or monitoring set up beyond Supabase defaults |
| Tests | Rough | `tests/logic-checks.js` (data, model, sort), `tests/browser-rep-flow.js` (rep flow, Admin, phone), `tests/acceptance-checklist.js` (design handoff section 7), `tests/supabase-mode-mock.js` (Supabase path against a stand-in). Run by hand; no CI yet |

## Risks & assumptions for the team

- Do not trust the sample history as real rep behaviour. It was seeded to make the screens look real.
- Do not expect attempted entries. The attempted-on-close rule (Module 3 Refine) is retired by the design handoff: only an explicit save records an activity. A call made and then abandoned without saving leaves no record.
- Do not look for Deals. It is hidden from the sidebar until a Deals screen is built; building one is a product decision.
- Do not assume the load order is optional. The `src/` files are classic scripts that share globals; `index.html` loads them in a fixed order, and moving one can break the app. Converting to ES modules is the next structural step.
- Do not trust anonymous sign-in for real reps. It gives each browser a private sample copy, which suits a prototype test. Real reps need a sign-in screen, and anonymous users should then be switched off.
- The hypothesis is still unproven. A partner understood it exactly right in Module 2, but no A/B session has run yet. Version B exists for that test, and the test plan is written, but no tester has tried either version against the other.

## How to run it

- Open the live URL: https://vibe-coding-course-weld-omega.vercel.app — no sign-in, no setup. It is sample data only. Your browser becomes an anonymous rep, and your changes persist across reloads in that browser. Clearing site data starts a new rep.
- Or open the repo: https://github.com/sabihusman/vibe-coding-course — the live site is the root `index.html` on main. Vercel deploys main automatically, so a push to main is the go-live decision.
- To run the prompts again, read `03-chaining/PROMPTS.md` in the repo. The chain is Expand, then Behavior, then Refine. The build README (`module3-build-readme.md`) is not in the repo, per the Module 3 lab guide.
- To run the checks: `node tests/logic-checks.js` (no dependencies), and with Playwright installed, `node tests/browser-rep-flow.js`, `node tests/acceptance-checklist.js` and `node tests/supabase-mode-mock.js`.
- To rebuild the backend in a new Supabase project: run `supabase/migrations/20261113000000_crm_companion.sql` in its SQL editor, switch on anonymous sign-in under Authentication, then set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel and redeploy.
- Test reps add up: every browser, including each automated test run, creates an anonymous user with its own sample rows. Delete old anonymous users in Supabase under Authentication; their deals and activities are removed with them.
