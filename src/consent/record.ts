import { z } from 'zod';

/**
 * The consent record.
 *
 * Holds ONLY the decision, when it was made, and which notice version it was made against
 * (control: PDP-CONSENT, PDP-RETENTION). It must never carry personal data — `consentRecordSchema`
 * is `.strict()` so an unexpected field makes the record unreadable rather than silently accepted,
 * and a test asserts the field set so a later change cannot widen it quietly.
 *
 * This is a navigation gate, not the legal record of consent. The authoritative record is the
 * backend's copy, written at submission (design.md, "The local record is not the legal record").
 */
export const consentRecordSchema = z
  .object({
    /** Consent to process registration data. Required to continue. */
    registration: z.boolean(),
    /** Optional analytics consent. Recorded but not consumed until wo-10. */
    analytics: z.boolean(),
    /** ISO-8601 instant the decision was made. */
    grantedAt: z.string().datetime(),
    /** The notice version consented to. */
    policyVersion: z.string().min(1),
  })
  .strict();

export type ConsentRecord = z.infer<typeof consentRecordSchema>;

/** The field names the record is allowed to contain — asserted by the test suite. */
export const CONSENT_RECORD_FIELDS = [
  'registration',
  'analytics',
  'grantedAt',
  'policyVersion',
] as const;
