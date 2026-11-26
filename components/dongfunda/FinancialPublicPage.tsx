'use client';
import {useEffect} from 'react';
import snapshot from '@/lib/dongfunda/bdms-financials.json';

export default function FinancialPublicPage({html}: {html:string}) {
  useEffect(()=>{
    let cancelled=false;
    let dispose:undefined|(()=>void);
    const moduleUrl='/dongfunda-assets/financial-statements/finance.js';
    import(/* webpackIgnore: true */ moduleUrl).then(module=>{
      if(!cancelled) dispose=module.mountFinancialPage(snapshot);
    });
    return ()=>{cancelled=true;dispose?.();};
  },[html]);
  return <><link rel="stylesheet" href="/dongfunda-assets/financial-statements/base.css"/><link rel="stylesheet" href="/dongfunda-assets/shared/dashboard-support.css"/><link rel="stylesheet" href="/dongfunda-assets/financial-statements/finance.css"/><div id="financial-public-content" dangerouslySetInnerHTML={{__html:html}}/></>;
}
