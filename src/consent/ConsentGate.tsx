'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { t } from '@/i18n';
import { StepCounter } from '@/components/StepCounter';
import { PrivacyNotice } from './PrivacyNotice';
import { writeConsent } from './store';
import { reportConsentDecision } from './telemetry';
import { isVehicleType } from '@/registration/vehicleType';

/**
 * The consent gate (control: PDP-CONSENT).
 *
 * Consents are separate, independently toggleable, and start unticked — registration processing
 * consent is never bundled with optional analytics consent, and nothing is pre-selected.
 */
export function ConsentGate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationRef = useRef<HTMLInputElement>(null);

  // Never pre-ticked. Ticking is the citizen's act, not the application's default.
  const [registration, setRegistration] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [error, setError] = useState(false);

  const jenis = searchParams.get('jenis');
  const vehicleQuery = isVehicleType(jenis) ? `?jenis=${jenis}` : '';

  const handleAgree = () => {
    if (!registration) {
      setError(true);
      registrationRef.current?.focus();
      return;
    }
    const record = writeConsent({ registration: true, analytics });
    reportConsentDecision('granted', record);
    router.push(`/daftar/identitas${vehicleQuery}`);
  };

  const handleDecline = () => {
    const record = writeConsent({ registration: false, analytics: false });
    reportConsentDecision('declined', record);
    router.push('/daftar/persetujuan/ditolak');
  };

  return (
    <Box>
      <StepCounter current={1} total={5} />

      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('persetujuan.judul')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t('persetujuan.pengantar')}
      </Typography>

      <PrivacyNotice />

      <FormControl error={error} required sx={{ width: '100%', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={registration}
              onChange={(event) => {
                setRegistration(event.target.checked);
                setError(false);
              }}
              slotProps={{
                input: {
                  ref: registrationRef,
                  'aria-describedby': error ? 'persetujuan-error' : undefined,
                },
              }}
            />
          }
          label={t('persetujuan.registrasi.label')}
          sx={{ alignItems: 'flex-start', mb: 1 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
            />
          }
          label={t('persetujuan.analitik.label')}
          sx={{ alignItems: 'flex-start' }}
        />
        {error && (
          <FormHelperText id="persetujuan-error" role="alert">
            {t('persetujuan.wajib')}
          </FormHelperText>
        )}
      </FormControl>

      <Stack spacing={1}>
        <Button variant="contained" fullWidth onClick={handleAgree}>
          {t('persetujuan.setuju')}
        </Button>
        <Button variant="outlined" fullWidth onClick={handleDecline}>
          {t('persetujuan.tolak')}
        </Button>
      </Stack>
    </Box>
  );
}
