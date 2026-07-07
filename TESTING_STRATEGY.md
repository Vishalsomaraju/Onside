# Testing Strategy

## Coverage Target
- **Core Logic Gate**: All code residing in the `domain/` and `backend/services/` (future) packages is strictly bound to a `>=90%` test coverage requirement.

## Current Test Layers
### Domain Layer (`domain/__tests__/`)
- **Graph Validity**: Tests ensure the reference stadium has zero orphan nodes and zero dangling edges.
- **Congestion Simulation**: Tests enforce determinism across all permutations of zones and match phases.
- **Pathfinding & Accessibility**: Tests verify valid routing, correct handling of unreachable destinations, and strictly avoiding `stairsOnly` paths when accessibility is required.

### Backend API Layer (`backend/src/__tests__/`)
- **Input Validation**: Tests prove `RouteRequestSchema` accurately rejects missing fields and invalid enumerations with HTTP 400.
- **Rate Limiting**: Automated tests slam the endpoint to confirm `express-rate-limit` enforces the 30 rpm boundary (HTTP 429).
- **Error Handling**: Tests confirm the global error middleware suppresses stack traces and returns a clean, uniform JSON schema on unexpected faults.
