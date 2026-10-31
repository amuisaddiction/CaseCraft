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
  CheckCircle,
  Landmark,
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
      <div className="flex items-end justify-between px-2 sm:px-4 gap-2">
        <div className="folder-tab px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-muted flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-vermilion flex-shrink-0" />
          <span className="sm:hidden">Escalation Ladder</span>
          <span className="hidden sm:inline">Practical Escalation Ladder</span>
        </div>
        <div className="flex items-center gap-2 pb-1 text-[11px] sm:text-xs font-mono text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-forest flex-shrink-0" />
          <span>Source-Linked & Statutory</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        {/* Recommended Next Step Hero Banner */}
        <div className="p-5 sm:p-7 rounded-xl border-2 border-vermilion bg-card shadow-sm mb-10 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="stamp-badge stamp-badge-vermilion">Recommended Next Step</span>
            {recommendation.deadlineNotice && (
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded bg-amber-light border border-amber-border text-[11px] sm:text-xs font-mono text-amber font-semibold">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{recommendation.deadlineNotice.label}</span>
              </span>
            )}
          </div>

          <h3 className="font-serif text-xl sm:text-3xl text-ink font-bold tracking-tight break-normal leading-snug">
            {recommendation.actionTitle}
          </h3>
          <p className="mt-2.5 text-sm sm:text-base text-ink/80 leading-relaxed font-sans max-w-3xl">
            {recommendation.reason}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-line">
            <button
              type="button"
              onClick={onDraftComplaint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-vermilion text-white text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:opacity-95 active:scale-[0.99] transition"
            >
              <FileCheck className="w-4 h-4" />
              <span>Prepare Formal Draft</span>
            </button>
            <button
              type="button"
              onClick={onLogResponse}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-line bg-paper hover:bg-card text-xs sm:text-sm font-medium text-ink transition shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-muted" />
              <span>Log Company Response</span>
            </button>
          </div>
        </div>

        {/* Section Lead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-line mb-6 gap-1">
          <div>
            <h4 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
              <Landmark className="w-4 h-4 text-vermilion" />
              <span>Official Escalation Pathway</span>
            </h4>
            <p className="text-xs text-muted mt-0.5">
              Structured sequence under the Consumer Protection Act, 2019 & E-Commerce Rules, 2020.
            </p>
          </div>
          <span className="text-xs font-mono text-muted">
            4 Statutory Stages
          </span>
        </div>

        {/* Vertical Rung Sequence with Journey Track */}
        <div className="space-y-6 relative before:absolute before:top-4 before:bottom-4 before:left-5 sm:before:left-6 before:w-0.5 before:bg-line-dark/60">
          {orderedRules.map((rule, idx) => {
            const status = getRungStatus(rule.id);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';

            return (
              <div
                key={rule.id}
                className={`relative pl-12 sm:pl-14 transition ${
                  isActive
                    ? 'opacity-100'
                    : isCompleted
                    ? 'opacity-90'
                    : 'opacity-75'
                }`}
              >
                {/* Stage Indicator Node */}
                <span
                  className={`absolute left-2.5 sm:left-3.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ring-4 ring-card ${
                    isActive
                      ? 'bg-vermilion text-white ring-vermilion/30 scale-110 shadow-sm'
                      : isCompleted
                      ? 'bg-forest text-white'
                      : 'bg-paper-dark border border-line-dark text-muted'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                </span>

                {/* Card Container */}
                <div
                  className={`p-5 sm:p-6 rounded-xl border transition ${
                    isActive
                      ? 'border-vermilion bg-card ring-1 ring-vermilion/30 shadow-md'
                      : isCompleted
                      ? 'border-forest-border bg-forest-light/40'
                      : 'border-line bg-paper/60 hover:bg-card/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-muted uppercase tracking-wider">
                        Stage {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h5 className="font-serif text-lg sm:text-xl font-bold text-ink">
                        {rule.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {isActive && (
                        <span className="stamp-badge stamp-badge-vermilion text-[10px]">
                          Active Step
                        </span>
                      )}
                      {isCompleted && (
                        <span className="stamp-badge stamp-badge-forest text-[10px]">
                          Logged
                        </span>
                      )}
                      {rule.verificationStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-forest font-semibold uppercase px-2 py-0.5 rounded bg-card border border-forest-border">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber font-semibold uppercase px-2 py-0.5 rounded bg-card border border-amber-border">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Needs Verification</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink/80 leading-relaxed mb-3.5 font-sans">
                    {rule.purpose}
                  </p>

                  <div className="p-3.5 rounded-lg bg-card/90 border border-line/70 text-xs text-ink space-y-2 mb-3.5">
                    <div>
                      <strong className="text-muted font-mono uppercase text-[10px] block font-semibold mb-0.5">
                        Recommended Action:
                      </strong>
                      <span className="leading-relaxed">{rule.action}</span>
                    </div>
                    {rule.caveat && (
                      <div className="pt-2 border-t border-line/50">
                        <strong className="text-muted font-mono uppercase text-[10px] block font-semibold mb-0.5">
                          Official Statutory Context:
                        </strong>
                        <span className="text-muted leading-relaxed">{rule.caveat}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Metadata & External Source Link */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-[11px] font-mono text-muted border-t border-line/60">
                    <div className="flex items-center gap-3">
                      {rule.deadlineKind === 'statutory' ? (
                        <span className="text-vermilion font-bold">
                          Statutory Clock: {rule.deadlineDays} {rule.deadlineDays === 1 ? 'day' : 'days'}
                        </span>
                      ) : rule.deadlineKind === 'service_target' ? (
                        <span className="text-amber font-bold">
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
                      className="inline-flex items-center gap-1.5 text-ink hover:text-vermilion underline transition font-medium"
                    >
                      <span>View Official Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-10 pt-6 border-t border-line text-xs text-muted leading-relaxed flex items-start gap-2.5 bg-paper/40 p-4 rounded-lg">
          <HelpCircle className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
          <p>
            <strong>Process guidance, not legal advice:</strong> The practical sequence and statutory citations presented above are derived directly from the Consumer Protection Act, 2019 and Consumer Protection (E-Commerce) Rules, 2020. CaseCraft does not file petitions automatically or guarantee outcome verdicts. Consult a qualified advocate for representation before judicial commissions.
          </p>
        </div>
      </div>
    </div>
  );
};
