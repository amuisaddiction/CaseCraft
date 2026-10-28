import type { ConsumerCase } from '../types/case';

export interface GeneratedDraft {
  recipientTitle: string;
  recipientEmail?: string;
  subject: string;
  body: string;
  mailtoUrl?: string;
}

// Known official grievance contact channels for major Indian e-commerce entities
const KNOWN_GRIEVANCE_CHANNELS: Record<string, { title: string; email: string }> = {
  flipkart: {
    title: 'Flipkart Grievance Officer',
    email: 'grievance-officer@flipkart.com',
  },
  amazon: {
    title: 'Amazon India Grievance Officer',
    email: 'grievance-officer@amazon.in',
  },
  meesho: {
    title: 'Meesho Grievance Redressal Officer',
    email: 'grievanceofficer@meesho.com',
  },
  myntra: {
    title: 'Myntra Grievance Officer',
    email: 'grievance@myntra.com',
  },
  ajio: {
    title: 'AJIO Grievance Officer',
    email: 'grievanceofficer@ajio.com',
  },
  nykaa: {
    title: 'Nykaa Grievance Officer',
    email: 'grievanceofficer@nykaa.com',
  },
  swiggy: {
    title: 'Swiggy Grievance Officer',
    email: 'grievances@swiggy.in',
  },
  zomato: {
    title: 'Zomato Grievance Officer',
    email: 'grievance@zomato.com',
  },
  blinkit: {
    title: 'Blinkit Grievance Redressal',
    email: 'grievance@blinkit.com',
  },
  zepto: {
    title: 'Zepto Grievance Officer',
    email: 'grievance@zeptonow.com',
  },
};

/**
 * Builds a professional, factual complaint draft strictly based on confirmed facts.
 * Never invents facts, amounts, or events.
 */
export function buildComplaintDraft(consumerCase: ConsumerCase): GeneratedDraft {
  const platform = consumerCase.platformOrSeller || 'E-Commerce Platform';
  const platformKey = platform.toLowerCase().trim();
  const knownContact = KNOWN_GRIEVANCE_CHANNELS[platformKey];

  const recipientTitle = knownContact
    ? knownContact.title
    : `Grievance Officer, ${platform}`;
  const recipientEmail = knownContact?.email;

  const item = consumerCase.itemDescription || 'Purchased Item';
  const amountStr =
    consumerCase.amountInr !== null
      ? `₹${consumerCase.amountInr.toLocaleString('en-IN')}`
      : 'the paid amount';

  const issueLabel =
    consumerCase.issueType === 'defective_item'
      ? 'Damaged / Defective Product'
      : consumerCase.issueType === 'wrong_item'
      ? 'Wrong Product Delivered'
      : consumerCase.issueType === 'replacement'
      ? 'Unresolved Replacement Request'
      : consumerCase.issueType === 'refund'
      ? 'Pending Refund'
      : 'Consumer Grievance';

  const subject = `Formal Grievance: ${issueLabel} regarding ${item} [Ref: ${consumerCase.id}]`;

  // Build body strictly with confirmed facts
  const lines: string[] = [
    `To: ${recipientTitle}${recipientEmail ? ` (${recipientEmail})` : ''}`,
    `Subject: ${subject}`,
    '',
    `Dear Grievance Officer,`,
    '',
    `I am writing to lodge a formal consumer grievance regarding my purchase of ${item} on ${platform}${
      consumerCase.purchaseDate ? ` ordered on ${consumerCase.purchaseDate}` : ''
    }${consumerCase.amountInr !== null ? ` for a sum of ${amountStr}` : ''}.`,
    '',
    `1. STATEMENT OF FACTS:`,
  ];

  if (consumerCase.confirmedFacts.length > 0) {
    consumerCase.confirmedFacts.forEach((fact) => {
      lines.push(`• ${fact}`);
    });
  } else {
    lines.push(`• ${consumerCase.issueSummary}`);
  }

  lines.push('');
  lines.push(`2. EVIDENCE MAINTAINED:`);
  const presentEvidence = consumerCase.evidence.filter((e) => e.present);
  if (presentEvidence.length > 0) {
    presentEvidence.forEach((ev) => {
      lines.push(`• [Attached/Available] ${ev.label}${ev.note ? `: ${ev.note}` : ''}`);
    });
  } else {
    lines.push(`• Transaction and communication records preserved.`);
  }

  lines.push('');
  lines.push(`3. RELIEF REQUESTED:`);
  lines.push(`• ${consumerCase.desiredOutcome || 'Immediate resolution of this dispute through replacement or full refund.'}`);

  lines.push('');
  lines.push(
    `4. STATUTORY TIMEFRAME:`,
    `As per Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020, please acknowledge the receipt of this grievance within forty-eight (48) hours and assign a docket reference. I request formal redressal of this matter within one month as mandated under Rule 5(5).`,
    '',
    `Kindly provide your written reply to this communication.`,
    '',
    `Yours sincerely,`,
    `[Your Full Name]`,
    `[Your Contact Phone Number]`,
    `[Your Email Address]`
  );

  const body = lines.join('\n');

  // Build safe mailto link if an email is known
  let mailtoUrl: string | undefined = undefined;
  if (recipientEmail) {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    mailtoUrl = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  return {
    recipientTitle,
    recipientEmail,
    subject,
    body,
    mailtoUrl,
  };
}
