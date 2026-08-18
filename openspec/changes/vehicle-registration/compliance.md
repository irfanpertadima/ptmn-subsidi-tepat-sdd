# Compliance: Vehicle Registration (Pendaftaran Kendaraan) — Subsidi Tepat

Regimes in scope: **UU PDP No. 27/2022** (Indonesia) and **ISO/IEC 27001:2022 Annex A**
(engineering subset). Control catalogues: `openspec/forge/controls/uu-pdp.yaml`,
`openspec/forge/controls/iso-27001.yaml`.

## DPIA

**Personal data processed?** **YES.** A DPIA is required and must be approved by the DPO before
the first work order is built (control: PDP-DPIA).

### What data

| Category | Data | Sensitivity |
|---|---|---|
| Identity | NIK (16-digit national ID), full name, date of birth, address | Personal data; NIK is a national identifier and is treated as high-risk |
| Contact | Phone number, email | Personal data |
| Documents | KTP photograph, STNK photograph | Personal data; document imagery carries more than the fields extracted from it |
| Vehicle | Plate number (nomor polisi), STNK number, brand, model, year, engine capacity | Personal data by association — a plate identifies an individual |
| Imagery | Vehicle front and side photographs | May incidentally capture bystanders and location context |
| Consent | Consent timestamp, policy version, consent scope | Processing record |

A KTP photograph is treated as **higher-risk than the fields read from it**: it carries a face
image and a full address in a single artifact. It is therefore never rendered in analytics, never
persisted in browser storage, and never cached by the frontend.

**Assessment of "specific/sensitive personal data" (UU PDP Art. 4):** the registration set does
not intentionally collect health, biometric, financial, sexual-orientation, political or criminal
data. The KTP facial image is *not* processed as a biometric identifier by this frontend — no
face matching or template extraction occurs here. If backend verification later introduces facial
matching, PDP-SENSITIVE-DATA applies and **this DPIA must be re-approved**. This boundary is a
condition of the current approval, not an assumption.

### Lawful basis

Primary basis: **performance of a task in the public interest / legal obligation** — the operator
is required to establish entitlement before dispensing subsidized fuel, under the program's
regulatory mandate (UU PDP Art. 20).

**Consent is nonetheless collected explicitly** for the collection and processing of identity and
document data, because the citizen is providing the data directly and the program's transparency
commitment requires an unambiguous, recorded opt-in. Consent is unbundled (registration consent is
separate from any marketing or analytics consent) and is captured with a timestamp and the version
of the privacy notice consented to.

Declining consent stops the journey with an explanation of the consequence — the citizen cannot be
registered for subsidized fuel — and does not degrade any other MyPertamina service.

### Retention

| Data | Retention | Mechanism |
|---|---|---|
| Browser draft state (non-document fields, no unmasked NIK) | Cleared on submit, on sign-out, and after 7 days | Frontend-owned; in scope for this epic |
| Submitted registration record | Per program policy, for the life of the registration plus the statutory audit period | Backend-owned |
| Document images | Per program policy; not retained by the frontend at all | Backend / object storage |
| Analytics events | 90 days; contain no personal data by construction | Analytics platform |

The frontend's retention obligation is narrow and fully in scope: **it must not become an
unmanaged copy of personal data.** No document image and no unmasked NIK is written to
`localStorage`, `sessionStorage`, IndexedDB, or a service-worker cache (control: PDP-RETENTION).

### Data-subject rights

| Right (UU PDP Art. 5-13) | How this frontend supports it |
|---|---|
| Access | The citizen views their full submitted registration and its status |
| Rectification | Edit-in-place before submission; guided correction after rejection |
| Erasure | A deletion request path is exposed from the registration detail screen |
| Objection / withdrawal of consent | Consent withdrawal is reachable from the privacy notice, with its consequence stated |
| Portability | The citizen can download their registration record and QR code |
| Information | Privacy notice in Bahasa Indonesia, presented before any data is collected |

### Cross-border transfer

**None by design.** Identity verification, OCR, document storage, and analytics must be served
from Indonesian infrastructure. **Open item:** the OCR service and the analytics platform must be
confirmed as in-country before the DPIA is signed. If either processes data outside Indonesia,
PDP-CROSS-BORDER applies and a transfer basis must be documented and approved (UU PDP Art. 56).

### Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| NIK or document image leaks via logs, analytics, or error reporting | Medium | High | Deny-list scrubbing in the analytics and error-reporting layer; a test asserts no personal data in payloads (control: PDP-NO-PII-IN-LOGS) |
| Document images cached on a shared or family device | Medium | High | No image persistence in browser storage; object URLs revoked after use; no service-worker caching of document routes |
| Registration reference guessable, exposing another citizen's data | Low | High | Server-side authorization against the signed-in citizen; reference is not a bearer credential (control: ISO-A5.15-ACCESS-CONTROL) |
| Over-collection — capturing more than verification needs | Medium | Medium | Field set reviewed against verification requirements; every field justified in the PRD |
| Vehicle photographs incidentally capture bystanders | Medium | Low | Capture guidance directs framing to the vehicle; no face processing on vehicle imagery |
| Consent recorded without genuine comprehension | Medium | Medium | Plain-language notice, unbundled checkboxes, no pre-ticked boxes, consequence of declining stated |
| OCR misreads propagate into an official record | Medium | Medium | OCR output is always presented for citizen confirmation and never auto-accepted |

## Control Mapping

| Control | Applies? | How satisfied |
|---|---|---|
| PDP-LAWFUL-BASIS (UU PDP Art. 20) | **Yes** | Public-interest/legal-obligation basis recorded above; privacy notice states it in Bahasa Indonesia before collection. Attested via DPO approval of this document. |
| PDP-CONSENT (UU PDP Art. 21-22) | **Yes** | Explicit, unbundled, un-pre-ticked consent gate at `/daftar/persetujuan`; timestamp + policy version recorded; no personal data transmitted before consent exists. Withdrawal path exposed. |
| PDP-SENSITIVE-DATA (UU PDP Art. 4) | **Not currently** | No health, biometric, financial or criminal data processed. The KTP face image is not used for biometric matching **by this frontend**. Re-assessment required if backend facial matching is introduced. |
| PDP-DATA-SUBJECT-RIGHTS (UU PDP Art. 5-13) | **Yes** | Access, rectification, erasure request, consent withdrawal, and portability surfaced in the UI as tabled above. |
| PDP-RETENTION (UU PDP Art. 43) | **Yes** | Frontend draft state cleared on submit/sign-out/7 days; no document images or unmasked NIK in any browser storage. Backend retention per program policy. |
| PDP-CROSS-BORDER (UU PDP Art. 56) | **Open — must close before sign-off** | Designed as in-country only. OCR and analytics processing locations to be confirmed; if either is offshore, a transfer basis must be documented and approved. |
| PDP-NO-PII-IN-LOGS | **Yes** | NIK, document images, and full plate numbers excluded from logs, analytics events, and error reports by a scrubbing layer, asserted by automated tests. Verified by SonarQube in the gate. |
| PDP-DPIA (UU PDP Art. 34) | **Yes** | This document is the DPIA. DPO approval in Confluence is a precondition of the first work order build; `forge gate` checks for it. |
| ISO-A8.28-SECURE-CODING (A.8.28) | **Yes** | Strict TypeScript, ESLint security rules, Zod validation at every boundary, no `dangerouslySetInnerHTML` on citizen-supplied content. Verified by SonarQube in the gate. |
| ISO-A8.8-VULN-MGMT (A.8.8) | **Yes** | Dependency audit in CI; no known high/critical vulnerabilities permitted to merge. Verified by SonarQube in the gate. |
| ISO-A8.29-SECURITY-TESTING (A.8.29) | **Yes** | SonarQube quality gate runs per PR via `forge scan`; tests cover the PII-scrubbing and authorization paths. |
| ISO-A8.24-CRYPTO (A.8.24) | **Yes** | TLS 1.2+ for all traffic; document uploads via short-lived pre-signed URLs directly to storage; encryption at rest is the storage owner's control. |
| ISO-A5.15-ACCESS-CONTROL (A.5.15) | **Yes** | Registration access authorized server-side against the signed-in citizen; reference numbers are not credentials; QR codes bound to a specific approved vehicle. |
| ISO-A8.15-LOGGING (A.8.15) | **Yes** | Consent grant/withdrawal, submission, and authorization failures are logged as security-relevant events, without personal data. |

## Approval

| Role | Approves | Status |
|---|---|---|
| Data Protection Officer | DPIA, lawful basis, retention, rights | Pending — Confluence |
| Information Security | ISO control mapping | Pending — Confluence |
| Program owner | BRD/PRD scope | Pending — Confluence |

**Blocking open item before DPO sign-off:** confirm OCR and analytics processing locations
(PDP-CROSS-BORDER). No work order may be built until this DPIA is approved — `forge gate`
enforces the approval check advisorily and the DPO approval is a hard precondition in policy.
