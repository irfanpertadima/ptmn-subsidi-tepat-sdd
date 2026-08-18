import { describe, it, expect } from 'vitest';
import { contrastRatio, AA_NORMAL_TEXT } from './contrast';
import { contrastPairs, MIN_TOUCH_TARGET } from './tokens';
import { theme } from './theme';

describe('theme accessibility', () => {
  it.each(contrastPairs)('$name clears 4.5:1', ({ foreground, background }) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it('sets a 44px minimum height on buttons', () => {
    const root = theme.components?.MuiButton?.styleOverrides?.root;
    expect(root).toMatchObject({ minHeight: MIN_TOUCH_TARGET });
  });

  it('sets a 44px minimum target on icon buttons', () => {
    const root = theme.components?.MuiIconButton?.styleOverrides?.root;
    expect(root).toMatchObject({ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET });
  });

  it('keeps a visible focus indicator', () => {
    const baseline = theme.components?.MuiCssBaseline?.styleOverrides as
      | Record<string, unknown>
      | undefined;
    expect(baseline?.[':focus-visible']).toBeDefined();
  });
});

describe('contrast helper', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });

  it('returns 1 for identical colours', () => {
    expect(contrastRatio('#0C4DA2', '#0C4DA2')).toBeCloseTo(1, 5);
  });

  it('is order-independent', () => {
    expect(contrastRatio('#0C4DA2', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#0C4DA2'), 5);
  });

  it('accepts shorthand hex', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 1);
  });

  it('rejects a non-hex colour', () => {
    expect(() => contrastRatio('rebeccapurple', '#FFFFFF')).toThrow(/hex/i);
  });
});
