# Testing Strategy & CI Proof

The system relies on an aggressive, invariant-focused test suite verifying every component from schema to render. We have 81 total tests covering routing invariants, AI containment, fallback paths, and UI rendering.

## 1. Domain (Routing Invariants)
- **Tooling**: Jest
- **Focus**: Pure mathematical verification of Dijkstra's algorithm logic.
- **Proof**: `domain/src/__tests__/pathfinding.test.ts` mathematically asserts that routes correctly avoid stairs when `accessible: true` is passed, and dynamically adjust weights based on current congestion levels.

## 2. Shared (Contract Enforcement)
- **Tooling**: Jest
- **Focus**: Preventing malformed payloads from touching the application logic.
- **Proof**: `shared/src/__tests__/directionsRequest.test.ts` validates that language must strictly equal `en`, `es`, or `fr`, query strings are bounded to `<200` characters, and control characters are scrubbed.

## 3. Backend (API & Security)
- **Tooling**: Jest + Supertest
- **Focus**: Verifying security headers, AI fallback mechanisms, intent parsing, and endpoint health.
- **Proof**: 
  - `backend/src/api/__tests__/security.test.ts` asserts malicious AI-prompt injection fails safely.
  - `backend/src/services/ai/__tests__/fallbackTemplates.test.ts` verifies localized deterministic fallbacks for EN/ES/FR routing text.
  - `backend/src/api/__tests__/health.test.ts` verifies the high-speed `/health` endpoint bypasses AI.

## 4. Frontend (UI Rendering & Accessibility)
- **Tooling**: Vitest + React Testing Library + axe-core
- **Focus**: Proving the user flow from dropdown selection to route rendering.
- **Proof**: 
  - `frontend/src/__tests__/App.test.tsx` proves that a French localization request safely updates the UI.
  - `App.test.tsx` proves that safe failure states (no route found, API error) render an accessible warning without crashing the React DOM.
  - `vitest-axe` enforces zero structural accessibility violations on the rendered HTML.
