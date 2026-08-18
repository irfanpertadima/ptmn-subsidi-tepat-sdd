import type { Metadata, Viewport } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';
import { t } from '@/i18n';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: `${t('app.name')} — ${t('app.tagline')}`,
  description: t('daftar.intro'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Not capped: the layout must survive 200% zoom (WCAG 2.1 AA).
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang="id" — Bahasa Indonesia is the launch language (PRD, i18n requirements).
  return (
    <html lang="id">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
