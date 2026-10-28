# Technical Stack

## Recommended MVP stack
| Area | Choice | Why |
|---|---|---|
| App | Vite + React + TypeScript | Fast build and predictable component structure |
| Styling | Tailwind CSS | Rapid, consistent visual system |
| Icons | Lucide React | Small, consistent icon language |
| Validation | Zod | Validate AI output and form state |
| Local persistence | IndexedDB via `idb` | Cases survive refresh without an account |
| AI | Gemini Flash only after model/terms verification | Extraction and drafting, not legal decisions |
| Server endpoints | Vercel Functions / TypeScript | Keep API key off the client |
| Tests | Vitest + React Testing Library | Test deterministic logic and user flows |
| Deployment | Vercel | Simple static app + serverless functions |

## Dependency discipline
Install only what is used. Avoid animation libraries unless the native CSS transition is insufficient. Do not add a database, authentication, state-management framework, analytics SDK, or UI kit for the MVP.

## Important security rule
Never put a secret in a variable prefixed with `VITE_`; Vite exposes those variables to browser code. AI calls must go through a server endpoint. Do not commit `.env.local`.

## AI responsibility boundary
AI may extract facts and draft text from confirmed facts. It must not choose statutory deadlines or determine legal rights. The rules engine uses local, versioned rule data with source metadata. Validate AI JSON with Zod; if validation fails or the provider is unavailable, let the user edit facts manually or use clearly labelled sample mode.

## Provider verification before implementation
Before choosing the exact Gemini model:
1. Check current official model documentation and availability.
2. Check current free-tier quotas, regional availability, data use, and retention terms.
3. Confirm the model's structured-output behaviour and rate-limit responses.
4. Record the checked date in `docs/LEGAL_SOURCE_POLICY.md` or a separate provider note.
5. If unavailable, keep manual entry/sample mode instead of switching to an unreviewed provider.

## Proposed scripts
- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run lint` (only if lint config is actually installed)
