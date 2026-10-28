import type { ConsumerCase, LadderData, LadderRule, ResponseOutcome } from '../types/case';

export const ORDERED_RUNG_IDS = [
  'prepare-evidence',
  'platform-grievance',
  'nch',
  'e-jagriti',
] as const;

export type RungId = typeof ORDERED_RUNG_IDS[number];

/**
 * Returns rules sorted in strict canonical progression.
 */
export function getPracticalLadder(data: LadderData): LadderRule[] {
  return [...data.rules].sort((a, b) => {
    const idxA = ORDERED_RUNG_IDS.indexOf(a.id as RungId);
    const idxB = ORDERED_RUNG_IDS.indexOf(b.id as RungId);
    const valA = idxA === -1 ? 999 : idxA;
    const valB = idxB === -1 ? 999 : idxB;
    return valA - valB;
  });
}

export interface NextActionRecommendation {
  nextRungId: string;
  actionTitle: string;
  reason: string;
  deadlineNotice?: {
    kind: 'statutory' | 'service_target' | 'user_reminder';
    days: number | null;
    label: string;
  };
}

/**
 * Deterministically evaluates the case state, evidence completeness,
 * and logged responses to decide the active practical step and reason.
 */
export function determineNextAction(
  consumerCase: ConsumerCase,
  rules: LadderRule[]
): NextActionRecommendation {
  if (consumerCase.status === 'resolved') {
    return {
      nextRungId: consumerCase.currentRungId || 'prepare-evidence',
      actionTitle: 'Case Resolved',
      reason: 'You have confirmed that this complaint has been satisfactorily resolved. Keep your case record preserved.',
    };
  }

  // Check evidence rung
  const hasBasicEvidence = consumerCase.evidence.some(
    (e) => e.present && (e.id.includes('invoice') || e.id === 'ev-1' || e.label.toLowerCase().includes('invoice') || e.label.toLowerCase().includes('order'))
  );

  const latestResponseEvent = [...consumerCase.events]
    .reverse()
    .find((e) => e.kind === 'response_logged');

  // If case has not yet gathered basic evidence
  if (!hasBasicEvidence && consumerCase.currentRungId === 'prepare-evidence') {
    const rule = rules.find((r) => r.id === 'prepare-evidence');
    return {
      nextRungId: 'prepare-evidence',
      actionTitle: rule?.title || 'Organise your evidence',
      reason: 'Essential transaction proof (order invoice or payment receipt) is needed before issuing a formal notice.',
    };
  }

  // If on platform grievance rung
  if (consumerCase.currentRungId === 'platform-grievance') {
    if (latestResponseEvent?.outcome === 'refused') {
      return {
        nextRungId: 'nch',
        actionTitle: 'Escalate to National Consumer Helpline (NCH)',
        reason: 'The seller or platform refused resolution. The next practical step is pre-litigation conciliation through NCH (1915).',
        deadlineNotice: {
          kind: 'service_target',
          days: 45,
          label: 'NCH typically tracks conciliation within 45 days.',
        },
      };
    }

    if (latestResponseEvent?.outcome === 'acknowledged') {
      return {
        nextRungId: 'platform-grievance',
        actionTitle: 'Await Redressal (Rule 5(5) 30-Day Window)',
        reason: 'The company acknowledged your grievance. Under Rule 5(5) of the E-Commerce Rules 2020, redressal is targeted within 1 month.',
        deadlineNotice: {
          kind: 'statutory',
          days: 30,
          label: 'Statutory redressal window: up to 1 month from receipt.',
        },
      };
    }

    if (latestResponseEvent?.outcome === 'partially_resolved') {
      return {
        nextRungId: 'platform-grievance',
        actionTitle: 'Review Partial Offer or Escalate to NCH',
        reason: 'The company offered partial relief. If this does not satisfy your rightful claim, you can lodge a grievance with NCH.',
      };
    }

    if (latestResponseEvent?.outcome === 'no_response') {
      return {
        nextRungId: 'nch',
        actionTitle: 'Escalate to National Consumer Helpline',
        reason: 'No response was received within the expected timeframe. Escalate to NCH for mediation.',
        deadlineNotice: {
          kind: 'service_target',
          days: 45,
          label: 'NCH conciliation target: 45 days.',
        },
      };
    }

    return {
      nextRungId: 'platform-grievance',
      actionTitle: 'Send Formal Notice to Grievance Officer',
      reason: 'Submit the structured complaint draft directly to the platform’s designated Grievance Officer.',
      deadlineNotice: {
        kind: 'statutory',
        days: 2,
        label: 'Statutory 48-hour acknowledgement requirement (Rule 5(4)).',
      },
    };
  }

  // If on NCH rung
  if (consumerCase.currentRungId === 'nch') {
    // Only escalate to e-Jagriti if NCH itself failed (response logged specifically on nch rung)
    if (
      latestResponseEvent?.rungId === 'nch' &&
      (latestResponseEvent?.outcome === 'refused' || latestResponseEvent?.outcome === 'no_response')
    ) {
      return {
        nextRungId: 'e-jagriti',
        actionTitle: 'Review Consumer Commission Petition on e-Jagriti',
        reason: 'Mediation through NCH did not resolve the matter. You may review formal petition filing with the District Consumer Commission via e-Jagriti.',
        deadlineNotice: {
          kind: 'statutory',
          days: 730,
          label: '2-year statutory limitation period under Section 69, CPA 2019.',
        },
      };
    }

    return {
      nextRungId: 'nch',
      actionTitle: 'Escalate to National Consumer Helpline (NCH)',
      reason: 'Register case details on consumerhelpline.gov.in or call 1915 to engage convergence mediation.',
      deadlineNotice: {
        kind: 'service_target',
        days: 45,
        label: 'Standard conciliation timeline: 45 days.',
      },
    };
  }

  // If on e-jagriti rung
  if (consumerCase.currentRungId === 'e-jagriti') {
    return {
      nextRungId: 'e-jagriti',
      actionTitle: 'Prepare Petition on e-Jagriti Portal',
      reason: 'Prepare verified index of evidence, affidavit, and consumer commission petition on e-jagriti.gov.in.',
      deadlineNotice: {
        kind: 'statutory',
        days: 730,
        label: 'Limitation clock: 2 years from date of cause of action.',
      },
    };
  }

  return {
    nextRungId: 'prepare-evidence',
    actionTitle: 'Organise your evidence',
    reason: 'Review your case facts and assemble supporting documentation.',
  };
}

/**
 * Explains why the next practical action changed after logging an outcome.
 */
export function explainOutcomeTransition(outcome: ResponseOutcome): string {
  switch (outcome) {
    case 'acknowledged':
      return 'The platform acknowledged receipt of your complaint. Awaiting formal redressal under Rule 5(5).';
    case 'resolved':
      return 'You marked the issue as resolved. Confirmation preserves this record in your archives.';
    case 'refused':
      return 'The company refused resolution. The Ladder automatically unlocks the National Consumer Helpline conciliation step.';
    case 'partially_resolved':
      return 'A partial resolution was offered. You may accept or escalate the remaining balance.';
    case 'no_response':
      return 'No response was received within the statutory or practical window. Escalating to the next authority.';
    case 'other':
      return 'Custom response logged. Review current evidence and determine whether to proceed.';
  }
}
