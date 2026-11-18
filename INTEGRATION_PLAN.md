# Integration Plan — CRM Companion

Module 5, Lab 1. Scanned on 2026-11-18 against `main` at `cace521` ("Design handoff v1.0: focused Today queue, Problem statement, intentional forms"). The prompt's last known main was `c7514e5`; main has moved forward by the design handoff build, and this plan uses the newer baseline.

## 1. Current status

| Area | Status | Evidence |
|---|---|---|
| Live site | Deployed | https://vibe-coding-course-weld-omega.vercel.app, Vercel deploys `main` |
| Database | Live | Supabase project `toctukiccnirfkkoaqog`; tables `deals`, `activities`, `follow_ups` (migration `supabase/migrations/20261113000000_crm_companion.sql`) |
| Auth | Live, anonymous | Supabase anonymous sign-in is on; no sign-in screen. One browser = one rep |
| Row-level security | On for all 3 tables | One policy per table, `authenticated` role only; `anon` has no table grants |
| Keys | Not in repo | `/api/supabase-config` reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Vercel env vars; service_role key never used |
| Loading / empty / error + Retry | Present | On Today and Activity history (Module 3, kept through the Module 4 refactor and the design handoff) |
| Log activity form, duplicate guard, no-activity-on-close | Already built | Shipped in the design handoff build (`cace521`), which ran before this lab. They are not gaps on current main |

## 2. Data audit — where each number on screen comes from

**From Supabase (live query)**

| Screen | Value | Source |
|---|---|---|
| Today queue rows | contact, company, sample ARR, due label, next step | `deals` (`select * order by arr desc`), per rep via `owner_id` |
| Today summary | "6 follow-ups", "2 overdue", "$663k total sample ARR" | Computed in the page from the loaded `deals` rows (count, overdue parsed from `due`, sum of `arr`) |
| Today progress, sidebar count | "n of 6 updated", count left | Computed from `follow_ups.status = 'updated_today'` |
| Updated today | each updated deal and its summary | `follow_ups` + latest non-attempted `activities` row per deal |
| Deal context panel, Deal Detail | deal fields, recent / past activity | `deals` + `activities` (by `deal_id`) |
| Activity history | every row, count line, search | `activities` joined in the page to `deals` |
| Email draft | subject and message | Built in the page from the deal's `contact`, `company`, `next_step` (not stored until sent) |

**Typed into the page (static)**

| Screen | Value | Why it is static |
|---|---|---|
| Problem statement | 18% signal, 18% / 8 / 11 min vs 2-min / 63%, Hypothesis B, swap feedback, three rep quotes, the instruction | Supplied research about the problem, not dashboard data. Moved off Today by the design handoff; it lives in `src/pages/problem-statement/problem-statement-view.js` |
| Today eyebrow | "Thursday, November 5 · Sample day" | Fixed sample-day label |
| Sidebar | "Alex Rivera · Sales representative", "Prototype workspace" notice | Sample persona; the notice text switches to "saved for this browser" when Supabase loads |
| Admin | Orbit nodes, Living PRD and Handoff tabs | Documentation of the app, not data |
| `deals.due` | "Due today", "Overdue 2 days" | Stored as text labels, so they never age. A real due date column would be needed for real use |

No displayed rep data is hardcoded without a table behind it.

## 3. Schema to add

None. Every live value already has a table. The lab guide's `Invites` table does not apply: there is no invite flow. Not adding tables for the static items above, by the standing rules.

Possible later (not this lab): a real `due_date` column to replace the text label; a `profiles` table only if real sign-in replaces the fixed "Alex Rivera" persona.

## 4. RLS rules (as live)

| Table | Policy | Rule |
|---|---|---|
| `deals` | "deals: own rows" (ALL, authenticated) | `owner_id = auth.uid()` for read and write |
| `activities` | "activities: own deals" (ALL, authenticated) | the row's deal must be owned by `auth.uid()` |
| `follow_ups` | "follow_ups: own deals" (ALL, authenticated) | the row's deal must be owned by `auth.uid()` |

Note: `authenticated` also holds Supabase's default `TRUNCATE`, `REFERENCES` and `TRIGGER` grants. `TRUNCATE` ignores RLS, but the REST API cannot issue it, so it is not reachable from the app. Revoking it is optional hardening.

## 5. Three build prompts (sequential)

1. **Schema:** audit every displayed value against the schema; add a table only for a displayed value with nothing behind it (none expected); refresh test — save a call, reload, it must survive.
2. **Auth + RLS:** keep anonymous auth; list tables, RLS and policies in the project; prove isolation with two anonymous reps in two browsers (reads and writes); record in `05-fullstack/fullstack.md`.
3. **Edge cases:** confirm loading, empty and error + Retry on Today and Activity history; run a throttled-network test and a blocked-request test; record the gaps (pagination, simultaneous edits, empty-state CTA) and fill in `fullstack.md`.

## 6. Edge cases to handle

- First visit: new anonymous rep is seeded once with 6 deals and 12 activities.
- Slow network: skeletons, no blank screen.
- Failed load: inline error with Retry; no false success; session kept.
- Bad input: required call outcome, email subject and message, real log note (already built).
- Repeated submits: one activity per save (already built).
- Same rep in two tabs at once: not handled beyond last-write-wins on `follow_ups` (see Prompt 3 / 4 findings).

## 7. Stress tests to run

- Refresh persistence: save, reload, value survives.
- Two-rep isolation: rep B cannot read or write rep A's rows.
- Throttled network: skeleton shows, then data.
- Blocked request: error + Retry, recovery after unblock, session survives.
- Repeated submit: double-click save writes one row.
