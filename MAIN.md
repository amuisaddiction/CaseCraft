# HAQ — Main Product Brief

## One-line pitch
HAQ turns a consumer's messy spoken complaint into a clear case file, a source-linked escalation plan, and a trackable next action.

## The problem
When an online order is wrong, defective, or not refunded, people often have screenshots and a long story—but not a clear, organised next step. They may not know what information to preserve, whom to contact next, or how to follow up when a company replies.

## Target user
An Indian consumer dealing with an online-purchase refund, replacement, wrong-item, or defective-item issue. MVP scope is intentionally narrow.

## Core workflow
1. **Tell the story:** user speaks naturally in Hinglish or types. Wispr Flow is an external voice-input method; HAQ must also work with typing.
2. **Build the Case File:** extract platform/company, order/item, purchase and complaint dates, amount, issue, desired outcome, and missing evidence. All extracted facts remain editable.
3. **Show the Ladder:** a deterministic rules engine selects practical next steps from a versioned rules file. Each step includes source URL, checked date, confidence/status, required evidence, and a suggested action.
4. **Draft:** generate a complaint/follow-up draft from confirmed case facts. Never invent facts or legal claims.
5. **Follow through:** user logs a response such as acknowledged, resolved, refused, partially resolved, or no response. The ladder recalculates.
6. **Export:** printable case summary/PDF and optional calendar reminder (.ics).

## Signature feature: The Ladder + Follow-through
The main product value is not the letter itself. It is remembering what happened, showing the next practical step, and preserving a timeline so the user does not have to reconstruct the case every time.

## MVP boundaries
### In
- Online shopping only: refund, replacement, wrong item, defective item
- Local-first case storage
- One case at a time is acceptable for the first release
- Editable extraction result
- Source-linked, deterministic rules
- Draft, copy, mailto link
- Response log, printable export, ICS reminders
- Clear sample mode when AI is unavailable

### Out
- Automatic filing or sending
- WhatsApp Business API
- Payments, subscriptions, accounts, social feeds
- Lawyer matching or legal representation
- Guarantees about results
- Complex legal-fee calculators
- Claims that an AI model verifies the law
- Additional complaint categories until the core scope works

## Product principles
- Voice-first, not voice-only.
- Evidence before escalation.
- Never fabricate a date, deadline, contact, law, or company policy.
- Let the user correct facts before drafting.
- Keep a visible source and verification status for every legal/process claim.
- Do not imply that a suggested sequence is legally mandatory unless a primary source explicitly says so.
- Be useful without an AI key: show a clearly labelled sample case or allow manual entry.
- Privacy-first: mask likely phone/card/account identifiers before any external AI request; tell users what leaves the device.

## Success criteria for the hackathon
- A judge can complete the main flow without an account.
- One complaint can move from raw text to editable case, ladder, draft, response log, and export.
- The app distinguishes verified rules from unverified guidance.
- No critical user action silently fails.
- Demo clearly shows Wispr Flow dictation being used naturally.
