# Iteration — Module 6

> Module 6 · Read your product analytics, then run one AI-driven iteration sprint.
> Product: CRM Companion — "Do the work here, not log it after."
> Live: https://vibe-coding-course-weld-omega.vercel.app
> Repo: sabihusman/vibe-coding-course · main, last known `cace521`

## What the analytics say (Lab 1)

There is no built-in analytics panel in this product, so this is the no-numbers path: behaviour counted directly, not metrics invented.

### Behaviour counted

| Signal | How it was read | What was seen |
|---|---|---|
| First run | Walk the core flow as a stranger, count the places you had to think | 0 pauses on the core flow when online: Today → Call/Email → Save → Updated today. The pauses were all in the test setup, not the flow. |
| Reach | Peers who replied on the product thread | No Module 6 cohort replies recorded yet. The only peer feedback on record is the Module 2 show-and-swap partner (Nov 10) and the other-AI design audit (Nov 12) — see Peer feedback below. |
| Core action | Of those, how many got through the main flow unprompted | Module 2 partner: understood Hypothesis B and the kill switch exactly right, and worked the follow-ups as instructed. No real reps have used the live app in real work yet — all live usage to date is test reps. |
| Stall point | The screen or control more than one person stopped on | Today, before the design handoff: the research block (hypothesis, metrics, quotes) dominated the screen and pushed the follow-ups down. Fixed in the design handoff, live on main `cace521` — research moved to Problem statement, Today is now a compact queue. |
| Explained away | Anything that had to be explained in the thread | The kill-switch line on screen had to be explained to the test partner — it primed testers. Removed in Module 3; replaced with "Work this follow-up as you normally would." |

### Usage data (Supabase, not product analytics)

No visitors, page views, or bounce rate exist — there is no analytics tool wired in, and the live users to date are test reps, not real reps. The counts below are database counts, not usage metrics, and must not be read as adoption.

- Single-query snapshot, 2026-11-17 evening: 40 users, all anonymous, 0 regular; 39 deal owners + 1 user with no deals; 234 deals, 491 activities, 234 follow-ups. Counts drift upward between runs because every fresh browser signs in as a new anonymous rep.
- Module 5 Lab 2 stress tests, run 2026-11-17 evening on the live site: spam-click held (5 rapid saves on James Whitfield wrote exactly 1 activity); ghost user held (fresh browser gets its own anonymous rep with the 6 seeded deals, $663k, straight into Today — no sign-in gate, no "Get Started" CTA, never blank); kill-switch FAILED — P0, see below.

### What the evidence says

- **Primary signal:** the offline write. It maps directly to the M2 hypothesis — "reps stay in the CRM and log as they go" only works if a log actually lands.
- **What moved:** the core flow works when online. Call/Email first on every card, save moves the deal to Updated today, Activity History records it, and the two-browser isolation test passed (rep B got 0 rows, writes refused 403).
- **What didn't:** the write path under stress. Acting on a follow-up while offline shows it as done — including in Activity history — but the write never reaches Supabase. After reconnecting and reloading, the follow-up is back in the queue with no notification at either point.

### The three audit questions

- **Which feature is the ghost:** the empty states. A new rep never sees one, because seeding always gives 6 deals — and there is no "Get Started" CTA on them. Built, but unreachable.
- **Where do users drop off:** there is no real drop-off data yet — no real reps have used it. The only observed drop is the offline write silently vanishing.
- **Does the behaviour confirm or contradict the M2 problem statement:** neither yet. The hypothesis is unproven with real reps. The product does what the hypothesis asks for when online; it breaks the trust the hypothesis depends on when offline.

## Peer feedback (Lab 1)

No Module 6 cohort replies are recorded yet — do not invent any. What is on record:

- **Module 2 swap partner, Nov 10:** (1) cancelling without "Save and log" does not count as a valid call — a false metric; (2) left-nav disabled status unclear; (3) the kill-switch line on screen primes testers — hide it, keep the criteria in the internal test plan only. Q3 (did the data feel real?) was not answered. All three were acted on in Module 3.
- **Other-AI design audit, Nov 12:** research block dominates Today; Log activity logs instantly with no form; opening/closing Call records an attempted call; large cards slow scanning; overdue tasks rank below larger ARR. The whole handoff was built and merged as main `cace521` (Problem statement screen, compact queue, intentional forms, no-activity-on-close).

## Iteration sprint (Lab 2)

Problem statement: sales reps log only 18% of their work in the CRM, because logging feels like data entry for management — they do the work in their email and phone apps and log later, or not at all.

Hypothesis (M2, Hypothesis B): let reps call or email right from the task. Outcome: reps stay in the CRM and log as they go.

### Strategic ranking (top 3, by likely impact)

1. **Offline write silently lost (P0).** A rep who acts offline is told the work is done, then finds it undone with no warning. That breaks the exact trust the hypothesis needs — a rep who loses one log will go back to their spreadsheet. Highest impact, and already proven live by the user.
2. **Two-tab duplicate save.** The same rep in two tabs can save the same deal twice (live test wrote two activities for Aisha Bello). Same family as #1 — a write that should happen once, happening twice.
3. **Ghost empty states.** No "Get Started" CTA, and a new rep never reaches the empty state because seeding always gives 6 deals. Lowest impact — it only matters once real reps with zero follow-ups exist.

### The one finding (picked)

**#1 — the offline write.** One finding, not three.

| Change | Hypothesis | Result | Recommendation |
|---|---|---|---|
| Write path: only show a follow-up as done after the server confirms it; on failure show an inline error with Retry, keep it queued, never show it in Activity history; never silently roll back — tell the user what was lost | If a rep can trust that "done" means saved, they will do the work inside the tool instead of their spreadsheet | Not yet shipped — the fix prompt is drafted, not yet sent to Claude Code. After it lands, the user re-runs the kill-switch test live: go offline, act on a follow-up (must show the error and stay queued), reconnect, Retry (must save), reload (must stay saved) | **Iterate** — do not ship until the P0 is fixed and re-tested. The Module 5 verdict (do-not-ship) stands until then. |

### Evidence that justifies the call

Lab 2 kill-switch test, run by the user on 2026-11-17 evening with real DevTools offline on their laptop: acting on a follow-up while offline showed it as done, including in Activity history, but the write never reached Supabase; after reconnecting and reloading, the follow-up was back in the queue with no notification at either point. The earlier browser test only checked page loading while offline, not saving while offline — the user's real test caught the write path it missed. Spam-click and ghost-user tests held in the same run.

### Demo link (redeployed URL)

https://vibe-coding-course-weld-omega.vercel.app

No redeploy has happened for this sprint yet — the fix is not built. The link above is the current live site on main `cace521`. It will be re-tested on the same link after the fix deploys.

### The one-sentence story

CRM Companion is a rep's today view: do the call or email here, and it logs itself as you go.

### Where it landed on the Confidence Line (M2 → now)

Value risk: still open — no real reps have used it in real work, so Hypothesis B is unproven. Usability risk: partly closed — the core flow works online, and the design handoff fixed the Today screen. Trust risk: opened by the P0 — a log that silently vanishes is worse than a log that never happened.

### Primary signal (from Lab 1)

- **What moved:** the core flow online, the compact Today queue, the two-browser isolation test, spam-click and ghost-user holding.
- **What didn't:** the offline write (P0), the two-tab duplicate, the unreachable empty states.
- **Peer feedback:** Module 2 partner's three points (all acted on) and the other-AI design audit (built as `cace521`). No Module 6 cohort replies recorded yet.
