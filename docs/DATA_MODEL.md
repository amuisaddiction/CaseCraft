# Data Model (TypeScript sketch)

```ts
export type CaseStatus =
  | "draft"
  | "needs_review"
  | "ready"
  | "waiting"
  | "resolved"
  | "closed";

export type ResponseOutcome =
  | "acknowledged"
  | "resolved"
  | "refused"
  | "partially_resolved"
  | "no_response"
  | "other";

export interface ConsumerCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  sampleMode: boolean;
  issueType: "refund" | "replacement" | "wrong_item" | "defective_item" | "other";
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
}

export interface EvidenceItem {
  id: string;
  label: string;
  present: boolean;
  note?: string;
}

export interface CaseEvent {
  id: string;
  occurredAt: string;
  kind: "draft_created" | "message_sent_by_user" | "response_logged" | "rung_changed" | "note";
  outcome?: ResponseOutcome;
  note?: string;
}

export interface LadderRule {
  id: string;
  title: string;
  purpose: string;
  action: string;
  sourceUrl: string;
  sourceType: "primary" | "secondary" | "official_service";
  checkedOn: string | null;
  verificationStatus: "verified" | "needs_verification" | "unavailable";
  deadlineKind: "statutory" | "service_target" | "user_reminder" | "none";
  deadlineDays: number | null;
  caveat: string;
}
```

This is a contract sketch, not a substitute for implementation-level validation. Use runtime schema validation for external AI output.
