# Solution Brief

## The Problem
For the 2026 World Cup hosted across North America (USA, Mexico, Canada), massive stadiums will see unprecedented density and linguistic diversity. A generic AI chatbot cannot be trusted to guide fans. If an AI hallucinates a route to a closed gate during an emergency, it is a catastrophic failure.

## The Solution: Smart Stadiums Wayfinding
We built a strict, bounded concierge service.
- **Single-Purpose Focus**: It only handles wayfinding (restrooms, food, seats). No ticketing, no irrelevant conversations.
- **Tri-Lingual Localization**: Natively supports English, Spanish, and French.
- **Deterministic AI**: The AI is ONLY used to parse natural language intent (e.g. "donde esta el baño sin escaleras") and to phrase the final output. The actual routing engine is a hardcoded Dijkstra's algorithm that guarantees accurate paths, stair-avoidance, and congestion mitigation.

## Why This Wins
1. **Verifiable Safety**: You can prove mathematically that the AI cannot override the graph paths (`backend/src/api/__tests__/security.test.ts`).
2. **Immediate Deployment**: Built explicitly for the modern web (Vercel + Render + Neon) with exact CORS locking and health-check monitoring ready on day one.
3. **Accessibility Native**: Automatically filters step-free routes, and guarantees ARIA-compliant UI rendering.
