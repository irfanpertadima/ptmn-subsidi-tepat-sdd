/**
 * The actual transport to the analytics and error-reporting backends.
 *
 * NOT for direct import by application code — the ESLint rule `no-restricted-imports` blocks it.
 * Everything must go through `@/telemetry`, which scrubs first (control: PDP-NO-PII-IN-LOGS).
 *
 * Swapping in a real vendor SDK happens here and nowhere else. Whichever vendor is chosen must
 * process data inside Indonesia — see the Epic DPIA's open PDP-CROSS-BORDER item.
 */

export type TransportPayload = Readonly<Record<string, unknown>>;

/** A sink receives already-scrubbed payloads. */
export interface TelemetrySink {
  event(name: string, payload: TransportPayload): void;
  error(payload: TransportPayload): void;
}

/** Default sink: console in development, no-op in production until a vendor is wired up. */
const consoleSink: TelemetrySink = {
  event(name, payload) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[telemetry:event]', name, payload);
    }
  },
  error(payload) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[telemetry:error]', payload);
    }
  },
};

let sink: TelemetrySink = consoleSink;

/** Replaces the sink. Used to wire a vendor SDK, and by tests to capture transmitted payloads. */
export function setSink(next: TelemetrySink): void {
  sink = next;
}

export function resetSink(): void {
  sink = consoleSink;
}

export function getSink(): TelemetrySink {
  return sink;
}
