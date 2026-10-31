import React, { useState } from 'react';
import type { ConsumerCase, ResponseOutcome } from '../types/case';
import {
  explainOutcomeTransition,
} from '../lib/ladderEngine';
import {
  Mic,
  History,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ResponseLogProps {
  consumerCase: ConsumerCase;
  onLogOutcome: (
    outcome: ResponseOutcome,
    notes: string,
    responseDate: string
  ) => void;
  onBackToLadder: () => void;
}

const OUTCOME_OPTIONS: {
  id: ResponseOutcome;
  label: string;
  description: string;
  badgeClass: string;
}[] = [
  {
    id: 'acknowledged',
    label: 'Acknowledged',
    description: 'Received formal ticket ID / acknowledgement email from the grievance officer.',
    badgeClass: 'border-line text-ink',
  },
  {
    id: 'refused',
    label: 'Refused',
    description: 'Company or seller explicitly rejected your claim or return request.',
    badgeClass: 'border-vermilion-border text-vermilion bg-vermilion-light/40',
  },
  {
    id: 'partially_resolved',
    label: 'Partially Resolved',
    description: 'Offered partial store credit or alternative that does not fully satisfy your claim.',
    badgeClass: 'border-amber-border text-amber bg-amber-light/40',
  },
  {
    id: 'no_response',
    label: 'No Response Yet',
    description: 'Statutory 48h acknowledgement (Rule 5(4)) or 30-day redressal window elapsed without reply.',
    badgeClass: 'border-amber-border text-amber',
  },
  {
    id: 'resolved',
    label: 'Fully Resolved',
    description: 'Refund received in your account or replacement product successfully delivered.',
    badgeClass: 'border-forest-border text-forest bg-forest-light/60',
  },
  {
    id: 'other',
    label: 'Other Response',
    description: 'Different outcome or update from the company.',
    badgeClass: 'border-line text-muted',
  },
];

export const ResponseLog: React.FC<ResponseLogProps> = ({
  consumerCase,
  onLogOutcome,
  onBackToLadder,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<ResponseOutcome>('acknowledged');
  const [notes, setNotes] = useState('');
  const [responseDate, setResponseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showResolvedConfirmModal, setShowResolvedConfirmModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOutcome === 'resolved') {
      setShowResolvedConfirmModal(true);
      return;
    }
    proceedWithSubmission();
  };

  const proceedWithSubmission = () => {
    onLogOutcome(selectedOutcome, notes.trim(), responseDate);
    setNotes('');
    setShowResolvedConfirmModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Folder Tab & Header */}
      <div className="flex items-end justify-between px-2 sm:px-4 gap-2">
        <div className="folder-tab px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-muted flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <History className="w-3.5 h-3.5 text-vermilion flex-shrink-0" />
          <span className="sm:hidden">Response Log</span>
          <span className="hidden sm:inline">Follow-Through & Response Log</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5 pb-1 text-[11px] sm:text-xs font-mono">
          {consumerCase.sampleMode && (
            <span className="stamp-badge stamp-badge-vermilion text-[10px] sm:text-xs px-2 py-0.5">Sample Case</span>
          )}
          <span className="text-muted hidden sm:inline">Loop & State Progression</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        {/* Fictional Sample Case Advisory Banner */}
        {consumerCase.sampleMode && (
          <div className="mb-5 p-3 rounded-lg border border-amber-border bg-amber-light text-xs font-mono text-ink flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="stamp-badge stamp-badge-amber text-[10px]">Fictional Demo</span>
              <span className="text-muted leading-tight">
                Simulated case follow-through using mock merchant response history.
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-muted uppercase">Sample Mode</span>
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-line">
          <div className="flex items-center gap-2 mb-2">
            <span className="stamp-badge stamp-badge-vermilion">Step 4: Follow Through</span>
            <span className="text-xs font-mono text-muted">Case: {consumerCase.id}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-ink font-bold tracking-tight">
            Log What Happened.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-2xl font-sans">
            Record what the company or authority communicated. CaseCraft recalculates your practical next step and updates your verifiable case timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Outcome Choice Grid */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-3">
              Select Company / Authority Response:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {OUTCOME_OPTIONS.map((opt) => {
                const isSelected = selectedOutcome === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOutcome(opt.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition select-none ${
                      isSelected
                        ? 'border-vermilion bg-card ring-2 ring-vermilion/40 shadow-sm'
                        : 'border-line bg-paper/50 hover:bg-card hover:border-line-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif font-bold text-sm sm:text-base text-ink">
                        {opt.label}
                      </span>
                      <input
                        type="radio"
                        name="outcome"
                        checked={isSelected}
                        onChange={() => setSelectedOutcome(opt.id)}
                        className="text-vermilion focus:ring-vermilion h-4 w-4"
                      />
                    </div>
                    <p className="text-xs text-muted leading-relaxed font-sans">{opt.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Explanation of Next Action */}
          <div className="p-4 sm:p-5 rounded-lg border border-line bg-card text-xs text-ink shadow-xs">
            <div className="flex items-center gap-2 mb-1.5 text-muted font-mono uppercase text-[10px] font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-vermilion" />
              <span>Impact on Escalation Ladder:</span>
            </div>
            <p className="leading-relaxed font-medium text-sm text-ink font-sans">
              {explainOutcomeTransition(selectedOutcome)}
            </p>
          </div>

          {/* Date & Voice/Text Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="response-date" className="block text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-1.5">
                Date of Response
              </label>
              <input
                id="response-date"
                type="date"
                value={responseDate}
                onChange={(e) => setResponseDate(e.target.value)}
                className="w-full bg-paper px-3.5 py-2.5 border border-line rounded-md text-sm text-ink outline-none focus:border-vermilion focus:bg-card transition font-mono"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="response-notes" className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                  Notes or Message Summary
                </label>
                <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
                  <Mic className="w-3.5 h-3.5 text-vermilion" />
                  <span>Wispr Flow Dictation Friendly</span>
                </div>
              </div>
              <textarea
                id="response-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dictate using Wispr Flow or type summary (e.g. Received ticket #FLK-99281 promising review in 3 days)..."
                className="w-full bg-paper p-3.5 border border-line rounded-md text-sm text-ink outline-none focus:border-vermilion focus:bg-card transition font-sans placeholder:text-muted/60"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line">
            <button
              type="button"
              onClick={onBackToLadder}
              className="text-xs text-muted hover:text-ink underline transition font-mono"
            >
              ← Back to Ladder Overview
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-vermilion text-white font-medium text-sm tracking-wide shadow-sm hover:opacity-95 active:scale-[0.99] transition"
            >
              <span>Record Response & Update Ladder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Verifiable Case Event Timeline */}
        <div className="mt-12 pt-8 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
                <History className="w-4 h-4 text-vermilion" />
                <span>Verifiable Case Timeline</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Every event is timestamped and cryptographically preserved in local storage.
              </p>
            </div>
            <span className="text-xs font-mono text-muted px-2.5 py-1 rounded bg-paper border border-line self-start sm:self-auto">
              {consumerCase.events.length} chronological events
            </span>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-line-dark/60">
            {consumerCase.events.map((evt) => (
              <div key={evt.id} className="relative flex items-start gap-4 pl-1">
                <span className="w-4 h-4 rounded-full bg-card border-2 border-vermilion z-10 flex-shrink-0 mt-1 shadow-xs" />
                <div className="flex-1 p-4 rounded-lg border border-line bg-card text-xs shadow-xs hover:border-line-dark transition">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-muted font-bold uppercase tracking-wider text-[11px]">
                      {new Date(evt.occurredAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    {evt.outcome && (
                      <span className="font-mono font-semibold px-2 py-0.5 rounded text-[10px] bg-paper border border-line uppercase text-ink">
                        {evt.outcome.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-ink text-sm leading-relaxed font-sans">{evt.note || 'Event recorded'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explicit Confirmation Guard Modal for 'Resolved' */}
      {showResolvedConfirmModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="paper-surface rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-forest-border animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-forest mb-3">
              <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center border border-forest-border flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-forest" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">Confirm Case Resolution</h3>
                <span className="text-[11px] font-mono text-muted uppercase">Irreversible Archive Action</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans mt-3">
              Marking this case as resolved confirms that the merchant or platform has provided the full agreed remedy (<strong className="text-ink">refund received in your bank account</strong> or undamaged replacement received).
            </p>
            <p className="mt-2.5 text-xs text-muted leading-relaxed">
              Your case record, evidence checklist, and timeline will be permanently preserved in your local archive.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setShowResolvedConfirmModal(false)}
                className="px-4 py-2 rounded-md border border-line text-xs font-mono uppercase text-muted hover:text-ink hover:bg-paper transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedWithSubmission}
                className="px-5 py-2.5 rounded-md bg-forest text-white text-xs font-mono uppercase font-semibold hover:opacity-90 active:scale-[0.99] transition shadow-xs"
              >
                Yes, Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
