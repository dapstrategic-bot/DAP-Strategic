'use client';
import { useEffect, useRef } from 'react';
import { trackContactIntent, type ContactChannel } from '@/lib/contact-analytics';
import {prepareResearchHtml,mountResearchLanguage,type ResearchLocale} from '@/lib/dongfunda/research-language';
import {researchLanguageSeo} from '@/lib/dongfunda/research-copy';

export default function ApprovedPublicPage({html, page,locale='th'}: {html:string; page:'home'|'library'|'bdms'|'hmpro'|'cpall';locale?:ResearchLocale}) {
  const root = useRef<HTMLDivElement>(null);
  const path=page==='library'?'/dongfunda/one-report':`/dongfunda/one-report/${page}`;
  const content=page==='home'?html:prepareResearchHtml(html,locale,path);
  useEffect(() => {
    let cancelled = false;
    const nodes: HTMLScriptElement[] = [];
    const disposeLanguage=page!=='home'&&root.current?mountResearchLanguage(root.current,html,locale,researchLanguageSeo('one-report',page==='library'?undefined:page)):()=>{};
    const files = !html.includes('article-search') && page === 'home' ? [] : page === 'home' ? ['page.js'] : page === 'library' ? ['members.js?v=20261128-cpall'] : ['data.js','dashboard.js'];
    async function load() {
      for (const file of files) {
        if (cancelled) return;
        await new Promise<void>((resolve) => {
          const script=document.createElement('script');
          script.src=`/dongfunda-assets/r04/${page}/${file}`;
          script.async=false;
          script.onload=()=>resolve();
          script.onerror=()=>resolve();
          nodes.push(script); root.current?.appendChild(script);
        });
      }
    }
    load();
    const track = (e: MouseEvent) => {
      const link=(e.target as Element).closest<HTMLAnchorElement>('a');
      if (!link) return;
      const href=link.href;
      const channel:ContactChannel|undefined = /lin.ee|line.me/.test(href)?'line': /wa.me/.test(href)?'whatsapp':href.startsWith('tel:')?'phone':/facebook.com/.test(href)?'facebook':/youtube.com/.test(href)?'youtube':undefined;
      if(channel) trackContactIntent(channel,link.closest('.dap-contact-bar')?'contact_bar':link.closest('footer')?'footer':'header');
    };
    const el=root.current; el?.addEventListener('click',track);
    return ()=>{cancelled=true;disposeLanguage();nodes.forEach(n=>n.remove());el?.removeEventListener('click',track);};
  },[page,html,locale]);
  const css=page==='home'?'page.css':page==='library'?'members.css':'dashboard.css';
  return <><link rel="stylesheet" href={`/dongfunda-assets/r04/${page}/${css}`} />{page !== 'home' && <><link rel="stylesheet" href="/dongfunda-assets/shared/dashboard-support.css" /><link rel="stylesheet" href="/dongfunda-assets/shared/research-language.css" /></>}<div ref={root} id="approved-public-content" dangerouslySetInnerHTML={{__html:content}} /></>;
}
