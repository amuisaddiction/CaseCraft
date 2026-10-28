import { describe, expect, it } from 'vitest';
import {
  determineNextAction,
  explainOutcomeTransition,
  getPracticalLadder,
} from '../src/lib/ladderEngine';
import type { ConsumerCase, LadderRule } from '../src/types/case';
import { SAMPLE_CASE } from '../src/data/sampleCase';

const mockRules: LadderRule[] = [
  {
    id: 'e-jagriti',
    title: 'Consumer Commission via e-Jagriti',
    purpose: 'Judicial remedy',
    action: 'File petition',
    sourceUrl: 'https://e-jagriti.gov.in/',
    sourceType: 'primary',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'statutory',
    deadlineDays: 730,
    caveat: 'Limitation period: 2 years.',
  },
  {
    id: 'nch',
    title: 'National Consumer Helpline',
    purpose: 'Pre-litigation conciliation',
    action: 'Lodge grievance',
    sourceUrl: 'https://consumerhelpline.gov.in/',
    sourceType: 'official_service',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'service_target',
    deadlineDays: 45,
    caveat: 'Target: 45 days.',
  },
  {
    id: 'prepare-evidence',
    title: 'Organise your evidence',
    purpose: 'Consolidate proof',
    action: 'Gather documents',
    sourceUrl: 'https://consumerhelpline.gov.in/',
    sourceType: 'official_service',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'none',
    deadlineDays: null,
    caveat: 'Preserve files.',
  },
  {
    id: 'platform-grievance',
    title: 'Contact Platform Grievance Officer',
    purpose: 'Formal notice',
    action: 'Send complaint',
    sourceUrl: 'https://consumeraffairs.nic.in/',
    sourceType: 'primary',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'statutory',
    deadlineDays: 2,
    caveat: '48h acknowledgement.',
  },
];

describe('Ladder Engine', () => {
  it('returns the practical sequence in stable, canonical order', () => {
    const ordered = getPracticalLadder({
      schemaVersion: 1,
      lastReviewedAt: '2026-10-29',
      disclaimer: 'Guidance',
      rules: mockRules,
    });
    expect(ordered.map((r) => r.id)).toEqual([
      'prepare-evidence',
      'platform-grievance',
      'nch',
      'e-jagriti',
    ]);
  });

  it('recommends preparing evidence when required invoice is missing', () => {
    const freshCase: ConsumerCase = {
      ...SAMPLE_CASE,
      currentRungId: 'prepare-evidence',
      evidence: [
        { id: 'ev-1', label: 'Tax invoice', present: false },
        { id: 'ev-2', label: 'Photos', present: false },
      ],
      events: [],
    };

    const action = determineNextAction(freshCase, mockRules);
    expect(action.nextRungId).toBe('prepare-evidence');
    expect(action.reason).toContain('Essential transaction proof');
  });

  it('recommends sending formal notice to platform grievance officer when ready', () => {
    const readyCase: ConsumerCase = {
      ...SAMPLE_CASE,
      currentRungId: 'platform-grievance',
      events: [],
    };

    const action = determineNextAction(readyCase, mockRules);
    expect(action.nextRungId).toBe('platform-grievance');
    expect(action.deadlineNotice?.kind).toBe('statutory');
    expect(action.deadlineNotice?.days).toBe(2);
  });

  it('escalates to NCH when seller refuses resolution', () => {
    const refusedCase: ConsumerCase = {
      ...SAMPLE_CASE,
      currentRungId: 'platform-grievance',
      events: [
        {
          id: 'evt-r',
          occurredAt: '2026-10-25T10:00:00.000Z',
          kind: 'response_logged',
          outcome: 'refused',
          note: 'Seller stated out-of-warranty and refused refund.',
        },
      ],
    };

    const action = determineNextAction(refusedCase, mockRules);
    expect(action.nextRungId).toBe('nch');
    expect(action.reason).toContain('refused');
    expect(action.deadlineNotice?.kind).toBe('service_target');
  });

  it('tracks 30-day redressal when platform acknowledges', () => {
    const ackCase: ConsumerCase = {
      ...SAMPLE_CASE,
      currentRungId: 'platform-grievance',
      events: [
        {
          id: 'evt-a',
          occurredAt: '2026-10-24T10:00:00.000Z',
          kind: 'response_logged',
          outcome: 'acknowledged',
          note: 'Ticket created by platform.',
        },
      ],
    };

    const action = determineNextAction(ackCase, mockRules);
    expect(action.nextRungId).toBe('platform-grievance');
    expect(action.deadlineNotice?.kind).toBe('statutory');
    expect(action.deadlineNotice?.days).toBe(30);
  });

  it('escalates from NCH to e-Jagriti when conciliation fails', () => {
    const nchFailedCase: ConsumerCase = {
      ...SAMPLE_CASE,
      currentRungId: 'nch',
      events: [
        {
          id: 'evt-nch-f',
          occurredAt: '2026-11-15T10:00:00.000Z',
          kind: 'response_logged',
          outcome: 'refused',
          rungId: 'nch',
          note: 'Convergence mediation closed as unresolved.',
        },
      ],
    };

    const action = determineNextAction(nchFailedCase, mockRules);
    expect(action.nextRungId).toBe('e-jagriti');
    expect(action.deadlineNotice?.kind).toBe('statutory');
    expect(action.deadlineNotice?.days).toBe(730);
  });

  it('generates clear explanatory copy for outcome transitions', () => {
    expect(explainOutcomeTransition('refused')).toContain('National Consumer Helpline');
    expect(explainOutcomeTransition('acknowledged')).toContain('Rule 5(5)');
    expect(explainOutcomeTransition('resolved')).toContain('resolved');
  });
});
