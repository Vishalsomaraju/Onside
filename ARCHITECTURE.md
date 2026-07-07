# Architecture

## Layer Boundaries

1.  **Domain (`domain/`)**: Pure business logic. Contains the stadium graph (`graph.ts`), deterministic congestion simulator (`congestion.ts`), and pathfinding algorithm (`pathfinding.ts`). Zero dependencies on UI or transport layers.
2.  **Backend API (`backend/api/`, `backend/middleware/`)**: The transport layer built on Express. Thin route handlers (`route.ts`) validate requests, invoke the domain layer, and map responses. Zero pathfinding logic exists here.
3.  **Backend Services (`backend/services/`)**: Orchestration for external AI providers. Specifically, `backend/services/ai/` isolates all prompts and Gemini SDK calls for parsing free-text queries (`intentParser.ts`) and formatting natural language directions (`directionsGenerator.ts`). Includes strict timeouts and deterministic fallbacks.
4.  **Shared Types (`shared/types/`)**: Centralized Zod schemas (e.g. `routeRequest.ts`) and TypeScript interfaces used by both the frontend and backend.
5.  **Frontend (`frontend/`)**: React presentation layer focused on accessibility. No pathfinding or AI logic inline.
