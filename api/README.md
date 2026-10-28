# Serverless API endpoints

Expected endpoints:
- `POST /api/extract-case`: accept a complaint string, call the verified AI provider server-side, validate output, return structured fields.
- `POST /api/draft-message`: accept confirmed case facts and draft type, return an editable message.

These endpoints are **not implemented in this starter pack**. Do not expose provider keys to the browser. Add request-size limits, input validation, safe error handling, and tests before implementation.
