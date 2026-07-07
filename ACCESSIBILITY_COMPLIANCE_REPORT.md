# Accessibility Compliance Report

This application views Accessibility as a core routing requirement, not just a UI checklist.

## 1. Domain-Level Physical Accessibility
- **Feature**: Wheelchair / Step-Free Routing
- **Proof**: `domain/src/__tests__/pathfinding.test.ts` proves that when `accessible: true` is requested, the Dijkstra algorithm automatically bypasses any graph edges marked with `requiresStairs`. The AI is physically barred from returning a route with stairs to a disabled user.

## 2. Structural UI Accessibility
- **Feature**: ARIA Compliance and Semantic HTML
- **Proof**: `frontend/src/__tests__/App.test.tsx` integrates `vitest-axe` to assert zero structural accessibility violations on the DOM.
- **Feature**: Safe Error Rendering
- **Proof**: If the backend fails or returns no route, the UI does not crash or silently fail. It renders a safe fallback error state that is accessible and readable by screen readers.

## 3. Linguistic Accessibility
- **Feature**: 2026 Host Nation Support
- **Proof**: Natively supports English, Spanish, and French, mapping to the USA, Mexico, and Canada World Cup audiences. Tested via `shared/src/__tests__/directionsRequest.test.ts` and `frontend/src/__tests__/App.test.tsx`.
