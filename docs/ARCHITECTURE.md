# Architecture

## Data flow
```text
User speaks with Wispr Flow / types
        |
        v
Complaint input (browser)
        |
        v
Client-side privacy scrub + user consent
        |
        v
POST /api/extract-case  -----> AI provider (server-side secret)
        |                              |
        <------- validated JSON --------
        |
        v
Editable Case File (user confirms facts)
        |
        +------> IndexedDB local storage
        |
        v
Deterministic ladder engine <----- versioned ladder.json
        |                              |
        v                              +-- sources + verification status
Ladder UI
        |
        +--> /api/draft-message (draft from confirmed facts)
        |
        +--> response log --> recompute ladder
        |
        +--> print/PDF + .ics export
```

## Suggested folder structure
```text
haq/
├── api/
│   ├── extract-case.ts
│   └── draft-message.ts
├── public/
│   ├── favicon.svg
│   └── ladder.json
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.ts
│   ├── components/
│   │   ├── CaseFile.tsx
│   │   ├── EvidenceChecklist.tsx
│   │   ├── Ladder.tsx
│   │   ├── ResponseLog.tsx
│   │   └── ui/
│   ├── data/
│   │   └── sampleCase.ts
│   ├── lib/
│   │   ├── aiSchema.ts
│   │   ├── privacy.ts
│   │   ├── ladderEngine.ts
│   │   ├── storage.ts
│   │   ├── exportIcs.ts
│   │   └── exportCase.ts
│   ├── styles/
│   │   └── index.css
│   ├── types/
│   │   └── case.ts
│   └── main.tsx
├── docs/
├── tests/
│   ├── ladderEngine.test.ts
│   ├── privacy.test.ts
│   └── caseFlow.test.tsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── MAIN.md
└── README.md
```

## Rules engine contract
Input: confirmed case facts + current rung status + rule data.
Output: ordered practical next steps, reasons, action requirements, source references, and any verified clock.
- Never call the LLM to compute dates or escalation order.
- A reminder date chosen by the user is not a statutory deadline.
- Every rule must have a source URL, source type, checked date, and verification status.
- If the source is missing or unverified, display “Needs verification” and do not show a legal countdown.
