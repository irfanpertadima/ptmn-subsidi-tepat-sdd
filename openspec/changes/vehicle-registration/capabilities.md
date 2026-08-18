# Capabilities: Vehicle Registration (Pendaftaran Kendaraan) — Subsidi Tepat

Prose outline of the capabilities this feature introduces. Each maps to one or more work orders
whose specs carry the actual delta requirements. No delta specs are written here.

## registration-onboarding

Before asking for any personal data, the application explains the program: what registration is
for, which documents the citizen needs to have on hand, how long verification takes, and what
they receive at the end. From here the citizen chooses the vehicle type they are registering —
Roda 2 or Roda 4 — which determines the document set required for the rest of the journey.

This capability also carries the privacy gate. The citizen is shown the privacy notice and gives
explicit, unbundled consent, and that consent is recorded with a timestamp and the version of the
policy consented to. No personal data leaves the browser before consent exists. If consent is
declined the journey stops here with a clear explanation, not a dead end.

Serves: Budi, Siti, Pak Agus.

## identity-capture

The citizen establishes who they are. They enter their NIK and capture or upload their KTP.
The KTP image is read by the OCR service, which prefills full name, date of birth, and address;
the citizen reviews every prefilled value and corrects anything wrong, because OCR output is a
suggestion and never an authority. The NIK is checked against the backend identity service, and
the result — verified, not found, or service unavailable — is communicated in plain language.

When identity verification is unavailable, the citizen continues with manually entered data
rather than being blocked; the submission is simply marked for fuller manual review. Once
verified, the NIK is masked in the interface to its last four digits.

Serves: Budi, Siti, Pak Agus.

## vehicle-data-entry

The citizen describes the vehicle. They enter the plate number in the official Indonesian format
and the STNK details, and capture the STNK document. OCR prefills the registration number, brand,
model, year, and engine capacity from the STNK image, and again the citizen confirms or corrects.
The plate number is validated for format and normalized to a canonical representation so that
back-office matching is reliable, and a duplicate check tells the citizen immediately if that
vehicle is already registered rather than after days of waiting.

Fields offered adapt to the vehicle type chosen during onboarding — engine capacity and fuel
type options differ between Roda 2 and Roda 4.

Serves: Budi, Siti, Pak Agus.

## document-capture

The citizen provides the required photographs: KTP, STNK, and vehicle images showing the front
with a legible plate and one side view. This is the heaviest and most failure-prone part of the
journey, so the capability owns the quality problem directly. Each captured image is assessed in
the browser for blur, darkness, and resolution before it is accepted, and the citizen is told
specifically what is wrong — the photograph is too dark, the plate is not readable — while they
still have the vehicle in front of them.

Accepted images are compressed client-side to a bounded size that keeps document text legible,
then uploaded directly to storage through short-lived pre-signed URLs. Uploads show real progress,
retry on transient failure with backoff, and never lose the citizen's place in the form. Every
camera interaction has a file-upload alternative so a broken or denied camera cannot end the journey.

Serves: Siti above all, and every other persona.

## review-and-submit

Everything the citizen has entered and captured is presented on a single summary screen for a
final check: identity values, vehicle values, and thumbnails of each document. Any item can be
corrected in place without restarting the flow or losing other steps. The citizen accepts the
declaration (surat pernyataan) that the information is true, and submits.

On submission the application confirms receipt with a reference number and the expected decision
window, and clears the locally held draft. Submission is protected against double-submission and
against partial state where documents uploaded but the registration record did not.

Serves: Budi, Siti, Pak Agus — and Rina downstream, who receives the result.

## registration-status-tracking

After submission the citizen can see, at any time, where their registration stands: awaiting
verification, verified, or rejected — with the date of submission and the expected or actual
decision date. A rejection is never a bare status: each specific reason is listed in plain
Bahasa Indonesia and tied to the item that caused it.

From a rejection the citizen moves directly into a guided correction. Previously accepted data
and documents are preserved, only the failing items are re-collected, and the correction is
resubmitted against the same reference rather than as a new registration.

Serves: Siti, Budi, Pak Agus.

## qr-code-issuance

On approval the citizen receives the QR code that is presented at the SPBU. The code is displayed
at a size and contrast that scans reliably from a phone screen in daylight, and can be downloaded
or printed for use when the phone is offline or out of battery. The code is bound to the specific
approved vehicle, and the screen shows which vehicle it belongs to so a multi-vehicle owner cannot
present the wrong one. A citizen can return and re-display or re-download the code at any time.

Serves: Budi, Siti, Pak Agus.

## vehicle-portfolio

A citizen who owns more than one vehicle sees all of their registrations in one list — plate,
vehicle type, and current status each visible without opening the record. From the list they can
start a new registration, in which their already-verified identity data is carried forward for
confirmation rather than re-entry, open an approved vehicle to reach its QR code, or resume a
draft they left unfinished.

Serves: Pak Agus primarily, and any citizen with a second vehicle.

## journey-instrumentation

The journey reports the events needed to measure the BRD's success metrics: each step entered,
completed, and abandoned; document upload attempts, successes, and failure causes; validation
failures by field; and submission outcomes. Events carry no personal data — no NIK, no document
imagery, no full plate number — and client error reports are stripped of the same before leaving
the browser. This is what turns the BRD's "to be instrumented" baselines into real numbers.

Serves: the program owner and the frontend team, not an end user directly.
