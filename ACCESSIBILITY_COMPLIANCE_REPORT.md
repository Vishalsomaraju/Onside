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

## 4. Visual Design System & Contrast
- **Feature**: WCAG AA Programmatic Contrast Enforcement
- **Proof**: `frontend/src/__tests__/accessibility.test.ts` explicitly asserts mathematically that all foreground-to-background combinations in the CSS design token system (`frontend/src/index.css`) meet WCAG AA requirements (>4.5:1 for text, >3.0:1 for boundaries/focus rings).
- **Feature**: Semantic Congestion Indicators
- **Proof**: Congestion levels are conveyed using both a styled dot and explicit text, ensuring state is not communicated by color alone. Tested in `frontend/src/__tests__/RouteResult.test.tsx`.
- **Feature**: Perceivable Loading States
- **Proof**: The submit button has a distinct, tested `.loading-pulse` state that safely falls back to a non-animated border in `@media (prefers-reduced-motion: reduce)`, ensuring loading states are visible without requiring motion.
