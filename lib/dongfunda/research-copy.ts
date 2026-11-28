import {researchEntry,type ResearchSection} from './research-catalog';
import {researchEnglish,type ResearchLocale} from './research-language';

export function localizedResearchEntry(section:ResearchSection,slug?:string,locale:ResearchLocale='th'){
  const entry=researchEntry(section,slug);
  if(locale==='th')return entry;
  const company='company' in entry?entry.company:undefined;
  const coverage=entry.report?researchEnglish(entry.report.coverage):'';
  const detailTitles:Record<string,string>={bdms:'Revenue, Hospitals & Beds',hmpro:'Revenue, Business Mix & Stores',cpall:'Revenue, 7-Eleven Stores & SBP'};
  const title=section==='one-report'
    ?company?`${company.ticker} One Report ${coverage} | ${detailTitles[company.slug]||'Business Dashboard'} | DongFunda`:'Thai Stock One Report Summaries | Free Business Dashboards | DongFunda'
    :company?`${company.ticker} Financial Statements | Revenue, Earnings & Financial Position | DongFunda`:'Thai Stock Financial Statements & Comparative Charts | DongFunda';
  const description=section==='one-report'
    ?company?`Explore ${company.ticker} through five years of One Report data (${coverage}). Compare revenue, business mix and network expansion in a free interactive dashboard.`:'Browse free One Report dashboards for Thai listed companies. Explore revenue, business structure, customer mix and network expansion over five years.'
    :company?`Explore ${company.ticker} consolidated financial statements (${coverage}). Compare revenue, earnings, profit margins, assets, liabilities, retained earnings and interest-bearing debt to equity by reporting period.`:'Browse Thai company financial statements. Compare revenue, earnings, margins, financial position and debt across annual, quarterly and year-to-date periods.';
  return {...entry,path:'/en'+entry.path,title,description,name:company?`${company.ticker} ${section==='one-report'?'One Report':'Financial Statements'} ${coverage}`:section==='one-report'?'One Report':'Financial Statements'};
}
export function researchLanguageSeo(section:ResearchSection,slug?:string){
  const th=localizedResearchEntry(section,slug,'th'),en=localizedResearchEntry(section,slug,'en');
  return {th:{title:th.title,description:th.description},en:{title:en.title,description:en.description}};
}
