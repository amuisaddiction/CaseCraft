export type CaseStatus = 'draft' | 'needs_review' | 'ready' | 'waiting' | 'resolved' | 'closed';
export type ResponseOutcome = 'acknowledged' | 'resolved' | 'refused' | 'partially_resolved' | 'no_response' | 'other';

export interface ConsumerCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  sampleMode: boolean;
  issueType: 'refund' | 'replacement' | 'wrong_item' | 'defective_item' | 'other';
  platformOrSeller: string | null;
  itemDescription: string | null;
  amountInr: number | null;
  purchaseDate: string | null;
  complaintDate: string | null;
  issueSummary: string;
  desiredOutcome: string | null;
  confirmedFacts: string[];
  missingFacts: string[];
  currentRungId: string | null;
}
