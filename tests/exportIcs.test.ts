import { describe, expect, it } from 'vitest';
import { createReminderIcs } from '../src/lib/exportIcs';

describe('Calendar ICS Generator', () => {
  it('generates standard RFC 5545 compliant VCALENDAR format', () => {
    const title = 'Follow up with Flipkart Grievance Officer';
    const date = new Date('2026-11-01T10:00:00.000Z');
    const desc = 'Check for 48h acknowledgement docket under Rule 5(4).';

    const ics = createReminderIcs(title, date, desc);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Follow up with Flipkart Grievance Officer');
    expect(ics).toContain('DESCRIPTION:Check for 48h acknowledgement docket under Rule 5(4).');
    expect(ics).toContain('DTSTART:20261101T100000Z');
    expect(ics).toContain('DTEND:20261101T103000Z');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('escapes special characters correctly in summary and description', () => {
    const title = 'Check; follow-up, test & review';
    const date = new Date('2026-11-02T15:00:00.000Z');
    const desc = 'Line 1\nLine 2, with comma; and semicolon.';

    const ics = createReminderIcs(title, date, desc);

    expect(ics).toContain('SUMMARY:Check\\; follow-up\\, test & review');
    expect(ics).toContain('DESCRIPTION:Line 1\\nLine 2\\, with comma\\; and semicolon.');
  });
});
