import type { ExtractedCase } from './aiSchema';

const PLATFORM_PATTERNS = [
  'flipkart',
  'amazon',
  'meesho',
  'myntra',
  'ajio',
  'nykaa',
  'zomato',
  'swiggy',
  'blinkit',
  'zepto',
  'tata cliq',
  'jiomart',
  'croma',
  'reliance digital',
];

/**
 * Deterministic local rule-based extractor.
 * Extracts confirmed facts directly from text without external API dependency.
 * Unknown facts strictly remain null.
 */
export function extractCaseLocally(text: string): ExtractedCase {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // 1. Detect Platform
  let detectedPlatform: string | null = null;
  for (const plat of PLATFORM_PATTERNS) {
    if (new RegExp(`\\b${plat}\\b`, 'i').test(clean)) {
      // Capitalize nicely
      detectedPlatform = plat
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      break;
    }
  }

  // 2. Detect Amount (INR)
  let detectedAmount: number | null = null;
  const amountMatch = clean.match(/(?:(?:rs\.?|inr|₹)\s*(\d[\d,]*)|(\d[\d,]*)\s*(?:rs|rupees|inr))/i);
  if (amountMatch) {
    const rawNum = (amountMatch[1] || amountMatch[2]).replace(/,/g, '');
    const parsed = parseInt(rawNum, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 10000000) {
      detectedAmount = parsed;
    }
  }

  // 3. Detect Issue Type
  let issueType: ExtractedCase['issueType'] = 'other';
  if (/\b(wrong|galat|different item|dusra product|incorrect)\b/i.test(lower)) {
    issueType = 'wrong_item';
  } else if (/\b(defect|damage|broken|kharab|tuta|not working|faulty)\b/i.test(lower)) {
    issueType = 'defective_item';
  } else if (/\b(replace|replacement|badal)\b/i.test(lower)) {
    issueType = 'replacement';
  } else if (/\b(refund|paise|money back|return)\b/i.test(lower)) {
    issueType = 'refund';
  }

  // 4. Detect Dates
  let detectedDate: string | null = null;
  const dateMatch = clean.match(
    /\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)(?:\s+\d{2,4})?|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/i
  );
  if (dateMatch) {
    detectedDate = dateMatch[1];
  }

  // 5. Detect Item description heuristic
  let itemDescription: string | null = null;
  const itemMatch = clean.match(
    /(?:order(?:ed| kiya)?|bought|purchased|item(?: is)?)\s+([a-zA-Z0-9\s-]{3,35}?)(?:\s+for|\s+se|\s+on|\s+at|\s+ko|\.|\,|$)/i
  );
  if (itemMatch && itemMatch[1] && !PLATFORM_PATTERNS.includes(itemMatch[1].trim().toLowerCase())) {
    itemDescription = itemMatch[1].trim();
  }

  // 6. Assemble Confirmed & Missing Facts
  const confirmedFacts: string[] = [];
  const missingFacts: string[] = [];

  if (detectedPlatform) {
    confirmedFacts.push(`Platform / Seller: ${detectedPlatform}`);
  } else {
    missingFacts.push('Seller or platform name not identified in complaint text.');
  }

  if (itemDescription) {
    confirmedFacts.push(`Product / Item: ${itemDescription}`);
  } else {
    missingFacts.push('Specific product model or item name not clearly stated.');
  }

  if (detectedAmount !== null) {
    confirmedFacts.push(`Transaction amount: ₹${detectedAmount.toLocaleString('en-IN')}`);
  } else {
    missingFacts.push('Transaction amount not mentioned.');
  }

  if (detectedDate) {
    confirmedFacts.push(`Date referenced: ${detectedDate}`);
  } else {
    missingFacts.push('Exact order or complaint date not specified.');
  }

  // Always require order invoice
  missingFacts.push('Order ID / Tax invoice number required for formal notice.');

  // Desired Outcome
  let desiredOutcome: string | null = null;
  if (issueType === 'refund') {
    desiredOutcome = detectedAmount
      ? `Full refund of ₹${detectedAmount.toLocaleString('en-IN')}`
      : 'Full refund to original payment source';
  } else if (issueType === 'replacement') {
    desiredOutcome = 'Replacement with undamaged, verified unit';
  } else if (issueType === 'defective_item' || issueType === 'wrong_item') {
    desiredOutcome = detectedAmount
      ? `Replacement or full refund of ₹${detectedAmount.toLocaleString('en-IN')}`
      : 'Replacement or full refund';
  }

  // Summary
  const issueSummary =
    clean.length > 200 ? clean.slice(0, 197) + '...' : clean || 'Unspecified complaint details';

  return {
    issueType,
    platformOrSeller: detectedPlatform,
    itemDescription,
    amountInr: detectedAmount,
    purchaseDate: detectedDate,
    complaintDate: null,
    issueSummary,
    desiredOutcome,
    confirmedFacts,
    missingFacts,
  };
}

