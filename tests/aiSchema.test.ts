import { describe, expect, it } from 'vitest';
import { parseAndValidateExtractedCase } from '../src/lib/aiSchema';
import { extractCaseLocally } from '../src/lib/extractFallback';
import { buildComplaintDraft } from '../src/lib/draftEngine';
import { SAMPLE_CASE } from '../src/data/sampleCase';

describe('AI Schema & Validation', () => {
  it('accepts valid extraction JSON', () => {
    const raw = {
      issueType: 'refund',
      platformOrSeller: 'Flipkart',
      itemDescription: 'Shoes',
      amountInr: 2499,
      purchaseDate: '2026-10-10',
      complaintDate: null,
      issueSummary: 'Refund not received after return pickup.',
      desiredOutcome: 'Full refund of ₹2,499',
      confirmedFacts: ['Returned shoes on 10 Oct'],
      missingFacts: [],
    };
    const result = parseAndValidateExtractedCase(raw);
    expect(result.success).toBe(true);
    expect(result.data?.platformOrSeller).toBe('Flipkart');
  });

  it('rejects invalid JSON structure', () => {
    const raw = {
      issueType: 'invalid_issue_type',
      issueSummary: '',
    };
    const result = parseAndValidateExtractedCase(raw);
    expect(result.success).toBe(false);
  });
});

describe('Deterministic Fallback Extractor', () => {
  it('extracts platform, amount, and issue type from Hinglish text', () => {
    const text = 'Maine Amazon se ek jacket order kiya tha for Rs 3500. Galat product deliver hua hai.';
    const result = extractCaseLocally(text);
    expect(result.platformOrSeller).toBe('Amazon');
    expect(result.amountInr).toBe(3500);
    expect(result.issueType).toBe('wrong_item');
    expect(result.confirmedFacts.length).toBeGreaterThan(0);
  });

  it('leaves unknown facts as null without fabrication', () => {
    const text = 'Mera order deliver nahi hua please help.';
    const result = extractCaseLocally(text);
    expect(result.platformOrSeller).toBeNull();
    expect(result.amountInr).toBeNull();
    expect(result.purchaseDate).toBeNull();
    expect(result.missingFacts).toContain('Seller or platform name not identified in complaint text.');
    expect(result.missingFacts).toContain('Transaction amount not mentioned.');
  });
});

describe('Draft Message Generator', () => {
  it('builds a factual draft without inventing details', () => {
    const draft = buildComplaintDraft(SAMPLE_CASE);
    expect(draft.recipientTitle).toBe('Flipkart Grievance Officer');
    expect(draft.recipientEmail).toBe('grievance-officer@flipkart.com');
    expect(draft.subject).toContain('boAt wireless headphones');
    expect(draft.body).toContain('Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020');
    expect(draft.mailtoUrl).toBeDefined();
    expect(draft.mailtoUrl).toContain('mailto:grievance-officer@flipkart.com');
  });
});

