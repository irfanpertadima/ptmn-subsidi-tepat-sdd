import { describe, it, expect } from 'vitest';
import { t, formatDate, formatIdr, messagesId, type MessageKey } from './index';

describe('message catalogue', () => {
  it('resolves a known key', () => {
    expect(t('daftar.title')).toBe('Pendaftaran Kendaraan');
  });

  it('throws on a missing key outside production', () => {
    expect(() => t('does.not.exist' as MessageKey)).toThrow(/missing message/i);
  });

  it('has no empty message', () => {
    for (const [key, value] of Object.entries(messagesId)) {
      expect(value.trim(), `message "${key}" is empty`).not.toBe('');
    }
  });

  it('covers every status label the journey can show', () => {
    expect(t('status.menunggu')).toBe('Menunggu Verifikasi');
    expect(t('status.terverifikasi')).toBe('Terverifikasi');
    expect(t('status.ditolak')).toBe('Ditolak');
  });
});

describe('formatting', () => {
  it('formats a date as DD/MM/YYYY', () => {
    expect(formatDate(new Date(1989, 2, 14))).toBe('14/03/1989');
  });

  it('pads single-digit days and months', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('05/01/2026');
  });

  it('formats rupiah without decimals', () => {
    const formatted = formatIdr(10000);
    expect(formatted).toContain('10.000');
    expect(formatted).not.toContain(',00');
  });
});
