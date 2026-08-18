import { messagesId, type MessageKey } from './messages.id';

export type { MessageKey };
export { messagesId };

/** BCP 47 tag for the document language. */
export const LOCALE = 'id-ID';

/**
 * Resolves a catalogue message.
 *
 * A missing key throws in development and reports in production rather than rendering an empty
 * string: a blank label on a government form is worse than a visible defect in review
 * (design.md, "Message catalogue with fail-loud lookups").
 */
export function t(key: MessageKey, params?: Readonly<Record<string, string | number>>): string {
  const message = messagesId[key];
  if (message === undefined) {
    const error = new Error(`Missing message for key: ${String(key)}`);
    if (process.env.NODE_ENV !== 'production') throw error;
    // Production: surface it without breaking the citizen's journey. Imported lazily so the
    // telemetry boundary does not pull the catalogue into a cycle.
    void import('@/telemetry').then(({ reportError }) => reportError(error));
    return String(key);
  }
  return params ? interpolate(message, params) : message;
}

/**
 * Substitutes `{name}` placeholders. A placeholder with no matching param is left as written
 * rather than blanked, so the omission is visible in review instead of silently disappearing.
 */
function interpolate(message: string, params: Readonly<Record<string, string | number>>): string {
  return message.replace(/\{(\w+)\}/g, (whole, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : whole,
  );
}

/** Formats a date as DD/MM/YYYY, the format used across the product. */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Formats an amount as Indonesian rupiah, e.g. `Rp 10.000`. */
export function formatIdr(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
