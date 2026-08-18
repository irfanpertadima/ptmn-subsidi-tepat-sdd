/**
 * The privacy-notice version the application currently presents.
 *
 * Bump this ONLY for substantive changes to the notice — a change to the lawful basis, the data
 * collected, the retention period, or the rights described. Every bump forces every citizen to
 * consent again, so a typo fix must not touch it (design.md, "Re-consent on every policy change
 * may fatigue citizens").
 *
 * It is a build-time constant rather than a fetched value so the consent step has no network
 * dependency: it must work before anything else does. The commit that changes the notice also
 * changes this constant, which is the review point where the DPO decides whether the change
 * warrants re-consent.
 */
export const PRIVACY_POLICY_VERSION = '2026-08-18.1';
