'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { t } from '@/i18n';
import { StepCounter } from '@/components/StepCounter';
import { requiredDocuments, type VehicleType } from './vehicleType';

/**
 * The program explainer.
 *
 * Explains the program, the documents needed, the verification window, and the outcome BEFORE any
 * personal data is requested (control: PDP-LAWFUL-BASIS). This route renders no input that
 * collects personal data — the vehicle-type choice is not personal data.
 */
export function ProgramExplainer() {
  const router = useRouter();
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');
  const [error, setError] = useState(false);

  const handleContinue = () => {
    if (!vehicleType) {
      setError(true);
      // Send focus to what is blocking, rather than leaving the citizen to hunt for it.
      document.getElementById('jenis-kendaraan-roda2')?.focus();
      return;
    }
    router.push(`/daftar/persetujuan?jenis=${vehicleType}`);
  };

  return (
    <Box>
      <StepCounter current={1} total={5} />

      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        {t('daftar.title')}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ fontSize: '1rem', fontWeight: 700, mb: 1 }}>
          {t('daftar.program.judul')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {t('daftar.program.penjelasan')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('daftar.program.durasi')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('daftar.program.hasil')}
        </Typography>
      </Paper>

      <FormControl error={error} required sx={{ mb: 3, width: '100%' }}>
        <FormLabel id="jenis-kendaraan-label" sx={{ fontWeight: 700, mb: 1 }}>
          {t('daftar.jenis.judul')}
        </FormLabel>
        <RadioGroup
          aria-labelledby="jenis-kendaraan-label"
          value={vehicleType}
          onChange={(event) => {
            setVehicleType(event.target.value as VehicleType);
            setError(false);
          }}
        >
          <FormControlLabel
            value="roda2"
            control={<Radio id="jenis-kendaraan-roda2" />}
            label={t('daftar.jenis.roda2')}
          />
          <FormControlLabel
            value="roda4"
            control={<Radio id="jenis-kendaraan-roda4" />}
            label={t('daftar.jenis.roda4')}
          />
        </RadioGroup>
        {error && <FormHelperText>{t('daftar.jenis.wajib')}</FormHelperText>}
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" sx={{ fontSize: '1rem', fontWeight: 700 }}>
          {t('daftar.dokumen.judul')}
        </Typography>
        {vehicleType ? (
          <List dense aria-live="polite">
            {requiredDocuments(vehicleType).map((key) => (
              <ListItem key={key} sx={{ px: 0 }}>
                <ListItemText primary={t(key)} />
              </ListItem>
            ))}
          </List>
        ) : (
          // Before a type is chosen the shared documents are still worth showing, so the citizen
          // can start gathering them.
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary={t('daftar.dokumen.ktp')} />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary={t('daftar.dokumen.stnk')} />
            </ListItem>
          </List>
        )}
      </Box>

      <Button variant="contained" fullWidth onClick={handleContinue}>
        {t('nav.continue')}
      </Button>
    </Box>
  );
}
