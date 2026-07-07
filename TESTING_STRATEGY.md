# Testing Strategy

## Coverage Target
- **Core Logic Gate**: All code residing in the `domain/` and `backend/services/` (future) packages is strictly bound to a `>=90%` test coverage requirement.

## Current Test Layers
### Domain Layer (`domain/__tests__/`)
- **Graph Validity**: Tests ensure the reference stadium has zero orphan nodes and zero dangling edges.
- **Congestion Simulation**: Tests enforce determinism across all permutations of zones and match phases.
- Pathfinding logic, congestion generation, and graph integrity.
- Expected coverage: >=90%.

### Frontend Integration & Accessibility (`frontend/`)
- Tool: `vitest` with `jsdom`, `@testing-library/react`, and `axe-core`
- Interaction Tests: Verify the UI components respond correctly to inputs and form submission (e.g., `App.test.tsx` full workflow).
- Accessibility Tests: Automated DOM accessibility checks using `vitest-axe` on all rendered components to ensure no critical/serious violations exist.
- Expected coverage: >=90% line coverage.

### Backend API Layer (`backend/src/__tests__/`)
- **Input Validation**: Tests prove `RouteRequestSchema` accurately rejects missing fields and invalid enumerations with HTTP 400.
- **Rate Limiting**: Automated tests slam the endpoint to confirm `express-rate-limit` enforces the 30 rpm boundary (HTTP 429).
- **Error Handling**: Tests confirm the global error middleware suppresses stack traces and returns a clean, uniform JSON schema on unexpected faults.
