'use client';

import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { t } from '@/i18n';
import { reportError } from '@/telemetry';

/**
 * Route error boundary.
 *
 * Reports through the telemetry boundary, so the error and any personal data caught in its message
 * or stack are scrubbed before transmission (control: PDP-NO-PII-IN-LOGS).
 */
export default function RouteError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    reportError(error, { digest: error.digest });
  }, [error]);

  return (
    <Box role="alert">
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('error.title')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t('error.body')}
      </Typography>
      <Button onClick={reset} variant="contained" fullWidth>
        {t('error.retry')}
      </Button>
    </Box>
  );
}
