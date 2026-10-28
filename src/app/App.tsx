import { useState, useEffect } from 'react';
import type { ConsumerCase, LadderRule, ResponseOutcome } from '../types/case';
import { SAMPLE_CASE } from '../data/sampleCase';
import { extractCaseWithFallback } from '../lib/apiClient';
import { saveCase, getActiveCase, deleteCase } from '../lib/storage';
import { determineNextAction } from '../lib/ladderEngine';
import { ComplaintInput } from '../components/ComplaintInput';
import { CaseFile } from '../components/CaseFile';
import { Ladder } from '../components/Ladder';
import { ResponseLog } from '../components/ResponseLog';
import { DraftAndExport } from '../components/DraftAndExport';
import {
  RotateCcw,
  Sparkles,
  ExternalLink,
  Mic,
} from 'lucide-react';

type ActiveTab = 'input' | 'case-file' | 'ladder' | 'response-log' | 'draft';

const DEFAULT_LADDER_RULES: LadderRule[] = [
  {
    id: 'prepare-evidence',
    title: 'Organise your evidence',
    purpose: 'Consolidate facts, tax invoice, photos, and prior communications into a verifiable case record.',
    action: 'Collect tax invoice, unboxing or damage photos/video, payment transaction ID, and timestamped screenshots of customer service interactions.',
    sourceUrl: 'https://consumerhelpline.gov.in/',
    sourceType: 'official_service',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'none',
    deadlineDays: null,
    caveat: 'Preserve original electronic files and email headers. Unsubstantiated claims are routinely rejected during grievance review.',
  },
  {
    id: 'platform-grievance',
    title: 'Escalate to Platform Grievance Officer',
    purpose: 'Issue a formal written notice to the designated Grievance Officer under Indian e-commerce regulations.',
    action: 'Send a formal factual complaint citing order details, statutory acknowledgement timeframe, and desired relief.',
    sourceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection/consumer-protection-e-commerce-rules-2020',
    sourceType: 'primary',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'statutory',
    deadlineDays: 2,
    caveat: 'Under Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020, the Grievance Officer must acknowledge receipt within 48 hours and redress the complaint within one month (Rule 5(5)).',
  },
  {
    id: 'nch',
    title: 'Lodge grievance on National Consumer Helpline (NCH / INGRAM)',
    purpose: 'Engage the Government of India pre-litigation conciliation platform to mediate with the company.',
    action: 'Register the grievance via consumerhelpline.gov.in, call 1915, or WhatsApp 8800001915 with company details and invoice.',
    sourceUrl: 'https://consumerhelpline.gov.in/',
    sourceType: 'official_service',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'service_target',
    deadlineDays: 45,
    caveat: 'NCH is an alternate dispute resolution conciliation mechanism, not a judicial court. Many platforms are convergence partners; typical resolution target is 45 days.',
  },
  {
    id: 'e-jagriti',
    title: 'File Consumer Commission petition via e-Jagriti',
    purpose: 'Seek binding judicial adjudication and compensation from the District Consumer Commission if mediation fails.',
    action: 'Prepare petition, affidavit, and index of documents on the official e-Jagriti portal (e-jagriti.gov.in) for District Commission hearing.',
    sourceUrl: 'https://e-jagriti.gov.in/',
    sourceType: 'primary',
    checkedOn: '2026-10-29',
    verificationStatus: 'verified',
    deadlineKind: 'statutory',
    deadlineDays: 730,
    caveat: 'Statutory limitation period is 2 years from date of cause of action (Section 69, Consumer Protection Act, 2019). While self-representation is permitted, consider seeking independent legal counsel.',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('input');
  const [activeCase, setActiveCase] = useState<ConsumerCase | null>(null);
  const [ladderRules, setLadderRules] = useState<LadderRule[]>(DEFAULT_LADDER_RULES);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Restore saved active case from IndexedDB/localStorage on mount
  useEffect(() => {
    async function loadSavedState() {
      try {
        const saved = await getActiveCase();
        if (saved) {
          setActiveCase(saved);
          if (saved.status === 'draft') {
            setActiveTab('case-file');
          } else {
            setActiveTab('ladder');
          }
        }
      } catch (err) {
        console.warn('Failed to load saved case:', err);
      }
    }
    loadSavedState();

    // Fetch latest verified ladder rules if available
    fetch('/ladder.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.rules) && data.rules.length > 0) {
          setLadderRules(data.rules);
        }
      })
      .catch(() => {
        // Fallback already configured
      });
  }, []);

  // Save active case whenever it changes
  useEffect(() => {
    if (activeCase) {
      saveCase(activeCase);
    }
  }, [activeCase]);

  // Handle complaint submission from input screen
  const handleComplaintSubmit = async (complaintText: string) => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const result = await extractCaseWithFallback(complaintText);
      const generatedId = `HAQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newCase: ConsumerCase = {
        id: generatedId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        sampleMode: false,
        issueType: result.extracted.issueType,
        platformOrSeller: result.extracted.platformOrSeller,
        itemDescription: result.extracted.itemDescription,
        amountInr: result.extracted.amountInr,
        purchaseDate: result.extracted.purchaseDate,
        complaintDate: result.extracted.complaintDate,
        issueSummary: result.extracted.issueSummary,
        desiredOutcome: result.extracted.desiredOutcome,
        confirmedFacts: result.extracted.confirmedFacts,
        missingFacts: result.extracted.missingFacts,
        evidence: [
          { id: 'ev-1', label: 'Order confirmation & Tax invoice', present: false, note: 'PDF or screenshot from merchant portal' },
          { id: 'ev-2', label: 'Photos / Unboxing video of product & packaging', present: false, note: 'Showing any defect, damage, or wrong label' },
          { id: 'ev-3', label: 'Previous customer care interaction screenshots', present: false, note: 'Chat transcript, ticket numbers, or emails' },
          { id: 'ev-4', label: 'Courier delivery / pickup slip (if applicable)', present: false, note: 'Proof of pickup or non-arrival' },
        ],
        currentRungId: 'prepare-evidence',
        events: [
          {
            id: `evt-${Date.now()}`,
            occurredAt: new Date().toISOString(),
            kind: 'case_created',
            note: result.usedAi
              ? 'Case initialized via AI extraction from spoken/typed narrative.'
              : 'Case initialized via deterministic local rule engine.',
          },
        ],
        rawComplaint: complaintText,
      };

      setActiveCase(newCase);
      await saveCase(newCase);
      setActiveTab('case-file');

      if (result.notice) {
        setStatusMessage(result.notice);
      }
    } catch (err) {
      console.error('Extraction error:', err);
      setStatusMessage('Encountered an issue processing narrative; using local intake.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load sample case
  const handleLoadSample = async () => {
    setActiveCase(SAMPLE_CASE);
    await saveCase(SAMPLE_CASE);
    setActiveTab('case-file');
    setStatusMessage('Loaded fictional sample case (boAt headphones / Flipkart dispute).');
  };

  // User confirms facts on Case File
  const handleConfirmCase = async () => {
    if (!activeCase) return;
    const updated: ConsumerCase = {
      ...activeCase,
      status: activeCase.status === 'resolved' ? 'resolved' : 'ready',
      currentRungId: activeCase.currentRungId || 'platform-grievance',
      updatedAt: new Date().toISOString(),
    };
    setActiveCase(updated);
    await saveCase(updated);
    setActiveTab('ladder');
  };

  // Log response from company/authority
  const handleLogOutcome = async (
    outcome: ResponseOutcome,
    notes: string,
    responseDate: string
  ) => {
    if (!activeCase) return;

    const newEvent = {
      id: `evt-${Date.now()}`,
      occurredAt: new Date(`${responseDate}T12:00:00`).toISOString(),
      kind: 'response_logged' as const,
      outcome,
      note: notes || `Logged outcome: ${outcome.replace('_', ' ')}`,
      rungId: activeCase.currentRungId || undefined,
    };

    let updatedStatus = activeCase.status;
    let nextRungId = activeCase.currentRungId;

    if (outcome === 'resolved') {
      updatedStatus = 'resolved';
    } else {
      // Recompute next ladder action
      const tempCase = {
        ...activeCase,
        events: [...activeCase.events, newEvent],
      };
      const rec = determineNextAction(tempCase, ladderRules);
      nextRungId = rec.nextRungId;
    }

    const updatedCase: ConsumerCase = {
      ...activeCase,
      status: updatedStatus,
      currentRungId: nextRungId,
      events: [...activeCase.events, newEvent],
      updatedAt: new Date().toISOString(),
    };

    setActiveCase(updatedCase);
    await saveCase(updatedCase);
    setActiveTab('ladder');
  };

  // Reset active case
  const handleResetCase = async () => {
    if (confirm('Are you sure you want to clear this case and start fresh? All local details will be reset.')) {
      if (activeCase) {
        await deleteCase(activeCase.id);
      }
      setActiveCase(null);
      setActiveTab('input');
      setStatusMessage(null);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col justify-between selection:bg-[#E9B5A8] selection:text-[#211F1C]">
      {/* Top Header */}
      <header className="border-b border-line bg-card/70 backdrop-blur-xs sticky top-0 z-40 no-print">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('input')}
              className="text-left group"
            >
              <div className="flex items-center gap-1 font-serif text-2xl font-bold tracking-tight text-ink">
                <span>HAQ</span>
                <span className="text-vermilion">.</span>
              </div>
              <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-muted">
                Your complaint. Your next step.
              </span>
            </button>
          </div>

          {/* Step Navigation Pill */}
          {activeCase && (
            <div className="hidden md:flex items-center gap-1 bg-paper px-2 py-1 rounded-full border border-line text-xs font-mono">
              <button
                onClick={() => setActiveTab('case-file')}
                className={`px-3 py-1 rounded-full transition ${
                  activeTab === 'case-file'
                    ? 'bg-ink text-white font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                1. Case File
              </button>
              <button
                onClick={() => setActiveTab('ladder')}
                className={`px-3 py-1 rounded-full transition ${
                  activeTab === 'ladder'
                    ? 'bg-ink text-white font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                2. Ladder
              </button>
              <button
                onClick={() => setActiveTab('draft')}
                className={`px-3 py-1 rounded-full transition ${
                  activeTab === 'draft'
                    ? 'bg-ink text-white font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                3. Draft
              </button>
              <button
                onClick={() => setActiveTab('response-log')}
                className={`px-3 py-1 rounded-full transition ${
                  activeTab === 'response-log'
                    ? 'bg-ink text-white font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                4. Follow-Through
              </button>
            </div>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {activeCase ? (
              <button
                type="button"
                onClick={handleResetCase}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-line bg-card hover:bg-paper text-xs font-mono text-muted hover:text-vermilion transition"
                title="Clear current case"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Fresh</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-line bg-card hover:bg-paper text-xs font-mono text-ink transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber" />
                <span>Try Sample Case</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Wispr Challenge Voice Banner */}
      <div className="bg-paper-dark border-b border-line px-4 py-2 text-xs font-mono text-ink text-center flex flex-wrap items-center justify-center gap-2 no-print">
        <Mic className="w-3.5 h-3.5 text-vermilion flex-shrink-0" />
        <span>
          <strong>No Hands: The Wispr Challenge</strong> — Speak naturally using <strong>Wispr Flow</strong> in Hinglish or English to narrate your complaint.
        </span>
      </div>

      {/* Informational Status Banner */}
      {statusMessage && (
        <div className="mx-auto max-w-4xl px-4 pt-4 w-full no-print">
          <div className="p-3 rounded-md bg-card border border-line text-xs font-mono text-ink flex items-center justify-between gap-3">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-muted hover:text-ink underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 w-full flex-1">
        {activeTab === 'input' && (
          <ComplaintInput
            onSubmit={handleComplaintSubmit}
            onLoadSample={handleLoadSample}
            isLoading={isLoading}
            initialText={activeCase?.rawComplaint || ''}
          />
        )}

        {activeTab === 'case-file' && activeCase && (
          <CaseFile
            consumerCase={activeCase}
            onUpdateCase={(updated) => setActiveCase(updated)}
            onConfirmCase={handleConfirmCase}
            onBackToInput={() => setActiveTab('input')}
          />
        )}

        {activeTab === 'ladder' && activeCase && (
          <Ladder
            consumerCase={activeCase}
            ladderRules={ladderRules}
            onDraftComplaint={() => setActiveTab('draft')}
            onLogResponse={() => setActiveTab('response-log')}
          />
        )}

        {activeTab === 'response-log' && activeCase && (
          <ResponseLog
            consumerCase={activeCase}
            onLogOutcome={handleLogOutcome}
            onBackToLadder={() => setActiveTab('ladder')}
          />
        )}

        {activeTab === 'draft' && activeCase && (
          <DraftAndExport
            consumerCase={activeCase}
            onUpdateDraft={(updated) =>
              setActiveCase({ ...activeCase, draftMessage: updated })
            }
            onBackToLadder={() => setActiveTab('ladder')}
          />
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-card/60 py-6 text-xs text-muted no-print">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">HAQ</span>
            <span>•</span>
            <span>What is rightfully yours.</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Process guidance, not legal advice.</span>
            <span>•</span>
            <a
              href="https://github.com/amuisaddiction/CaseCraft"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-ink underline transition"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
