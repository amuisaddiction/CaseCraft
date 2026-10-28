export interface LadderRule {
  id: string;
  title: string;
  purpose: string;
  action: string;
  sourceUrl: string;
  sourceType: 'primary' | 'secondary' | 'official_service';
  checkedOn: string | null;
  verificationStatus: 'verified' | 'needs_verification' | 'unavailable';
  deadlineKind: 'statutory' | 'service_target' | 'user_reminder' | 'none';
  deadlineDays: number | null;
  caveat: string;
}

export interface LadderData { rules: LadderRule[] }

/**
 * Conservative starter engine: only verified rules can be presented as verified.
 * This function does not calculate legal deadlines. Add explicit transition rules
 * and tests before using it to drive real case decisions.
 */
export function getPracticalLadder(data: LadderData): LadderRule[] {
  return [...data.rules].sort((a, b) => {
    const order = ['prepare-evidence', 'platform-grievance', 'nch', 'e-jagriti'];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });
}
