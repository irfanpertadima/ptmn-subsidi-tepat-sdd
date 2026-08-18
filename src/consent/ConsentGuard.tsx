'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { hasRegistrationConsent } from './store';
import { t } from '@/i18n';

/**
 * Blocks a step until registration consent exists, redirecting to the consent gate otherwise.
 *
 * Every step that collects personal data wraps in this (control: PDP-CONSENT). It is one guard
 * rather than a check inside each screen because later work orders each add a data-collecting
 * step, and one forgotten check would silently open the boundary the DPIA rests on
 * (design.md, "A route guard enforces the gate, not each screen").
 *
 * This is a UX and policy control, NOT a security boundary — sessionStorage is tamperable and the
 * backend re-checks consent at submission.
 */
export function ConsentGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  // Consent lives in sessionStorage, so it cannot be read during SSR. Render nothing decisive
  // until the client has checked, rather than flashing content the citizen has not consented to.
  const [state, setState] = useState<'checking' | 'allowed'>('checking');

  useEffect(() => {
    if (hasRegistrationConsent()) {
      setState('allowed');
    } else {
      router.replace('/daftar/persetujuan');
    }
  }, [router]);

  if (state === 'checking') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }} aria-live="polite">
        <CircularProgress aria-label={t('consent.checking')} />
      </Box>
    );
  }

  return <>{children}</>;
}
