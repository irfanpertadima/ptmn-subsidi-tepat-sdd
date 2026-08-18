import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Paper, Stepper, Step, StepLabel, Button, TextField,
  Chip, LinearProgress, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogActions,
  Card, CardContent, Stack, Divider, IconButton, Checkbox, FormControlLabel, ThemeProvider,
  createTheme, CssBaseline, List, ListItem, ListItemIcon, ListItemText, Avatar,
} from '@mui/material';

// Real app shell for Subsidi Tepat — Pendaftaran Kendaraan, per ux-design.md.
// Design system: MUI (Material Design), confirmed high confidence by the forge rubric.
// Mobile-first: the dominant client is a 360px entry-level Android device.
// Copy is Bahasa Indonesia, as required by openspec/config.yaml.

const theme = createTheme({
  palette: {
    primary: { main: '#0C4DA2' },   // Pertamina blue
    secondary: { main: '#ED1C24' }, // Pertamina red
    success: { main: '#00833E' },
    warning: { main: '#B26A00' },
    background: { default: '#F4F6F8' },
  },
  typography: { fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  components: {
    // 44x44 minimum touch target — WCAG 2.1 AA / one-handed use.
    MuiButton: { styleOverrides: { root: { minHeight: 44, textTransform: 'none', fontWeight: 600 } } },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
  },
});

const STEPS = ['Persetujuan', 'Identitas', 'Kendaraan', 'Dokumen', 'Ringkasan'];

/** Phone-sized frame so the screenshot shows the real target viewport. */
function Phone({ title, children }) {
  return (
    <Box sx={{ width: 360, flexShrink: 0 }}>
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary', fontWeight: 700, letterSpacing: 1,
          display: 'block', height: 40, lineHeight: 1.4, overflow: 'hidden',
        }}
      >
        {title}
      </Typography>
      <Paper
        elevation={4}
        sx={{
          width: 360, height: 720, borderRadius: 4, overflow: 'hidden',
          display: 'flex', flexDirection: 'column', bgcolor: 'background.default',
          border: '1px solid', borderColor: 'divider',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

function TopBar({ label }) {
  return (
    <AppBar position="static" elevation={0} color="primary">
      <Toolbar variant="dense" sx={{ minHeight: 56 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>{label}</Typography>
        <Chip label="Subsidi Tepat" size="small" sx={{ bgcolor: 'rgba(255,255,255,.18)', color: '#fff' }} />
      </Toolbar>
    </AppBar>
  );
}

/** Compact step counter — a full Stepper does not fit 360px (ux-design.md). */
function StepHeader({ active }) {
  return (
    <Box sx={{ px: 2, pt: 2 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
        Langkah {active + 1} dari {STEPS.length} — {STEPS[active]}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={((active + 1) / STEPS.length) * 100}
        sx={{ mt: 0.75, height: 6, borderRadius: 3 }}
      />
    </Box>
  );
}

/** Screen 1 — document capture. The highest-risk screen in the epic. */
function DocumentCaptureScreen({ onOpenError }) {
  return (
    <>
      <TopBar label="Pendaftaran Kendaraan" />
      <StepHeader active={3} />
      <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Unggah Dokumen</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pastikan foto terang dan tulisan terbaca.
        </Typography>

        <Card variant="outlined" sx={{ mb: 1.5 }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar variant="rounded" sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>✓</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Foto KTP</Typography>
                <Typography variant="caption" color="success.main">Berhasil diunggah · 480 KB</Typography>
              </Box>
              <Button size="small" variant="text">Ganti</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 1.5 }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
              <Avatar variant="rounded" sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>↑</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Foto STNK</Typography>
                <Typography variant="caption" color="text.secondary">Mengunggah… 64%</Typography>
              </Box>
            </Stack>
            <LinearProgress variant="determinate" value={64} sx={{ height: 6, borderRadius: 3 }} />
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 1.5, borderColor: 'secondary.main', borderWidth: 2 }}>
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
              <Avatar variant="rounded" sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>!</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Foto Kendaraan (Depan)</Typography>
                <Typography variant="caption" color="secondary.main">Foto terlalu gelap</Typography>
              </Box>
            </Stack>
            {/* Quality feedback arrives while the vehicle is still in front of the citizen. */}
            <Alert severity="error" sx={{ py: 0.5, mb: 1 }}>
              <Typography variant="caption">
                Plat nomor tidak terbaca. Ambil ulang di tempat yang lebih terang.
              </Typography>
            </Alert>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="contained" color="secondary" onClick={onOpenError} fullWidth>
                Ambil Ulang
              </Button>
              {/* Camera is never required — file upload is always available. */}
              <Button size="small" variant="outlined" fullWidth>Pilih File</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2, borderStyle: 'dashed' }}>
          <CardContent sx={{ py: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Foto Kendaraan (Samping)</Typography>
            <Button variant="outlined" size="small">Ambil Foto</Button>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
        <Button variant="contained" fullWidth disabled>Lanjutkan</Button>
      </Box>
    </>
  );
}

/** Screen 2 — identity, showing the OCR-review and NIK-masking rules. */
function IdentityScreen() {
  return (
    <>
      <TopBar label="Pendaftaran Kendaraan" />
      <StepHeader active={1} />
      <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Data Identitas</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Periksa data hasil pindai KTP Anda.
        </Typography>

        <Alert severity="success" sx={{ mb: 2, py: 0.5 }}>
          <Typography variant="caption">NIK terverifikasi</Typography>
        </Alert>

        {/* NIK masked to last 4 digits once verified (control: PDP-NO-PII-IN-LOGS). */}
        <TextField label="NIK" value="•••• •••• •••• 4821" size="small" fullWidth disabled sx={{ mb: 2 }} />

        {/* OCR output is a suggestion, never an authority — citizen confirms each value. */}
        <TextField
          label="Nama Lengkap" defaultValue="BUDI SANTOSO" size="small" fullWidth sx={{ mb: 2 }}
          helperText="Hasil pindai — periksa kembali"
        />
        <TextField
          label="Tanggal Lahir" defaultValue="14/03/1989" size="small" fullWidth sx={{ mb: 2 }}
          helperText="Hasil pindai — periksa kembali"
        />
        <TextField
          label="Alamat" defaultValue="Jl. Merdeka No. 45, Bandung" size="small" fullWidth multiline rows={2}
          helperText="Hasil pindai — periksa kembali" sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label={<Typography variant="body2">Data di atas sudah benar</Typography>}
        />
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
        <Button variant="contained" fullWidth>Lanjutkan</Button>
      </Box>
    </>
  );
}

/** Screen 3 — status tracking with itemised rejection reasons and guided correction. */
function StatusScreen() {
  return (
    <>
      <TopBar label="Status Pendaftaran" />
      <Box sx={{ p: 2, overflowY: 'auto', flex: 1 }}>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>D 1234 ABC</Typography>
              {/* Status carried by icon + text, never colour alone. */}
              <Chip label="✕ Ditolak" color="secondary" size="small" sx={{ fontWeight: 700 }} />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Roda 4 · Toyota Avanza 2019 · Diajukan 12/08/2026
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" color="text.secondary">No. Referensi</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>ST-2026-0814-77213</Typography>
          </CardContent>
        </Card>

        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle sx={{ fontSize: 14, fontWeight: 700 }}>Perlu Diperbaiki</AlertTitle>
          <Typography variant="caption">Perbaiki 2 item berikut, lalu kirim ulang.</Typography>
        </Alert>

        {/* Each reason ties to the item that caused it, with a direct fix action. */}
        <List dense sx={{ bgcolor: '#fff', borderRadius: 1, mb: 2, border: '1px solid', borderColor: 'divider' }}>
          <ListItem
            secondaryAction={<Button size="small" variant="outlined">Perbaiki</Button>}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>✕</ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Foto STNK</Typography>}
              secondary={<Typography variant="caption">Tulisan tidak terbaca</Typography>}
            />
          </ListItem>
          <Divider component="li" />
          <ListItem
            secondaryAction={<Button size="small" variant="outlined">Perbaiki</Button>}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>✕</ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>Foto Kendaraan</Typography>}
              secondary={<Typography variant="caption">Plat nomor tertutup</Typography>}
            />
          </ListItem>
        </List>

        {/* Accepted data is preserved — the citizen does not retype the whole form. */}
        <Alert severity="info" sx={{ py: 0.5 }}>
          <Typography variant="caption">
            Data lain yang sudah benar tetap tersimpan. Anda hanya perlu memperbaiki item di atas.
          </Typography>
        </Alert>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
        <Button variant="contained" fullWidth>Kirim Ulang</Button>
      </Box>
    </>
  );
}

export default function App() {
  const [errorOpen, setErrorOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, bgcolor: '#E8ECEF', minHeight: '100vh' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
          Subsidi Tepat — Pendaftaran Kendaraan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Design system: <strong>MUI (Material Design)</strong> · Bahasa Indonesia · viewport 360px
          (Android kelas dasar)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
          Epic: vehicle-registration · Layar berisiko tertinggi ditampilkan untuk persetujuan visual
        </Typography>

        <Stack direction="row" spacing={4} alignItems="flex-start" sx={{ overflowX: 'auto', pb: 2 }}>
          <Phone title="Langkah 2 — Identitas (OCR + NIK tersamar)">
            <IdentityScreen />
          </Phone>
          <Phone title="Langkah 4 — Unggah Dokumen (risiko tinggi)">
            <DocumentCaptureScreen onOpenError={() => setErrorOpen(true)} />
          </Phone>
          <Phone title="Status — Ditolak dengan alasan spesifik">
            <StatusScreen />
          </Phone>
        </Stack>

        {/* Representative modal: camera permission denied must never end the journey. */}
        <Dialog open={errorOpen} onClose={() => setErrorOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Tips Mengambil Foto</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              Agar foto dapat diverifikasi:
            </Typography>
            <List dense>
              <ListItem disableGutters><ListItemText primary="Ambil foto di tempat terang" /></ListItem>
              <ListItem disableGutters><ListItemText primary="Pastikan seluruh plat nomor terlihat" /></ListItem>
              <ListItem disableGutters><ListItemText primary="Jangan gunakan zoom digital" /></ListItem>
            </List>
            <Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
              <Typography variant="caption">
                Kamera tidak berfungsi? Anda tetap dapat memilih file dari galeri.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setErrorOpen(false)} variant="outlined" fullWidth>Pilih File</Button>
            <Button onClick={() => setErrorOpen(false)} variant="contained" fullWidth>Buka Kamera</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
