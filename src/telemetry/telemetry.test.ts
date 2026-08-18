import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { trackEvent, reportError, setSink, resetSink, REDACTED, type TelemetrySink } from './index';

/**
 * These tests assert the promise the Epic DPIA makes to the DPO: personal data does not leave the
 * browser through telemetry (control: PDP-NO-PII-IN-LOGS).
 *
 * They assert on what the SINK actually receives, not on the scrubber in isolation — the point is
 * that the transmitted payload is clean, however the caller passed the data in.
 */

const NIK = '3273010101890001';
const PLATE = 'D 1234 ABC';
const DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ';
const BLOB_URL = 'blob:http://localhost:3000/8f3a-4b2c';

type Captured = { name?: string; payload: Record<string, unknown> };

let captured: Captured[] = [];

const capturingSink: TelemetrySink = {
  event(name, payload) {
    captured.push({ name, payload: payload as Record<string, unknown> });
  },
  error(payload) {
    captured.push({ payload: payload as Record<string, unknown> });
  },
};

/** Everything transmitted, flattened to one string — nothing can hide in a nested field. */
function transmitted(): string {
  return JSON.stringify(captured);
}

beforeEach(() => {
  captured = [];
  setSink(capturingSink);
});

afterEach(() => {
  resetSink();
});

describe('NIK is never transmitted', () => {
  it('removes a NIK from a field named for it', () => {
    trackEvent('step_completed', { nik: NIK, step: 'identitas' });
    expect(transmitted()).not.toContain(NIK);
    expect(transmitted()).toContain('identitas');
  });

  it('removes a NIK that arrived in an unexpected field', () => {
    trackEvent('validation_failed', { note: `gagal untuk ${NIK}` });
    expect(transmitted()).not.toContain(NIK);
  });

  it('removes a NIK written with separators', () => {
    trackEvent('validation_failed', { note: '3273-0101-0189-0001' });
    expect(transmitted()).not.toContain('3273');
  });

  it('removes a NIK nested deep in the payload', () => {
    trackEvent('step_completed', { form: { owner: { identity: { value: NIK } } } });
    expect(transmitted()).not.toContain(NIK);
  });
});

describe('document images are never transmitted', () => {
  it('removes an inline base64 image', () => {
    reportError(new Error('upload failed'), { preview: DATA_URL });
    expect(transmitted()).not.toContain('/9j/4AAQ');
    expect(transmitted()).toContain('upload failed');
  });

  it('removes an object URL', () => {
    reportError(new Error('upload failed'), { objectUrl: BLOB_URL });
    expect(transmitted()).not.toContain('8f3a-4b2c');
  });

  it('removes a data URL embedded in an error message', () => {
    reportError(new Error(`gagal mengunggah ${DATA_URL}`));
    expect(transmitted()).not.toContain('/9j/4AAQ');
  });

  it('removes binary payloads outright', () => {
    trackEvent('upload_failed', { bytes: new Uint8Array([1, 2, 3]) });
    expect(transmitted()).toContain(REDACTED);
  });

  it('removes a field named for a document regardless of content', () => {
    trackEvent('upload_succeeded', { fotoKtp: 'anything', dokumenStnk: 'anything' });
    expect(transmitted()).not.toContain('anything');
  });
});

describe('plate numbers are never transmitted', () => {
  it('removes a plate from a field named for it', () => {
    trackEvent('step_completed', { nomorPolisi: PLATE });
    expect(transmitted()).not.toContain(PLATE);
  });

  it('removes a plate embedded in free text', () => {
    trackEvent('validation_failed', { message: `Kendaraan ${PLATE} sudah terdaftar` });
    expect(transmitted()).not.toContain(PLATE);
    expect(transmitted()).toContain('sudah terdaftar');
  });
});

describe('other personal data is never transmitted', () => {
  it('removes address, phone, email, date of birth, and full name', () => {
    trackEvent('step_completed', {
      alamat: 'Jl. Merdeka No. 45, Bandung',
      noHp: '081234567890',
      email: 'budi@example.com',
      tanggalLahir: '14/03/1989',
      namaLengkap: 'BUDI SANTOSO',
    });
    const sent = transmitted();
    expect(sent).not.toContain('Merdeka');
    expect(sent).not.toContain('081234567890');
    expect(sent).not.toContain('budi@example.com');
    expect(sent).not.toContain('BUDI SANTOSO');
  });
});

describe('telemetry never breaks the journey', () => {
  it('survives a cyclic payload', () => {
    const cyclic: Record<string, unknown> = { step: 'dokumen' };
    cyclic.self = cyclic;
    expect(() => trackEvent('step_entered', cyclic)).not.toThrow();
    expect(transmitted()).toContain('[circular]');
  });

  it('swallows a throwing sink rather than propagating', () => {
    setSink({
      event() {
        throw new Error('transport down');
      },
      error() {
        throw new Error('transport down');
      },
    });
    expect(() => trackEvent('step_entered', { step: 'daftar' })).not.toThrow();
    expect(() => reportError(new Error('boom'))).not.toThrow();
  });

  it('preserves non-personal analytics data', () => {
    trackEvent('upload_failed', { step: 'dokumen', attempt: 3, reason: 'network_timeout' });
    const sent = transmitted();
    expect(sent).toContain('dokumen');
    expect(sent).toContain('network_timeout');
    expect(sent).toContain('3');
  });
});
