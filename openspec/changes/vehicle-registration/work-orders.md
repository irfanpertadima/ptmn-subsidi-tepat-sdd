# Work Orders: Vehicle Registration (Pendaftaran Kendaraan) — Subsidi Tepat

**JIRA Epic:** [KAN-1](https://the-direction.atlassian.net/browse/KAN-1) · **Confluence:** [Epic index](https://the-direction.atlassian.net/wiki/spaces/DESIGN/pages/589826)

The build queue. Each work order is its own change (schema: forge-workorder), built one at a time
(`/opsx:apply <wo-id>`), on its own branch/PR. Order is by dependency — do not start a work order
whose predecessor has not merged.

All work orders build against **MUI**, the design system confirmed in `ux-design.md`. None of them
re-opens that decision.

## Queue

- [ ] `wo-01-app-foundation` — As a **frontend engineer**, I want a Next.js + TypeScript app shell with the MUI theme, the Bahasa Indonesia message catalogue, the route skeleton, and the PII-scrubbing layer, so that every later work order builds on one consistent, compliant base  ·  [KAN-2](https://the-direction.atlassian.net/browse/KAN-2)

- [ ] `wo-02-onboarding-consent` — As **Budi**, I want to understand what registration requires and give explicit consent before entering any personal data, so that I know what I am agreeing to and can decide freely  ·  [KAN-3](https://the-direction.atlassian.net/browse/KAN-3)

- [ ] `wo-03-identity-capture` — As **Budi**, I want to enter my NIK and capture my KTP with the fields read for me, so that I can prove who I am without typing everything by hand  ·  [KAN-4](https://the-direction.atlassian.net/browse/KAN-4)

- [ ] `wo-04-vehicle-data-entry` — As **Budi**, I want to enter my plate number and STNK details with prefill from the document, so that my vehicle is recorded accurately and I learn immediately if it is already registered  ·  [KAN-5](https://the-direction.atlassian.net/browse/KAN-5)

- [ ] `wo-05-document-capture` — As **Siti**, I want to photograph my documents and vehicle and be told at once if an image is unusable, so that I do not wait days only to be rejected for a blurry photo  ·  [KAN-6](https://the-direction.atlassian.net/browse/KAN-6)

- [ ] `wo-06-review-submit` — As **Budi**, I want to review everything on one screen and correct mistakes in place before submitting, so that I submit with confidence and do not restart the flow to fix one digit  ·  [KAN-7](https://the-direction.atlassian.net/browse/KAN-7)

- [ ] `wo-07-status-tracking` — As **Siti**, I want to see where my registration stands and exactly why it was rejected, so that I can fix only what is wrong and resubmit without asking support  ·  [KAN-8](https://the-direction.atlassian.net/browse/KAN-8)

- [ ] `wo-08-qr-issuance` — As **Budi**, I want to view, download, and print the QR code for my approved vehicle, so that I can buy subsidized fuel even when my phone is offline or flat  ·  [KAN-9](https://the-direction.atlassian.net/browse/KAN-9)

- [ ] `wo-09-vehicle-portfolio` — As **Pak Agus**, I want to see all my vehicles and their statuses in one list and register another without re-entering my identity, so that I can manage my family's vehicles without confusion  ·  [KAN-10](https://the-direction.atlassian.net/browse/KAN-10)

- [ ] `wo-10-instrumentation` — As the **program owner**, I want the journey to report funnel and upload events carrying no personal data, so that the BRD's success metrics have real baselines instead of guesses  ·  [KAN-11](https://the-direction.atlassian.net/browse/KAN-11)

## Dependencies

```
wo-01-app-foundation
  └─> wo-02-onboarding-consent
        └─> wo-03-identity-capture
              └─> wo-04-vehicle-data-entry
                    └─> wo-05-document-capture
                          └─> wo-06-review-submit
                                ├─> wo-07-status-tracking
                                │     └─> wo-08-qr-issuance
                                └─> wo-09-vehicle-portfolio
wo-10-instrumentation  (after wo-06; instruments whatever has shipped, then extended per WO)
```

`wo-01` is a hard prerequisite for everything — the repository currently has no application code.
`wo-05-document-capture` carries the most technical and compliance risk in the epic (client-side
image quality assessment, compression, pre-signed upload, no image persistence) and should get the
most review attention.

## Capability coverage

| Capability | Work orders |
|---|---|
| registration-onboarding | wo-02 |
| identity-capture | wo-03 |
| vehicle-data-entry | wo-04 |
| document-capture | wo-05 |
| review-and-submit | wo-06 |
| registration-status-tracking | wo-07 |
| qr-code-issuance | wo-08 |
| vehicle-portfolio | wo-09 |
| journey-instrumentation | wo-10 |
| *(cross-cutting foundation)* | wo-01 |

## Governance preconditions

Before `wo-01` is built:

1. `compliance.md` (DPIA) approved by the DPO in Confluence — including the open
   **PDP-CROSS-BORDER** item on OCR and analytics processing location.
2. `brd.md` and `prd.md` approved by the program owner.
3. `ux-design.md` approved, with the MUI mockup screenshot reviewed.
4. JIRA Epic created and each work order linked as a child issue.

`node openspec/forge/forge.mjs gate --change <wo-id>` checks these before any build.
