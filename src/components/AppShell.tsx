import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { t } from '@/i18n';

/**
 * The application chrome every route renders inside. Product screens are built by later work
 * orders; this provides the header, the main landmark, and the skip link.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Keyboard users must be able to bypass the header (WCAG 2.4.1). */}
      <Link
        href="#main"
        sx={{
          position: 'absolute',
          left: -9999,
          top: 0,
          zIndex: 1400,
          p: 2,
          bgcolor: 'background.paper',
          '&:focus': { left: 0 },
        }}
      >
        {t('nav.skipToContent')}
      </Link>

      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>
            {t('app.name')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        id="main"
        component="main"
        maxWidth="sm"
        sx={{ flex: 1, py: 3, px: 2 }}
        tabIndex={-1}
      >
        {children}
      </Container>
    </Box>
  );
}
