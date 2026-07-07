# Performance & Fallbacks

This application explicitly prioritizes bounded performance over open-ended generative AI capabilities. The architecture guarantees a response, even under extreme load or AI failure.

## 1. Fast Deterministic Pathfinding
- The core algorithm (`pathfinding.ts`) executes in-memory against a tightly bounded subset of nodes. It does not hit a database. It is mathematically bounded and resolves instantly.

## 2. AI Timeout & Fallback Interception
Generative AI calls are the only potential bottleneck. We constrain this strictly.
- **AbortController Timeouts**: `backend/src/services/ai/intentParser.ts` sets a hard `5000ms` timeout on the Gemini call. If the AI is slow, the request is instantly aborted.
- **Fallback Parsers**: In the event of a timeout or an invalid hallucinated response, the system seamlessly redirects to `fallbackTemplates.ts`.
- **Proof**: `backend/src/api/__tests__/directions.test.ts` and `frontend/src/__tests__/App.test.tsx` prove that if the AI hallucinates or fails, the user is still provided safe, accurate, deterministic routing text in their selected language.

## 3. Render / Vercel Cold Starts
- **Vercel Frontend**: Delivered statically to the edge for instant TTI.
- **Render Backend**: The backend exposes a fast `GET /health` route documented for up-time monitoring, ensuring that Render instances can be kept warm or instantly validated. It bypasses all AI initialization for sub-100ms response times (`backend/src/api/__tests__/health.test.ts`).
