export interface DongFundaTrustValues {
  subscribers: number;
  videos: number;
  referenceDate: string;
}

export const DEFAULT_TRUST_VALUES: DongFundaTrustValues = {
  subscribers: 13963,
  videos: 250,
  referenceDate: '2026-10-21',
};

export function isReferenceDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function normalizeTrustValues(value: unknown): DongFundaTrustValues {
  const v = value as Partial<DongFundaTrustValues> | null;
  // Keep counts and their reference date together if a CMS record is incomplete.
  if (!v || !Number.isSafeInteger(v.subscribers) || v.subscribers! < 0 ||
    !Number.isSafeInteger(v.videos) || v.videos! < 0 || !isReferenceDate(v.referenceDate)) {
    return {...DEFAULT_TRUST_VALUES};
  }
  return {subscribers: v.subscribers!, videos: v.videos!, referenceDate: v.referenceDate};
}

export function formatTrustValues(values: DongFundaTrustValues) {
  const floor = Math.floor(values.subscribers / 1000) * 1000;
  // Exact thousands and counts below 1,000 must not claim "more than".
  const subscribers = values.subscribers >= 1000 && values.subscribers > floor
    ? `กว่า ${floor.toLocaleString('en-US')}`
    : values.subscribers.toLocaleString('en-US');
  return {
    subscribers,
    videos: values.videos.toLocaleString('en-US'),
    date: new Intl.DateTimeFormat('th-TH', {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok',
    }).format(new Date(`${values.referenceDate}T00:00:00Z`)),
  };
}
