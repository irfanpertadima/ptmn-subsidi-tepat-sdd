import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { t } from '@/i18n';

/**
 * The decline outcome (control: PDP-CONSENT).
 *
 * A distinct screen rather than a dialog: a modal invites a reflexive dismissal, and declining
 * consent deserves a deliberate one. It states the consequence and offers a route back, so the
 * decision is reversible rather than a dead end.
 */
export default function PersetujuanDitolakPage() {
  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('persetujuan.ditolak.judul')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t('persetujuan.ditolak.penjelasan')}
      </Typography>
      <Button component={Link} href="/daftar/persetujuan" variant="contained" fullWidth>
        {t('persetujuan.ditolak.kembali')}
      </Button>
    </Box>
  );
}
