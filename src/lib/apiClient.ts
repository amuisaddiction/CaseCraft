import { parseAndValidateExtractedCase, type ExtractedCase } from './aiSchema';
import { extractCaseLocally } from './extractFallback';
import { buildComplaintDraft, type GeneratedDraft } from './draftEngine';
import { maskLikelySensitiveNumbers } from './privacy';
import type { ConsumerCase } from '../types/case';

export interface ExtractionResponse {
  extracted: ExtractedCase;
  usedAi: boolean;
  maskedComplaint: string;
  notice?: string;
}

export async function extractCaseWithFallback(
  rawComplaint: string
): Promise<ExtractionResponse> {
  const maskedText = maskLikelySensitiveNumbers(rawComplaint);

  try {
    const response = await fetch('/api/extract-case', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaintText: maskedText }),
    });

    if (response.ok) {
      const json = await response.json();
      const validation = parseAndValidateExtractedCase(json.caseData);
      if (validation.success && validation.data) {
        return {
          extracted: validation.data,
          usedAi: true,
          maskedComplaint: maskedText,
        };
      }
    }
  } catch (err) {
    console.info('Serverless AI extraction unavailable, using deterministic local engine:', err);
  }

  // Graceful deterministic fallback
  const fallbackData = extractCaseLocally(rawComplaint);
  return {
    extracted: fallbackData,
    usedAi: false,
    maskedComplaint: maskedText,
    notice: 'Parsed locally using deterministic legal and platform heuristics (no external AI key required).',
  };
}

export async function generateDraftWithFallback(
  consumerCase: ConsumerCase
): Promise<{ draft: GeneratedDraft; usedAi: boolean }> {
  try {
    const response = await fetch('/api/draft-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseData: {
          id: consumerCase.id,
          platformOrSeller: consumerCase.platformOrSeller,
          itemDescription: consumerCase.itemDescription,
          amountInr: consumerCase.amountInr,
          purchaseDate: consumerCase.purchaseDate,
          issueType: consumerCase.issueType,
          issueSummary: consumerCase.issueSummary,
          confirmedFacts: consumerCase.confirmedFacts,
          desiredOutcome: consumerCase.desiredOutcome,
        },
      }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.draft && json.draft.body) {
        const platform = consumerCase.platformOrSeller || 'E-Commerce Platform';
        const subject = json.draft.subject || `Formal Grievance: ${consumerCase.itemDescription || 'Order'}`;
        const body = json.draft.body;
        return {
          draft: {
            recipientTitle: json.draft.recipient || `Grievance Officer, ${platform}`,
            subject,
            body,
            mailtoUrl: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
          },
          usedAi: true,
        };
      }
    }
  } catch (err) {
    console.info('Serverless AI drafting unavailable, using deterministic draft engine:', err);
  }

  // Guaranteed fallback
  const localDraft = buildComplaintDraft(consumerCase);
  return {
    draft: localDraft,
    usedAi: false,
  };
}
