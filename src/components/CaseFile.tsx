import React, { useState } from 'react';
import type { ConsumerCase, EvidenceItem } from '../types/case';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Edit3,
  Plus,
  Trash2,
  Check,
  ShieldAlert,
  Building2,
  Calendar,
  IndianRupee,
  Package,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface CaseFileProps {
  consumerCase: ConsumerCase;
  onUpdateCase: (updated: ConsumerCase) => void;
  onConfirmCase: () => void;
  onBackToInput: () => void;
}

export const CaseFile: React.FC<CaseFileProps> = ({
  consumerCase,
  onUpdateCase,
  onConfirmCase,
  onBackToInput,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newFact, setNewFact] = useState('');

  // Editable local state
  const [platform, setPlatform] = useState(consumerCase.platformOrSeller || '');
  const [item, setItem] = useState(consumerCase.itemDescription || '');
  const [amount, setAmount] = useState<string>(
    consumerCase.amountInr !== null ? String(consumerCase.amountInr) : ''
  );
  const [purchaseDate, setPurchaseDate] = useState(consumerCase.purchaseDate || '');
  const [issueSummary, setIssueSummary] = useState(consumerCase.issueSummary);
  const [desiredOutcome, setDesiredOutcome] = useState(consumerCase.desiredOutcome || '');
  const [issueType, setIssueType] = useState(consumerCase.issueType);

  const handleSaveEdits = () => {
    const updated: ConsumerCase = {
      ...consumerCase,
      platformOrSeller: platform.trim() || null,
      itemDescription: item.trim() || null,
      amountInr: amount ? parseInt(amount, 10) || null : null,
      purchaseDate: purchaseDate.trim() || null,
      issueSummary: issueSummary.trim(),
      desiredOutcome: desiredOutcome.trim() || null,
      issueType,
      updatedAt: new Date().toISOString(),
    };
    onUpdateCase(updated);
    setIsEditing(false);
  };

  const handleToggleEvidence = (id: string) => {
    const updatedEvidence: EvidenceItem[] = consumerCase.evidence.map((item) =>
      item.id === id ? { ...item, present: !item.present } : item
    );
    onUpdateCase({
      ...consumerCase,
      evidence: updatedEvidence,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;
    const updatedFacts = [...consumerCase.confirmedFacts, newFact.trim()];
    onUpdateCase({
      ...consumerCase,
      confirmedFacts: updatedFacts,
      updatedAt: new Date().toISOString(),
    });
    setNewFact('');
  };

  const handleRemoveFact = (index: number) => {
    const updatedFacts = consumerCase.confirmedFacts.filter((_, i) => i !== index);
    onUpdateCase({
      ...consumerCase,
      confirmedFacts: updatedFacts,
      updatedAt: new Date().toISOString(),
    });
  };

  const readyEvidenceCount = consumerCase.evidence.filter((e) => e.present).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Folder Tab & Header */}
      <div className="flex items-end justify-between px-2 sm:px-4 gap-2">
        <div className="folder-tab px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-muted flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <FileText className="w-3.5 h-3.5 text-vermilion flex-shrink-0" />
          <span className="sm:hidden">File • {consumerCase.id}</span>
          <span className="hidden sm:inline">Case File • {consumerCase.id}</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5 pb-1">
          {consumerCase.sampleMode && (
            <span className="stamp-badge stamp-badge-vermilion text-[10px] sm:text-xs px-2 py-0.5">Sample Case</span>
          )}
          <span className="stamp-badge stamp-badge-forest text-[10px] sm:text-xs px-2 py-0.5">
            {consumerCase.status === 'resolved' ? 'Resolved' : 'Review Required'}
          </span>
        </div>
      </div>

      {/* Main Case Dossier Sheet */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        {/* Fictional Sample Case Advisory Banner */}
        {consumerCase.sampleMode && (
          <div className="mb-6 p-3.5 rounded-lg border border-amber-border bg-amber-light text-xs font-mono text-ink flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="stamp-badge stamp-badge-amber text-[10px]">Fictional Demo</span>
              <span className="text-muted leading-tight">
                This record contains simulated dispute data (boAt / Flipkart) for evaluation and testing purposes only.
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-muted uppercase tracking-wider">
              Sample Mode Active
            </span>
          </div>
        )}

        {/* Case Banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-2">
              <span className="px-2 py-0.5 rounded bg-paper border border-line font-bold text-ink">
                Case Reference: {consumerCase.id}
              </span>
              <span>•</span>
              <span>Opened: {new Date(consumerCase.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-forest font-semibold">{consumerCase.confirmedFacts.length} Confirmed Facts</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-bold tracking-tight">
              {consumerCase.itemDescription || 'Online Purchase Issue'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted mt-2">
              <span>
                Platform: <strong className="text-ink text-sm">{consumerCase.platformOrSeller || 'Unknown / Not stated'}</strong>
              </span>
              {consumerCase.amountInr !== null && (
                <>
                  <span>•</span>
                  <span>
                    Disputed Value: <strong className="text-vermilion text-sm font-bold">₹{consumerCase.amountInr.toLocaleString('en-IN')}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSaveEdits}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-forest bg-forest text-white text-xs font-mono uppercase tracking-wider hover:opacity-90 transition shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Edits</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-line bg-card hover:bg-paper text-xs font-mono uppercase tracking-wider text-ink transition shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-muted" />
                <span>Edit Case Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Missing Facts Advisory Memo */}
        {consumerCase.missingFacts.length > 0 && (
          <div className="mt-6 p-4 rounded-lg border border-amber-border bg-amber-light text-xs text-ink">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold uppercase tracking-wider text-amber font-mono mb-1 flex items-center justify-between">
                  <span>Missing Information ({consumerCase.missingFacts.length})</span>
                  <span className="text-[10px] lowercase font-normal text-muted">Strengthens your statutory claim</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-ink/80 mt-1">
                  {consumerCase.missingFacts.map((fact, idx) => (
                    <li key={idx} className="leading-relaxed">{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Fact Grid: Editable or View Mode */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-lg border border-line bg-paper/50">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              <Building2 className="w-3 h-3 text-vermilion" />
              <span>Platform / Seller</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. Flipkart, Amazon"
                className="w-full bg-card px-2.5 py-1.5 border border-line text-sm rounded outline-none focus:border-vermilion"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.platformOrSeller || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg border border-line bg-paper/50">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              <Package className="w-3 h-3 text-vermilion" />
              <span>Product / Item</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. boAt wireless headphones"
                className="w-full bg-card px-2.5 py-1.5 border border-line text-sm rounded outline-none focus:border-vermilion"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.itemDescription || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg border border-line bg-paper/50">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              <IndianRupee className="w-3 h-3 text-vermilion" />
              <span>Amount (INR)</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1499"
                className="w-full bg-card px-2.5 py-1.5 border border-line text-sm rounded outline-none focus:border-vermilion"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.amountInr !== null ? (
                  `₹${consumerCase.amountInr.toLocaleString('en-IN')}`
                ) : (
                  <span className="text-muted italic">Not specified</span>
                )}
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg border border-line bg-paper/50">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              <Calendar className="w-3 h-3 text-vermilion" />
              <span>Purchase Date</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                placeholder="e.g. 12 Oct 2026"
                className="w-full bg-card px-2.5 py-1.5 border border-line text-sm rounded outline-none focus:border-vermilion"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.purchaseDate || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg border border-line bg-paper/50">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              <Layers className="w-3 h-3 text-vermilion" />
              <span>Dispute Category</span>
            </div>
            {isEditing ? (
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full bg-card px-2.5 py-1.5 border border-line text-sm rounded outline-none focus:border-vermilion"
              >
                <option value="refund">Refund Not Received</option>
                <option value="replacement">Replacement Pending</option>
                <option value="wrong_item">Wrong Product Delivered</option>
                <option value="defective_item">Damaged / Defective Product</option>
                <option value="other">Other Issue</option>
              </select>
            ) : (
              <p className="text-sm font-semibold text-ink capitalize">
                {consumerCase.issueType.replace('_', ' ')}
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg border border-line bg-paper/50">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
              <HelpCircle className="w-3 h-3 text-vermilion" />
              <span>Desired Outcome</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="e.g. Full refund or replacement"
                className="w-full bg-card px-2.5 py-1.5 border border-line text-sm rounded outline-none focus:border-vermilion"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.desiredOutcome || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>
        </div>

        {/* Problem Summary */}
        <div className="mt-5 p-4 rounded-lg border border-line bg-paper/40">
          <span className="block text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-1.5">
            Grievance Summary
          </span>
          {isEditing ? (
            <textarea
              rows={3}
              value={issueSummary}
              onChange={(e) => setIssueSummary(e.target.value)}
              className="w-full bg-card p-3 border border-line text-sm rounded outline-none focus:border-vermilion font-sans"
            />
          ) : (
            <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">{consumerCase.issueSummary}</p>
          )}
        </div>

        {/* Confirmed Facts Section */}
        <div className="mt-8 pt-6 border-t border-line">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-serif text-lg sm:text-xl text-ink font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest" />
                Confirmed Factual Statements
              </h3>
              <p className="text-xs text-muted">
                These verifiable facts form the backbone of your formal complaint notice.
              </p>
            </div>
            <span className="text-xs font-mono text-muted px-2.5 py-1 rounded bg-paper border border-line">
              {consumerCase.confirmedFacts.length} verified facts
            </span>
          </div>

          <div className="space-y-2.5">
            {consumerCase.confirmedFacts.map((fact, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-card border border-line/80 text-xs sm:text-sm text-ink group hover:border-line-dark transition"
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-muted font-bold text-xs mt-0.5 px-1.5 py-0.5 rounded bg-paper border border-line">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="leading-relaxed">{fact}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFact(idx)}
                  className="text-muted hover:text-vermilion p-1 transition opacity-70 group-hover:opacity-100"
                  title="Remove fact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add fact form */}
          <form onSubmit={handleAddFact} className="mt-3.5 flex gap-2">
            <input
              type="text"
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              placeholder="Add another confirmed detail (e.g. Courier tracking #, specific date, customer support ticket)..."
              className="flex-1 bg-paper px-3.5 py-2 border border-line text-xs sm:text-sm rounded-md outline-none focus:border-vermilion focus:bg-card transition"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-line bg-card hover:bg-paper text-xs font-mono uppercase text-ink transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Evidence Checklist Section */}
        <div className="mt-8 pt-6 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-serif text-lg sm:text-xl text-ink font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-vermilion" />
                Evidence Checklist
              </h3>
              <p className="text-xs text-muted">
                Tick the documents and electronic records you currently hold. Unsubstantiated claims are routinely rejected during grievance review.
              </p>
            </div>
            <span className="text-xs font-mono text-muted px-2.5 py-1 rounded bg-paper border border-line self-start sm:self-auto">
              <strong className="text-forest">{readyEvidenceCount}</strong> of {consumerCase.evidence.length} ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {consumerCase.evidence.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleEvidence(item.id)}
                className={`cursor-pointer p-3.5 rounded-lg border transition flex items-start gap-3 select-none ${
                  item.present
                    ? 'border-forest-border bg-forest-light/60 text-ink shadow-xs'
                    : 'border-line bg-card text-muted hover:border-line-dark hover:bg-paper/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.present}
                  onChange={() => {}}
                  className="mt-0.5 h-4 w-4 rounded border-line text-forest focus:ring-forest cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 text-xs">
                  <span className={`font-semibold block ${item.present ? 'text-forest font-bold' : 'text-ink'}`}>
                    {item.label}
                  </span>
                  {item.note && <span className="text-muted block mt-1 leading-relaxed">{item.note}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToInput}
            className="text-xs text-muted hover:text-ink underline transition font-mono"
          >
            ← Retell or paste new story
          </button>

          <button
            type="button"
            onClick={onConfirmCase}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-vermilion text-white font-medium text-sm tracking-wide shadow-sm hover:opacity-95 active:scale-[0.99] transition"
          >
            <span>Confirm Case & View Escalation Ladder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
