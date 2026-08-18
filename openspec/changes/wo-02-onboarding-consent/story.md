# Work Order: Program Onboarding and the Privacy Consent Gate

## Why
The registration journey currently starts by asking for data. UU PDP requires that the citizen
understands what is collected, on what basis, and for how long — and agrees to it — before any
personal data is entered or transmitted.

## What Changes
Builds the two entry screens: a program explainer with a document checklist and vehicle-type
choice, and an unbundled consent gate that records the consent with a timestamp and policy version
and blocks the rest of the journey until it exists.

## User Story
As a **Budi (Pemilik Mobil Pribadi)**, I want **to understand what registration requires and give
explicit consent before entering any personal data**, so that **I know what I am agreeing to and
can decide freely**.

## Acceptance Criteria

### Program explainer (`/daftar`)
- Landing on `/daftar` shows what the program is, the documents needed, how long verification
  takes, and what the citizen receives at the end — before any input field is presented.
- The document checklist differs by vehicle type: Roda 2 requires KTP and STNK; Roda 4 requires
  KTP, STNK, and vehicle photographs.
- The citizen selects a vehicle type of Roda 2 or Roda 4, and the choice is carried forward to
  the rest of the journey.
- Continuing without a vehicle type selected is refused, with a message naming what is missing.

### Consent gate (`/daftar/persetujuan`)
- The privacy notice states, in Bahasa Indonesia, the lawful basis, what data is collected, the
  retention period, and the citizen's rights, and is readable in full without leaving the step.
- Consent is presented as separate, independently toggleable checkboxes — registration processing
  consent is not bundled with optional analytics consent.
- No checkbox is pre-ticked.
- Continuing is refused until the registration processing consent is given; optional consents may
  be left off without blocking.
- Granting consent records the moment it was given and the version of the privacy notice shown,
  and that record survives a page reload.
- Declining ends the journey on an explanatory screen that states the consequence — that
  registration cannot proceed without consent — and offers a way back, not a dead end.
- The privacy notice exposes how to withdraw consent later, and states what withdrawal means for
  an existing registration.

### Privacy boundary
- No personal data is transmitted before a valid consent record exists.
- The consent record persists no personal data in browser storage — only the decision, the
  timestamp, and the policy version.
- Consent grant, decline, and withdrawal are recorded as security-relevant events carrying no
  personal data.

### Accessibility
- Both steps are completable by keyboard alone, with visible focus and programmatically
  associated labels on every checkbox.
- A refused continue moves focus to the first blocking control and announces the reason.
- The step position ("Langkah 1 dari 5") is announced on entry, not conveyed by styling alone.

## Links
- Epic: vehicle-registration
- JIRA: [KAN-3](https://the-direction.atlassian.net/browse/KAN-3)
- Confluence: <filled by `forge sync confluence`>
