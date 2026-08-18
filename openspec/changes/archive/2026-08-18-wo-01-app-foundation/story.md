# Work Order: Application Foundation — Next.js + MUI shell, i18n catalogue, PII scrubbing

## Why
The repository has no application code. Every other work order in the epic needs one consistent
shell to build on, and two epic-wide rules — Bahasa Indonesia copy and never logging personal data —
are far cheaper to enforce once, here, than to retrofit across ten work orders.

## What Changes
Adds the Next.js + TypeScript application, the MUI theme confirmed in the Epic's `ux-design.md`,
the Bahasa Indonesia message catalogue, the route skeleton for the registration and vehicle
journeys, and the PII-scrubbing layer that every analytics and error-reporting call goes through.

## User Story
As a **frontend engineer**, I want **a Next.js + TypeScript app shell with the MUI theme, the
Bahasa Indonesia message catalogue, the route skeleton, and the PII-scrubbing layer**, so that
**every later work order builds on one consistent, compliant base**.

## Acceptance Criteria
- The application boots as a Next.js App Router project in TypeScript strict mode, with lint and
  format configured, and the build fails on a type error.
- A single MUI theme defines the palette, typography, and a 44px minimum touch target, and is
  applied to every route; no route defines its own brand colours.
- Every text colour in the theme meets 4.5:1 contrast against its background.
- The document declares `lang="id"`, and all user-facing text resolves from the message catalogue —
  no user-facing string literal is rendered from a component.
- Routes exist and render for the registration journey (`/daftar`, `/daftar/persetujuan`,
  `/daftar/identitas`, `/daftar/kendaraan`, `/daftar/dokumen`, `/daftar/ringkasan`,
  `/daftar/selesai`) and the vehicle journey (`/kendaraan`, `/kendaraan/[id]`, `/kendaraan/[id]/qr`).
- Every analytics event and error report passes through a scrubber that removes NIK, document
  images, and full plate numbers before the payload leaves the browser.
- The scrubber is applied by construction: analytics and error reporting are only reachable through
  it, so a caller cannot bypass it by accident.
- The test harness runs: Vitest + React Testing Library for units, Playwright for journeys.

## Links
- Epic: vehicle-registration
- JIRA: [KAN-2](https://the-direction.atlassian.net/browse/KAN-2)
- Confluence: [Epic index](https://the-direction.atlassian.net/wiki/spaces/DESIGN/pages/589826)
