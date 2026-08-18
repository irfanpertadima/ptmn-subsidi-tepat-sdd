import { describe, it, expect, beforeEach } from 'vitest';
import { readConsent, writeConsent, clearConsent, hasRegistrationConsent } from './store';
import { CONSENT_RECORD_FIELDS } from './record';
import { PRIVACY_POLICY_VERSION } from './policy';

const STORAGE_KEY = 'subsiditepat.consent';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('consent persistence (control: PDP-CONSENT)', () => {
  it('survives a reload and is not requested again', () => {
    writeConsent({ registration: true, analytics: false });
    // A reload re-reads from sessionStorage; the module holds no in-memory cache.
    expect(hasRegistrationConsent()).toBe(true);
    expect(readConsent()?.registration).toBe(true);
  });

  it('reports no consent before any decision', () => {
    expect(readConsent()).toBeNull();
    expect(hasRegistrationConsent()).toBe(false);
  });

  it('treats a declined decision as no registration consent', () => {
    writeConsent({ registration: false, analytics: false });
    expect(hasRegistrationConsent()).toBe(false);
  });

  it('clears on withdrawal', () => {
    writeConsent({ registration: true, analytics: true });
    clearConsent();
    expect(readConsent()).toBeNull();
  });
});

describe('policy versioning (control: PDP-CONSENT)', () => {
  it('treats consent to an older policy version as absent', () => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        registration: true,
        analytics: false,
        grantedAt: new Date().toISOString(),
        policyVersion: '1999-01-01.1',
      }),
    );
    expect(readConsent()).toBeNull();
    expect(hasRegistrationConsent()).toBe(false);
  });

  it('stamps the current policy version on write', () => {
    const record = writeConsent({ registration: true, analytics: false });
    expect(record.policyVersion).toBe(PRIVACY_POLICY_VERSION);
  });
});

describe('the record carries no personal data (control: PDP-RETENTION)', () => {
  it('stores only decision, timestamp, and policy version', () => {
    writeConsent({ registration: true, analytics: true });
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(Object.keys(stored).sort()).toEqual([...CONSENT_RECORD_FIELDS].sort());
  });

  it('rejects a record carrying an unexpected field, rather than accepting it', () => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        registration: true,
        analytics: false,
        grantedAt: new Date().toISOString(),
        policyVersion: PRIVACY_POLICY_VERSION,
        nik: '3273010101890001',
      }),
    );
    // .strict() makes the widened record unreadable — it fails closed instead of carrying a NIK.
    expect(readConsent()).toBeNull();
  });

  it('has no personal-data field names in its allowed set', () => {
    const forbidden = /nik|ktp|stnk|nama|alamat|telepon|email|plat|polisi/i;
    for (const field of CONSENT_RECORD_FIELDS) {
      expect(forbidden.test(field), `field "${field}" looks like personal data`).toBe(false);
    }
  });
});

describe('storage failures never break the journey', () => {
  it('survives unparseable stored data', () => {
    window.sessionStorage.setItem(STORAGE_KEY, 'not json');
    expect(() => readConsent()).not.toThrow();
    expect(readConsent()).toBeNull();
  });

  it('survives a record of the wrong shape', () => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ registration: 'yes' }));
    expect(readConsent()).toBeNull();
  });
});
