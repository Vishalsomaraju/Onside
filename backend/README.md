# Backend Layer

`backend/api/`: route handlers only — validate request, call domain layer, call AI orchestration service, map result to response. No business logic inline.
`backend/services/`: AI orchestration — prompt construction, timeout, retry, fallback trigger. Isolated from route handlers.
