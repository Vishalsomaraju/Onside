# Judge Evidence

This document maps the project's implemented features directly against the 6 rubric items, providing concrete, file-path-backed proof of our architecture and constraints.

## 1. Problem Statement Alignment
- **Evidence**: The core workflow described in [`SOLUTION_BRIEF.md`](file:///e:/Onside/SOLUTION_BRIEF.md) and [`README.md`](file:///e:/Onside/README.md) aligns perfectly with the challenge of navigating massive, complex venues like FIFA World Cup stadiums.
- **Proof Locations**:
  - [`frontend/src/components/QueryForm.tsx`](file:///e:/Onside/frontend/src/components/QueryForm.tsx): The form seamlessly handles free-text queries, language selection, and accessible routing requests in a single, un-bloated screen.

## 2. Code Quality
This project adheres to a strict separation of concerns, maintaining a pure domain layer free of AI or framework coupling.
- **Pure Domain Layer**: The entire routing logic is computationally isolated.
  - [`domain/src/pathfinding.ts`](file:///e:/Onside/domain/src/pathfinding.ts): Houses the core Dijkstra algorithm. Does not import Express, React, or any transport logic.
  - [`domain/src/congestion.ts`](file:///e:/Onside/domain/src/congestion.ts): Determines multipliers based purely on zone and match phase.
- **Thin API Handlers**: 
  - [`backend/src/api/route.ts`](file:///e:/Onside/backend/src/api/route.ts) & [`backend/src/api/directions.ts`](file:///e:/Onside/backend/src/api/directions.ts): Express routes merely validate inputs via Zod, invoke the domain and AI services, and return mapped responses.
- **Isolated AI Orchestration**:
  - [`backend/src/services/ai/intentParser.ts`](file:///e:/Onside/backend/src/services/ai/intentParser.ts): Isolates LLM intent extraction.
  - [`backend/src/services/ai/directionsGenerator.ts`](file:///e:/Onside/backend/src/services/ai/directionsGenerator.ts): Isolates LLM route description generation.

## 3. Security
- **Evidence**: We treat user input as untrusted and protect the backend from abuse and catastrophic crashes.
- **Proof Locations**:
  - [`shared/src/types/routeRequest.ts`](file:///e:/Onside/shared/src/types/routeRequest.ts): Uses Zod for strict type checking on network boundaries.
  - [`backend/src/middleware/rateLimit.ts`](file:///e:/Onside/backend/src/middleware/rateLimit.ts): Caps requests at 30 rpm per IP.
  - [`backend/src/middleware/errorHandler.ts`](file:///e:/Onside/backend/src/middleware/errorHandler.ts): Traps unhandled errors, ensuring no stack traces leak to the client.

## 4. Efficiency
- **Evidence**: The system relies on lightning-fast static routing paired with strictly-bounded AI tasks to provide sub-second (or highly constrained) response times.
- **Proof Locations**:
  - [`PERFORMANCE_REPORT.md`](file:///e:/Onside/PERFORMANCE_REPORT.md): Summarizes optimizations.
  - [`backend/src/services/ai/directionsGenerator.ts`](file:///e:/Onside/backend/src/services/ai/directionsGenerator.ts): Implements strict 5000ms `AbortController` timeouts for Gemini SDK calls, ensuring the API never hangs.

## 5. Testing
- **Evidence**: We integrated an uncompromising testing pipeline that mandates >=90% test coverage for all core logic.
- **Proof Locations**:
  - [`domain/package.json`](file:///e:/Onside/domain/package.json) & [`backend/jest.config.js`](file:///e:/Onside/backend/jest.config.js): Define strict 90% coverage threshold gates.
  - [`.github/workflows/ci.yml`](file:///e:/Onside/.github/workflows/ci.yml): Automatically runs `npm run test --workspaces -- --coverage` on every push and PR, failing the build if coverage drops.

## 6. Accessibility
- **Evidence**: Accessibility is a first-class citizen embedded in both the backend algorithms and the frontend UI.
- **Proof Locations**:
  - [`domain/src/pathfinding.ts`](file:///e:/Onside/domain/src/pathfinding.ts): The pathfinder algorithm explicitly skips edges marked `stairsOnly` if the user requires an accessible route.
  - [`frontend/src/components/RouteResult.tsx`](file:///e:/Onside/frontend/src/components/RouteResult.tsx): Uses `aria-live="polite"` regions for screen-reader announcements and presents the map route as a text-first ordered list, rather than an inaccessible SVG graphic.
  - [`frontend/src/App.css`](file:///e:/Onside/frontend/src/App.css): Includes `prefers-reduced-motion` media queries.

## Known Open Risks
- No significant AI model disagreements or structural divergence constraints were encountered that remain unresolved. The architecture successfully adheres strictly to the pure-domain constraint.
