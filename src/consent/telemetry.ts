import { trackEvent } from '@/telemetry';
import type { ConsentRecord } from './record';

/**
 * Records a consent decision as a security-relevant event
 * (control: ISO-A8.15-LOGGING, PDP-NO-PII-IN-LOGS).
 *
 * Carries the decision, the policy version, and the timestamp — never anything identifying. It
 * still goes through the telemetry boundary, which scrubs regardless, so this is defence in depth
 * rather than the only safeguard.
 */
export function reportConsentDecision(
  outcome: 'granted' | 'declined' | 'withdrawn',
  record: Pick<ConsentRecord, 'registration' | 'analytics' | 'policyVersion' | 'grantedAt'>,
): void {
  trackEvent('step_completed', {
    step: 'persetujuan',
    outcome,
    registrationConsent: record.registration,
    // Recorded, but NOT consumed: analytics stays off by default until wo-10 wires this
    // preference to the telemetry boundary.
    analyticsConsent: record.analytics,
    policyVersion: record.policyVersion,
    decidedAt: record.grantedAt,
  });
}
