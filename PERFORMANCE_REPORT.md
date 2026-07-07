# Performance & Efficiency Report

The Smart Stadiums application incorporates several architectural decisions focused on minimizing response latency, optimizing compute resources, and providing a snappy user experience even under heavy load.

## 1. Domain Layer Efficiency
- **Location**: `domain/src/pathfinding.ts`
- **Strategy**: The core routing algorithm uses Dijkstra's shortest path algorithm over an in-memory graph.
- **Why it matters**: Complex congestion checks and accessibility filters are evaluated statically via computationally inexpensive graph traversals. By keeping this logic entirely separated from the backend API handlers, it can execute synchronously in `< 5ms` on standard hardware, avoiding any I/O overhead.

## 2. Frontend Debouncing and Optimizations
- **Location**: `frontend/src/App.tsx` & `frontend/src/hooks/useRoute.ts`
- **Strategy**: 
  - Network requests to the backend are only dispatched upon explicit form submission, rather than per keystroke on the text input.
  - State updates are carefully managed to avoid unnecessary DOM re-renders. 
  - UI state leverages an `isLoading` boolean to disable inputs during network transit, preventing duplicate parallel requests.

## 3. Strict AI Bounding & Timeouts
- **Location**: `backend/src/services/ai/intentParser.ts` & `backend/src/services/ai/directionsGenerator.ts`
- **Strategy**: 
  - Both AI interactions (Intent Parsing and Directions Generation) use `AbortController` bound to strict **5000ms timeouts**.
  - We exclusively use `gemini-1.5-flash`, the fastest and most efficient model available, to minimize generation latency.
  - If the Gemini API fails, times out, or produces invalid output, the service instantly falls back to deterministic parsing and direction generation.
- **Why it matters**: This prevents backend threads from hanging indefinitely while waiting for an external LLM, ensuring the API remains responsive to all users regardless of external provider health.

## 4. API Rate Limiting
- **Location**: `backend/src/middleware/rateLimit.ts`
- **Strategy**: The API enforces a limit of 30 requests per minute per IP address.
- **Why it matters**: Prevents malicious scraping or unintentional spam from exhausting server resources, keeping latency low for legitimate users.
