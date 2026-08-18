/**
 * The vehicle type being registered.
 *
 * Travels in the query string, not in storage: it is a benign, shareable choice, and a reload or
 * a shared link should preserve it (design.md, "Vehicle type travels in the URL, consent does not").
 */
export const VEHICLE_TYPES = ['roda2', 'roda4'] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export function isVehicleType(value: unknown): value is VehicleType {
  return typeof value === 'string' && (VEHICLE_TYPES as readonly string[]).includes(value);
}

/** Documents the citizen must have on hand, by vehicle type. Roda 4 additionally needs photographs. */
export function requiredDocuments(type: VehicleType): ReadonlyArray<
  'daftar.dokumen.ktp' | 'daftar.dokumen.stnk' | 'daftar.dokumen.fotoKendaraan'
> {
  const base = ['daftar.dokumen.ktp', 'daftar.dokumen.stnk'] as const;
  return type === 'roda4' ? [...base, 'daftar.dokumen.fotoKendaraan'] : base;
}
