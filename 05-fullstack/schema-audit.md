# Schema audit — Module 5, Lab 1 (Prompt 2)

Run 2026-11-18 against `main` at `cace521` and the live Supabase project `toctukiccnirfkkoaqog`.

**Result: no schema change.** Every displayed rep value already comes from a table. No migration was added. No `Invites` table: there is no invite flow.

## Live values

| Screen | Displayed value | Table · columns | Relationship |
|---|---|---|---|
| Today queue | contact, company, sample ARR, due label, next step | `deals` · contact, company, arr, due, next_step | `deals.owner_id` = signed-in rep |
| Today summary | follow-up count, overdue count, total sample ARR | `deals` · computed in the page (count, `due` parsed for "Overdue", sum of `arr`) | same rows as the queue |
| Today progress, sidebar count | "n of 6 updated", count left | `follow_ups` · status | `follow_ups.deal_id` → `deals.id` |
| Updated today | updated deal and its summary | `follow_ups` · status + latest `activities` row | `activities.deal_id` → `deals.id` |
| Deal context panel | deal fields, recent activity | `deals` + `activities` · type, title, detail, date, time | by `deal_id` |
| Deal Detail | deal fields, past activity | `deals` + `activities` | by `deal_id` |
| Activity history | rows, count, search by name/company | `activities` joined to `deals` in the page | by `deal_id` |

## Static values (typed in, by design)

| Screen | Value | Why no table |
|---|---|---|
| Problem statement | 18%, 8, 11 min vs 2-min target, 63%, Hypothesis B, swap feedback, three quotes, the instruction | Research context about the problem, not data |
| Today | "Thursday, November 5 · Sample day" | Fixed sample-day label |
| Sidebar | "Alex Rivera · Sales representative" | Sample persona; reps are anonymous, so there is no name to store |
| Admin | Orbit, Living PRD, Handoff | Documentation |

Note: `deals.due` stores labels ("Due today", "Overdue 2 days"), so they do not age day to day. A real date column would be needed for production use.

## Refresh test (live site)

| Step | Result |
|---|---|
| Fresh browser → anonymous rep `fb1f82d1-…`, 6 deals seeded | progress "0 of 6 updated" |
| Call on Daniel Ortiz → Start simulated call → Connected → note → Save | Daniel moved to Updated today |
| Reload the page | progress "1 of 6 updated", Daniel still in Updated today, not back in the queue |
| Database | one `activities` row for Daniel (call, Connected, the note) and `follow_ups.status = updated_today`, under that rep |

The value survived the refresh, so it is not hardcoded.
