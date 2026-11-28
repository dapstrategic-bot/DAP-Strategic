'use client';
import {useEffect,useRef} from 'react';
import snapshot from '@/lib/dongfunda/bdms-financials.json';
import {prepareResearchHtml,mountResearchLanguage,type ResearchLocale} from '@/lib/dongfunda/research-language';
import {researchLanguageSeo} from '@/lib/dongfunda/research-copy';

export default function FinancialPublicPage({html,locale='th'}: {html:string;locale?:ResearchLocale}) {
  const root=useRef<HTMLDivElement>(null);
  const slug=html.includes('id="financial-period"')?'bdms':undefined;
  const path='/dongfunda/financial-statements'+(slug?'/'+slug:'');
  const content=prepareResearchHtml(html,locale,path);
  useEffect(()=>{
    let cancelled=false;
    let dispose:undefined|(()=>void);
    const disposeLanguage=root.current?mountResearchLanguage(root.current,html,locale,researchLanguageSeo('financial-statements',slug)):()=>{};
    const moduleUrl='/dongfunda-assets/financial-statements/finance.js?v=20261128-bilingual';
    import(/* webpackIgnore: true */ moduleUrl).then(module=>{
      if(!cancelled) dispose=module.mountFinancialPage(snapshot);
    });
    return ()=>{cancelled=true;dispose?.();disposeLanguage();};
  },[html,locale,slug]);
  return <><link rel="stylesheet" href="/dongfunda-assets/financial-statements/base.css"/><link rel="stylesheet" href="/dongfunda-assets/shared/dashboard-support.css"/><link rel="stylesheet" href="/dongfunda-assets/shared/research-language.css"/><link rel="stylesheet" href="/dongfunda-assets/financial-statements/finance.css"/><link rel="stylesheet" href="/dongfunda-assets/shared/contact-bar.css"/><div ref={root} id="financial-public-content" dangerouslySetInnerHTML={{__html:content}}/></>;
}
