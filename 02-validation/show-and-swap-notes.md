# Show & Swap Notes — Module 2

## What I showed

https://muse.ai/s/crm-companion-today-view-v3-sxj66j1xl1xht8/ciERg6BVEzd9HjFK2jUMs-hr8TuQV3mXr07Uhi0u6Hs — CRM Companion v3, testing Hypothesis B: letting reps call or email right from the task will keep them in the CRM, so they log as they go. Kill switch: if my partner still leaves the tool to call or email, the idea fails.

## What my partner understood (in their words)

What they thought the hypothesis or kill switch was:
"If reps can call or email straight from the follow-up card, they'll stay in the CRM and log as they go, instead of working in their phone or inbox and logging afterwards (or never). Kill switch: if the reps pick a follow-up and still open their phone or email app rather than doing the call, email and log from that card, Hypothesis B has failed."

## Where they got confused / pushed back

Where the experience lost credibility:
1. "If the tester cancels the window without selecting 'save and log' button, that doesn't count towards a valid call even if the call is made and would give false metric."
2. "I wasn't sure if the left hand nav menu was intentionally disabled for the purpose of scope of testing."
3. "'If you'd still open your phone or email app instead, Hypothesis B has failed — that's the kill switch, and it's meant to be visible.' This statement should be hidden from the testers because it tells testers exactly what failure looks like: if they'd open their phone or email app instead, the hypothesis fails. That primes them toward the outcome you want. Testers who know they're being watched for leaving the CRM will stay in it, so the kill switch can't fire honestly. The instruction should be neutral ('work this follow-up as you normally would'), and the kill-switch criteria should live in the internal test plan, not on the screen."

Note: my partner did not answer the third question — did the data make you feel like you were using a real product?

## What I'll change as a result

The one change worth making after this read:
Hide the kill-switch line from the screen and replace it with a neutral instruction: "Work this follow-up as you normally would." Keep the kill-switch criteria in the internal test plan only. That is the biggest fix, because the line on screen primes the tester and the kill switch cannot fire honestly while it is there.

Two smaller fixes with it:
- If a call or email is started and then the panel is closed without "Save and log", count it as attempted, not as no call. Closing without saving should not give a false zero.
- Make it clear the left nav is out of scope for this test, with a short note on screen, so a tester does not wonder if it is broken.

## The three credibility questions (for reference)

1. What do you think the core hypothesis or kill switch was?
2. Where did the experience lose credibility?
3. Did the data make you feel like you were using a real product?
