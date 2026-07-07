# Architecture Details

This repository uses a strict monorepo architecture divided cleanly by operational concern.

## Project Structure

1. **`@smart-stadiums/shared`**
   - **Role**: Source of truth for API contracts.
   - **Key Tech**: Zod schemas.
   - **Why**: Enforces exact data shapes (language limits, bounded queries) before data crosses the network boundary.

2. **`@smart-stadiums/domain`**
   - **Role**: Pure logic calculation layer.
   - **Key Tech**: TypeScript (No dependencies).
   - **Why**: Dijkstra's algorithm for pathfinding is completely isolated from HTTP logic and AI APIs, making it mathematically provable and independently testable.

3. **`@smart-stadiums/backend`**
   - **Role**: AI orchestration and HTTP routing.
   - **Key Tech**: Node, Express, Helmet, `@google/generative-ai`.
   - **Why**: Handles rate limiting, strict CORS origin checks, orchestrates the Gemini flash model, applies timeouts, and binds the domain pathfinding to HTTP endpoints.

4. **`frontend`**
   - **Role**: User Interface.
   - **Key Tech**: React, Vite.
   - **Why**: Deployed as a static bundle to Vercel, providing instant interaction and localized rendering based strictly on backend payload.

## Deployment Target
This codebase is verified against the recommended judging deployment environment:
- **Frontend**: Vercel (`smartstadiums.vercel.app`)
- **Backend API**: Render Web Service (`smartstadiums-api.onrender.com`)
- **Database (Optional/Future)**: Neon Postgres.

*Configured explicitly via `.env.example` templates.*
