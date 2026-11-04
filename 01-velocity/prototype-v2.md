# Prototype v2: Two Upgrade Passes (Lab 2)

> Module 1 · Velocity. Same prototype, two surgical upgrade passes, closing the gap from toy to tool.

## Weakest section (from v1)

_Where does it look like a toy? Where would a VP of Design refuse to open it? Where does the logic feel fake? Pick the one spot that costs you the most credibility._

The first screen itself. It looked like a sketch, not a real product. Plain list, no clear hierarchy, no sidebar, no clear progress. A VP would not open it. That is why we did the design change, to a Notion, Linear, and Stripe style with a dark sidebar, a card grid, and a horizontal progress stepper.

## Upgrade paths run (pick two)

- [x] Design Match
- [ ] Add Interactivity
- [x] Surgical Refinement
- [ ] Existing Product Track

## v2 build

- **Shareable link:** https://muse.ai/s/crm-companion-today-view-xhxb64xvuxi42bb/Xz3LzvL8DBMydUOLV-UpqSR_Vz-VJKN_7a_qkCyfH1M
- **Before → after:** Plain today list sorted only by due date → on-brand dashboard with a dark sidebar, progress stepper, and card grid, ordered by sample ARR, largest first
- **What each pass changed:**
  - Design Match: Applied a Notion, Linear, and Stripe style design system to the existing prototype. Dark sidebar (#1e1e2d) with Today, Follow-ups, Updated today, and Activity navigation and live counts; light content area (#f9fafb); white cards with 8px corners, #e5e7eb borders, and 24px padding; blue primary (#3b82f6) and green success (#22c55e) accents; horizontal progress stepper across the top (Review today done, Log activity current, Schedule next step and All caught up to come); the 6 follow-ups in a 2-column grid. The old light-mode default with a dark toggle was removed, because the redesign replaces it.
  - Surgical Refinement: Changed just the ordering. It no longer sorts only by due date. It now sorts by account importance first, using sample ARR, largest first, so a big account due today outranks a small one that is overdue. Each card now shows its sample ARR, and a short line above the list explains the new order. The new order is: James Whitfield ($312k, due today), Daniel Ortiz ($148k), Priya Nair ($92k), Maya Chen ($54k, overdue), Sofia Reyes ($38k, overdue), and Aisha Bello ($19k). Undo now puts a deal back in ARR order. No filters and no deal detail panel were added. The log flow, badges, sidebar counts, stepper, Updated today list, Activity, and Undo all work as before. Sample data only, resets on reload.

## Show & Swap read, round 2

_A NEW partner, a blind read. What landed differently from v1?_

- **Feels like a real product, or a mockup?** Feels more like a real product, with a progress bar signaling completion for team members.
- **Where interactivity fell short:** This may be too advanced at this stage, but to make it really actionable it would be cool to call or email from the CRM immediately.
- **Would they show it to a VP?** Yes, because it addresses the main challenge of customer success managers and account managers, prioritizing actions on a daily basis. It makes sure no action is left undone. However, to make sure CSMs will adopt it, the actions need to be taken from the CRM directly, otherwise team members are likely to not log their actions.
