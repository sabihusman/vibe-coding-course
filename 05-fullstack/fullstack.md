# Full-Stack: Data, Access Rules, Edge Cases, Deploy

> Module 5 · Full-Stack. Add data schemas, access rules, and edge cases; stress-test and deploy.

## Deployed link

**https://vibe-coding-course-weld-omega.vercel.app**

Vercel deploys `main` automatically. Each browser signs in anonymously as its own rep, gets a private copy of the sample data, and its work is saved in Supabase, so it survives a reload. Calls and emails are simulated: nothing is placed or sent.

## Data schema

Supabase project `toctukiccnirfkkoaqog` (Postgres + Supabase Auth). Schema in `supabase/migrations/20261113000000_crm_companion.sql`.

| Entity | Key fields | Notes |
|---|---|---|
| `deals` | id, contact, company, arr, due, next_step, owner_id | One row per follow-up. `owner_id` is the signed-in rep. Sample data: 6 deals, $663k total ARR |
| `activities` | id, deal_id, type (call / email / log), title, detail, date, time, attempted, created_at | One row per saved call, sent email or logged note. `attempted` is kept for older rows only; the app no longer writes attempted entries |
| `follow_ups` | id, deal_id, status (open / updated_today), updated_at | One per deal; drives "Updated today" and the progress count |
| `seed_my_sample_data()` | — | Gives a new rep their own 6 deals and 12 seeded activities (Oct 28–Nov 4), once |

## Access rules

- **Who:** every visitor is a Supabase Auth user via anonymous sign-in. There is no sign-in screen; one browser = one rep, and a reload returns to the same rep.
- **Row-level security** is on for all three tables, with one policy each:
  - `deals`: a rep reads and writes only rows where `owner_id = auth.uid()`.
  - `activities` and `follow_ups`: only for deals the rep owns.
- **Anonymous (not signed in) role:** no table access at all.
- **Keys:** the browser gets the project URL and the public anon key from `/api/supabase-config`, a Vercel function reading the `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables. No key is in the repo. The anon key is meant to be public; row-level security is the boundary. The service_role key is never used in the app.
- **Checked:** on a local Postgres, a second rep saw none of the first rep's rows and a cross-rep insert was refused; the anon role was denied. Live, a rep's saved activity was stored under that rep only.

## Edge cases hardened

| Case | Before | After |
|---|---|---|
| Empty / first-run state | Hard-coded sample arrays in the page; no notion of a first visit | A new browser signs in anonymously and `seed_my_sample_data()` creates its own 6 deals and 12 activities, once. When every follow-up is updated, the queue shows "All caught up. No follow-ups today." |
| Bad / malicious input | Log activity saved instantly with no form; Email could send a blank subject | Call needs an outcome; Email needs a subject and a message; Log activity needs a real note (whitespace refused). Field errors are shown and announced. All text is HTML-escaped before display. Row-level security blocks writing to another rep's deals |
| Failure / offline | No backend, so nothing could fail | A failed load shows "Couldn't load your follow-ups. Check your connection and try again." with Retry, announced to screen readers; existing activity is kept and no false success is shown. Without the Supabase settings the app falls back to in-page sample data |
| Accidental activity | Closing a Call or Email panel logged an "attempted" entry | Opening, cancelling or closing any dialog records nothing; unsent text is kept as a draft |
| Duplicate submits | — | The save button disables on first submit and a repeated save is refused, so a double-click writes one activity. The closing dialog absorbs the second click so it cannot hit the button underneath |

## Stress test results

| What we threw at it | Result |
|---|---|
| Design handoff section 7 acceptance checklist, on the live site | 103/104 passed. The one difference is expected: live data persists across reloads instead of resetting |
| Browser rep-flow suite (rep flow, Admin tabs, sidebar, phone), on the live site | 71/71 passed |
| Logic checks (data, sort, save, Undo, duplicate guard) | 26/26 passed |
| Supabase path against an in-memory stand-in (sign-in, seed, save, reload, Undo, cancel writes nothing, error + Retry) | 19/19 passed |
| Live Supabase: cancel Call and Email, then double-click Save on a note, then reload | 0 writes on cancel; exactly 1 activity and 1 follow-up update on save; still there after reload |
| Widths 320, 390, 768, 1024, 1366px and 200% zoom | No page-wide horizontal scroll, no clipped actions, touch targets at least 44×44px |
| SonarCloud quality gate on the Lab 2 PR | Passed after fixing 11 security and reliability findings |

**What broke along the way:** double-clicking Save opened another deal's dialog underneath (fixed); the Orbit diagram's labels overlapped and hid one node (re-laid out; one node is still partly covered at 768px but reachable from the list).

**Not tested:** real phones, a real screen reader, and many concurrent users. Every test run creates an anonymous rep in Supabase; old ones should be deleted under Authentication.
