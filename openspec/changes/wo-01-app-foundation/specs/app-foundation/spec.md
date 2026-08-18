## Purpose

The shared frontend foundation for Subsidi Tepat: the application shell, the approved design system
theme, the Bahasa Indonesia message catalogue, the route skeleton, and the privacy-preserving
telemetry boundary that every other capability in this product builds on.

## ADDED Requirements

### Requirement: Application shell
The system SHALL provide a Next.js App Router application in TypeScript strict mode whose build
fails on a type error or a lint error (control: ISO-A8.28-SECURE-CODING).

#### Scenario: Type error fails the build
- **WHEN** a source file contains a TypeScript type error
- **THEN** the production build exits non-zero and does not emit an artifact

#### Scenario: Application boots
- **WHEN** a citizen opens the application root
- **THEN** the shell renders with the theme applied and no console error

### Requirement: Single approved design system theme
The system SHALL apply one MUI theme — the design system confirmed in the Epic's `ux-design.md` —
across every route, defining the palette, typography, and a minimum touch target of 44px.

#### Scenario: Theme applies to every route
- **WHEN** any route in the registration or vehicle journey renders
- **THEN** it inherits the shared theme, and no route overrides the brand palette locally

#### Scenario: Interactive targets meet the minimum size
- **WHEN** a button or icon button renders at its default size
- **THEN** its hit area is at least 44px by 44px

#### Scenario: Theme text colours meet contrast
- **WHEN** the theme palette is checked for contrast
- **THEN** every text colour reaches at least 4.5:1 against its intended background

### Requirement: Bahasa Indonesia message catalogue
The system SHALL resolve all user-facing text from a message catalogue and declare the document
language as Indonesian, so that copy is reviewable and a second language can be added without
changing component code.

#### Scenario: Document language is Indonesian
- **WHEN** any page renders
- **THEN** the root HTML element carries `lang="id"`

#### Scenario: No inline user-facing strings
- **WHEN** a component renders user-facing text
- **THEN** that text is resolved by a catalogue lookup rather than a string literal in the component

#### Scenario: Missing key is visible in development
- **WHEN** a catalogue lookup is made for a key that does not exist
- **THEN** the failure is surfaced to the developer rather than rendering an empty string to a citizen

### Requirement: Journey route skeleton
The system SHALL provide reachable routes for the registration journey and the vehicle journey, so
that later work orders fill in screens rather than inventing navigation.

#### Scenario: Registration routes resolve
- **WHEN** a citizen navigates to `/daftar`, `/daftar/persetujuan`, `/daftar/identitas`,
  `/daftar/kendaraan`, `/daftar/dokumen`, `/daftar/ringkasan`, or `/daftar/selesai`
- **THEN** the route renders within the shell and returns a success status

#### Scenario: Vehicle routes resolve
- **WHEN** a citizen navigates to `/kendaraan`, `/kendaraan/[id]`, or `/kendaraan/[id]/qr`
- **THEN** the route renders within the shell and returns a success status

### Requirement: Personal data is never emitted in telemetry
The system SHALL strip personal data from every analytics event and error report before it leaves
the browser, so that telemetry cannot become an uncontrolled copy of personal data
(control: PDP-NO-PII-IN-LOGS, ISO-A8.15-LOGGING).

Personal data for this purpose is NIK, document imagery, full plate numbers, address, date of
birth, phone number, and email. The lawful basis and retention for the registration data itself are
recorded in the Epic's DPIA; this requirement covers only the telemetry boundary.

#### Scenario: NIK is removed from an analytics event
- **WHEN** an analytics event is emitted carrying a field containing a 16-digit NIK
- **THEN** the transmitted payload does not contain that value in any field

#### Scenario: Document image is removed from an error report
- **WHEN** an error is reported while a captured document image is in scope
- **THEN** the transmitted report contains no image data and no object URL for it

#### Scenario: Full plate number is removed
- **WHEN** an event or error report carries a full plate number
- **THEN** the transmitted payload does not contain the full plate number

#### Scenario: Telemetry cannot bypass the scrubber
- **WHEN** application code sends an analytics event or reports an error
- **THEN** it does so through the scrubbing boundary, which is the only exported path to the
  analytics and error-reporting providers

### Requirement: Test harness
The system SHALL provide a running test harness covering unit and journey levels, so that every
later work order has somewhere to put its tests.

#### Scenario: Unit tests run
- **WHEN** the unit test command is run
- **THEN** Vitest executes React Testing Library tests and reports a pass or fail result

#### Scenario: Journey tests run
- **WHEN** the end-to-end test command is run
- **THEN** Playwright executes against the application and reports a pass or fail result
