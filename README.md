# Stadium Wayfinding & Assistance Concierge

## Challenge Fit & Solution Scope
This project delivers a **strict, single-purpose wayfinding concierge** for the 2026 World Cup. It avoids feature-creep (no ticketing, no generic chatbots) and focuses entirely on solving the most critical fan problem: **navigating a congested, high-density environment safely and accessibly.**

The application natively supports **English, Spanish, and French**—the official languages of the 2026 North American host nations (USA, Mexico, Canada)—and guarantees that **all route decisions are deterministic**, using AI purely for natural-language parsing and phrasing.

## Persona & Core Workflow
**Persona**: An international fan attending a World Cup match who needs to find their seat, food, or a restroom.  
**Workflow**: 
1. Fan submits a natural-language request in EN/ES/FR (e.g., "I need a wheelchair accessible bathroom").
2. AI parses the *intent* (destination and accessibility needs) and bounds it strictly against a hardcoded domain graph.
3. The deterministic backend calculates the optimal step-free, congestion-aware route.
4. AI phrases the route into conversational directions in the fan's requested language.

## Architecture & Deployment Proof
The codebase enforces strict, typed boundaries between the `frontend`, `backend`, `domain`, and `shared` modules.

**Verified Live Deployment Architecture**:
- **Frontend**: Vercel (React + Vite)
- **Backend API**: Render (Node + Express)
- **Database (Optional)**: Neon Postgres (Connection strings mapped via Render)

To verify the separation of concerns and deployment readiness, view `.env.example` to see how `FRONTEND_ORIGIN` securely locks down CORS, and how `VITE_API_BASE_URL` dynamically points the Vercel app to the Render API.

## Documentation Index
- [Judge Evidence & Rubric Mapping](./JUDGE_EVIDENCE.md) - **Start Here**
- [Solution Brief](./SOLUTION_BRIEF.md)
- [Architecture Details](./ARCHITECTURE.md)
- [Security Posture](./SECURITY.md)
- [Performance & Fallbacks](./PERFORMANCE_REPORT.md)
- [Testing Strategy & CI Proof](./TESTING_STRATEGY.md)
- [Accessibility Compliance](./ACCESSIBILITY_COMPLIANCE_REPORT.md)

## Live Demo & Local Verification
To run the full stack locally and verify the test invariants:
1. `npm install`
2. `npm run test --workspaces -- --coverage` (Verifies 90 tests covering routing, localization, security, and UI rendering)
3. `npm run typecheck && npm run build` (Verifies deployment-ready compilation)
4. Start via `npm run dev` and navigate to `http://localhost:5173`.
