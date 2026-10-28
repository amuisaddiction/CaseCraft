import React, { useState } from 'react';
import { Mic, ArrowRight, ShieldCheck, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { maskLikelySensitiveNumbers, getRedactionSummary } from '../lib/privacy';

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
    <div className="w-full max-w-4xl mx-auto">
      {/* Folder Tab Header */}
      <div className="flex items-end justify-between px-2 sm:px-4">
        <div className="folder-tab px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-muted flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-vermilion" />
          <span>New Case Intake</span>
        </div>
        <div className="flex items-center gap-2 pb-1 text-xs font-mono text-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-forest animate-pulse" />
          <span>Wispr Voice Enabled</span>
        </div>
      </div>

      {/* Main Document Surface */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="stamp-badge stamp-badge-vermilion">Intake Phase</span>
            <span className="text-xs font-mono text-muted">Step 1 of 4 • Confidential & Local</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
            Tell me what happened.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
            Speak naturally in Hinglish or English using <strong className="text-ink font-semibold">Wispr Flow</strong>, or type freely. HAQ extracts the facts, checks missing evidence, and builds your escalation ladder.
          </p>
        </div>

        {/* Quick Sample Prompts */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-muted">Try scenario:</span>
          <button
            type="button"
            onClick={() =>
              handleUsePrompt(
                'Maine 14 Oct ko Amazon se geyser order kiya tha Rs 6,999 ka. Box me dent tha aur heating coil kam nahi kar rahi. Seller ne return lene se mana kar diya.'
              )
            }
            className="text-xs bg-paper px-2.5 py-1 rounded border border-line hover:border-vermilion transition text-ink"
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
            className="text-xs bg-paper px-2.5 py-1 rounded border border-line hover:border-vermilion transition text-ink"
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
            className="text-xs bg-paper px-2.5 py-1 rounded border border-line hover:border-vermilion transition text-ink"
          >
            Refund Pending (Myntra)
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative rounded-lg border border-line bg-paper/60 p-4 focus-within:border-vermilion focus-within:bg-card transition">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="complaint-input" className="text-xs font-mono uppercase tracking-wider text-muted">
                Complaint Narrative
              </label>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Mic className="w-3.5 h-3.5 text-vermilion" />
                <span className="hidden sm:inline">Use Wispr Flow to dictate</span>
              </div>
            </div>

            <textarea
              id="complaint-input"
              rows={7}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Maine ek order kiya tha... (Speak or type your experience: platform name, item, date, amount, and what went wrong)"
              className="w-full resize-y bg-transparent text-base sm:text-lg leading-relaxed text-ink outline-none placeholder:text-muted/60"
              disabled={isLoading}
            />

            {/* Redaction Notice */}
            {redactionCheck.hadRedactions && (
              <div className="mt-2 pt-2 border-t border-line/60 flex items-center gap-2 text-xs font-mono text-forest">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
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
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-line">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onLoadSample}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-line bg-card hover:bg-paper text-xs font-mono uppercase tracking-wider text-ink transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber" />
                <span>Load Sample Case</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
                className="text-xs text-muted hover:text-ink underline transition"
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
            <h4 className="font-semibold text-ink mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest" />
              Privacy & Data Transparency
            </h4>
            <p>
              Your complaint stays on your device in IndexedDB storage. Before any request to external AI providers (Google Gemini Flash), phone numbers, card numbers, email addresses, and UPI IDs are masked on your browser.
            </p>
            <p className="mt-1">
              If you prefer zero external processing, HAQ includes a deterministic local rule-based extractor that runs completely offline on your device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
