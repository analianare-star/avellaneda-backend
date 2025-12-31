export const now = () => new Date();

export const toISO = (date: Date) => date.toISOString();

export const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
};