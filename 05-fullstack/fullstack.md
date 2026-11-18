# Full-Stack: Data, Access Rules, Edge Cases, Deploy

> Module 5 · Full-Stack. Add data schemas, access rules, and edge cases; stress-test and deploy.

## Deployed link

_The working, shareable link that survives real users._

_____

## Data schema

| Entity | Key fields | Notes |
|---|---|---|
| _____ | _____ | _____ |

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

| Case | Before | After |
|---|---|---|
| Empty / first-run state | _____ | _____ |
| Bad / malicious input | _____ | _____ |
| Failure / offline | _____ | _____ |

## Stress test results

_What you threw at it, and what held / broke._

_____
