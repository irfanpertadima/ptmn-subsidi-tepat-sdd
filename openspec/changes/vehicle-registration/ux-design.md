# UI/UX Design: Vehicle Registration (Pendaftaran Kendaraan) — Subsidi Tepat

## Design System Recommendation

- **Recommended:** MUI (Material Design) — `@mui/material`   (confidence: **high**)
- **Why:** Scored 9 against a runner-up 4 by the forge rubric
  (`node openspec/forge/forge.mjs preview recommend --epic vehicle-registration`). The signals
  that drove it map directly onto this PRD:
  - *Archetype (+3, twice)* — this is a document-heavy, multi-step data-collection journey. MUI's
    Stepper, form controls, and validation/helper-text patterns cover the registration wizard,
    the review summary, and the status surfaces without bespoke component work.
  - *Accessibility (+2)* — WCAG 2.1 AA is a launch requirement in the PRD, not a follow-up. MUI
    ships accessible focus management, labelling, and dialog semantics by default, which is the
    cheapest route to the "0 critical findings" metric in the BRD.
  - *i18n (+1)* — the PRD requires a Bahasa Indonesia message catalogue with a second language
    addable later; MUI's localization layer and RTL-capable theming support that without rework.
  - Beyond the rubric: the dominant client is an **entry-level Android phone**. Material is the
    visual language those users already navigate daily, so the journey costs them less to learn —
    which matters for the low-literacy audience named in the BRD.
- **Runner-up:** Ant Design — an equally strong form and data-entry library, but its default
  bundle and desktop-first density work against the ≤ 200KB initial-JS budget and the one-handed
  360px viewport this audience actually uses.
- **Decision:** **Confirmed — MUI.** Every work order in this epic builds against MUI; no work
  order re-opens this choice.

### Implementation notes for MUI

- Import from `@mui/material` per-component; no barrel imports, to protect the JS budget.
- Theme is defined once (palette, typography, spacing, 44px minimum touch target) and consumed by
  every work order — no per-screen overrides of brand tokens.
- Pertamina brand colours are applied through the theme palette and must be contrast-checked at
  4.5:1 for text; the default Material palette is not assumed to pass.
- Camera and OCR-dependent components are `next/dynamic` imports so they stay out of the initial
  route bundle.

## Component Inventory

### Screens / routes

| Route | Purpose | Capability |
|---|---|---|
| `/daftar` | Program explainer, document checklist, vehicle-type choice | registration-onboarding |
| `/daftar/persetujuan` | Privacy notice + explicit consent gate | registration-onboarding |
| `/daftar/identitas` | NIK entry, KTP capture, OCR review, verification result | identity-capture |
| `/daftar/kendaraan` | Plate number, STNK details, OCR review, duplicate check | vehicle-data-entry |
| `/daftar/dokumen` | KTP / STNK / vehicle photo capture, quality checks, upload | document-capture |
| `/daftar/ringkasan` | Full review, edit-in-place, declaration, submit | review-and-submit |
| `/daftar/selesai` | Confirmation, reference number, decision window | review-and-submit |
| `/kendaraan` | Multi-vehicle list with per-vehicle status | vehicle-portfolio |
| `/kendaraan/[id]` | Registration detail, status timeline, rejection reasons | registration-status-tracking |
| `/kendaraan/[id]/qr` | Approved QR code: display, download, print | qr-code-issuance |

### Shared components

- **`RegistrationStepper`** — MUI `Stepper`; horizontal on desktop, compact counter ("Langkah 3
  dari 5") on mobile where a full stepper does not fit 360px.
- **`DocumentCapture`** — camera capture with a mandatory file-upload fallback, live quality
  feedback, framing guide overlay, and retake. The most important component in the epic.
- **`UploadProgress`** — determinate `LinearProgress` per document, with retry affordance and
  per-file failure state.
- **`OcrReviewField`** — a `TextField` that visibly marks a value as OCR-suggested and requires
  the citizen to confirm it; carries the "suggestion, not authority" rule into the UI.
- **`NikField`** — 16-digit masked input, format validation, and post-verification masking to the
  last 4 digits.
- **`PlateNumberField`** — official Indonesian plate format, auto-uppercase, canonical
  normalization on blur.
- **`ConsentGate`** — unbundled consent checkboxes with the full notice reachable inline; blocks
  onward navigation until explicit consent is given.
- **`StatusChip`** — Menunggu Verifikasi / Terverifikasi / Ditolak, always paired with an icon and
  text so status is never conveyed by colour alone.
- **`RejectionReasonList`** — per-item reasons in plain Bahasa Indonesia, each with a direct
  "perbaiki" action into the failing step.
- **`QrCodeDisplay`** — high-contrast render sized for reliable daylight scanning, with download
  and print actions and the owning vehicle clearly labelled.
- **`VehicleCard`** — plate, type, and status for the portfolio list.
- **`OfflineNotice` / `DraftResumeBanner`** — connectivity loss and draft-resume messaging.

## Accessibility

Target: **WCAG 2.1 AA**, verified before launch.

- **Keyboard** — the entire journey is completable without a pointer. Focus moves to the first
  invalid field on validation failure, and to the step heading on step change. Focus is visible
  at 3:1 against its background.
- **Screen reader** — every input has a programmatic label; errors are wired via
  `aria-describedby` and announced through a polite live region. Step changes announce the new
  step and position. Upload progress and completion are announced, not only shown.
- **Camera independence** — every capture control has an equivalent file input. A denied or
  missing camera permission degrades to upload with an explanation, never a blocked journey.
- **Contrast and colour** — 4.5:1 for text, 3:1 for UI boundaries and focus. Status is carried by
  icon + text as well as colour, for the colour-blind and for low-brightness outdoor screens.
- **Targets and layout** — ≥ 44×44px touch targets; usable one-handed at 360px; content reflows to
  320px without horizontal scrolling; layout holds at 200% zoom.
- **Motion and timing** — `prefers-reduced-motion` honoured on step transitions; no step imposes a
  time limit, since document capture is slow for this audience by nature.
- **Language** — `lang="id"` on the document; copy written for a general reading level.

## Preview

A single-page app-shell mockup (rendered by `forge preview mockup` into `ux-preview/`, captured by
`forge preview shot`) is embedded in Confluence for visual approval alongside this document — see
`openspec/forge/DESIGN.md` §10. The mockup demonstrates the MUI theme, the stepper pattern, and the
document-capture screen, which together carry most of the visual risk in this epic.
