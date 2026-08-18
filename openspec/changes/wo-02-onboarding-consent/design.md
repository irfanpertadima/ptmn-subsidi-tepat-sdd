# Design: Program Onboarding and the Privacy Consent Gate

## Context

wo-01 delivered the shell: the MUI theme, the Bahasa Indonesia catalogue, the route skeleton
including `/daftar` and `/daftar/persetujuan`, and the telemetry boundary that scrubs personal data.
This work order replaces the two placeholder routes with real screens.

The binding constraint comes from the Epic DPIA: **no personal data may be processed before a valid
consent record exists**. That is not a screen-level rule but a structural one — later work orders
collect NIK, KTP images and plate numbers, and each must be unable to run before this gate has
passed. So the decisions below are mostly about *where consent state lives* and *what enforces it*,
not about the visual design of two forms.

This work order handles no document uploads; the upload rules in the project standards apply from
wo-05 onward.

## Decisions

### Consent state lives in `sessionStorage`, keyed by policy version

The record is `{ decision, grantedAt, policyVersion }` — no personal data, per the spec.

`sessionStorage` over the alternatives:
- **`localStorage`** would outlive the browser session. Consent that silently persists for months
  is weaker consent, and PDP-RETENTION pushes toward the shortest defensible lifetime.
- **A cookie** would be sent on every request, putting the record somewhere it is not needed and
  widening its exposure for no benefit.
- **Server-side only** is the eventual home of the authoritative record, but the frontend still
  needs a local answer to gate navigation before the submission exists. The local record is a
  navigation gate, not the legal record of consent — the backend's copy at submission time is.

Storing the policy version in the record is what makes re-consent on policy change detectable; a
bare boolean cannot express "consented, but to the old notice".

### A route guard enforces the gate, not each screen

A single guard reads the consent record and redirects to `/daftar/persetujuan` when a downstream
step is entered without one. Putting the check in each screen would mean every future work order
re-implements it, and one omission silently opens the boundary the DPIA depends on.

This mirrors the pattern wo-01 used for telemetry: one chokepoint that cannot be bypassed by
accident, rather than a convention each caller must remember.

### Policy version is a build-time constant, not fetched

The privacy notice ships with the app, so its version is known at build time. Fetching it would add
a network dependency to the step that must work before anything else does. When the notice changes,
the constant changes in the same commit — which is also the review point where someone must decide
whether the change warrants re-consent.

### Vehicle type travels in the URL, consent does not

Vehicle type is a benign, shareable choice and belongs in the query string, where a reload or a
shared link preserves it. Consent is a decision about the person and must not be settable by URL —
a link that grants consent would defeat the requirement that it be explicit.

## Risks / Trade-offs

- **`sessionStorage` is cleared by the browser mid-journey** → the guard sends the citizen back to
  the consent step rather than failing. Re-consenting is a minor cost; proceeding without a record
  is a compliance breach, so the trade is one-sided.
- **The local record is not the legal record** → a citizen could tamper with `sessionStorage` to
  skip the gate. This is accepted: the backend re-checks consent at submission, and tampering
  harms only the tamperer's own submission. The frontend gate is a UX and policy control, not a
  security boundary — stating that plainly here avoids it being mistaken for one later.
- **Re-consent on every policy change may fatigue citizens** → the version constant should change
  only for substantive changes to the notice, not typo fixes. That judgement sits with the DPO at
  review time, and is why the constant lives in a reviewed commit.
- **Optional analytics consent is recorded but not yet consumed** → wo-10 wires it to the telemetry
  boundary. Until then the recorded preference has no effect, which means analytics must remain off
  by default rather than on.

## UI Notes

Uses the Epic's approved MUI theme; no new design system decisions. Component-level notes only:

- **`ConsentGate`** — MUI `FormControlLabel` + `Checkbox` per consent, never a single "accept all".
  The theme already sizes checkboxes to the 44px target.
- The privacy notice uses a scrollable region with a heading structure, not an `expand`/accordion
  that could let a citizen consent without the text ever being rendered.
- The decline outcome is a distinct screen rather than a dialog: a modal invites a reflexive
  dismissal, and this decision deserves a deliberate one.
- Step position renders as the compact "Langkah 1 dari 5" counter the Epic specified for 360px,
  exposed to assistive technology rather than styled-only.
