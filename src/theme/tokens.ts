/**
 * Brand tokens for Subsidi Tepat.
 *
 * These are the ONLY place brand colours are defined. Work orders consume the theme built from
 * them and must not override brand tokens locally — see openspec/changes/wo-01-app-foundation/design.md
 * ("One theme module, no per-route theming"). Keeping them here is what makes the 4.5:1 contrast
 * obligation checkable in one test instead of ten.
 */

/** Minimum interactive target, in px (WCAG 2.1 AA, one-handed use on a 360px viewport). */
export const MIN_TOUCH_TARGET = 44;

export const brand = {
  /** Pertamina blue — primary actions, headers. */
  blue: '#0C4DA2',
  blueDark: '#083A7A',
  /** Pertamina red — destructive and rejected states. */
  red: '#C8102E',
  /** Success / verified. Darkened from the brand green to clear 4.5:1 on white. */
  green: '#00833E',
  /** Warning / pending. Darkened from amber, which fails contrast on white at its usual value. */
  amber: '#8A5A00',
  ink: '#1A1A1A',
  inkMuted: '#5A5A5A',
  surface: '#FFFFFF',
  canvas: '#F4F6F8',
  border: '#D5DAE0',
} as const;

/**
 * Text colours that must clear 4.5:1 against the background they are used on.
 * `themeContrast` in the test suite asserts every entry.
 */
export const contrastPairs: ReadonlyArray<{
  name: string;
  foreground: string;
  background: string;
}> = [
  { name: 'body text on surface', foreground: brand.ink, background: brand.surface },
  { name: 'body text on canvas', foreground: brand.ink, background: brand.canvas },
  { name: 'muted text on surface', foreground: brand.inkMuted, background: brand.surface },
  { name: 'muted text on canvas', foreground: brand.inkMuted, background: brand.canvas },
  { name: 'primary text on surface', foreground: brand.blue, background: brand.surface },
  { name: 'error text on surface', foreground: brand.red, background: brand.surface },
  { name: 'success text on surface', foreground: brand.green, background: brand.surface },
  { name: 'warning text on surface', foreground: brand.amber, background: brand.surface },
  { name: 'surface text on primary', foreground: brand.surface, background: brand.blue },
];
