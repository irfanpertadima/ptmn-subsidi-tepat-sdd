## Purpose

Introduces the citizen to the Subsidi Tepat registration program and obtains lawful, explicit
consent before any personal data is entered or transmitted. This is the privacy boundary of the
whole journey: every later step depends on a valid consent record existing.

## ADDED Requirements

### Requirement: Program explanation precedes data collection

The system SHALL explain the program, the documents required, the expected verification duration,
and the outcome the citizen receives, before presenting any field that collects personal data
(control: PDP-LAWFUL-BASIS, PDP-CONSENT).

Lawful basis: public-interest/legal-obligation for the subsidy program, with explicit consent
collected in addition because the citizen supplies the data directly. Retention of the frontend
draft is bounded by the retention requirement below. This requirement supports the data subject's
right to be informed.

#### Scenario: Citizen arrives at the registration entry point
- **WHEN** the citizen opens `/daftar`
- **THEN** the page shows "Pendaftaran Kendaraan", what the program provides, the required document
  checklist, and the expected verification window
- **AND** no input that collects personal data is present on the page

#### Scenario: Document checklist reflects the vehicle type
- **WHEN** the citizen selects "Roda 2"
- **THEN** the checklist shows KTP and STNK
- **WHEN** the citizen selects "Roda 4"
- **THEN** the checklist additionally shows the vehicle photograph requirement

### Requirement: Vehicle type is chosen before the journey continues

The system SHALL require the citizen to choose Roda 2 or Roda 4 before advancing, and SHALL carry
that choice into the remaining steps.

#### Scenario: Continuing without a choice is refused
- **WHEN** the citizen selects "Lanjutkan" with no vehicle type chosen
- **THEN** the journey does not advance
- **AND** the message "Pilih jenis kendaraan terlebih dahulu" is shown and associated with the choice control

#### Scenario: The choice is carried forward
- **WHEN** the citizen chooses "Roda 4" and advances
- **THEN** the selected type is available to the following steps without being asked again

### Requirement: Privacy notice states basis, scope, retention, and rights

The system SHALL present a privacy notice in Bahasa Indonesia stating the lawful basis, the
categories of personal data collected, the retention period, and the citizen's rights, readable in
full without leaving the step (control: PDP-LAWFUL-BASIS, PDP-DATA-SUBJECT-RIGHTS).

The notice supports the rights of access, rectification, erasure, withdrawal of consent, and
portability by describing how each is exercised.

#### Scenario: Notice is readable in full at the consent step
- **WHEN** the citizen opens `/daftar/persetujuan`
- **THEN** the notice states the lawful basis, the data collected, the retention period, and the rights
- **AND** the full text is reachable without navigating away from the step

#### Scenario: Withdrawal is explained before consent is given
- **WHEN** the citizen reads the notice
- **THEN** it states how consent is withdrawn later and what withdrawal means for an existing registration

### Requirement: Consent is explicit, unbundled, and never pre-ticked

The system SHALL obtain consent through separate, independently toggleable controls, none of which
are pre-selected, and SHALL NOT bundle consent for registration processing with any optional
consent (control: PDP-CONSENT).

#### Scenario: Consent controls start unticked
- **WHEN** the citizen first opens the consent step
- **THEN** every consent checkbox is unticked

#### Scenario: Registration consent is separable from optional consent
- **WHEN** the citizen ticks registration processing consent and leaves optional analytics consent unticked
- **THEN** the journey advances
- **AND** the declined optional consent is recorded as not given

#### Scenario: Advancing without registration consent is refused
- **WHEN** the citizen selects "Lanjutkan" without giving registration processing consent
- **THEN** the journey does not advance
- **AND** the message "Persetujuan diperlukan untuk melanjutkan pendaftaran" is shown

### Requirement: Consent is recorded with its timestamp and policy version

The system SHALL record, for each consent decision, the moment it was given and the version of the
privacy notice presented, and that record SHALL survive a page reload (control: PDP-CONSENT).

#### Scenario: Consent record is durable across reload
- **WHEN** the citizen grants consent and reloads the page
- **THEN** the consent is still in effect and is not requested again

#### Scenario: A new policy version invalidates prior consent
- **WHEN** the stored consent references a policy version older than the one currently presented
- **THEN** consent is requested again before the journey continues

### Requirement: Declining consent ends the journey with an explanation

The system SHALL, on decline, stop the journey on a screen stating that registration cannot proceed
without consent, and SHALL offer a route back rather than a dead end (control: PDP-CONSENT).

#### Scenario: Citizen declines
- **WHEN** the citizen selects "Tidak Setuju"
- **THEN** a screen explains that registration cannot continue without consent
- **AND** an action to return and reconsider is offered

### Requirement: No personal data is processed before consent exists

The system SHALL NOT transmit personal data, and SHALL NOT write personal data to browser storage,
before a valid consent record exists (control: PDP-CONSENT, PDP-RETENTION, PDP-NO-PII-IN-LOGS).

The consent record itself holds only the decision, the timestamp, and the policy version — never
personal data.

#### Scenario: Nothing personal leaves the browser before consent
- **WHEN** the citizen is on the explainer or consent step and has not yet consented
- **THEN** no request carrying personal data is issued

#### Scenario: The consent record holds no personal data
- **WHEN** consent has been granted
- **THEN** the stored record contains only the decision, timestamp, and policy version

### Requirement: Consent decisions are logged as security events without personal data

The system SHALL record consent grant, decline, and withdrawal as security-relevant events
containing no personal data (control: ISO-A8.15-LOGGING, PDP-NO-PII-IN-LOGS).

#### Scenario: A grant is recorded without identifying the citizen
- **WHEN** consent is granted
- **THEN** an event records the decision, policy version, and timestamp
- **AND** the transmitted payload contains no NIK, name, address, or contact detail

### Requirement: The consent gate is operable without a pointer

The system SHALL make both steps completable by keyboard alone, with visible focus and
programmatically associated labels, and SHALL move focus to the first blocking control when
advancing is refused.

#### Scenario: Keyboard-only completion
- **WHEN** the citizen navigates the consent step using only the keyboard
- **THEN** every checkbox and action is reachable and operable, with a visible focus indicator

#### Scenario: A refusal directs the citizen to the cause
- **WHEN** advancing is refused for missing consent
- **THEN** focus moves to the consent control that is blocking
- **AND** the reason is announced to assistive technology

#### Scenario: Step position is announced
- **WHEN** the citizen enters the consent step
- **THEN** the position "Langkah 1 dari 5" is available to assistive technology, not conveyed by styling alone
