# PRD: Vehicle Registration (Pendaftaran Kendaraan) — Subsidi Tepat

## Scope

### In scope

- Self-service registration for **Roda 2** (motorcycle) and **Roda 4** (passenger car) owned by
  a private individual.
- Identity step: NIK entry, owner details, KTP capture and verification against the backend
  identity service.
- Vehicle step: plate number (nomor polisi), STNK details, brand/model/year, engine capacity,
  current fuel type.
- Document capture: KTP, STNK, and vehicle photographs (front view showing the plate, and a
  side view), with in-browser quality checks and OCR-assisted field prefill.
- Consent and declaration (persetujuan dan surat pernyataan) with an auditable consent record.
- Review-and-submit summary, with edit-in-place before final submission.
- Post-submission status tracking, including rejection reasons and a guided resubmission path.
- QR code issuance on approval: display, download, and re-issue.
- Registration lookup for a returning citizen, and a list view when one citizen owns several vehicles.
- Analytics instrumentation for the funnel metrics named in the BRD.

### Out of scope

- The back-office verifier console (separate product surface).
- SPBU point-of-sale QR scanning and the transaction/quota flow.
- Roda 3, freight, public transport (angkutan umum), fishing (nelayan), UMKM and other business
  categories — these need different documents and verification rules and are a follow-up epic.
- Native mobile applications.
- Account creation and authentication mechanics — this epic consumes the existing MyPertamina
  session and does not redesign login.
- Backend services for identity verification, OCR, and verification workflow.

## Personas

- **Budi — Pemilik Mobil Pribadi (private car owner).** Mid-30s, owns one Roda 4 car, commutes
  daily and fuels with Bio Solar. Comfortable with apps but impatient; registers once and expects
  it to work. Goal: get a working QR code without visiting an office.

- **Siti — Pengendara Roda 2 (motorcycle rider).** Late-20s, uses her motorcycle for daily work
  travel, on an entry-level Android phone with a metered prepaid data plan. Low tolerance for
  large downloads and re-uploads. Goal: finish registration in one sitting without wasting quota.

- **Pak Agus — Pemilik Beberapa Kendaraan (multi-vehicle owner).** 50s, owns a car and two
  motorcycles used by his family. Less confident with forms, needs to see clearly which of his
  vehicles are registered and which are not. Goal: manage several registrations without confusion.

- **Rina — Petugas Verifikasi (back-office verifier).** Not a user of this frontend, but the
  downstream consumer of everything it produces. Her review speed depends on the legibility and
  completeness of what the citizen submits. Goal: receive submissions she can decide on in one pass.

## User Journeys

### J1 — First-time registration (happy path)

1. Budi opens the registration page from MyPertamina, already signed in.
2. He sees what the program is, what documents he needs, and how long verification takes,
   before being asked for any data.
3. He gives explicit consent for the processing of his personal data; the consent text names
   the lawful basis, the retention period, and his rights.
4. He selects vehicle type **Roda 4**.
5. **Identity step** — he enters his NIK and captures his KTP. OCR prefills name, date of birth
   and address; he corrects anything wrong. The backend verifies NIK against the identity service.
6. **Vehicle step** — he enters his plate number and STNK details. OCR from the STNK photograph
   prefills brand, model, year, and capacity; he confirms them.
7. **Document step** — he captures the vehicle front (plate legible) and side photographs. Each
   image is checked in the browser for blur, darkness, and size, and is compressed before upload.
   Failed uploads retry without losing his place.
8. **Review** — every entered value and every captured image is shown on one summary screen.
   He edits one wrong digit in the plate number in place.
9. He submits, and lands on a confirmation with a reference number and the expected decision window.

### J2 — Tracking verification status

1. Siti returns days later and opens her registration.
2. She sees a status of **Menunggu Verifikasi**, when it was submitted, and when to expect a decision.
3. When it becomes **Terverifikasi**, the QR code is shown with download and print options.
4. If it becomes **Ditolak**, she sees each specific reason in plain Bahasa Indonesia — for example
   "Foto STNK tidak terbaca" — with a direct action to fix only the failing item and resubmit.

### J3 — Resubmission after rejection

1. Siti opens the rejected registration and sees the failing items listed first.
2. Her previously accepted data is retained; she is not made to retype the whole form.
3. She recaptures only the rejected document, re-reviews, and resubmits against the same reference.

### J4 — Multi-vehicle management

1. Pak Agus opens his vehicle list and sees each vehicle with its plate, type, and status.
2. He starts a new registration for his second motorcycle; his identity data is reused and
   he confirms rather than re-enters it.
3. He opens an approved vehicle to view or re-download its QR code.

### J5 — Interruption and resume

1. Siti loses connectivity during the document step.
2. The application tells her plainly what failed and preserves her progress locally.
3. On return she resumes from where she stopped, without re-entering earlier steps.

## Non-Functional Requirements

### Performance and network
- Largest Contentful Paint <= 2.5s and Interaction to Next Paint <= 200ms at p75 on a 4x CPU
  throttled mid-tier Android device over a 3G-class connection.
- Initial route JavaScript <= 200KB gzipped; document capture and OCR code is loaded on demand.
- Images are compressed client-side to <= 1MB before upload, with the long edge capped, while
  keeping the plate and STNK text legible.
- Uploads resume or retry on transient failure, with a bounded exponential backoff and a clear
  manual retry.
- Form progress survives a page reload and a lost connection.

### Security
- All traffic over TLS 1.2+ (control: ISO-A8.24-CRYPTO).
- Document images are transmitted directly to object storage via short-lived pre-signed URLs and
  are never proxied through, or cached by, the frontend.
- NIK is masked in the UI to the last 4 digits once verified, and is never placed in a URL, query
  string, `localStorage`, analytics event, or log line (control: PDP-NO-PII-IN-LOGS).
- Locally persisted draft state excludes document images and stores no unmasked NIK.
- Access to a registration is authorized against the signed-in citizen; a registration reference
  is not a bearer credential (control: ISO-A5.15-ACCESS-CONTROL).
- Client-side validation is a usability aid and is re-validated server-side without exception.

### Privacy (UU PDP)
- Consent is explicit, unbundled, and captured with timestamp and policy version before any
  personal data is transmitted (control: PDP-CONSENT).
- The privacy notice states the lawful basis, the categories of data, the retention period, and
  how to exercise data-subject rights, in Bahasa Indonesia (control: PDP-LAWFUL-BASIS).
- The citizen can view, correct, and request deletion of their registration data
  (control: PDP-DATA-SUBJECT-RIGHTS).
- Draft data held in the browser is cleared on submission, on sign-out, and after 7 days
  (control: PDP-RETENTION).

### Accessibility
- WCAG 2.1 AA across the journey: full keyboard operation, visible focus, 4.5:1 text contrast,
  labelled inputs, and errors announced to assistive technology.
- Every camera-based step has a file-upload alternative — the flow must never depend on a
  working camera.
- Touch targets >= 44x44px; the form is usable one-handed on a 360px-wide viewport.
- Instructions do not rely on colour alone to convey status.

### Internationalization and content
- All user-facing text in Bahasa Indonesia, held in a message catalogue rather than inline in
  components, so a second language can be added without touching component code.
- Dates render as DD/MM/YYYY; plate numbers render in the official spaced format.
- Error messages state what is wrong and what to do about it, at a reading level appropriate
  for a general audience.

### Availability and resilience
- When identity verification or OCR is unavailable, the citizen can still complete the journey
  with manual entry; the application degrades rather than blocks.
- Backend failures produce an actionable message and a retry, never a raw error code or a dead end.

### Observability
- Funnel events for each step entered, completed, and abandoned, and for upload success and
  failure — carrying no personal data.
- Client errors are reported with the document images and identity fields stripped.
