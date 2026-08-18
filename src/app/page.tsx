import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { t } from '@/i18n';

export default function HomePage() {
  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('daftar.title')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {t('daftar.intro')}
      </Typography>
      <Button component={Link} href="/daftar" variant="contained" fullWidth>
        {t('nav.continue')}
      </Button>
    </Box>
  );
}
