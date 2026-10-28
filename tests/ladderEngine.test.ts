import { describe, expect, it } from 'vitest';
import { getPracticalLadder } from '../src/lib/ladderEngine';

describe('getPracticalLadder', () => {
  it('returns the practical sequence in stable order', () => {
    const rules = [
      { id: 'nch', title: 'NCH', purpose: '', action: '', sourceUrl: '', sourceType: 'official_service' as const, checkedOn: null, verificationStatus: 'needs_verification' as const, deadlineKind: 'none' as const, deadlineDays: null, caveat: '' },
      { id: 'prepare-evidence', title: 'Evidence', purpose: '', action: '', sourceUrl: '', sourceType: 'official_service' as const, checkedOn: null, verificationStatus: 'needs_verification' as const, deadlineKind: 'none' as const, deadlineDays: null, caveat: '' },
    ];
    expect(getPracticalLadder({ rules }).map((rule) => rule.id)).toEqual(['prepare-evidence', 'nch']);
  });
});
