# BRD: Vehicle Registration (Pendaftaran Kendaraan) — Subsidi Tepat

## Context

Subsidized fuel (Pertalite and Bio Solar) is a large recurring cost to the state, and a
material share of it is consumed by vehicles that are not entitled to it. The Subsidi Tepat
program closes that gap by requiring every vehicle to be registered and verified before it
can buy subsidized fuel, and by issuing a QR code that is presented at the SPBU at the point
of purchase.

Today the registration experience is the main bottleneck in the program. Citizens abandon the
flow partway through, and a large share of the submissions that do arrive are rejected for
avoidable reasons — an unreadable STNK photograph, a plate number typed in a format the
verifier cannot match, a missing supporting document. Every rejection costs the citizen a
second attempt and costs Pertamina a second manual review, and it pushes people back toward
the offline channel the program is meant to replace.

This epic delivers the citizen-facing self-service registration journey on the web frontend:
from identity entry through document capture, submission, verification status, and QR code
issuance.

## Objectives

1. **Raise completion rate** — let a citizen finish registration unassisted in one sitting on
   an entry-level Android phone over a mobile connection.
2. **Raise first-pass approval rate** — catch bad data and unusable document images in the
   browser, before submission, rather than days later in back-office review.
3. **Cut verification cost** — reduce the volume of manual rework caused by malformed or
   incomplete submissions.
4. **Make status self-serve** — remove the "where is my registration?" support contact by
   exposing verification state and its reasons directly to the citizen.
5. **Be demonstrably compliant** — process NIK, KTP, STNK and vehicle imagery under a
   recorded lawful basis with explicit consent, defined retention, and working data-subject rights.

## Stakeholders

| Stakeholder | Interest | Signs off on |
|---|---|---|
| Pertamina Retail / Subsidi Tepat program owner | Subsidy accuracy, adoption | BRD, PRD |
| Citizen (vehicle owner) | Fast, clear, private registration | — (represented by UX research) |
| Back-office verification team | Submission quality, review throughput | PRD, capabilities |
| Data Protection Officer (DPO) | UU PDP compliance | compliance.md (DPIA) |
| Information Security | ISO 27001 control coverage | compliance.md |
| BPH Migas / regulator | Program integrity, auditability | — (evidence via RTM) |
| Frontend engineering | Buildability, maintainability | ux-design.md, work orders |

## Success Metrics

| Metric | Baseline | Target |
|---|---|---|
| Registration completion rate (started → submitted) | to be instrumented | ≥ 75% |
| First-pass approval rate (submitted → approved without resubmission) | to be instrumented | ≥ 85% |
| Median time to complete a registration | to be instrumented | ≤ 8 minutes |
| Document upload success rate on a 3G-class connection | to be instrumented | ≥ 95% |
| "Where is my registration" support contacts per 1,000 submissions | to be instrumented | −50% |
| WCAG 2.1 AA audit findings on the journey | — | 0 critical |

Baselines are captured by the analytics work order before the first optimization claim is made;
targets are reviewed after one month of production traffic.

## Constraints

- **Regulatory — UU PDP No. 27/2022.** NIK, KTP imagery, address, phone, STNK and plate numbers
  are personal data. A DPIA is required before build (see `compliance.md`); the DPO approves it.
- **Regulatory — program rules.** Eligibility criteria, required documents, and vehicle
  categories are set by program policy and change without frontend releases. The UI must treat
  them as configuration, not as hardcoded logic.
- **Device and network.** The dominant client is an entry-level Android phone on a metered
  mobile connection. Photograph upload is the single heaviest interaction in the journey and
  must survive interruption.
- **Language.** Bahasa Indonesia is the primary and only launch language; copy must be readable
  by a low-literacy audience.
- **Accessibility.** WCAG 2.1 AA is a launch requirement, not a follow-up.
- **Backend dependency.** Identity verification, OCR, and the verification workflow are backend
  services owned by other teams. This epic consumes their contracts and must degrade gracefully
  when they are unavailable.
- **Security — ISO 27001.** Documents are transported and stored encrypted; NIK and document
  images never appear in logs or analytics payloads.
