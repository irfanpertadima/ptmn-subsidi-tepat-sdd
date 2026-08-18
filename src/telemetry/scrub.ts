/**
 * Removes personal data from telemetry payloads.
 *
 * UU PDP No. 27/2022 (control: PDP-NO-PII-IN-LOGS, control: ISO-A8.15-LOGGING).
 *
 * Two independent passes, because either alone is insufficient:
 *   - by FIELD NAME, which catches well-formed data in an expected field;
 *   - by VALUE SHAPE, which catches personal data that arrived in an unexpected field —
 *     a NIK pasted into a "note", a document image inside an error message.
 *
 * A later work order that introduces a new personal-data field must add its name to
 * DENIED_FIELD_PATTERNS. That is an explicit task in each work order's checklist.
 */

export const REDACTED = '[redacted]';

/** Field names whose value is personal data regardless of what it looks like. */
const DENIED_FIELD_PATTERNS: readonly RegExp[] = [
  /nik/i,
  /ktp/i,
  /stnk/i,
  // Indonesian and English spellings of the same concepts.
  /(nomor|no)_?(polisi|pol)\b/i,
  /plate|plat/i,
  /alamat|address/i,
  /tanggal_?lahir|tgl_?lahir|birth|dob/i,
  /telepon|telpon|no_?hp|phone|msisdn/i,
  /email|surel/i,
  /nama_?lengkap|full_?name/i,
  /foto|photo|image|gambar|document|dokumen/i,
];

/** A 16-digit run — the shape of a NIK — allowing spaces or hyphens as separators. */
const NIK_SHAPE = /\b(?:\d[\s-]?){15}\d\b/g;

/** Inline image payloads and object URLs: a document image that slipped into a string. */
const DATA_URL_SHAPE = /data:[a-z-]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi;
const BLOB_URL_SHAPE = /blob:https?:\/\/[^\s"']+/gi;

/**
 * Indonesian plate number, e.g. `D 1234 ABC`, `B1A`, `DK-5678-XY`.
 * Deliberately broad: over-redacting an analytics string is harmless, under-redacting is a breach.
 */
const PLATE_SHAPE = /\b[A-Z]{1,2}[\s-]?\d{1,4}[\s-]?[A-Z]{1,3}\b/g;

function isDeniedFieldName(name: string): boolean {
  return DENIED_FIELD_PATTERNS.some((pattern) => pattern.test(name));
}

/** Applies the value-shape passes to a single string. */
export function scrubString(input: string): string {
  return input
    .replace(DATA_URL_SHAPE, REDACTED)
    .replace(BLOB_URL_SHAPE, REDACTED)
    .replace(NIK_SHAPE, REDACTED)
    .replace(PLATE_SHAPE, REDACTED);
}

/**
 * Deep-scrubs an arbitrary telemetry payload, returning a new value.
 *
 * Cyclic references are replaced with `'[circular]'` rather than throwing — telemetry must never
 * be the thing that breaks the citizen's journey.
 */
export function scrub<T>(value: T): unknown {
  return scrubValue(value, new WeakSet<object>());
}

function scrubValue(value: unknown, seen: WeakSet<object>): unknown {
  if (typeof value === 'string') return scrubString(value);
  if (value === null || typeof value !== 'object') return value;

  if (seen.has(value)) return '[circular]';
  seen.add(value);

  if (value instanceof Date) return value.toISOString();

  if (value instanceof Error) {
    return {
      name: value.name,
      message: scrubString(value.message),
      stack: value.stack === undefined ? undefined : scrubString(value.stack),
    };
  }

  if (Array.isArray(value)) return value.map((item) => scrubValue(item, seen));

  // Binary payloads are document imagery by definition here — never transmit them.
  if (typeof Blob !== 'undefined' && value instanceof Blob) return REDACTED;
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return REDACTED;

  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    output[key] = isDeniedFieldName(key) ? REDACTED : scrubValue(item, seen);
  }
  return output;
}
