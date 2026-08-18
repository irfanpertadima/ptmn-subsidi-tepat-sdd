'use client';

import { createTheme } from '@mui/material/styles';
import { brand, MIN_TOUCH_TARGET } from './tokens';

/**
 * The single theme for Subsidi Tepat. Applied once at the root layout; every route inherits it.
 *
 * Changing a brand token here affects every work order, so treat this file as an interface:
 * changes need the same review as a spec change (design.md, "Risks / Trade-offs").
 */
export const theme = createTheme({
  palette: {
    primary: { main: brand.blue, dark: brand.blueDark, contrastText: brand.surface },
    secondary: { main: brand.red, contrastText: brand.surface },
    success: { main: brand.green, contrastText: brand.surface },
    warning: { main: brand.amber, contrastText: brand.surface },
    error: { main: brand.red, contrastText: brand.surface },
    text: { primary: brand.ink, secondary: brand.inkMuted },
    background: { default: brand.canvas, paper: brand.surface },
    divider: brand.border,
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    // Slightly larger base than MUI's default: the audience includes low-literacy users
    // reading outdoors on small screens.
    fontSize: 15,
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: MIN_TOUCH_TARGET } },
    },
    MuiIconButton: {
      styleOverrides: { root: { minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET } },
    },
    MuiCheckbox: {
      styleOverrides: { root: { padding: 10, width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET } },
    },
    MuiRadio: {
      styleOverrides: { root: { padding: 10, width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET } },
    },
    MuiTextField: { defaultProps: { fullWidth: true } },
    // Focus must stay visible at 3:1 — never remove the outline.
    MuiCssBaseline: {
      styleOverrides: {
        ':focus-visible': { outline: `3px solid ${brand.blue}`, outlineOffset: 2 },
      },
    },
  },
});
