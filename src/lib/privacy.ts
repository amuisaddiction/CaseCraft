/**
 * Best-effort client-side masking before sending text to an external AI provider.
 * This is not a guarantee of anonymisation. Review before shipping and add tests.
 */
export function maskLikelySensitiveNumbers(input: string): string {
  return input
    .replace(/\b\d{10}\b/g, '[PHONE REDACTED]')
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, '[NUMBER REDACTED]');
}
