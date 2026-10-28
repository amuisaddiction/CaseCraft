import React from 'react';
import type { ConsumerCase, LadderRule } from '../types/case';
import {
  determineNextAction,
  getPracticalLadder,
} from '../lib/ladderEngine';
import {
  ShieldCheck,
  ExternalLink,
  Clock,
  AlertCircle,
  FileCheck,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface LadderProps {
  consumerCase: ConsumerCase;
  ladderRules: LadderRule[];
  onDraftComplaint: () => void;
  onLogResponse: () => void;
}

export const Ladder: React.FC<LadderProps> = ({
  consumerCase,
  ladderRules,
  onDraftComplaint,
  onLogResponse,
}) => {
  const orderedRules = getPracticalLadder({
    schemaVersion: 1,
    lastReviewedAt: '2026-10-29',
    disclaimer: 'Process guidance, not legal advice.',
    rules: ladderRules,
  });

  const recommendation = determineNextAction(consumerCase, orderedRules);

  const getRungStatus = (ruleId: string) => {
    if (consumerCase.status === 'resolved') {
      return 'completed';
    }
    if (ruleId === recommendation.nextRungId) {
      return 'active';
    }
    const targetIdx = orderedRules.findIndex((r) => r.id === recommendation.nextRungId);
    const thisIdx = orderedRules.findIndex((r) => r.id === ruleId);
    if (thisIdx < targetIdx) {
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Folder Tab & Header */}
      <div className="flex items-end justify-between px-2 sm:px-4">
        <div className="folder-tab px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-muted flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-vermilion" />
          <span>Practical Escalation Ladder</span>
        </div>
        <div className="flex items-center gap-2 pb-1 text-xs font-mono text-muted">
          <span>Source-Linked & Deterministic</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        {/* Next Recommended Action Banner */}
        <div className="p-5 sm:p-6 rounded-lg border-2 border-vermilion bg-card shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="stamp-badge stamp-badge-vermilion">Recommended Next Step</span>
            {recommendation.deadlineNotice && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-light border border-amber-border text-xs font-mono text-amber font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{recommendation.deadlineNotice.label}</span>
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl text-ink font-bold tracking-tight">
            {recommendation.actionTitle}
          </h3>
          <p className="mt-2 text-sm sm:text-base text-ink/80 leading-relaxed">
            {recommendation.reason}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-line">
            <button
              type="button"
              onClick={onDraftComplaint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-vermilion text-white text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:opacity-95 transition"
            >
              <FileCheck className="w-4 h-4" />
              <span>Prepare Formal Draft</span>
            </button>
            <button
              type="button"
              onClick={onLogResponse}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-line bg-paper hover:bg-card text-xs sm:text-sm font-medium text-ink transition"
            >
              <MessageSquare className="w-4 h-4 text-muted" />
              <span>Log Company Response</span>
            </button>
          </div>
        </div>

        {/* Vertical Rung Sequence */}
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h4 className="font-serif text-lg font-semibold text-ink">Escalation Sequence</h4>
            <span className="text-xs font-mono text-muted">
              Step-by-step practical pathway under Indian Consumer Law
            </span>
          </div>

          {orderedRules.map((rule, idx) => {
            const status = getRungStatus(rule.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';

            return (
              <div
                key={rule.id}
                className={`p-5 rounded-lg border transition ${
                  isActive
                    ? 'border-vermilion bg-card ring-1 ring-vermilion/30 shadow-sm'
                    : isCompleted
                    ? 'border-forest-border bg-forest-light/40 opacity-90'
                    : 'border-line bg-paper/60 opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isActive
                          ? 'bg-vermilion text-white'
                          : isCompleted
                          ? 'bg-forest text-white'
                          : 'bg-line text-muted'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h5 className="font-serif text-lg font-bold text-ink">{rule.title}</h5>
                  </div>

                  <div className="flex items-center gap-2">
                    {rule.verificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-forest font-semibold uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber font-semibold uppercase">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Needs Verification</span>
                      </span>
                    )}
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-line bg-paper text-muted uppercase">
                      {rule.sourceType.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed mb-3">
                  {rule.purpose}
                </p>

                <div className="p-3 rounded bg-card/80 border border-line/60 text-xs text-ink space-y-1.5 mb-3">
                  <div>
                    <strong className="text-muted font-mono uppercase text-[10px] block">
                      Recommended Action:
                    </strong>
                    <span>{rule.action}</span>
                  </div>
                  {rule.caveat && (
                    <div>
                      <strong className="text-muted font-mono uppercase text-[10px] block">
                        Official Legal Context:
                      </strong>
                      <span className="text-muted">{rule.caveat}</span>
                    </div>
                  )}
                </div>

                {/* Footer Metadata & External Source Link */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] font-mono text-muted border-t border-line/60">
                  <div className="flex items-center gap-3">
                    {rule.deadlineKind === 'statutory' ? (
                      <span className="text-vermilion font-semibold">
                        Statutory Clock: {rule.deadlineDays} {rule.deadlineDays === 1 ? 'day' : 'days'}
                      </span>
                    ) : rule.deadlineKind === 'service_target' ? (
                      <span className="text-amber font-semibold">
                        Service Target: {rule.deadlineDays} days
                      </span>
                    ) : (
                      <span>No statutory deadline applicable</span>
                    )}
                    {rule.checkedOn && <span>• Checked: {rule.checkedOn}</span>}
                  </div>

                  <a
                    href={rule.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ink hover:text-vermilion underline transition"
                  >
                    <span>View Official Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-8 pt-6 border-t border-line text-xs text-muted leading-relaxed flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
          <p>
            <strong>Process guidance, not legal advice:</strong> The practical sequence and statutory citations presented above are derived directly from the Consumer Protection Act, 2019 and Consumer Protection (E-Commerce) Rules, 2020. HAQ does not file petitions automatically or guarantee outcome verdicts. Consult a qualified advocate for representation before judicial commissions.
          </p>
        </div>
      </div>
    </div>
  );
};
