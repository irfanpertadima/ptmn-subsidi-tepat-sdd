/**
 * The telemetry boundary — the ONLY path from application code to analytics or error reporting.
 *
 * Every payload is scrubbed of personal data before it leaves the browser
 * (control: PDP-NO-PII-IN-LOGS, control: ISO-A8.15-LOGGING). The underlying transport is not
 * re-exported, and an ESLint rule blocks importing it directly, so a caller cannot bypass the
 * scrubber by accident — see design.md, "The scrubber is the only path to telemetry".
 */

import { scrub } from './scrub';
import { getSink, type TransportPayload } from './providers/transport';

export { REDACTED, scrub, scrubString } from './scrub';
export { setSink, resetSink, type TelemetrySink } from './providers/transport';

/** Funnel events the Epic's success metrics are built from. */
export type FunnelEvent =
  | 'step_entered'
  | 'step_completed'
  | 'step_abandoned'
  | 'upload_started'
  | 'upload_succeeded'
  | 'upload_failed'
  | 'validation_failed'
  | 'registration_submitted';

function asPayload(value: unknown): TransportPayload {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as TransportPayload)
    : { value };
}

/**
 * Records a product event. The payload is scrubbed before transmission; callers do not need to
 * pre-sanitize, and must not rely on doing so.
 */
export function trackEvent(name: FunnelEvent, payload: Record<string, unknown> = {}): void {
  try {
    getSink().event(name, asPayload(scrub(payload)));
  } catch {
    // Telemetry must never break the citizen's journey.
  }
}

/** Reports an error. The error and its context are scrubbed before transmission. */
export function reportError(error: unknown, context: Record<string, unknown> = {}): void {
  try {
    getSink().error(
      asPayload({
        error: scrub(error),
        context: scrub(context),
      }),
    );
  } catch {
    // As above.
  }
}
