/** Calendar dates as "YYYY-MM-DD" strings: a study day is a date in the user's own timezone, not a UTC instant. */
export type LocalDate = string;

/** The date it is for the user at `at`, e.g. 23:30 UTC is already the next day in Ho Chi Minh City. */
export function localDate(at: Date, timeZone: string): LocalDate {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
  } catch {
    // An unknown zone name should never block studying: fall back to UTC.
    return at.toISOString().slice(0, 10);
  }
}

export function addDays(date: LocalDate, days: number): LocalDate {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

/** Postgres DATE columns come back from Prisma as midnight UTC. */
export const toDbDate = (date: LocalDate) => new Date(`${date}T00:00:00.000Z`);
export const fromDbDate = (value: Date): LocalDate => value.toISOString().slice(0, 10);
