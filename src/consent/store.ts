'use client';

import { consentRecordSchema, type ConsentRecord } from './record';
import { PRIVACY_POLICY_VERSION } from './policy';

/**
 * Consent state, held in `sessionStorage`.
 *
 * `sessionStorage` rather than `localStorage` deliberately: consent that silently persists for
 * months is weaker consent, and PDP-RETENTION pushes toward the shortest defensible lifetime
 * (design.md, "Consent state lives in sessionStorage, keyed by policy version").
 *
 * A record consented to an older notice version is treated as ABSENT, which is what forces
 * re-consent when the notice changes. A bare boolean could not express that.
 */

const STORAGE_KEY = 'subsiditepat.consent';

/** Storage is unavailable in SSR, and in browsers with storage disabled. Never throw for it. */
function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Reads the current consent record.
 *
 * Returns `null` when absent, unparseable, or consented to a superseded policy version — callers
 * treat all three identically, which is what makes "stale consent" fail closed.
 */
export function readConsent(): ConsentRecord | null {
  const raw = storage()?.getItem(STORAGE_KEY);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const result = consentRecordSchema.safeParse(parsed);
  if (!result.success) return null;
  if (result.data.policyVersion !== PRIVACY_POLICY_VERSION) return null;
  return result.data;
}

/** True when registration processing consent is in effect for the current notice version. */
export function hasRegistrationConsent(): boolean {
  return readConsent()?.registration === true;
}

/**
 * Records a consent decision against the current policy version.
 * Returns the stored record so callers can report it without re-reading.
 */
export function writeConsent(decision: { registration: boolean; analytics: boolean }): ConsentRecord {
  const record: ConsentRecord = {
    registration: decision.registration,
    analytics: decision.analytics,
    grantedAt: new Date().toISOString(),
    policyVersion: PRIVACY_POLICY_VERSION,
  };
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage full or blocked. The journey continues; the guard will simply ask again.
  }
  return record;
}

/** Withdraws consent by clearing the record. */
export function clearConsent(): void {
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {
    // As above.
  }
}
