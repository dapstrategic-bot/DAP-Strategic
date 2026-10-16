import snapshot from './bdms-financials.json';

export const financialData = snapshot;
export const companyHref = '/dongfunda/companies/bdms';
export const periods = [
  ['q1', 'Q1 เทียบ 5 ปีย้อนหลัง'], ['q2', 'Q2 เทียบ 5 ปีย้อนหลัง'],
  ['q3', 'Q3 เทียบ 5 ปีย้อนหลัง'], ['q4', 'Q4 เทียบ 5 ปีย้อนหลัง'],
  ['half', 'รายครึ่งปีแรก (H1)'], ['nine', 'ราย 9 เดือน'], ['annual', 'รายปี (เต็มปี)'],
] as const;
export type Period = (typeof periods)[number][0];
export type Metric = 'revenue' | 'profit' | 'gpm' | 'npm' | 'retained' | 'assets' | 'liabilities' | 'ibde';
export function matchesBdms(query: string) {
  const normalized = query.normalize('NFKC').toLocaleLowerCase('th').trim().replace(/\s+/g, ' ');
  return !normalized || ['BDMS', 'กรุงเทพดุสิตเวชการ', 'บริษัท กรุงเทพดุสิตเวชการ จำกัด (มหาชน)', 'Bangkok Dusit Medical Services']
    .some(name => name.normalize('NFKC').toLocaleLowerCase('th').includes(normalized));
}
export function formatFinancial(value: number | null, unit: string, decimals?: number) {
  const precision = decimals ?? (unit === '%' || unit === 'เท่า' ? 2 : 1);
  return value === null ? 'รออัปเดต' : value.toLocaleString('en-US', {
    minimumFractionDigits: precision, maximumFractionDigits: precision,
  });
}
