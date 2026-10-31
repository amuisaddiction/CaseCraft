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
  Clock,
  ShieldCheck,
  Building,
  Tag,
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
    const title = `CaseCraft: Follow-up on ${consumerCase.platformOrSeller || 'order'} grievance`;
    const desc = `Reference: ${consumerCase.id}\nItem: ${consumerCase.itemDescription || 'Order'}\nCheck for 48h acknowledgement docket or redressal update as per E-Commerce Rules 2020.`;
    const icsContent = createReminderIcs(title, targetDate, desc);
    downloadIcsFile(`CaseCraft-reminder-${consumerCase.id}`, icsContent);
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
      <div className="flex items-end justify-between px-2 sm:px-4 gap-2 no-print">
        <div className="folder-tab px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest text-muted flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <FileText className="w-3.5 h-3.5 text-vermilion flex-shrink-0" />
          <span className="sm:hidden">Notice • {consumerCase.id}</span>
          <span className="hidden sm:inline">Formal Grievance Draft • {consumerCase.id}</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5 pb-1 text-[11px] sm:text-xs font-mono">
          {consumerCase.sampleMode && (
            <span className="stamp-badge stamp-badge-vermilion text-[10px] sm:text-xs px-2 py-0.5">Sample Case</span>
          )}
          <span className="text-forest font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Facts-Only Verified</span>
          </span>
        </div>
      </div>

      {/* Main Document Area */}
      <div className="paper-surface rounded-b-xl rounded-tr-xl p-6 sm:p-10 relative">
        {/* Fictional Sample Case Advisory Banner */}
        {consumerCase.sampleMode && (
          <div className="mb-5 p-3 rounded-lg border border-amber-border bg-amber-light text-xs font-mono text-ink flex items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="stamp-badge stamp-badge-amber text-[10px]">Fictional Demo</span>
              <span className="text-muted leading-tight">
                Simulated notice draft generated from fictional dispute records (boAt / Flipkart).
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-muted uppercase">Demonstration Only</span>
          </div>
        )}

        {/* Printable Case Summary Header */}
        <div className="pb-6 border-b border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <span className="stamp-badge stamp-badge-vermilion">Formal Notice Draft</span>
              <span className="text-xs font-mono text-muted">
                Docket Ref: <strong className="text-ink">{consumerCase.id}</strong> • Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            {consumerCase.sampleMode && (
              <span className="text-xs font-mono text-vermilion font-bold uppercase tracking-wider">
                [Demonstration Sample Data]
              </span>
            )}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold tracking-tight">
            Prepare Your Message
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted max-w-3xl leading-relaxed">
            This formal complaint is built strictly from your confirmed facts and cites the statutory 48-hour acknowledgement rule under Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020. Review and edit any field before copying or sending.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-paper border border-line no-print">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-line bg-card hover:bg-paper text-xs font-mono font-medium text-ink transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-forest" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
              <span className={copied ? 'text-forest font-bold' : ''}>
                {copied ? 'Copied to Clipboard!' : 'Copy Draft'}
              </span>
            </button>

            <a
              href={mailtoLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-line bg-card hover:bg-paper text-xs font-mono font-medium text-ink transition shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-vermilion" />
              <span>Open in Email Draft</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-line bg-card hover:bg-paper text-xs font-mono font-medium text-ink transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-muted" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-muted bg-card px-2.5 py-1 rounded border border-line">
            <Clock className="w-3.5 h-3.5 text-vermilion" />
            <span className="font-semibold text-ink">Rule 5(4) E-Commerce Rules, 2020 Cited</span>
          </div>
        </div>

        {/* Draft Editor Fields */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="draft-recipient" className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-1.5">
                <Building className="w-3.5 h-3.5 text-vermilion" />
                <span>Designated Recipient:</span>
              </label>
              <input
                id="draft-recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-paper px-3.5 py-2.5 border border-line rounded-md text-xs sm:text-sm text-ink outline-none focus:border-vermilion focus:bg-card transition font-mono"
              />
            </div>

            <div>
              <label htmlFor="draft-subject" className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-1.5">
                <Tag className="w-3.5 h-3.5 text-vermilion" />
                <span>Subject Line:</span>
              </label>
              <input
                id="draft-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-paper px-3.5 py-2.5 border border-line rounded-md text-xs sm:text-sm text-ink outline-none focus:border-vermilion focus:bg-card transition font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="draft-body" className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                Official Letterhead Notice (Editable):
              </label>
              <span className="text-[11px] font-mono text-muted">
                {draftBody.length} characters • {draftBody.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              id="draft-body"
              rows={14}
              value={draftBody}
              onChange={(e) => {
                setDraftBody(e.target.value);
                onUpdateDraft?.(e.target.value);
              }}
              className="w-full bg-card p-5 border border-line rounded-lg font-mono text-xs sm:text-sm text-ink leading-relaxed outline-none focus:border-vermilion shadow-inner transition"
            />
          </div>
        </div>

        {/* Calendar Reminder Tool (.ics) */}
        <div className="mt-8 p-5 sm:p-6 rounded-xl border border-line bg-paper/60 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-ink flex items-center gap-2">
                <Calendar className="w-4 h-4 text-vermilion" />
                <span>Schedule Calendar Follow-up (.ics)</span>
              </h4>
              <p className="text-xs text-muted mt-1 leading-relaxed max-w-xl">
                Download an .ICS calendar file to track the statutory 48-hour acknowledgement deadline or 30-day resolution check across Apple Calendar, Google Calendar, or Outlook.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="bg-card px-3 py-2 border border-line rounded-md text-xs font-mono text-ink outline-none focus:border-vermilion"
              />
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-ink text-paper text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 active:scale-[0.99] transition shadow-xs"
              >
                {downloadedIcs ? <Check className="w-3.5 h-3.5 text-forest" /> : <Calendar className="w-3.5 h-3.5" />}
                <span>{downloadedIcs ? 'Reminder Downloaded!' : 'Get .ICS Reminder'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Timeline & Facts for PDF Export */}
        <div className="print-only hidden mt-8 pt-8 border-t border-line">
          <div className="border-b border-black pb-4 mb-4">
            <h1 className="text-2xl font-serif font-bold">CASECRAFT CONSUMER GRIEVANCE DOSSIER</h1>
            <p className="text-xs font-mono">DOCKET REF: {consumerCase.id} • DATE: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
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
            Process guidance, not legal advice. Prepared using CaseCraft (HAQ).
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
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
