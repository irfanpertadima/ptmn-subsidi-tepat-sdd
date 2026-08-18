import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ConsentGuard } from './ConsentGuard';
import { writeConsent } from './store';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

beforeEach(() => {
  window.sessionStorage.clear();
  replace.mockClear();
});

describe('route guard (control: PDP-CONSENT)', () => {
  it('redirects a downstream step entered without consent', async () => {
    render(
      <ConsentGuard>
        <p>data pribadi</p>
      </ConsentGuard>,
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/daftar/persetujuan'));
  });

  it('does not render guarded content before consent is confirmed', () => {
    render(
      <ConsentGuard>
        <p>data pribadi</p>
      </ConsentGuard>,
    );
    // The citizen must never glimpse a step they have not consented to.
    expect(screen.queryByText('data pribadi')).not.toBeInTheDocument();
  });

  it('renders the step once consent exists', async () => {
    writeConsent({ registration: true, analytics: false });
    render(
      <ConsentGuard>
        <p>data pribadi</p>
      </ConsentGuard>,
    );
    expect(await screen.findByText('data pribadi')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects when consent was declined rather than granted', async () => {
    writeConsent({ registration: false, analytics: false });
    render(
      <ConsentGuard>
        <p>data pribadi</p>
      </ConsentGuard>,
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/daftar/persetujuan'));
  });

  it('redirects when the stored consent is for a superseded policy version', async () => {
    window.sessionStorage.setItem(
      'subsiditepat.consent',
      JSON.stringify({
        registration: true,
        analytics: false,
        grantedAt: new Date().toISOString(),
        policyVersion: '1999-01-01.1',
      }),
    );
    render(
      <ConsentGuard>
        <p>data pribadi</p>
      </ConsentGuard>,
    );
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/daftar/persetujuan'));
  });
});
