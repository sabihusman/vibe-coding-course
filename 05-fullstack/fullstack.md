# Full-Stack: Data, Access Rules, Edge Cases, Deploy

> Module 5 · Full-Stack. Add data schemas, access rules, and edge cases; stress-test and deploy.

## Deployed link

**https://vibe-coding-course-weld-omega.vercel.app** — Vercel deploys `main`. Each browser signs in anonymously as its own rep, gets a private copy of the sample data, and its work is saved in Supabase, so it survives a reload. Calls and emails are simulated.

## Data schema

Supabase project `toctukiccnirfkkoaqog`. Migration: `supabase/migrations/20261113000000_crm_companion.sql`. Audited 2026-11-18: every displayed rep value comes from one of these tables, so no table was added (no `Invites` table — there is no invite flow).

| Entity | Key fields | Notes |
|---|---|---|
| `deals` | id, contact, company, arr, due, next_step, owner_id | One row per follow-up; `owner_id` is the signed-in rep. 6 sample deals, $663k. `due` is a text label ("Overdue 2 days"), so it does not age |
| `activities` | id, deal_id → deals, type (call / email / log), title, detail, date, time, attempted, created_at | One row per saved call, sent email or logged note. `attempted` is kept for older rows; the app no longer writes attempted entries |
| `follow_ups` | id, deal_id → deals (unique), status (open / updated_today), updated_at | Drives Updated today and "n of 6 updated" |
| `seed_my_sample_data()` | — | Gives a new rep their own 6 deals and 12 seeded activities, once |

Static by design (no table): the Problem statement research pack (18%, 8, 11 min vs 2-min target, 63%, quotes, Hypothesis B), the "Thursday, November 5 · Sample day" label, and the "Alex Rivera" persona. Refresh test: a saved call survived a reload and was in the database under that rep.

User counts drift upward between runs, because every fresh browser signs in as a new anonymous rep. Single-query snapshot, 2026-11-17 evening: 40 users, all anonymous, 0 regular; 39 deal owners + 1 user with no deals; 234 deals, 491 activities, 234 follow-ups.

## Access rules

_Verified 2026-11-18 in Supabase project `toctukiccnirfkkoaqog` and on the live site._

- **Auth:** Supabase anonymous sign-in, switched on. No sign-in screen and no email login, by the user's decision (2026-11-17); email login is a later step. One browser = one rep; a reload keeps the same rep.
- **Tables:** `deals`, `activities`, `follow_ups`. Row-level security is **on** for all three.
- **Policies** (one per table, for the `authenticated` role, covering read and write):

| Table | Policy | Rule |
|---|---|---|
| `deals` | deals: own rows | `owner_id = auth.uid()` |
| `activities` | activities: own deals | the row's deal has `owner_id = auth.uid()` |
| `follow_ups` | follow_ups: own deals | the row's deal has `owner_id = auth.uid()` |

- **No session:** the `anon` role has no table grants; a request without a signed-in rep is refused (401).
- **Keys:** the browser gets the project URL and public anon key from `/api/supabase-config` (Vercel env vars `SUPABASE_URL`, `SUPABASE_ANON_KEY`). No key is in the repo. The service_role key is never used.

**Isolation test (two browsers, live site):** rep A saved a call on James Whitfield. Rep B, in a separate browser with its own anonymous session, then called the API directly:

| Rep B tried to… | Result |
|---|---|
| read rep A's 6 deals by id | 0 rows |
| read rep A's activities and follow-up for James | 0 rows each |
| see rep A's call note in its own app | not present |
| insert an activity into rep A's deal | refused — "new row violates row-level security" (403) |
| create a deal owned by rep A | refused — 403 |
| update rep A's follow-up or deal, or delete rep A's deal | 0 rows affected |

Afterwards rep A's deal was unchanged in the database, with no intruding row. Rep B saw only its own 6 seeded deals.

**Minor hardening note:** the `authenticated` role keeps Supabase's default `TRUNCATE`, `REFERENCES` and `TRIGGER` grants. `TRUNCATE` ignores row-level security, but the REST API the app uses cannot issue it, so it is not reachable from the app. Revoking it is optional; no policy was changed.

## Edge cases hardened

Verified on the live site, 2026-11-18, against `main` at `cace521`.

| Case | Before | After |
|---|---|---|
| Empty / first-run state | Hard-coded sample arrays | A new rep is seeded once with 6 deals and 12 activities, so a new rep never sees an empty queue. Empty wording when forced or when everything is done: Today "All caught up. No follow-ups today."; Activity history "No activity yet. Call or email a follow-up to see it here." No "Get Started" CTA |
| Slow network (throttled, +3 s per request) | — | Today shows 3 queue-shaped skeleton rows ("Loading follow-ups"), Activity history shows skeleton rows; then the 6 rows load. No hang |
| Failure / offline (Supabase requests blocked) | — | Today shows inline "Couldn't load your follow-ups. Check your connection and try again." with Retry (role=alert, announced); progress stays "0 of 6 updated", no false success. After unblocking, Retry restored all 6 rows and the same rep's session. Activity history shows "Couldn't load your activity. Check your connection and try again." with Retry (checked with the forced Error control) |
| Bad / malicious input | Log activity saved instantly with no form | Call needs an outcome; Email needs subject and message; Log activity needs a real note. All text is HTML-escaped before display. Row-level security refuses writes into another rep's deals |
| Repeated submits, one tab | — | Save button disables on first submit and a repeated save is refused; a double-click writes one activity |
| Accidental activity | Closing Call or Email logged an "attempted" entry | Opening, cancelling or closing a dialog records nothing |

**Gaps recorded (not built in this lab):**

1. **Log activity form** — already built in the design handoff (`cace521`): note required, validation, Cancel. Not a gap on current main.
2. **Duplicate guard** — built for one tab (double-click writes one row). **Gap:** the same rep in two tabs can save the same deal twice; the live test wrote two activities for Aisha Bello.
3. **Pagination** — not present and not needed at this size: 6 deals and about 12–20 activity rows per rep fit on one screen.
4. **Last-write-wins** — `follow_ups.status` is plain last-write-wins (each save overwrites it); there is no version check or conflict message. `activities` are inserts, so simultaneous saves both land (see gap 2).
5. **Empty-state CTA** — no "Get Started" action, and a new rep never reaches the empty state because seeding always gives 6 deals.

## Stress test results

Not yet run — Lab 2 fills this in.
