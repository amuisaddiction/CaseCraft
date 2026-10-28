interface ApiRequest {
  method?: string;
  body?: any;
}

interface ApiResponse {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

const EXTRACTION_SYSTEM_PROMPT = `
You are an expert consumer grievance specialist analyzing an Indian consumer's online shopping complaint.
Your job is to extract confirmed factual information into a clean JSON structure.

CRITICAL RULES:
1. ONLY extract facts explicitly stated by the user.
2. NEVER fabricate, guess, or invent an order number, seller name, date, price, or policy.
3. If an entity is not mentioned, return null for that field.
4. Distinguish clearly between what is confirmed and what critical facts are missing (e.g., missing invoice, missing purchase date).
5. Understand Hinglish (Hindi written in Roman script) and standard English.
6. The issueType must be one of: "refund", "replacement", "wrong_item", "defective_item", "other".

Return ONLY a valid JSON object with these keys:
{
  "issueType": "refund" | "replacement" | "wrong_item" | "defective_item" | "other",
  "platformOrSeller": string | null,
  "itemDescription": string | null,
  "amountInr": number | null,
  "purchaseDate": string | null,
  "complaintDate": string | null,
  "issueSummary": string,
  "desiredOutcome": string | null,
  "confirmedFacts": string[],
  "missingFacts": string[]
}
`;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { complaintText } = req.body || {};

  if (!complaintText || typeof complaintText !== 'string' || !complaintText.trim()) {
    return res.status(400).json({ error: 'complaintText is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server.',
      fallbackAvailable: true,
    });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: EXTRACTION_SYSTEM_PROMPT },
              { text: `User Complaint:\n${complaintText}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error:', response.status, errBody);
      return res.status(response.status).json({
        error: `AI provider error: ${response.statusText}`,
        fallbackAvailable: true,
      });
    }

    const data = (await response.json()) as any;
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return res.status(502).json({
        error: 'Empty response from AI provider.',
        fallbackAvailable: true,
      });
    }

    const parsed = JSON.parse(rawContent);
    return res.status(200).json({ caseData: parsed });
  } catch (err) {
    console.error('Extraction handler exception:', err);
    return res.status(500).json({
      error: (err as Error).message || 'Internal server error during extraction.',
      fallbackAvailable: true,
    });
  }
}
