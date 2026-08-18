import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsentGate } from './ConsentGate';
import { readConsent } from './store';
import { setSink, resetSink, type TelemetrySink } from '@/telemetry';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams('jenis=roda4'),
}));

let captured: Array<{ name: string; payload: Record<string, unknown> }> = [];
const sink: TelemetrySink = {
  event: (name, payload) => captured.push({ name, payload: payload as Record<string, unknown> }),
  error: () => {},
};

beforeEach(() => {
  window.sessionStorage.clear();
  push.mockClear();
  captured = [];
  setSink(sink);
});
afterEach(() => resetSink());

const registrationBox = () =>
  screen.getByRole('checkbox', { name: /data pribadi saya diproses/i });
const analyticsBox = () => screen.getByRole('checkbox', { name: /data penggunaan anonim/i });

describe('consent controls', () => {
  it('renders both checkboxes unticked on first visit', () => {
    render(<ConsentGate />);
    expect(registrationBox()).not.toBeChecked();
    expect(analyticsBox()).not.toBeChecked();
  });

  it('refuses to advance without registration consent, in Bahasa Indonesia', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(screen.getByRole('button', { name: 'Saya Setuju' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Persetujuan diperlukan untuk melanjutkan pendaftaran',
    );
    expect(push).not.toHaveBeenCalled();
    expect(readConsent()).toBeNull();
  });

  it('moves focus to the blocking control when refused', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(screen.getByRole('button', { name: 'Saya Setuju' }));
    expect(registrationBox()).toHaveFocus();
  });

  it('allows registration consent while analytics is left off', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(registrationBox());
    await user.click(screen.getByRole('button', { name: 'Saya Setuju' }));

    const record = readConsent();
    expect(record?.registration).toBe(true);
    expect(record?.analytics).toBe(false);
    expect(push).toHaveBeenCalledWith('/daftar/identitas?jenis=roda4');
  });

  it('records analytics consent separately when given', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(registrationBox());
    await user.click(analyticsBox());
    await user.click(screen.getByRole('button', { name: 'Saya Setuju' }));
    expect(readConsent()?.analytics).toBe(true);
  });
});

describe('declining', () => {
  it('routes to the consequence screen and records no registration consent', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(screen.getByRole('button', { name: 'Tidak Setuju' }));

    expect(push).toHaveBeenCalledWith('/daftar/persetujuan/ditolak');
    expect(readConsent()?.registration).toBe(false);
  });
});

describe('consent telemetry (control: PDP-NO-PII-IN-LOGS, ISO-A8.15-LOGGING)', () => {
  it('records the decision without anything identifying', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(registrationBox());
    await user.click(screen.getByRole('button', { name: 'Saya Setuju' }));

    const sent = JSON.stringify(captured);
    expect(captured).toHaveLength(1);
    expect(sent).toContain('persetujuan');
    expect(sent).toContain('granted');
    // Nothing that could identify the citizen.
    expect(sent).not.toMatch(/nik|alamat|telepon|email/i);
    expect(sent).not.toMatch(/\d{16}/);
  });

  it('records a decline too', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(screen.getByRole('button', { name: 'Tidak Setuju' }));
    expect(JSON.stringify(captured)).toContain('declined');
  });
});

describe('accessibility', () => {
  it('associates the error with the blocking checkbox', async () => {
    const user = userEvent.setup();
    render(<ConsentGate />);
    await user.click(screen.getByRole('button', { name: 'Saya Setuju' }));
    expect(registrationBox()).toHaveAttribute('aria-describedby', 'persetujuan-error');
  });

  it('announces the step position rather than styling it', () => {
    render(<ConsentGate />);
    expect(screen.getByRole('status')).toHaveTextContent('Langkah 1 dari 5');
  });

  it('exposes the privacy notice as a labelled region with real headings', () => {
    render(<ConsentGate />);
    const notice = screen.getByRole('region', { name: /pemberitahuan privasi/i });
    expect(notice).toBeInTheDocument();
    // Retention and rights must be readable without opening anything.
    expect(notice).toHaveTextContent(/Jangka Waktu Penyimpanan/);
    expect(notice).toHaveTextContent(/Hak Anda/);
    expect(notice).toHaveTextContent(/Menarik Persetujuan/);
  });
});
