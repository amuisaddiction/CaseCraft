import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { App } from '../src/app/App';
import { clearAllCases } from '../src/lib/storage';

describe('End-to-End Case Workflow Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
    await clearAllCases();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders initial intake screen with Wispr Voice hint and folder tabs', () => {
    render(<App />);
    expect(screen.getByText('Tell me what happened.')).toBeDefined();
    expect(screen.getAllByText(/Wispr Flow/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Build My Case File/i })).toBeDefined();
  });

  it('loads sample case on clicking sample case button', async () => {
    render(<App />);
    const sampleButtons = screen.getAllByRole('button', { name: /Sample Case/i });
    fireEvent.click(sampleButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/HAQ-2026-0842/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Flipkart/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/boAt wireless headphones/).length).toBeGreaterThan(0);
    });
  });

  it('handles Hinglish complaint intake and builds case file locally without AI key', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Maine ek order kiya tha/i);
    fireEvent.change(textarea, {
      target: {
        value: 'Maine 10 Oct ko Amazon se ek smart watch order kiya tha for Rs 2499. Received empty box.',
      },
    });

    const submitBtn = screen.getByRole('button', { name: /Build My Case File/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/HAQ-/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Amazon/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/2,499/).length).toBeGreaterThan(0);
    });
  });

  it('allows user to edit facts, toggle evidence, and confirm case to view ladder', async () => {
    render(<App />);
    const sampleButtons = screen.getAllByRole('button', { name: /Sample Case/i });
    fireEvent.click(sampleButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/HAQ-2026-0842/).length).toBeGreaterThan(0);
    });

    // Toggle evidence item
    const evidenceItem = screen.getByText('Customer care chat transcript with bot');
    fireEvent.click(evidenceItem);

    // Confirm case details to proceed to ladder
    const confirmBtn = screen.getByRole('button', { name: /Confirm Case & View Escalation Ladder/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText('Practical Escalation Ladder')).toBeDefined();
      expect(screen.getByText('Recommended Next Step')).toBeDefined();
      expect(screen.getAllByText(/Rule 5\(4\)/i).length).toBeGreaterThan(0);
    });
  });

  it('navigates to response log, logs refusal, and observes ladder updating to NCH', async () => {
    render(<App />);
    const sampleButtons = screen.getAllByRole('button', { name: /Sample Case/i });
    fireEvent.click(sampleButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/HAQ-2026-0842/).length).toBeGreaterThan(0);
    });

    // Confirm to ladder
    fireEvent.click(screen.getByRole('button', { name: /Confirm Case & View Escalation Ladder/i }));

    // Click Log Company Response
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Log Company Response/i })).toBeDefined();
    });
    fireEvent.click(screen.getByRole('button', { name: /Log Company Response/i }));

    // On Response Log view, select "Refused"
    const refusedOption = screen.getByText('Refused');
    fireEvent.click(refusedOption);

    // Enter notes
    const notesInput = screen.getByPlaceholderText(/Dictate using Wispr Flow or type summary/i);
    fireEvent.change(notesInput, {
      target: { value: 'Customer care rejected refund claim saying 7-day return expired.' },
    });

    // Record response
    const recordBtn = screen.getByRole('button', { name: /Record Response & Update Ladder/i });
    fireEvent.click(recordBtn);

    // Should return to ladder and recommend NCH
    await waitFor(() => {
      expect(screen.getByText(/Escalate to National Consumer Helpline \(NCH\)/i)).toBeDefined();
      expect(screen.getAllByText(/consumerhelpline\.gov\.in/i).length).toBeGreaterThan(0);
    });
  });

  it('guards resolution confirmation: requires explicit confirmation modal', async () => {
    render(<App />);
    const sampleButtons = screen.getAllByRole('button', { name: /Sample Case/i });
    fireEvent.click(sampleButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/HAQ-2026-0842/).length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Case & View Escalation Ladder/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Log Company Response/i })).toBeDefined();
    });
    fireEvent.click(screen.getByRole('button', { name: /Log Company Response/i }));

    // Select Fully Resolved
    fireEvent.click(screen.getByText('Fully Resolved'));

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /Record Response & Update Ladder/i }));

    // Expect confirmation guard modal
    expect(screen.getByText('Confirm Case Resolution')).toBeDefined();
    expect(screen.getByText(/refund received in your bank account/i)).toBeDefined();

    // Confirm resolution in modal
    fireEvent.click(screen.getByRole('button', { name: /Yes, Confirm Resolution/i }));

    await waitFor(() => {
      expect(screen.getByText('Case Resolved')).toBeDefined();
    });
  });

  it('tests reset action clears case and returns to intake', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    render(<App />);
    const sampleButtons = screen.getAllByRole('button', { name: /Sample Case/i });
    fireEvent.click(sampleButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/HAQ-2026-0842/).length).toBeGreaterThan(0);
    });

    const resetBtn = screen.getByTitle('Clear current case');
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getByText('Tell me what happened.')).toBeDefined();
    });
  });
});
