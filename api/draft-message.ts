interface ApiRequest {
  method?: string;
  body?: any;
}

interface ApiResponse {
  status: (code: number) => {
    json: (data: any) => void;
  };
}

const DRAFT_SYSTEM_PROMPT = `
You are an expert consumer advocate and grievance drafting assistant in India.
Your task is to draft a formal, professional, polite, and legally grounded complaint to the designated Grievance Officer of an e-commerce platform.

STRICT CONSTRAINTS:
1. ONLY use confirmed facts provided in the input. Never invent order numbers, dates, or amounts.
2. Cite Rule 5(4) of the Consumer Protection (E-Commerce) Rules, 2020 requiring 48-hour acknowledgement.
3. Cite Rule 5(5) regarding one-month redressal.
4. Keep the tone calm, objective, factual, and non-threatening.
5. Provide placeholders like [Your Name] and [Contact Number] for personal data.

Return ONLY a JSON object with:
{
  "recipient": string,
  "subject": string,
  "body": string
}
`;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { caseData } = req.body || {};
  if (!caseData) {
    return res.status(400).json({ error: 'caseData is required.' });
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
              { text: DRAFT_SYSTEM_PROMPT },
              { text: `Confirmed Case Facts:\n${JSON.stringify(caseData, null, 2)}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error during drafting:', response.status, errBody);
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
    return res.status(200).json({ draft: parsed });
  } catch (err) {
    console.error('Draft handler exception:', err);
    return res.status(500).json({
      error: (err as Error).message || 'Internal server error during draft generation.',
      fallbackAvailable: true,
    });
  }
}
