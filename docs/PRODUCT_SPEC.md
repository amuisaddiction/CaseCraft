# Product Requirements

## User stories
1. As a consumer, I can tell my complaint in my own words so I don't need to know legal terminology.
2. I can review and correct extracted facts before any draft is prepared.
3. I can see which evidence is missing before contacting anyone.
4. I can see a source-linked practical next step and understand why it is suggested.
5. I can draft a message from confirmed facts without fabricated details.
6. I can record a response and get an updated next action.
7. I can export a record of my case and create a reminder.
8. I can use the app without an AI key through manual entry or a clearly labelled sample.

## Acceptance criteria
- AI extraction never directly submits a complaint.
- Missing facts are represented as `null`/unknown, not guessed.
- Every extracted field can be edited.
- Ladder engine is deterministic and unit tested.
- No legal countdown appears unless the underlying rule has been verified.
- A sample case is visibly labelled “Sample — not a real complaint”.
- A failed API call produces a helpful message and manual fallback.
- User can delete a saved case locally.
- Export contains source links, creation/update dates, and disclaimer.
- No secret appears in browser bundles or git history.
