# PROMPTS.md — Living Prompt Pack, Module 3

## Chain name
CRM Companion hardening chain

## Build it tests
CRM Companion v3, Module 2. Scenario 02 — The Internal Tool Nobody Uses.
Hypothesis B: letting reps call or email right from the task will keep them in the CRM and log as they go, instead of doing the work in email and on the phone, then logging it after.
Live: https://vibe-coding-course-weld-omega.vercel.app
Main baseline: a6e7b38

Design to keep throughout: dark sidebar #1e1e2d, light content #f9fafb, white cards, 8px radius, borders #e5e7eb, blue primary #3b82f6, green success #22c55e. Same 6 sample deals, same ARR order, same stepper. Do not rebuild what already works. Do not change the hypothesis, the pack quotes, or the metrics on screen.

---

## Prompt 1 — Expand

Build the next phase of this app in a strict sequence:
1. Add a screen "Deal Detail".
2. Add a screen "Activity History".
3. Navigation: write the logic so Deal Detail links to Activity History.

Build these in order so Deal Detail is the anchor for Activity History.

Deal Detail: clicking a follow-up card on Today opens this screen for that one deal. Show company, contact, sample ARR, due date, next step, and past activity for that deal. Call and Email are first on this screen too, Log activity second, same simulated panels as Today. Saving or sending logs the activity and returns to Today with that deal in Updated today.

Activity History: a full screen listing every call, email, and log, newest first, with deal, outcome, and date. Add a search box to find a deal by name or company. Clicking a row opens that deal's Deal Detail screen. Back returns to Today.

Match the layout and spacing of the existing Today screen. Do not invent a new design system. Keep the dark sidebar, light content, white cards, and the same button styles.

---

## Prompt 2 — Behavior

Apply the following logic constraints to the Today follow-ups flow:
- Use skeleton screens for the follow-ups list loading state.
- If no data is present, show the empty state: "All caught up. No follow-ups today."
- On fetch failure, trigger the error state: "Couldn't load your follow-ups. Check your connection and try again." with a Retry button that tries loading again.

Apply the same three rules to the Activity History list, with these exact strings:
- Empty: "No activity yet. Call or email a follow-up to see it here."
- Error: "Couldn't load your activity. Check your connection and try again." with a Retry button.

Maintain the same design language throughout and tether all behavior strictly to these rules. Do not change the screens, navigation, or logic from Prompt 1.

---

## Prompt 3 — Refine

The Today screen needs a polish.
1. Start by listing the 3 biggest gaps in typography and spacing compared to the existing Today design system.
2. Once you've identified those, make this one change only: remove the kill-switch test line from the screen — "If you'd still open your phone or email app instead, Hypothesis B has failed" — and replace it with the neutral instruction "Work this follow-up as you normally would." Keep the kill-switch criteria in the internal test plan only, not on screen. Also label the left nav as out of scope for this test, with the short note "Nav is off for this test — only the follow-ups on this screen are in scope." And count a call or email as attempted if the panel is closed without "Save and log", instead of counting it as no call.

Don't change anything else in the project or touch the underlying logic, navigation, or screens from Prompts 1 and 2.

---

## What I learned
[to add after executing the chain]

## What broke
[to add after executing the chain]
