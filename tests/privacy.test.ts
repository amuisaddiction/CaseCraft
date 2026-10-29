import { describe, expect, it } from 'vitest';
import { getRedactionSummary, maskLikelySensitiveNumbers } from '../src/lib/privacy';

describe('Privacy Masking Utility', () => {
  it('masks Indian 10-digit mobile numbers with various prefixes', () => {
    expect(maskLikelySensitiveNumbers('My phone is 9876543210 call me')).toBe(
      'My phone is [PHONE REDACTED] call me'
    );
    expect(maskLikelySensitiveNumbers('Contact +91 98765 43210 now')).toBe(
      'Contact [PHONE REDACTED] now'
    );
    expect(maskLikelySensitiveNumbers('Reached at 08765432109')).toBe(
      'Reached at [PHONE REDACTED]'
    );
  });

  it('masks payment card numbers', () => {
    expect(maskLikelySensitiveNumbers('Paid using 4111 2222 3333 4444')).toBe(
      'Paid using [CARD REDACTED]'
    );
    expect(maskLikelySensitiveNumbers('Card: 5500-0000-0000-0004')).toBe(
      'Card: [CARD REDACTED]'
    );
  });

  it('masks Aadhaar patterns and email addresses', () => {
    expect(maskLikelySensitiveNumbers('UID 2345 6789 0123 submitted')).toBe(
      'UID [ID REDACTED] submitted'
    );
    expect(maskLikelySensitiveNumbers('Contact rahul.sharma@example.com for info')).toBe(
      'Contact [EMAIL REDACTED] for info'
    );
  });

  it('masks UPI IDs', () => {
    expect(maskLikelySensitiveNumbers('Refund to user@oksbi please')).toBe(
      'Refund to [UPI REDACTED] please'
    );
  });

  it('preserves amounts and non-card order numbers', () => {
    const text = 'Ordered phone for Rs 14999 on 12 Oct. Order ID is OD8827161.';
    expect(maskLikelySensitiveNumbers(text)).toBe(text);
  });

  it('reports transparent redaction summary', () => {
    const original = 'My number is 9876543210 and email test@gmail.com';
    const redacted = maskLikelySensitiveNumbers(original);
    const summary = getRedactionSummary(original, redacted);
    expect(summary.hadRedactions).toBe(true);
    expect(summary.redactedTypes).toContain('Phone number');
    expect(summary.redactedTypes).toContain('Email address');
  });
});

