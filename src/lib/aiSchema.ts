import { z } from 'zod';

export const ExtractedCaseSchema = z.object({
  issueType: z.enum(['refund', 'replacement', 'wrong_item', 'defective_item', 'other']),
  platformOrSeller: z.string().nullable(),
  itemDescription: z.string().nullable(),
  amountInr: z.number().nonnegative().nullable(),
  purchaseDate: z.string().nullable(),
  complaintDate: z.string().nullable(),
  issueSummary: z.string().min(1),
  desiredOutcome: z.string().nullable(),
  confirmedFacts: z.array(z.string()),
  missingFacts: z.array(z.string()),
});

export type ExtractedCase = z.infer<typeof ExtractedCaseSchema>;
