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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Folder Tab & Header */}
      <div className="flex items-end justify-between px-2 sm:px-4">
        <div className="folder-tab px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-muted flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-vermilion" />
          <span>Case File • {consumerCase.id}</span>
        </div>
        <div className="flex items-center gap-2 pb-1">
          {consumerCase.sampleMode && (
            <span className="stamp-badge stamp-badge-vermilion">Sample Case</span>
          )}
          <span className="stamp-badge stamp-badge-forest">
            {consumerCase.status === 'resolved' ? 'Resolved' : 'Review Required'}
          </span>
        </div>
      </div>

      {/* Main Case Sheet */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        {/* Case Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-1">
              <span>Case Reference: {consumerCase.id}</span>
              <span>•</span>
              <span>Opened: {new Date(consumerCase.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
              {consumerCase.itemDescription || 'Online Purchase Issue'}
            </h2>
            <p className="text-xs font-mono text-muted mt-1">
              Platform: <strong className="text-ink">{consumerCase.platformOrSeller || 'Unknown / Not stated'}</strong>
              {consumerCase.amountInr !== null && (
                <> • Disputed Value: <strong className="text-ink">₹{consumerCase.amountInr.toLocaleString('en-IN')}</strong></>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSaveEdits}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-forest bg-forest text-white text-xs font-mono uppercase tracking-wider hover:opacity-90 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Edits</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-line bg-card hover:bg-paper text-xs font-mono uppercase tracking-wider text-ink transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-muted" />
                <span>Edit Case Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Missing Facts Banner */}
        {consumerCase.missingFacts.length > 0 && (
          <div className="mt-6 p-4 rounded-md border border-amber-border bg-amber-light text-xs text-ink">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-amber font-mono mb-1">
                  Missing Information ({consumerCase.missingFacts.length})
                </h4>
                <ul className="list-disc pl-4 space-y-0.5 text-muted">
                  {consumerCase.missingFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Fact Grid: Editable or View Mode */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3.5 rounded border border-line bg-paper/50">
            <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Platform / Seller
            </span>
            {isEditing ? (
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. Flipkart, Amazon"
                className="w-full bg-card px-2 py-1 border border-line text-sm rounded outline-none"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.platformOrSeller || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded border border-line bg-paper/50">
            <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Product / Item
            </span>
            {isEditing ? (
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. boAt wireless headphones"
                className="w-full bg-card px-2 py-1 border border-line text-sm rounded outline-none"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.itemDescription || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded border border-line bg-paper/50">
            <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Amount (INR)
            </span>
            {isEditing ? (
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1499"
                className="w-full bg-card px-2 py-1 border border-line text-sm rounded outline-none"
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

          <div className="p-3.5 rounded border border-line bg-paper/50">
            <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Purchase Date
            </span>
            {isEditing ? (
              <input
                type="text"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                placeholder="e.g. 12 Oct 2026"
                className="w-full bg-card px-2 py-1 border border-line text-sm rounded outline-none"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.purchaseDate || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>

          <div className="p-3.5 rounded border border-line bg-paper/50">
            <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Dispute Category
            </span>
            {isEditing ? (
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full bg-card px-2 py-1 border border-line text-sm rounded outline-none"
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

          <div className="p-3.5 rounded border border-line bg-paper/50">
            <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Desired Outcome
            </span>
            {isEditing ? (
              <input
                type="text"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="e.g. Full refund or replacement"
                className="w-full bg-card px-2 py-1 border border-line text-sm rounded outline-none"
              />
            ) : (
              <p className="text-sm font-semibold text-ink">
                {consumerCase.desiredOutcome || <span className="text-muted italic">Not specified</span>}
              </p>
            )}
          </div>
        </div>

        {/* Problem Summary */}
        <div className="mt-4 p-4 rounded border border-line bg-paper/30">
          <span className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
            Problem Summary
          </span>
          {isEditing ? (
            <textarea
              rows={3}
              value={issueSummary}
              onChange={(e) => setIssueSummary(e.target.value)}
              className="w-full bg-card p-2 border border-line text-sm rounded outline-none"
            />
          ) : (
            <p className="text-sm text-ink leading-relaxed">{consumerCase.issueSummary}</p>
          )}
        </div>

        {/* Confirmed Facts Section */}
        <div className="mt-8 pt-6 border-t border-line">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg text-ink font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest" />
              Confirmed Factual Statements
            </h3>
            <span className="text-xs font-mono text-muted">
              {consumerCase.confirmedFacts.length} verified facts
            </span>
          </div>

          <div className="space-y-2">
            {consumerCase.confirmedFacts.map((fact, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-2.5 rounded bg-card border border-line/80 text-xs sm:text-sm text-ink"
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono text-muted font-bold text-xs mt-0.5">{idx + 1}.</span>
                  <span>{fact}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFact(idx)}
                  className="text-muted hover:text-vermilion p-1 transition"
                  title="Remove fact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add fact form */}
          <form onSubmit={handleAddFact} className="mt-3 flex gap-2">
            <input
              type="text"
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              placeholder="Add another confirmed detail (e.g. Courier tracking #, specific date, customer support ticket)..."
              className="flex-1 bg-paper px-3 py-2 border border-line text-xs sm:text-sm rounded outline-none focus:border-vermilion"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-line bg-card hover:bg-paper text-xs font-mono uppercase text-ink transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Evidence Checklist Section */}
        <div className="mt-8 pt-6 border-t border-line">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-serif text-lg text-ink font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-vermilion" />
                Evidence Checklist
              </h3>
              <p className="text-xs text-muted">
                Tick the documents and electronic records you currently hold.
              </p>
            </div>
            <span className="text-xs font-mono text-muted">
              {consumerCase.evidence.filter((e) => e.present).length} of {consumerCase.evidence.length} ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {consumerCase.evidence.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleEvidence(item.id)}
                className={`cursor-pointer p-3 rounded border transition flex items-start gap-3 ${
                  item.present
                    ? 'border-forest-border bg-forest-light/60 text-ink'
                    : 'border-line bg-card text-muted hover:border-line-dark'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.present}
                  onChange={() => {}}
                  className="mt-1 h-4 w-4 rounded border-line text-forest focus:ring-forest cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <span className={`font-semibold block ${item.present ? 'text-forest font-medium' : 'text-ink'}`}>
                    {item.label}
                  </span>
                  {item.note && <span className="text-muted block mt-0.5">{item.note}</span>}
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-vermilion text-white font-medium text-sm tracking-wide shadow-sm hover:opacity-95 transition"
          >
            <span>Confirm Case & View Escalation Ladder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
