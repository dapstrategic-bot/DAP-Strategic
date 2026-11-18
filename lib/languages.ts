// Only advertise a language alternative when that page has translated content.
export const bilingualPaths = [
  '/', '/portfolio', '/contact', '/services', '/services/business-plan', '/services/feasibility-study',
  '/services/strategic-planner-business-strategy',
] as const;

export function languagePair(path: string) {
  const clean = path.replace(/\/$/, '') || '/';
  const thai = clean === '/en' ? '/' : clean.startsWith('/en/') ? clean.slice(3) : clean;
  if (!(bilingualPaths as readonly string[]).includes(thai)) return null;
  return { th: thai, en: thai === '/' ? '/en' : `/en${thai}` };
}
