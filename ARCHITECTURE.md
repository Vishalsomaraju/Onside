# Architecture

## Layer Boundaries

*   **`domain/`**: Pure functions only. Stadium graph model, weighted pathfinding (Dijkstra/A*), accessibility filtering, congestion simulation. Zero UI or transport imports.
*   **`backend/api/`**: Route handlers only. Validates requests, calls the domain layer, calls AI orchestration service, maps results to responses. No business logic inline.
*   **`backend/services/`**: AI orchestration. Prompt construction, timeouts, retries, fallback triggers. Isolated from route handlers.
*   **`shared/types/`**: Zod validation schemas and types defined once, imported by both frontend and backend. No duplicated validation rules.
*   **`frontend/`**: Query form, route/result display, accessibility-first components. No pathfinding or AI logic inline in components.
