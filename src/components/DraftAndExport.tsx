import React, { useState } from 'react';
import type { ConsumerCase } from '../types/case';
import { buildComplaintDraft } from '../lib/draftEngine';
import { createReminderIcs, downloadIcsFile } from '../lib/exportIcs';
import {
  Copy,
  Mail,
  Printer,
  Calendar,
  Check,
  FileText,
} from 'lucide-react';

interface DraftAndExportProps {
  consumerCase: ConsumerCase;
  onUpdateDraft?: (updatedText: string) => void;
  onBackToLadder: () => void;
}

export const DraftAndExport: React.FC<DraftAndExportProps> = ({
  consumerCase,
  onUpdateDraft,
  onBackToLadder,
}) => {
  const defaultDraft = buildComplaintDraft(consumerCase);
  const [draftBody, setDraftBody] = useState(consumerCase.draftMessage || defaultDraft.body);
  const [recipient, setRecipient] = useState(defaultDraft.recipientTitle);
  const [subject, setSubject] = useState(defaultDraft.subject);
  const [copied, setCopied] = useState(false);
  const [reminderDate, setReminderDate] = useState(() => {
    // Default to +2 days (48 hours for statutory acknowledgement)
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [downloadedIcs, setDownloadedIcs] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draftBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadIcs = () => {
    const targetDate = new Date(`${reminderDate}T10:00:00`);
    const title = `HAQ: Follow-up on ${consumerCase.platformOrSeller || 'order'} grievance`;
    const desc = `Reference: ${consumerCase.id}\nItem: ${consumerCase.itemDescription || 'Order'}\nCheck for 48h acknowledgement docket or redressal update as per E-Commerce Rules 2020.`;
    const icsContent = createReminderIcs(title, targetDate, desc);
    downloadIcsFile(`HAQ-reminder-${consumerCase.id}`, icsContent);
    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const mailtoLink = defaultDraft.recipientEmail
    ? `mailto:${defaultDraft.recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftBody)}`
    : `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draftBody)}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Folder Tab & Header */}
      <div className="flex items-end justify-between px-2 sm:px-4 no-print">
        <div className="folder-tab px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-muted flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-vermilion" />
          <span>Complaint Draft & Export</span>
        </div>
        <div className="flex items-center gap-2 pb-1 text-xs font-mono">
          {consumerCase.sampleMode && (
            <span className="stamp-badge stamp-badge-vermilion">Sample Case</span>
          )}
          <span className="text-muted">Confirmed Facts Only</span>
        </div>
      </div>

      {/* Main Document Area */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        {/* Printable Case Summary Header (Visible in print or screen) */}
        <div className="pb-6 border-b border-line">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <span className="stamp-badge stamp-badge-vermilion">Formal Grievance Draft</span>
              <span className="text-xs font-mono text-muted ml-3">
                Docket Ref: {consumerCase.id} • Date: {new Date().toLocaleDateString('en-IN')}
              </span>
            </div>
            {consumerCase.sampleMode && (
              <span className="text-xs font-mono text-vermilion font-bold uppercase tracking-wider">
                [Demonstration Sample Data]
              </span>
            )}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
            Prepare Your Message
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            This draft is built strictly from your confirmed facts. Review and edit any field before copying or sending. HAQ never sends communications automatically.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-paper border border-line no-print">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-line bg-card hover:bg-paper text-xs font-mono font-medium text-ink transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-forest" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
            </button>

            <a
              href={mailtoLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-line bg-card hover:bg-paper text-xs font-mono font-medium text-ink transition shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-muted" />
              <span>Open in Email Draft</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-line bg-card hover:bg-paper text-xs font-mono font-medium text-ink transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-muted" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span>Rule 5(4) E-Commerce Rules, 2020 Cited</span>
          </div>
        </div>

        {/* Draft Editor Fields */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="draft-recipient" className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Designated Recipient:
              </label>
              <input
                id="draft-recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-paper px-3 py-2 border border-line rounded text-xs sm:text-sm text-ink outline-none"
              />
            </div>

            <div>
              <label htmlFor="draft-subject" className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
                Subject Line:
              </label>
              <input
                id="draft-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-paper px-3 py-2 border border-line rounded text-xs sm:text-sm text-ink outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="draft-body" className="block text-xs font-mono uppercase tracking-wider text-muted mb-1">
              Complaint Body (Editable):
            </label>
            <textarea
              id="draft-body"
              rows={14}
              value={draftBody}
              onChange={(e) => {
                setDraftBody(e.target.value);
                onUpdateDraft?.(e.target.value);
              }}
              className="w-full bg-card p-4 border border-line rounded-lg font-mono text-xs sm:text-sm text-ink leading-relaxed outline-none focus:border-vermilion"
            />
          </div>
        </div>

        {/* Calendar Reminder Tool (.ics) */}
        <div className="mt-8 p-5 rounded-lg border border-line bg-paper/60 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <Calendar className="w-4 h-4 text-vermilion" />
                Schedule Calendar Follow-up (.ics)
              </h4>
              <p className="text-xs text-muted mt-0.5">
                Download a calendar reminder file for the statutory 48-hour acknowledgement or 30-day resolution check.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="bg-card px-3 py-1.5 border border-line rounded text-xs font-mono text-ink outline-none"
              />
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-ink text-paper text-xs font-mono uppercase tracking-wider hover:opacity-90 transition"
              >
                {downloadedIcs ? <Check className="w-3.5 h-3.5 text-forest" /> : <Calendar className="w-3.5 h-3.5" />}
                <span>{downloadedIcs ? 'Downloaded!' : 'Get .ICS Reminder'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Timeline & Facts for PDF Export */}
        <div className="print-only hidden mt-8 pt-8 border-t border-line">
          <h3 className="font-serif text-lg font-bold mb-2">Preserved Case Timeline</h3>
          <ul className="text-xs space-y-2 mb-6">
            {consumerCase.events.map((evt) => (
              <li key={evt.id}>
                <strong>{new Date(evt.occurredAt).toLocaleDateString('en-IN')}:</strong> {evt.note}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted">
            Official Source: Consumer Protection (E-Commerce) Rules, 2020 (Rule 5(4)-(5)) & Consumer Protection Act, 2019.
          </p>
          <p className="text-[10px] text-muted italic">
            Process guidance, not legal advice. Prepared using HAQ (CaseCraft).
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-line flex items-center justify-between no-print">
          <button
            type="button"
            onClick={onBackToLadder}
            className="text-xs text-muted hover:text-ink underline transition font-mono"
          >
            ← Back to Escalation Ladder
          </button>
          <span className="text-xs font-mono text-muted">
            Process guidance, not legal advice
          </span>
        </div>
      </div>
    </div>
  );
};
