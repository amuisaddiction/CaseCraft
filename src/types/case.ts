export type CaseStatus =
  | 'draft'
  | 'needs_review'
  | 'ready'
  | 'waiting'
  | 'resolved'
  | 'closed';

export type ResponseOutcome =
  | 'acknowledged'
  | 'resolved'
  | 'refused'
  | 'partially_resolved'
  | 'no_response'
  | 'other';

export interface EvidenceItem {
  id: string;
  label: string;
  present: boolean;
  note?: string;
  requiredForRungId?: string;
}

export interface CaseEvent {
  id: string;
  occurredAt: string;
  kind:
    | 'case_created'
    | 'draft_created'
    | 'message_sent_by_user'
    | 'response_logged'
    | 'rung_changed'
    | 'note'
    | 'resolved_confirmed';
  outcome?: ResponseOutcome;
  note?: string;
  rungId?: string;
}

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
  evidence: EvidenceItem[];
  currentRungId: string | null;
  events: CaseEvent[];
  rawComplaint?: string;
  draftMessage?: string;
  followUpReminderDate?: string | null;
}

export interface LadderData {
  schemaVersion: number;
  lastReviewedAt: string | null;
  disclaimer: string;
  rules: LadderRule[];
}
