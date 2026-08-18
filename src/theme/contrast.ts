/**
 * WCAG 2.1 relative-luminance contrast ratio.
 *
 * Lives in src/ rather than in the test folder because the accessibility obligation is a product
 * requirement, not a test concern — a work order adding a colour can check it directly.
 */

/** Parses `#RGB` or `#RRGGBB` into 0-255 channels. Throws on anything else, by design. */
function parseHex(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  const int = Number.parseInt(full, 16);
  return [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff];
}

function relativeLuminance(hex: string): number {
  const channels = parseHex(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** Contrast ratio between two hex colours, from 1 (identical) to 21 (black on white). */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG 2.1 AA minimum for normal-size text. */
export const AA_NORMAL_TEXT = 4.5;
/** WCAG 2.1 AA minimum for UI boundaries and focus indicators. */
export const AA_NON_TEXT = 3;
