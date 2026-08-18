import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { t } from '@/i18n';

/**
 * The privacy notice: lawful basis, data collected, retention, rights, and withdrawal
 * (control: PDP-LAWFUL-BASIS, PDP-DATA-SUBJECT-RIGHTS).
 *
 * A scrollable region with real headings, deliberately NOT an accordion — a collapsed panel lets a
 * citizen consent without the text ever being rendered (design.md, UI Notes). The region is
 * focusable and labelled so screen-reader and keyboard users can reach and scroll it.
 */
const SECTIONS = [
  ['persetujuan.notice.dasarJudul', 'persetujuan.notice.dasar'],
  ['persetujuan.notice.dataJudul', 'persetujuan.notice.data'],
  ['persetujuan.notice.retensiJudul', 'persetujuan.notice.retensi'],
  ['persetujuan.notice.hakJudul', 'persetujuan.notice.hak'],
  ['persetujuan.notice.penarikanJudul', 'persetujuan.notice.penarikan'],
] as const;

export function PrivacyNotice() {
  return (
    <Box
      component="section"
      aria-labelledby="notice-heading"
      tabIndex={0}
      sx={{
        maxHeight: 320,
        overflowY: 'auto',
        p: 2,
        mb: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        id="notice-heading"
        variant="h6"
        component="h2"
        sx={{ fontSize: '1rem', fontWeight: 700, mb: 1 }}
      >
        {t('persetujuan.notice.judul')}
      </Typography>

      {SECTIONS.map(([headingKey, bodyKey]) => (
        <Box key={headingKey} sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            component="h3"
            sx={{ fontWeight: 700 }}
          >
            {t(headingKey)}
          </Typography>
          <Typography variant="body2">{t(bodyKey)}</Typography>
        </Box>
      ))}
    </Box>
  );
}
