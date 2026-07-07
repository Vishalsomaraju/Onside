# Stadium Wayfinding & Assistance Concierge

## Challenge Fit
Smart Stadiums tackles the challenge of delivering seamless, accessible, and personalized wayfinding for diverse attendees at a World Cup stadium. By blending deterministic, congestion-aware pathfinding with generative AI, it interprets natural-language requests and returns personalized, accessible directions in the fan's preferred language.

## Core Workflow
A fan asks for directions to a destination (e.g. seat, food, gate) inside the stadium. The app calculates a congestion-aware, accessibility-filtered route and uses AI to explain it in the fan's preferred language.

## Documentation
- [Solution Brief](./SOLUTION_BRIEF.md)
- [Architecture](./ARCHITECTURE.md)
- [Security](./SECURITY.md)
- [Performance](./PERFORMANCE_REPORT.md)
- [Testing Strategy](./TESTING_STRATEGY.md)
- [Accessibility](./ACCESSIBILITY_COMPLIANCE_REPORT.md)
- [Judge Evidence](./JUDGE_EVIDENCE.md)

## Tech Stack
- **Monorepo**: npm workspaces
- **Backend**: Node.js, Express, TypeScript, Zod, express-rate-limit, Helmet
- **Frontend**: React, Vite, CSS (no framework)
- **AI**: Google Gemini (gemini-1.5-flash) via `@google/generative-ai`
- **Testing**: Jest (domain, backend), Vitest + jsdom + axe-core (frontend)

## Local Setup
1. Clone the repository and navigate into it: `cd Onside`
2. Install all dependencies across workspaces: `npm install`
3. Set your Gemini API key as an environment variable (`AI_API_KEY`). For example, in PowerShell: `$env:AI_API_KEY="your-key"` or in Bash: `export AI_API_KEY="your-key"`.
4. Run the development environment from the root directory: `npm run dev`
5. The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.
