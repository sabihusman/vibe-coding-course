# PROMPTS.md — Living Prompt Pack, Module 3

## Chain name
CRM Companion hardening chain

## Build it tests
CRM Companion v3, Module 2. Scenario 02 — The Internal Tool Nobody Uses.
Hypothesis B: letting reps call or email right from the task will keep them in the CRM and log as they go, instead of doing the work in email and on the phone, then logging it after.
Live: https://vibe-coding-course-weld-omega.vercel.app
Main baseline: 19fc70b (Module 3 live site merged 2026-11-10 evening)

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
2. Once you've identified those, make only these changes, and nothing else:
- Keep the Hypothesis B strip, the pack quotes, and the metrics exactly as they are. Remove only the paragraph starting "Test it yourself" and ending "Hypothesis B has failed", and replace it in the same place, directly under the hypothesis strip, with "Work this follow-up as you normally would." Keep the kill-switch criteria in the internal test plan only, not on screen.
- Label the left nav as out of scope for this test, with the short note "Nav is off for this test — only the follow-ups on this screen are in scope."
- Call and Email buttons: both 8px radius, same size. Call is primary filled, Email is secondary outline. Green #22c55e stays only for success, the stepper and success states, not as an action color.
- ARR numbers use tabular figures, so digits line up in a column.
- This is the one logic change allowed: if a Call or Email panel is closed without "Save and log", and the timer ran or a draft was typed, count it as attempted in Activity. Do not move the deal to Updated today.

Do not add new data, do not add a last-message field, and do not change anything else in the project or touch any other logic.

Note: the lab guide's finished Prompt 3 ("resize the headers and update the kill-switch test line to match") does not say any of this. It does not say to remove the line, what to replace it with, or to label the nav, count an attempt, or fix the buttons. Do not use that version — use the prompt above, which is the one that was actually run.

---

## What I learned
- Naming the exact element stops the AI touching the rest.
- Passing the README as context keeps the chain consistent.
- Hard-coding the exact empty and error strings is what separates a mockup from a product.
- Audit first, then act — listing the gaps before fixing them keeps a Refine prompt to one change.
- Chain order matters: Expand, then Behavior, then Refine. Running Refine first meant checking later that its changes survived the next two prompts.
- A prompt that says "do not touch the underlying logic" and then asks for a logic change will contradict itself. Name the one logic change allowed, in the prompt.

## What broke
- The lab guide's Prompt 3 was too vague to run as written. "Resize the headers and update the kill-switch test line to match" does not say to remove the line, what to replace it with, or to fix the nav, the attempted count, or the buttons. Fix: rewrote it with the exact line to remove, the exact replacement, and the exact place it goes.
- The copyable Refine prompt from the design-system mockup contradicted itself in 5 places, and Claude Code flagged them before anything was applied: "do not show any hypothesis text" would have removed the whole Hypothesis B strip; counting a closed panel as attempted is a logic change, against a "no logic changes" line; showing the contact's last message needs new data, which the prompt forbade; Email could not be both 8px and fully rounded; "no second accent" conflicted with green #22c55e. Fix: kept the strip, named the attempted count as the one logic change allowed, dropped the last-message idea, set both buttons to 8px, and kept green for success only.
- Live-site test after the merge found an Email attempted bug: closing a Call panel without saving logged "Call attempted", but closing an Email panel without sending logged nothing. Fix: made Email match Call — a typed or edited draft closed without "Send and log" now logs "Email attempted" in Activity, and the deal stays in Follow-ups. Fixed in the Muse artifact 2026-11-10 evening; not yet pushed to the live site at the time this file was updated.
- Module 2 was built with one big prompt plus fixes after, so the loading, empty, and error wording was never written down. Chaining fixed that — Prompt 2 writes the exact strings down, and the test controls force each state.
- Show and Swap of the prompts was not done in this lab. No partner feedback on the prompts is recorded here.
