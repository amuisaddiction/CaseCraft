import { z } from 'zod';

export const IssueTypeSchema = z.enum([
  'refund',
  'replacement',
  'wrong_item',
  'defective_item',
  'other',
]);

export const ExtractedCaseSchema = z.object({
  issueType: IssueTypeSchema.default('other'),
  platformOrSeller: z.string().trim().min(1).nullable(),
  itemDescription: z.string().trim().min(1).nullable(),
  amountInr: z.union([z.number().nonnegative(), z.null()]).default(null),
  purchaseDate: z.string().trim().min(1).nullable().default(null),
  complaintDate: z.string().trim().min(1).nullable().default(null),
  issueSummary: z.string().trim().min(1, 'Issue summary cannot be empty'),
  desiredOutcome: z.string().trim().min(1).nullable().default(null),
  confirmedFacts: z.array(z.string().trim().min(1)).default([]),
  missingFacts: z.array(z.string().trim().min(1)).default([]),
});

export type ExtractedCase = z.infer<typeof ExtractedCaseSchema>;

export const DraftMessageSchema = z.object({
  recipient: z.string().trim().default('Platform Grievance Officer'),
  subject: z.string().trim().min(1),
  body: z.string().trim().min(1),
  statutoryCitations: z.array(z.string()).default([]),
});

export type DraftMessage = z.infer<typeof DraftMessageSchema>;

export function parseAndValidateExtractedCase(rawJson: unknown): {
  success: boolean;
  data?: ExtractedCase;
  error?: string;
} {
  try {
    const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
    const result = ExtractedCaseSchema.safeParse(parsed);
    if (result.success) {
      return { success: true, data: result.data };
    }
    const issueMessages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    return { success: false, error: issueMessages };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
