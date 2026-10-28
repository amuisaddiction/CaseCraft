/**
 * Best-effort client-side masking of sensitive identifiers before sending text
 * to an external AI service.
 *
 * NOTE: As noted in the privacy policy, this is a best-effort pre-filter and does not
 * guarantee absolute anonymisation. Users are always shown what information leaves the device.
 */
export function maskLikelySensitiveNumbers(input: string): string {
  if (!input) return '';

  return (
    input
      // Indian 10-digit mobile numbers with optional +91 / 0 prefix and spaces/dashes
      .replace(/(?:\+91[\s-]?)?(?:\b0)?[6-9]\d{4}[\s-]?\d{5}\b/g, '[PHONE REDACTED]')
      // 16-digit payment card numbers (with spaces or hyphens)
      .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[CARD REDACTED]')
      // 12-digit Aadhaar number pattern (4-4-4)
      .replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, '[ID REDACTED]')
      // Standard personal email addresses (while preserving support emails if needed)
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, '[EMAIL REDACTED]')
      // UPI IDs (e.g., user@okhdfcbank, name@paytm)
      .replace(/\b[\w.-]+@(okhdfcbank|oksbi|okaxis|okicici|paytm|ybl|ibl|apl|axl)\b/gi, '[UPI REDACTED]')
  );
}

/**
 * Returns a summary of privacy redactions performed for user transparency.
 */
export function getRedactionSummary(_original: string, redacted: string): {
  hadRedactions: boolean;
  redactedTypes: string[];
} {
  const redactedTypes: string[] = [];
  if (redacted.includes('[PHONE REDACTED]')) redactedTypes.push('Phone number');
  if (redacted.includes('[CARD REDACTED]')) redactedTypes.push('Card number');
  if (redacted.includes('[ID REDACTED]')) redactedTypes.push('National ID / Aadhaar');
  if (redacted.includes('[EMAIL REDACTED]')) redactedTypes.push('Email address');
  if (redacted.includes('[UPI REDACTED]')) redactedTypes.push('UPI ID');

  return {
    hadRedactions: redactedTypes.length > 0,
    redactedTypes,
  };
}
