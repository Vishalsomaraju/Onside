# Security Posture

The Smart Stadiums system utilizes several security patterns to enforce safety across all API surfaces.

## Input Validation
- **Tool**: `zod`
- **Location**: `shared/src/types/routeRequest.ts` & `backend/src/api/route.ts`
- **Strategy**: Every incoming request to `POST /api/route` is rigidly validated against `RouteRequestSchema`. Invalid data is automatically rejected with a clean `400 Bad Request` containing safe validation failure messages.

## Rate Limiting
- **Tool**: `express-rate-limit`
- **Location**: `backend/src/middleware/rateLimit.ts`
- **Strategy**: The API is restricted to 30 requests per minute per IP address. This mitigates automated DDoS attacks or scraping against the pathfinding endpoint.

## Error Handling & Information Leakage
- **Location**: `backend/src/middleware/errorHandler.ts`
- **Strategy**: A global error handler catches all unhandled exceptions. It suppresses stack traces and internal logic details, returning a standardized `500 Internal Server Error` with a generic, safe payload.

## Secure HTTP Headers
- **Tool**: `helmet`
- **Location**: `backend/src/app.ts`
- **Strategy**: Adds essential HTTP headers to block cross-site scripting (XSS), prevent clickjacking, and enforce strict content security policies.
