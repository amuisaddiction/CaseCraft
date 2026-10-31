import React, { useState } from 'react';
import {
  Mic,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Scale,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { maskLikelySensitiveNumbers, getRedactionSummary } from '../lib/privacy';
import { SAMPLE_COMPLAINT_TEXT } from '../data/sampleCase';

interface ComplaintInputProps {
  onSubmit: (complaintText: string) => void;
  onLoadSample: () => void;
  isLoading: boolean;
  initialText?: string;
}

export const ComplaintInput: React.FC<ComplaintInputProps> = ({
  onSubmit,
  onLoadSample,
  isLoading,
  initialText = '',
}) => {
  const [complaintText, setComplaintText] = useState(initialText);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redactionCheck = getRedactionSummary(
    complaintText,
    maskLikelySensitiveNumbers(complaintText)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      setErrorMsg('Please tell us what happened with your order first.');
      return;
    }
    setErrorMsg(null);
    onSubmit(complaintText.trim());
  };

  const handleUsePrompt = (prompt: string) => {
    setComplaintText(prompt);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Editorial Hero Banner */}
      <div className="text-left pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-card mb-4 text-[11px] font-mono uppercase tracking-widest text-muted">
          <Scale className="w-3.5 h-3.5 text-vermilion" />
          <span>CaseCraft • Consumer Rights & Escalation Studio</span>
        </div>
        <h1 className="font-serif text-[26px] sm:text-5xl lg:text-5xl text-ink font-bold tracking-tight leading-[1.15] break-normal">
          Your complaint deserves more than <span className="italic font-normal text-vermilion">another support ticket.</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          CaseCraft converts your voice complaint into a structured case dossier, verified evidence checklist, statutory escalation ladder, and print-ready grievance notice.
        </p>

        {/* 4-Step Process Breadcrumb */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded border border-vermilion/40 bg-card">
            <span className="block text-[10px] text-vermilion font-bold uppercase tracking-wider">01. Voice Narrative</span>
            <span className="font-semibold text-ink text-xs">Speak in Hinglish</span>
          </div>
          <div className="p-2.5 rounded border border-line bg-card/60">
            <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">02. Case Dossier</span>
            <span className="text-muted text-xs">Facts & Evidence</span>
          </div>
          <div className="p-2.5 rounded border border-line bg-card/60">
            <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">03. Escalation Ladder</span>
            <span className="text-muted text-xs">Statutory 48h Clock</span>
          </div>
          <div className="p-2.5 rounded border border-line bg-card/60">
            <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">04. Formal Action</span>
            <span className="text-muted text-xs">Notice & Calendar</span>
          </div>
        </div>
      </div>

      {/* Main Intake Dossier Surface */}
      <div>
        {/* Folder Tab Header */}
        <div className="flex items-end justify-between px-2 sm:px-4">
          <div className="folder-tab px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-muted flex items-center gap-1.5 sm:gap-2">
            <BookOpen className="w-3.5 h-3.5 text-vermilion flex-shrink-0" />
            <span className="sm:hidden">Intake Dossier</span>
            <span className="hidden sm:inline">Intake Dossier • Form CC-01</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 pb-1 text-[11px] sm:text-xs font-mono text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-forest animate-pulse flex-shrink-0" />
            <span>Wispr Voice Enabled</span>
          </div>
        </div>

        {/* Main Document Surface */}
        <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="stamp-badge stamp-badge-vermilion">Intake Phase</span>
              <span className="text-xs font-mono text-muted">Step 1 of 4 • Confidential & Local Storage</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight font-bold">
              Tell me what happened.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
              Speak naturally in Hinglish or English using <strong className="text-ink font-semibold">Wispr Flow</strong>, or type freely. HAQ extracts the facts, checks missing evidence, and builds your escalation ladder.
            </p>
          </div>

          {/* Wispr Flow Dictation Hero Banner */}
          <div className="mb-5 p-3.5 rounded-lg border border-line bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-vermilion/10 border border-vermilion/30 flex items-center justify-center flex-shrink-0">
                <Mic className="w-4 h-4 text-vermilion animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                    Wispr Flow Voice Dictation Ready
                  </span>
                  <div className="hidden sm:flex items-center gap-0.5 h-4 px-1.5 py-0.5 rounded bg-paper border border-line">
                    <span className="waveform-bar" style={{ animationDelay: '0ms' }} />
                    <span className="waveform-bar" style={{ animationDelay: '200ms' }} />
                    <span className="waveform-bar" style={{ animationDelay: '400ms' }} />
                    <span className="waveform-bar" style={{ animationDelay: '100ms' }} />
                  </div>
                </div>
                <p className="text-xs text-muted">
                  Speak naturally: "Maine Flipkart se headphones mangwaye the, box me damaged nikla..."
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                handleUsePrompt(
                  'Maine 12 Oct ko Flipkart se boAt wireless headphones order kiya tha for Rs 1499. Box me damaged headphone nikla jisme left earcup completely broken tha. Same day customer support me replacement request dali. Unhone 3 din me replace karne ka promise kiya but 10 din ho gaye koi courier nahi aaya aur Flipkart app me request silently cancelled show kar raha hai. Maine support se chat kiya but bot keh raha hai return window expired. Mujhe ya to replacement chahiye ya full refund.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-line bg-paper hover:bg-card text-xs font-mono text-ink transition self-start sm:self-auto"
            >
              <Sparkles className="w-3 h-3 text-amber" />
              <span>Paste Sample Audio Transcript</span>
            </button>
          </div>

          {/* Quick Sample Prompts */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                Or select a realistic dispute scenario:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleUsePrompt(SAMPLE_COMPLAINT_TEXT)}
                className="text-xs bg-paper px-3 py-1.5 rounded border border-line hover:border-vermilion transition text-ink font-medium hover:bg-card"
              >
                ⚡ boAt Headphones (Flipkart)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePrompt(
                    'Maine 14 Oct ko Amazon se geyser order kiya tha Rs 6,999 ka. Box me dent tha aur heating coil kam nahi kar rahi. Seller ne return lene se mana kar diya.'
                  )
                }
                className="text-xs bg-paper px-3 py-1.5 rounded border border-line hover:border-vermilion transition text-ink"
              >
                Defective Geyser (Amazon)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePrompt(
                    'Ordered sports shoes on Meesho for Rs 1,199 on 5 Oct. Received cheap local flip-flops instead. Delivery boy took no return and app has no refund button.'
                  )
                }
                className="text-xs bg-paper px-3 py-1.5 rounded border border-line hover:border-vermilion transition text-ink"
              >
                Wrong Item (Meesho)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePrompt(
                    'Myntra return pickup done on 20 Oct for dress worth Rs 2,450. Tracking shows received at warehouse but refund still not credited after 10 days.'
                  )
                }
                className="text-xs bg-paper px-3 py-1.5 rounded border border-line hover:border-vermilion transition text-ink"
              >
                Refund Pending (Myntra)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative rounded-lg border border-line bg-paper/60 p-4 sm:p-5 focus-within:border-vermilion focus-within:bg-card transition">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="complaint-input" className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                  Consumer Grievance Narrative
                </label>
                <div className="flex items-center gap-2 text-xs font-mono text-muted">
                  <span className="hidden sm:inline">English & Hinglish Supported</span>
                  <span>•</span>
                  <span>{complaintText.length} chars</span>
                </div>
              </div>

              <textarea
                id="complaint-input"
                rows={7}
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Maine ek order kiya tha... (Speak or type your experience: platform name, item, date, amount, and what went wrong)"
                className="w-full resize-y bg-transparent text-base sm:text-lg leading-relaxed text-ink outline-none placeholder:text-muted/60 font-sans"
                disabled={isLoading}
              />

              {/* Redaction Notice */}
              {redactionCheck.hadRedactions && (
                <div className="mt-3 pt-3 border-t border-line/60 flex items-center gap-2 text-xs font-mono text-forest">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Client-side protection active: {redactionCheck.redactedTypes.join(', ')} will be masked before external AI processing.
                  </span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mt-3 flex items-center gap-2 text-xs text-vermilion font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Row */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-line">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onLoadSample}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-line bg-card hover:bg-paper text-xs font-mono uppercase tracking-wider text-ink transition shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber" />
                  <span>Load Sample Case</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                  className="text-xs text-muted hover:text-ink underline transition font-mono"
                >
                  What leaves this device?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !complaintText.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-vermilion text-white font-medium text-sm tracking-wide shadow-sm hover:opacity-95 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Organising Case File...</span>
                  </>
                ) : (
                  <>
                    <span>Build My Case File</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Collapsible Privacy Details */}
          {showPrivacyDetails && (
            <div className="mt-6 p-4 rounded-md border border-line bg-paper text-xs text-muted leading-relaxed">
              <h4 className="font-semibold text-ink mb-1.5 flex items-center gap-1.5 font-serif text-sm">
                <ShieldCheck className="w-4 h-4 text-forest" />
                Privacy & Data Transparency
              </h4>
              <p>
                Your complaint stays on your device in IndexedDB storage. Before any request to external AI providers (Google Gemini Flash), phone numbers, card numbers, email addresses, and UPI IDs are masked directly inside your browser.
              </p>
              <p className="mt-1.5">
                If no API key is provided, CaseCraft includes a deterministic local rule-based extractor that runs completely offline on your device with 0 external network requests.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust & Methodology Footnote */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-lg border border-line bg-card/60 text-xs">
          <div className="flex items-center gap-2 mb-1.5 text-ink font-semibold">
            <Clock className="w-4 h-4 text-vermilion" />
            <span>Statutory 48h Clock</span>
          </div>
          <p className="text-muted leading-relaxed">
            Rule 5(4) of E-Commerce Rules 2020 mandates official grievance receipt acknowledgement within 48 hours.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-line bg-card/60 text-xs">
          <div className="flex items-center gap-2 mb-1.5 text-ink font-semibold">
            <CheckCircle2 className="w-4 h-4 text-forest" />
            <span>Source-Linked Guidance</span>
          </div>
          <p className="text-muted leading-relaxed">
            Every escalation step references official government portals (NCH / INGRAM 1915, e-Jagriti Commission).
          </p>
        </div>
        <div className="p-4 rounded-lg border border-line bg-card/60 text-xs">
          <div className="flex items-center gap-2 mb-1.5 text-ink font-semibold">
            <Lock className="w-4 h-4 text-amber" />
            <span>Local Sovereign Storage</span>
          </div>
          <p className="text-muted leading-relaxed">
            Drafts, evidence checklists, and response timelines are stored strictly in your browser's IndexedDB.
          </p>
        </div>
      </div>
    </div>
  );
};
