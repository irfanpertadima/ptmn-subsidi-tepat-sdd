# Design: Application Foundation

> This work order needs technical decisions — it introduces the framework, the dependency set, and
> a cross-cutting telemetry boundary that every later work order depends on.

## Context

The repository contains specs and governance artifacts but no application code. This work order
establishes the frontend that work orders 02–10 extend. Two epic-wide rules have to be structural
rather than advisory, because ten separate work orders will otherwise each get them slightly wrong:

1. All user-facing copy is Bahasa Indonesia and must be reviewable by non-engineers.
2. Personal data must never reach logs, analytics, or error reports (UU PDP).

The design system is already decided — MUI, confirmed in the Epic's `ux-design.md`. This work order
does not re-open that choice; it only wires it up.

## Decisions

### Next.js App Router over Pages Router
The journey is a mostly-client, form-heavy flow, but the shell, the explainer, and the status pages
benefit from server rendering on slow devices. App Router gives per-route control over what ships to
the client, which directly serves the ≤ 200KB initial-JS budget in the PRD. Alternative considered:
Pages Router — simpler, but no granular server/client split, so the document-capture and OCR code
would be harder to keep out of the initial bundle.

### One theme module, no per-route theming
A single `theme.ts` owns palette, typography, spacing, and component defaults (including the 44px
touch target). Work orders consume it and must not override brand tokens locally. This is what keeps
ten independently-built work orders looking like one product, and it makes the contrast obligation
checkable in one place instead of ten. Alternative considered: per-feature theme overrides — more
flexible, but it makes the accessibility guarantee unverifiable.

### The scrubber is the only path to telemetry
Analytics and error reporting are not imported directly by feature code. The foundation exports one
telemetry module; the underlying providers are not re-exported. A field-name deny-list (NIK, plate,
address, date of birth, phone, email) plus a value-shape check (16-digit sequences, data URLs, blob
URLs) runs on every payload, recursively, before dispatch.

This is deliberately a structural constraint rather than a convention. A convention would be
violated by the first work order that is in a hurry, and the failure mode — personal data leaving
the browser — is exactly what the DPIA commits to preventing. Alternative considered: a lint rule
banning direct provider imports — weaker, since lint is bypassable and does not inspect payloads at
runtime.

### Message catalogue with fail-loud lookups
Copy lives in a typed catalogue keyed by message id. A missing key throws in development and reports
in production rather than rendering an empty string, because a blank label on a government form is
worse than a visible defect in review. Alternative considered: inline strings with later extraction —
cheaper now, but it defers the whole i18n cost onto ten work orders and makes copy review impossible
until the end.

### Zod at every boundary
Backend responses and form input are parsed, not cast. The PRD requires client validation to be
treated as a usability aid with server-side revalidation; parsing at the boundary keeps malformed
backend data from propagating into the UI as `undefined` at render time.

## Risks / Trade-offs

- **The scrubber deny-list can miss a field a later work order introduces** → the check is
  shape-based as well as name-based (16-digit sequences, data/blob URLs), and wo-10 adds a test that
  asserts no personal data reaches telemetry across the whole journey. Each work order that adds a
  new personal-data field must extend the deny-list, and that is an explicit task in its checklist.
- **Scrubbing runs on every telemetry call, recursively** → payloads are small and dispatch is
  off the interaction path; if profiling shows cost, the traversal is memoized per event shape
  rather than weakened.
- **A single theme is a coordination point** → a change to it affects every work order. It is
  therefore treated as an interface: changes to brand tokens need the same review as a spec change.
- **Route skeleton may drift from what later work orders need** → routes are placeholders, not
  contracts; a work order may reshape its own route, but it may not add a brand-token override.

## UI Notes

Defers to the Epic's approved design system (MUI). This work order contributes no product screens —
only the shell, the theme, and placeholder routes. The compact step counter and `DocumentCapture`
described in `ux-design.md` are built by wo-02 and wo-05 respectively, against this theme.
