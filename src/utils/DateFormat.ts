export function DateFormatLatIso(dateStr: string): string | null {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return null;

  const [, dd, mm, yyyy] = match;
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;

  return `${yyyy}-${mm}-${dd}`;
}

export function DateFormatIsoLat(isoDate?: string | null): string | null {
  if (!isoDate || typeof isoDate !== "string") return null;

  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = isoDate.match(regex);
  if (!match) return null;

  const [, yyyy, mm, dd] = match;

  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;

  return `${dd}/${mm}/${yyyy}`;
}
export const formatearFecha = (fecha: Date): string =>
  fecha.toISOString().split("T")[0];
