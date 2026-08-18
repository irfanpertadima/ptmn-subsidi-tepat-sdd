## 1. Consent state and the route guard
- [ ] 1.1 Add the policy-version constant and the consent record type (`decision`, `grantedAt`, `policyVersion`) with a Zod schema for reading it back
- [ ] 1.2 Implement the consent store over `sessionStorage`: read, write, clear, and treat a record whose `policyVersion` differs from the current constant as absent
- [ ] 1.3 Implement the route guard that redirects to `/daftar/persetujuan` when a downstream step is entered without a valid record
- [ ] 1.4 Assert the record type carries no personal-data fields, so a later change cannot widen it silently

## 2. Program explainer (`/daftar`)
- [ ] 2.1 Add explainer copy to the message catalogue: program purpose, verification window, and outcome
- [ ] 2.2 Build the document checklist, varying by vehicle type (Roda 2: KTP + STNK; Roda 4: adds vehicle photographs)
- [ ] 2.3 Build the Roda 2 / Roda 4 selection and carry the choice forward in the query string
- [ ] 2.4 Refuse to advance without a vehicle type, showing "Pilih jenis kendaraan terlebih dahulu" associated with the control
- [ ] 2.5 Confirm no personal-data input is rendered anywhere on this route

## 3. Consent gate (`/daftar/persetujuan`)
- [ ] 3.1 Add the privacy notice to the catalogue: lawful basis, data collected, retention period, rights, and how to withdraw
- [ ] 3.2 Build `ConsentGate` with separate unticked checkboxes — registration processing consent independent of optional analytics consent
- [ ] 3.3 Refuse to advance without registration consent, showing "Persetujuan diperlukan untuk melanjutkan pendaftaran"
- [ ] 3.4 Write the consent record on grant, including timestamp and policy version
- [ ] 3.5 Build the decline outcome screen stating the consequence and offering a route back
- [ ] 3.6 Render the notice in a scrollable region with real heading structure, not an accordion that can stay unopened
- [ ] 3.7 Add the "Langkah 1 dari 5" step counter, exposed to assistive technology

## 4. Telemetry
- [ ] 4.1 Emit consent grant, decline, and withdrawal through the existing telemetry boundary, carrying decision, policy version, and timestamp only
- [ ] 4.2 Keep optional analytics consent recorded but unconsumed; analytics stays off by default until wo-10 wires it

## 5. Tests
- [ ] 5.1 Test: consent checkboxes render unticked on first visit
- [ ] 5.2 Test: advancing without registration consent is refused and the Bahasa Indonesia message is shown
- [ ] 5.3 Test: registration consent can be given while optional analytics consent is left off
- [ ] 5.4 Test: the consent record survives a reload and is not re-requested (control: PDP-CONSENT)
- [ ] 5.5 Test: a record with an older `policyVersion` triggers re-consent (control: PDP-CONSENT)
- [ ] 5.6 Test: the stored record contains only decision, timestamp, and policy version — no personal data (control: PDP-RETENTION)
- [ ] 5.7 Test: the route guard redirects a downstream step entered without consent (control: PDP-CONSENT)
- [ ] 5.8 Test: consent events reach the sink with no NIK, name, address, or contact detail (control: PDP-NO-PII-IN-LOGS, ISO-A8.15-LOGGING)
- [ ] 5.9 Test: the document checklist changes between Roda 2 and Roda 4
- [ ] 5.10 Test: declining shows the consequence screen with a route back
- [ ] 5.11 Journey test: explainer → consent → next step, and the guard's redirect, on the 360px viewport

## 6. Accessibility
- [ ] 6.1 Accessibility check: keyboard-only completion of both steps, visible focus, labels programmatically associated with every checkbox
- [ ] 6.2 Verify a refused continue moves focus to the blocking control and announces the reason
- [ ] 6.3 Verify contrast on any new text or control state introduced here (4.5:1 text, 3:1 boundaries)

## 7. Compliance & Review
- [ ] 7.1 Verify controls tagged in the spec: PDP-CONSENT, PDP-LAWFUL-BASIS, PDP-DATA-SUBJECT-RIGHTS, PDP-RETENTION, PDP-NO-PII-IN-LOGS, ISO-A8.15-LOGGING
- [ ] 7.2 Confirm the privacy notice wording matches the DPIA's stated lawful basis and retention period, and flag any divergence to the DPO rather than editing the DPIA
- [ ] 7.3 Run `npm test -- --coverage`, then `node openspec/forge/forge.mjs scan --workorder wo-02-onboarding-consent` and clear the SonarQube quality gate
- [ ] 7.4 Open the PR via `node openspec/forge/forge.mjs pr --workorder wo-02-onboarding-consent`
