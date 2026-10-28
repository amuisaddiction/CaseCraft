# HAQ (CaseCraft) — Your complaint. Your next step.

**HAQ** helps people turn a messy online-shopping complaint into an organised case file, a source-linked practical escalation ladder, and a clear next action.

> Process guidance, not legal advice. HAQ does not file complaints automatically, guarantee outcomes, or replace a lawyer.

## MVP scope
- Voice-friendly complaint input (Wispr Flow can dictate into the text area)
- Extracted Case File with editable facts and missing-evidence checklist
- Deterministic escalation ladder backed by versioned, source-linked rules
- Draft a first complaint and follow-up messages
- Log company responses and recompute the next action
- Export a printable case summary and calendar reminders
- Local-first storage; no account required

## Start here
1. Read [`MAIN.md`](./MAIN.md) for the product brief.
2. Read [`docs/UI_UX_DESIGN.md`](./docs/UI_UX_DESIGN.md) before designing screens.
3. Read [`docs/TECH_STACK.md`](./docs/TECH_STACK.md) and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
4. Verify every legal claim in [`docs/LEGAL_SOURCE_POLICY.md`](./docs/LEGAL_SOURCE_POLICY.md) against primary sources before presenting it as authoritative.
5. Follow [`docs/BUILD_PLAN.md`](./docs/BUILD_PLAN.md) and [`docs/TEST_PLAN.md`](./docs/TEST_PLAN.md).

## Proposed stack
- Vite + React + TypeScript
- Tailwind CSS
- Small serverless API routes for AI calls (API key stays server-side)
- Gemini Flash for extraction/drafting only if the selected model and current terms/free tier are verified
- IndexedDB for local case storage
- Vitest + React Testing Library for tests
- Vercel for deployment

## Current status
This is a **project starter/specification pack**, not a completed or tested application. Do not claim a feature is implemented until it has been built and tested.

## Environment
Copy `.env.example` to `.env.local` and fill in the server-side key only after confirming the chosen model and provider terms. Never expose a secret through a `VITE_` variable.

## Required submission evidence
- Public working deployment
- Public source repository with a suitable open-source license
- Demo video under 2 minutes
- Screenshot of the Wispr Flow usage/insights card
- Clear disclosure of demo/sample data and any mocked functionality
