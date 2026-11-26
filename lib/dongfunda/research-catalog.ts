import catalog from './research-catalog.json';
export type ResearchSection = 'one-report' | 'financial-statements';
export const researchCatalog = catalog;
export const sectionPath = (section:ResearchSection) => `/dongfunda/${section}`;
export const reportPath = (section:ResearchSection, slug:string) => `${sectionPath(section)}/${slug}`;
export function researchEntry(section:ResearchSection, slug?:string) {
  const category=catalog.sections.find(s=>s.slug===section);
  if(!category) throw Error('Unknown research section');
  if(!slug) return {path:sectionPath(section),title:category.title,description:category.description,name:category.name};
  const company=catalog.companies.find(c=>c.slug===slug);
  const report=company?.reports.find(r=>r.section===section&&r.published);
  if(!company||!report) throw Error('Unpublished company report');
  return {path:reportPath(section,slug),title:report.title,description:report.description,name:`${company.ticker} ${category.name} ${report.coverage}`,company,report};
}
export function publishedReports(section?:ResearchSection) {
  return catalog.companies.flatMap(company=>company.reports.filter(r=>r.published&&(!section||r.section===section)).map(report=>({company,report,path:reportPath(report.section as ResearchSection,company.slug)})));
}
export const researchPaths = [...catalog.sections.map(s=>sectionPath(s.slug as ResearchSection)),...publishedReports().map(r=>r.path)];
