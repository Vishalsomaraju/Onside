# Accessibility Compliance Report

The Smart Stadiums application incorporates accessibility (a11y) as a core feature rather than an afterthought. This document outlines the compliance measures implemented in Phase 4 for the primary routing workflow.

## Component Breakdown

### 1. `frontend/src/components/QueryForm.tsx`
- **Labels & Semantics**: 
  - Every input (`input`, `select`) has a dedicated `label` associated via `htmlFor`/`id`.
  - The form uses a `<fieldset>` and `<legend>` to logically group the query inputs.
  - The form is labeled by a heading using `aria-labelledby="form-heading"`.
  - The text input includes an `aria-describedby` hint text.
- **Keyboard Navigation**:
  - The form is fully navigable via `Tab`. All inputs and the submit button have visible focus states.
  - The `Submit` button is disabled dynamically to prevent empty queries, ensuring keyboard-only users don't encounter unhandled state errors.
- **Explicit Accessibility Control**:
  - An explicit `Require Accessible Route` checkbox is provided so users can forcefully request accessible routing (excluding `stairsOnly` paths) without relying solely on the AI inferring it from their text query.

### 2. `frontend/src/components/RouteResult.tsx`
- **Live Regions (`aria-live`)**:
  - A visually hidden `aria-live="polite"` region announces state transitions (e.g., `"Fetching route..."`, `"Route found."`, `"No route found."`) directly to screen readers without requiring focus changes.
- **Error Handling**:
  - Rendered error messages use `role="alert"` so they are immediately announced.
- **Text-First Content**:
  - The directions and route path are provided as plain, ordered `<ol>` text lists. No critical pathfinding information is hidden inside an inaccessible visual map or SVG.

### 3. Global Styles (`frontend/src/App.css`)
- **Reduced Motion**:
  - The application respects OS-level `prefers-reduced-motion` settings.
  - Using a global CSS media query (`@media (prefers-reduced-motion: reduce)`), all CSS animations and transitions are stripped to `0.01ms` (effectively disabled) when requested.
- **Visually Hidden Utility**:
  - A `.visually-hidden` class provides screen-reader-only text (such as the `aria-live` region content) while removing it from the visible layout in an accessible way.

## Automated Verification
- We utilize `vitest-axe` and `axe-core` to run automated accessibility checks against our React components in the CI pipeline. 
- Both `QueryForm` and `RouteResult` pass these tests with zero violations.
