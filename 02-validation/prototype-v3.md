# Prototype v3 — Module 2

## Build log

- Scenario: 02 — The Internal Tool Nobody Uses (locked in Module 2, no switching after M2)
- What it tests: Hypothesis B — letting reps call or email right from the task will keep them in the CRM, so they log as they go.
- Tool used: Muse
- Shareable link: https://muse.ai/s/crm-companion-today-view-v3-sxj66j1xl1xht8/ciERg6BVEzd9HjFK2jUMs-hr8TuQV3mXr07Uhi0u6Hs
- Sample data only, resets on reload.

## Real user quotes on screen (from the Context Data Pack)

- "Logging activity feels like data entry for management, not something that helps me sell." — Senior AE
- "If it could just tell me who to call next, I'd open it every morning." — SDR, occasional user
- "It's faster to keep my deals in a spreadsheet than to fight the CRM's eight required fields." — Account exec, 2 logins / month

Also on screen, from swap feedback:
- "Reps asked to do the work here, not log it after."
- Round 1: "It would be great if you could draft and send the email directly from the task to minimize the clicks."
- Round 2: "To make it really actionable it would be cool to call/email from CRM immediately."
- Round 2: "To make sure CSMs will adopt it the actions need to be taken from the CRM directly, otherwise team members are likely to not log their actions."

## Domain metrics on screen (from the Context Data Pack)

- 18% — weekly active adoption across licensed seats.
- 8 — required fields to log a single deal update.
- 11 min — average task time for "update a deal", vs. a 2-min target.
- 63% — reps keeping a shadow spreadsheet alongside the CRM.

Also on screen:
- 6 follow-ups today, $663k sample ARR in total.
- Order: James Whitfield $312k, Daniel Ortiz $148k, Priya Nair $92k, Maya Chen $54k, Sofia Reyes $38k, Aisha Bello $19k.

## Iteration log (v1 → v3)

### v1
- Change: A rep's today view, with today's follow-ups front and center and one-tap Log activity.
- Why: To test if fast logging alone would make reps log between calls.

### v2
- Change: Redesign to a dark sidebar, light content, card grid, and horizontal progress stepper. Follow-ups reordered by sample ARR, biggest first, instead of only by due date.
- Why: The first screen looked like a sketch, not a real product. And Round 1 feedback said order should weigh account importance, not just due date.

### v3
- Change: Call and Email buttons first on every card, with Log activity demoted to second choice. Call opens an in-tool panel with timer, note, and outcome. Email opens a pre-filled in-tool composer. Both are simulated, with a plain notice saying no real call or email is sent. Saving or sending logs the activity and moves the deal to Updated today. Added the Context Data Pack quotes and metrics on screen.
- Why: Both swap partners said the same thing — adoption depends on doing the work in the CRM, not logging it after. The pack quotes say the same thing in the reps' own words: logging feels like data entry, and they would open it if it told them who to call next. V3 tests that directly. If a partner still leaves the tool to call or email, the idea fails — that is the kill switch.

## Show & Swap notes

- What I showed: CRM Companion v3, testing Hypothesis B — call or email right from the task, so reps stay in the CRM and log as they go. Link above.
- What my partner understood (in their words): "If reps can call or email straight from the follow-up card, they'll stay in the CRM and log as they go, instead of working in their phone or inbox and logging afterwards (or never). Kill switch: if the reps pick a follow-up and still open their phone or email app rather than doing the call, email and log from that card, Hypothesis B has failed." They got it exactly right.
- Where they got confused / pushed back: (1) Cancelling the call/email panel without "Save and log" does not count as a call, even if the call was made — false metric. (2) Was not sure if the left nav was intentionally disabled for the test scope. (3) The kill-switch line on screen primes testers — it tells them what failure looks like, so they will stay in the CRM because they know they are being watched, and the kill switch cannot fire honestly. It should be hidden, with a neutral instruction instead.
- What I'll change as a result: Hide the kill-switch line from the screen, replace it with "Work this follow-up as you normally would", and keep the kill-switch criteria in the internal test plan only. Also count a started call/email as attempted if the panel is closed without saving, and label the left nav as out of scope for this test.

Note: my partner did not answer the third question — did the data feel like a real product?
