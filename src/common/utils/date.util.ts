export function formatToISO(date: Date): string {
  return date.toISOString();
}

export function isPastDate(date: Date): boolean {
  return date.getTime() < new Date().getTime();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
