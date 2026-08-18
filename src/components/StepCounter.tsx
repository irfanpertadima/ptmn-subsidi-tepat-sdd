import Typography from '@mui/material/Typography';
import { t } from '@/i18n';

/**
 * Compact step position for the 360px viewport, as the Epic specified in place of a full Stepper.
 *
 * Rendered as text rather than styling so assistive technology reads it, and marked `aria-live`
 * so a step change is announced rather than only re-painted.
 */
export function StepCounter({ current, total }: Readonly<{ current: number; total: number }>) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mb: 1 }}
      role="status"
      aria-live="polite"
    >
      {t('langkah.dari', { current, total })}
    </Typography>
  );
}
