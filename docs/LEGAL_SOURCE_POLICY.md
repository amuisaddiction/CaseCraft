# Legal and Process Source Policy

## Non-negotiable
The ladder must not present unverified legal claims as authoritative. This document intentionally does not certify the proposed legal clocks or legal interpretation. Verify each claim from primary/official sources before shipping.

## Source priority
1. India Code / Gazette of India / official legislation text
2. Relevant ministry or official government portal
3. Official consumer service portal documentation
4. Secondary legal commentary only as context, clearly labelled

## Candidate official starting points — verify before use
- India Code: https://www.indiacode.nic.in/
- Department of Consumer Affairs: https://consumeraffairs.nic.in/
- National Consumer Helpline: https://consumerhelpline.gov.in/
- e-Jagriti: https://e-jagriti.gov.in/

These are starting points, not proof that a specific claim has been verified. Confirm the exact page/document and save it with the rule.

## Candidate rules to investigate
- Consumer Protection (E-Commerce) Rules, 2020: grievance-officer requirements and any acknowledgement/redress timelines.
- Consumer Protection Act, 2019: limitation period and consumer commission pecuniary jurisdiction.
- National Consumer Helpline: current contact channels, hours, process, and what NCH does/does not guarantee.
- e-Jagriti: current filing process, applicable jurisdiction, documents, fees, and whether online/offline alternatives are described by official guidance.

## Rule record requirements
Every rule in `public/ladder.json` must contain:
- `id`
- concise claim / action
- exact source URL (not just a homepage if a specific document exists)
- source type
- checked date
- verification status
- applicable case types
- deadline kind: `statutory`, `service_target`, `user_reminder`, or `none`
- caveat / conditions
- reviewer initials or role

## UI language
- Use “practical next step” unless legal sources establish a mandatory sequence.
- Distinguish a statutory deadline from a service target and a user-created reminder.
- If not verified, show “Needs verification” and no countdown.
- Do not hardcode legal fees, forms, or filing requirements from unofficial sources.
- Never promise a refund, replacement, or legal win.
- Always display: “Process guidance, not legal advice.”

## Launch checklist
- [ ] Open each source and verify the exact claim.
- [ ] Record exact URL and checked date.
- [ ] Review whether the claim applies to the user's case type and amount.
- [ ] Add caveats and uncertainty in plain language.
- [ ] Have another person review the ladder copy.
- [ ] Recheck official links before submission.
