import React, { useState } from 'react';
import type { ConsumerCase, ResponseOutcome } from '../types/case';
import {
  explainOutcomeTransition,
} from '../lib/ladderEngine';
import {
  Mic,
  History,
  ArrowRight,
  ShieldAlert,
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
    description: 'Statutory 48h acknowledgement or 30-day resolution window elapsed without reply.',
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
      <div className="flex items-end justify-between px-2 sm:px-4">
        <div className="folder-tab px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-muted flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-vermilion" />
          <span>Follow-Through & Response Log</span>
        </div>
        <div className="flex items-center gap-2 pb-1 text-xs font-mono text-muted">
          <span>Loop & State Progression</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        <div className="mb-6 pb-6 border-b border-line">
          <span className="stamp-badge stamp-badge-vermilion mb-2">Step 5: Follow Through</span>
          <h2 className="font-serif text-3xl text-ink tracking-tight">
            Log What Happened.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
            Record what the company or authority communicated. HAQ recalculates your practical next step and updates your verifiable case timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Outcome Choice Grid */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-3">
              Select Company / Authority Response:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {OUTCOME_OPTIONS.map((opt) => {
                const isSelected = selectedOutcome === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOutcome(opt.id)}
                    className={`cursor-pointer p-4 rounded-lg border transition ${
                      isSelected
                        ? 'border-vermilion bg-card ring-1 ring-vermilion/40 shadow-sm'
                        : 'border-line bg-paper/50 hover:bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-semibold text-sm text-ink">
                        {opt.label}
                      </span>
                      <input
                        type="radio"
                        name="outcome"
                        checked={isSelected}
                        onChange={() => setSelectedOutcome(opt.id)}
                        className="text-vermilion focus:ring-vermilion"
                      />
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{opt.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Explanation of Next Action */}
          <div className="p-4 rounded-md border border-line bg-paper/60 text-xs text-ink">
            <span className="font-mono text-muted uppercase text-[10px] block font-semibold mb-1">
              Impact on Escalation Ladder:
            </span>
            <p className="leading-relaxed font-medium">
              {explainOutcomeTransition(selectedOutcome)}
            </p>
          </div>

          {/* Date & Voice/Text Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="response-date" className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                Date of Response
              </label>
              <input
                id="response-date"
                type="date"
                value={responseDate}
                onChange={(e) => setResponseDate(e.target.value)}
                className="w-full bg-paper px-3 py-2 border border-line rounded text-sm text-ink outline-none focus:border-vermilion"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="response-notes" className="text-xs font-mono uppercase tracking-wider text-muted">
                  Notes or Message Summary
                </label>
                <div className="flex items-center gap-1 text-[11px] text-muted">
                  <Mic className="w-3 h-3 text-vermilion" />
                  <span>Wispr Flow Dictation Friendly</span>
                </div>
              </div>
              <textarea
                id="response-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dictate using Wispr Flow or type summary (e.g. Received ticket #FLK-99281 promising review in 3 days)..."
                className="w-full bg-paper p-3 border border-line rounded text-sm text-ink outline-none focus:border-vermilion"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-vermilion text-white font-medium text-sm tracking-wide shadow-sm hover:opacity-95 transition"
            >
              <span>Record Response & Update Ladder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Case Event Timeline */}
        <div className="mt-10 pt-8 border-t border-line">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold text-ink flex items-center gap-2">
              <History className="w-4 h-4 text-muted" />
              Verifiable Case Timeline
            </h3>
            <span className="text-xs font-mono text-muted">
              {consumerCase.events.length} chronological events
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-line">
            {consumerCase.events.map((evt) => (
              <div key={evt.id} className="relative flex items-start gap-3.5 pl-1">
                <span className="w-4 h-4 rounded-full bg-card border-2 border-vermilion z-10 flex-shrink-0 mt-0.5" />
                <div className="flex-1 p-3 rounded border border-line/80 bg-card text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-muted font-bold uppercase tracking-wider text-[10px]">
                      {new Date(evt.occurredAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    {evt.outcome && (
                      <span className="font-mono font-semibold px-2 py-0.5 rounded text-[10px] bg-paper border border-line uppercase">
                        {evt.outcome.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-ink leading-relaxed">{evt.note || 'Event recorded'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explicit Confirmation Guard Modal for 'Resolved' */}
      {showResolvedConfirmModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="paper-surface rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-line">
            <div className="flex items-center gap-2.5 text-forest mb-3">
              <ShieldAlert className="w-5 h-5 text-forest" />
              <h3 className="font-serif text-xl font-bold text-ink">Confirm Case Resolution</h3>
            </div>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
              Marking this case as resolved confirms that the merchant or platform has provided the full agreed remedy (refund received in your bank account or undamaged replacement received).
            </p>
            <p className="mt-2 text-xs text-muted">
              Your case record, evidence checklist, and timeline will be preserved in your local archive.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setShowResolvedConfirmModal(false)}
                className="px-4 py-2 rounded border border-line text-xs font-mono uppercase text-muted hover:text-ink transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedWithSubmission}
                className="px-5 py-2 rounded bg-forest text-white text-xs font-mono uppercase font-semibold hover:opacity-90 transition"
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
