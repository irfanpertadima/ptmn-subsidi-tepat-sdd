import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { MessageKey } from '@/i18n';
import { t } from '@/i18n';

/**
 * Placeholder body for a skeleton route.
 *
 * Routes exist from wo-01 so navigation is settled before screens are built; each later work order
 * replaces the placeholder for the route it owns.
 */
export function StepPlaceholder({
  titleKey,
  workOrder,
}: Readonly<{
  titleKey: MessageKey;
  workOrder: string;
}>) {
  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t(titleKey)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {workOrder}
      </Typography>
    </Box>
  );
}
