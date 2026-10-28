# HAQ UI/UX Design System — “The Case File”

## Art direction
A tactile, editorial case file—not a generic AI dashboard. Warm paper, dark ink, and one vermilion rubber-stamp accent. Confident typography, generous whitespace, purposeful asymmetry, and small physical-feeling interactions.

### Avoid
- Purple/blue gradient backgrounds
- Generic chat bubbles as the primary UI
- Sidebar-heavy admin dashboards
- Fake legal badges or fake success metrics
- Over-animation that delays or blocks the workflow
- Fake microphone recording if the browser is only receiving Wispr-dictated text

## Visual tokens
- Paper: `#F6F1E8`
- Card/paper white: `#FFFCF6`
- Ink: `#211F1C`
- Muted ink: `#6E685F`
- Hairline: `#D9D0C3`
- Vermilion: `#C8462D`
- Soft green only for genuine resolved states: `#426B55`
- Display font: Fraunces (or a system serif fallback)
- Body font: a clean sans such as Inter
- Metadata: a readable mono such as IBM Plex Mono

Use accessible contrast. Accent colour is not the only way to communicate status.

## Screen 1 — Tell me what happened
- Small HAQ wordmark and a compact privacy note.
- One large folder-tab / document surface with the prompt: “Tell me what happened.”
- A large text area with a natural-language example in Hinglish.
- Hint: “Use Wispr Flow to dictate, or type here.”
- Primary action: “Build my case file”.
- Secondary action: “Try a sample case”.
- No long form before the user tells the story.
- Clear note: “Review every detail before using a draft.”

## Screen 2 — Case File
- Case ID, created date, issue label, and current status.
- Extracted fields: seller/platform, item, amount, purchase date, complaint date, issue, desired outcome.
- Every field editable; uncertain/missing fields visibly marked.
- Evidence checklist: order confirmation, invoice/payment proof, product photos/video, prior correspondence, refund/replacement policy.
- “Confirm case details” action before the Ladder.
- A short “What leaves this device?” privacy explanation before external AI processing.

## Screen 3 — The Ladder (primary screen)
- Vertical sequence of 3–4 practical rungs, not a progress dashboard.
- Each rung displays: why it is next, what to prepare, action, official/source link, source status, checked date, and relevant clock only if a verified rule supports it.
- Make it clear this is a practical suggested sequence, not automatically a legally mandatory order.
- Use “No statutory deadline verified” rather than inventing a countdown.
- Distinguish statutory deadlines, service-level targets, and HAQ follow-up reminders.
- CTA: “Prepare message” / “Log a response”.
- Rung states: ready, waiting, response received, completed, needs review.
- No fake urgency countdowns.

## Screen 4 — Log what happened
- Quick choices: Acknowledged / Resolved / Refused / Partly resolved / No response yet / Other.
- Optional response date, notes, and pasted/dictated reply.
- Never mark a case resolved just because the user selected “resolved” without a confirmation step.
- Recompute the next action and show a concise explanation of why.

## Screen 5 — Draft and export
- Editable message with recipient and subject where known.
- Copy, open email draft (`mailto:`), print/save as PDF, download `.ics`.
- Never auto-send or auto-file.
- Mark sample drafts and sample case data clearly.
- Include sources and process-guidance disclaimer in exports.

## Motion and micro-interactions
- The case sheet can “stamp in” after facts are confirmed.
- A rung may unlock with a restrained tactile transition.
- Use reduced-motion preferences and keep transitions under roughly 250 ms.
- Never delay a primary action for animation.
- Use subtle focus, hover, pressed, and success states.

## Responsive rules
- Mobile-first; one column at narrow widths.
- Main action reachable without horizontal scrolling.
- Ladder rungs become stacked cards on mobile.
- Keep labels readable and tap targets comfortably sized.
- Support keyboard navigation, visible focus, semantic headings, and reduced motion.

## Copy tone
Calm, direct, respectful, non-threatening. Avoid “We will win your case”, “guaranteed refund”, “legal notice generated”, or “the law says” unless directly supported by a verified source.
