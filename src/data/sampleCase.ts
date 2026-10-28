import type { ConsumerCase } from '../types/case';

export const SAMPLE_COMPLAINT_TEXT =
  'Maine 12 Oct ko Flipkart se boAt wireless headphones order kiya tha for Rs 1499. Box me damaged headphone nikla jisme left earcup completely broken tha. Same day customer support me replacement request dali. Unhone 3 din me replace karne ka promise kiya but 10 din ho gaye koi courier nahi aaya aur Flipkart app me request silently cancelled show kar raha hai. Maine support se chat kiya but bot keh raha hai return window expired. Mujhe ya to replacement chahiye ya full refund.';

export const SAMPLE_CASE: ConsumerCase = {
  id: 'HAQ-2026-0842',
  createdAt: '2026-10-22T10:30:00.000Z',
  updatedAt: '2026-10-24T14:15:00.000Z',
  status: 'ready',
  sampleMode: true,
  issueType: 'defective_item',
  platformOrSeller: 'Flipkart',
  itemDescription: 'boAt wireless headphones',
  amountInr: 1499,
  purchaseDate: '2026-10-12',
  complaintDate: '2026-10-12',
  issueSummary: 'Received defective headphones with broken left earcup. Replacement promised within 3 days but cancelled without courier pickup. Return window incorrectly marked expired.',
  desiredOutcome: 'Replacement unit or full refund of ₹1,499',
  confirmedFacts: [
    'Ordered boAt wireless headphones on Flipkart on 12 Oct 2026 for ₹1,499.',
    'Product arrived damaged with broken left earcup.',
    'Replacement request logged on 12 Oct 2026 with 3-day resolution commitment.',
    'No courier pickup occurred; replacement request marked cancelled on platform.',
  ],
  missingFacts: [
    'Original order ID / invoice number not yet recorded.',
    'Name or contact details of third-party seller if applicable.',
  ],
  evidence: [
    { id: 'ev-1', label: 'Order confirmation & Tax invoice', present: true, note: 'PDF downloaded from Flipkart app' },
    { id: 'ev-2', label: 'Photos / Unboxing video of damaged headphone', present: true, note: 'Clear photos of broken left earcup with packaging' },
    { id: 'ev-3', label: 'Screenshots of initial replacement request (12 Oct)', present: true, note: 'Shows 3-day resolution target' },
    { id: 'ev-4', label: 'Screenshot of silent cancellation status', present: true, note: 'Shows cancelled without customer consent' },
    { id: 'ev-5', label: 'Customer care chat transcript with bot', present: false, note: 'Need to export chat screenshot from Help section' },
  ],
  currentRungId: 'platform-grievance',
  events: [
    {
      id: 'evt-1',
      occurredAt: '2026-10-22T10:30:00.000Z',
      kind: 'case_created',
      note: 'Case file initialized from Hinglish dictation.',
    },
    {
      id: 'evt-2',
      occurredAt: '2026-10-22T11:00:00.000Z',
      kind: 'rung_changed',
      rungId: 'prepare-evidence',
      note: 'Organised invoice and broken earcup photos.',
    },
    {
      id: 'evt-3',
      occurredAt: '2026-10-23T09:15:00.000Z',
      kind: 'draft_created',
      note: 'Formal escalation email drafted to Flipkart Grievance Officer.',
    },
    {
      id: 'evt-4',
      occurredAt: '2026-10-24T14:15:00.000Z',
      kind: 'response_logged',
      outcome: 'acknowledged',
      note: 'Customer support sent automated ticket #FLK-99281 saying they are looking into it.',
      rungId: 'platform-grievance',
    },
  ],
  rawComplaint: SAMPLE_COMPLAINT_TEXT,
  draftMessage: `To: Flipkart Grievance Officer (grievance-officer@flipkart.com)
Subject: Formal Grievance: Damaged boAt headphones & unauthorised cancellation of replacement — Order ID needed

Dear Grievance Officer,

I am writing regarding my purchase of boAt wireless headphones ordered on 12 October 2026 for ₹1,499.

1. Issue Summary:
Upon delivery, the product was found physically damaged (the left earcup is broken). On the same date (12 October 2026), I lodged a replacement request through the Flipkart app. Your support team committed to a resolution within 3 days.

2. Unresolved Escalation:
No courier pickup was attempted. Instead, after 10 days, the replacement ticket was silently marked as cancelled on the application without my consent. When attempting to raise the issue again, the automated support system rejected the request claiming the return window has expired.

3. Evidence Maintained:
I have preserved the tax invoice, photographic proof of the broken product and packaging, and timestamped screenshots of both the initial request and the subsequent cancellation.

4. Relief Requested:
I request immediate arrangement of courier pickup and either:
(a) Dispatch of an undamaged replacement unit, or
(b) A full refund of ₹1,499 to the original payment method.

Kindly provide a formal written response and complaint docket number within 48 hours as per Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020.

Yours sincerely,
[Your Name]
[Your Contact Phone & Email]`,
  followUpReminderDate: '2026-10-27',
};
