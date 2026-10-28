# Test Plan

## Manual scenarios
1. Clear Hinglish complaint with platform, amount, date, and desired refund.
2. Complaint missing the order date and amount.
3. Vague complaint with no named platform.
4. Wrong-item case.
5. Defective-item case.
6. Unsupported complaint category.
7. AI returns malformed JSON.
8. AI provider returns 429 / network error.
9. User edits extracted facts before confirming.
10. User logs acknowledged, refused, partial, resolved, and no-response outcomes.
11. User refreshes and the local case remains.
12. User deletes the local case.
13. Export case summary and open the .ics file in a calendar app.
14. Use at mobile width and keyboard-only navigation.

## Expected safeguards
- Unknown facts remain unknown.
- No made-up legal clocks.
- Sample mode is visibly labelled.
- AI failure does not destroy typed text.
- No API key in client bundle.
- No external message is sent automatically.
- Case state changes only after explicit user action.

## Automated tests
- `ladderEngine.test.ts`: deterministic next-step selection and deadline-kind handling.
- `privacy.test.ts`: masks likely phone/card/account patterns without corrupting ordinary order IDs unnecessarily.
- `aiSchema.test.ts`: accepts valid output and rejects invalid values.
- `caseFlow.test.tsx`: edit facts, confirm case, log response, update ladder.
- `exportIcs.test.ts`: output has required calendar fields and valid date formatting.
