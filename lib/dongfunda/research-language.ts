import translations from './research-translations.json';
import {fourChannelContactHtml} from './contact-bar';

export type ResearchLocale = 'th' | 'en';
const dictionary:Record<string,string> = translations;
const ordered=Object.entries(dictionary).filter(([key])=>key!=='ปี').sort((a,b)=>b[0].length-a[0].length);
export function researchEnglish(source:string):string {
  const trimmed=source.trim();
  if(!trimmed)return source;
  if(/^เข้าใจธุรกิจ [A-Z]+$/.test(trimmed))return source.replace('เข้าใจธุรกิจ ','Understand ');
  if(dictionary[trimmed])return source.replace(trimmed,dictionary[trimmed]);
  let result=source;
  for(const [th,en] of ordered)if(result.includes(th))result=result.split(th).join(en);
  return result.replace(/พบ\s*(\d+)\s*บริษัท/g,'$1 companies found')
    .replace(/ข้อมูลที่มี:\s*ปี/g,'Available years:').replace(/แสดงรายละเอียดปี/g,'Viewing year')
    .replace(/ปีเป้าหมาย/g,'Target year').replace(/ปี\s*(?=25\d{2})/g,'Year ')
    .replace(/(?<![\d.,])25[6-7]\d(?!\d)/g,year=>String(Number(year)-543))
    .replace(/storesversus/g,'stores versus').replace(/Storesversus/g,'stores versus')
    .replace(/THBversus/g,'THB versus').replace(/^1 companies found$/,'1 company found');
}
const escapeHtml=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const decodeHtml=(s:string)=>s.replace(/&(?:amp|lt|gt|quot|apos|#39|#x[\da-f]+|#\d+);/gi,entity=>{
  const names:Record<string,string>={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'"};
  return names[entity.toLowerCase()]??String.fromCodePoint(entity.toLowerCase().startsWith('&#x')?parseInt(entity.slice(3,-1),16):parseInt(entity.slice(2,-1),10));
});
const textAttributes=['placeholder','aria-label','alt','title'];
export const researchLocalePath=(path:string,locale:ResearchLocale)=>locale==='en'?'/en'+path:path;
export function researchLanguageBar(path:string){
  return `<div class="locale-bar" data-th-path="${path}"><div class="locale-links"><a href="/dongfunda">DongFunda</a><a href="/dongfunda/one-report">สรุป One Report</a><a href="/dongfunda/financial-statements">งบการเงิน</a></div><div class="language-switch" role="group" aria-label="Language"><button type="button" data-locale="th" aria-label="ภาษาไทย" aria-pressed="true">TH</button><span aria-hidden="true">|</span><button type="button" data-locale="en" aria-label="English" aria-pressed="false">EN</button></div><noscript><a href="${path}" hreflang="th">ไทย</a> | <a href="/en${path}" hreflang="en">English</a></noscript></div>`;
}
function localizedLinks(html:string,locale:ResearchLocale){
  if(locale==='th')return html;
  return html.replace(/href="(\/dongfunda(?:\/[^"?#]*)?)([^"\s]*)"/g,(_,path,query)=>`href="/en${path}${query}"`);
}
export function prepareResearchHtml(html:string,locale:ResearchLocale,path:string){
  let result=fourChannelContactHtml(html).replace('</header>',researchLanguageBar(path)+'</header>');
  if(locale==='en') {
    // Translate text and accessible labels, preserving element structure and numeric data attributes.
    let rawElement:string|undefined;
    result=result.replace(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g,token=>{
      if(token.startsWith('<')){
        if(/^<(script|style|noscript)\b/i.test(token))rawElement=token.match(/^<(\w+)/)![1];
        else if(rawElement&&token.toLowerCase()===`</${rawElement}>`)rawElement=undefined;
        return token.replace(/\b(placeholder|aria-label|alt|title)="([^"]*)"/g,(_,name,value)=>`${name}="${escapeHtml(researchEnglish(decodeHtml(value)))}"`);
      }
      return rawElement?token:escapeHtml(researchEnglish(decodeHtml(token)));
    });
    result=result.replace('data-locale="th" aria-label="Thai" aria-pressed="true"','data-locale="th" aria-label="Thai" aria-pressed="false"')
      .replace('data-locale="en" aria-label="English" aria-pressed="false"','data-locale="en" aria-label="English" aria-pressed="true"');
  }
  return localizedLinks(result,locale);
}

export type LanguageSeo={title:string;description:string};
export function mountResearchLanguage(root:HTMLElement,thaiHtml:string,initialLocale:ResearchLocale,seo:Record<ResearchLocale,LanguageSeo>){
  let locale=initialLocale;
  const bar=root.querySelector<HTMLElement>('.locale-bar');
  if(!bar)return ()=>{};
  const thaiPath=bar.dataset.thPath!;
  const textMemory=new WeakMap<Text,{source:string;last:string}>();
  const attrMemory=new WeakMap<Element,Record<string,{source:string;last:string}>>();
  const skip=(node:Node)=>node.parentElement?.closest('script,style,noscript');
  const textNodes=(element:Node)=>{
    const nodes:Text[]=[];const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
    while(walker.nextNode())if(!skip(walker.currentNode))nodes.push(walker.currentNode as Text);
    return nodes;
  };
  // The server renders the chosen language. Pair it with the Thai source once so switching
  // back never requires a reverse translation, reload, or loss of dashboard state.
  const template=document.createElement('template');template.innerHTML=prepareResearchHtml(thaiHtml,'th',thaiPath);
  const originals=textNodes(template.content),current=textNodes(root);
  if(originals.length===current.length)current.forEach((node,i)=>textMemory.set(node,{source:originals[i].data,last:node.data}));
  const sourceElements=template.content.querySelectorAll('*'),elements=root.querySelectorAll('*');
  if(sourceElements.length===elements.length)elements.forEach((el,i)=>{
    const memory:Record<string,{source:string;last:string}>={};
    for(const key of textAttributes)if(el.hasAttribute(key))memory[key]={source:sourceElements[i].getAttribute(key)??'',last:el.getAttribute(key)!};
    attrMemory.set(el,memory);
  });
  let disposed=false;
  const previousLanguage=document.documentElement.lang;
  function updateSeo(){
    document.title=seo[locale].title;
    for(const [selector,value]of [
      ['meta[name="description"]',seo[locale].description],['meta[property="og:title"]',seo[locale].title],
      ['meta[property="og:description"]',seo[locale].description],['meta[property="og:locale"]',locale==='en'?'en_US':'th_TH'],
      ['meta[name="twitter:title"]',seo[locale].title],['meta[name="twitter:description"]',seo[locale].description],
      ['meta[property="og:url"]','https://www.dap.co.th'+researchLocalePath(thaiPath,locale)],
    ])document.querySelector(selector)?.setAttribute('content',value);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href','https://www.dap.co.th'+researchLocalePath(thaiPath,locale));
  }
  const observer=new MutationObserver(sync);
  function sync(){
    if(disposed)return;
    observer.disconnect();document.documentElement.lang=locale;
    for(const node of textNodes(root)){
      let memory=textMemory.get(node);
      if(!memory||node.data!==memory.last)memory={source:node.data,last:node.data};
      const value=locale==='en'?researchEnglish(memory.source):memory.source;
      if(node.data!==value)node.data=value;
      memory.last=value;textMemory.set(node,memory);
    }
    for(const el of root.querySelectorAll('[placeholder],[aria-label],[alt],[title]')){
      const memory=attrMemory.get(el)||{};
      for(const key of textAttributes)if(el.hasAttribute(key)){
        const current=el.getAttribute(key)!;let entry=memory[key];
        if(!entry||current!==entry.last)entry={source:current,last:current};
        const value=locale==='en'?researchEnglish(entry.source):entry.source;
        if(current!==value)el.setAttribute(key,value);
        entry.last=value;memory[key]=entry;
      }attrMemory.set(el,memory);
    }
    bar!.querySelectorAll<HTMLElement>('[data-locale]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.locale===locale)));
    for(const link of root.querySelectorAll<HTMLAnchorElement>('a[href]')){
      const url=new URL(link.href,location.href);
      if(url.origin!==location.origin||!/^\/(en\/)?dongfunda(?:\/|$)/.test(url.pathname))continue;
      // Hash-only chart navigation remains on the currently selected language route.
      url.pathname=researchLocalePath(url.pathname.replace(/^\/en(?=\/)/,''),locale);
      const href=url.pathname+url.search+url.hash;
      if(link.getAttribute('href')!==href)link.setAttribute('href',href);
    }
    document.documentElement.style.setProperty('--research-header-height',(root.querySelector('header')?.getBoundingClientRect().height||125)+'px');
    observer.observe(root,{subtree:true,childList:true,characterData:true});
  }
  const switchLanguage=(event:Event)=>{
    const button=(event.target as Element).closest<HTMLElement>('[data-locale]');if(!button)return;
    locale=button.dataset.locale as ResearchLocale;
    const url=new URL(location.href);url.pathname=researchLocalePath(thaiPath,locale);url.searchParams.delete('lang');
    const year=root.querySelector<HTMLElement>('#year-tabs [aria-pressed="true"]')?.dataset.year;
    const period=root.querySelector<HTMLSelectElement>('#financial-period')?.value;
    if(year)url.searchParams.set('year',year);if(period)url.searchParams.set('period',period);
    history.replaceState(null,'',url.pathname+url.search+url.hash);
    sync();updateSeo();
  };
  bar.addEventListener('click',switchLanguage);
  const header=root.querySelector('header');const headerObserver=new ResizeObserver(()=>{
    document.documentElement.style.setProperty('--research-header-height',(header?.getBoundingClientRect().height||125)+'px');
  });if(header)headerObserver.observe(header);
  sync();
  return ()=>{disposed=true;observer.disconnect();headerObserver.disconnect();bar.removeEventListener('click',switchLanguage);document.documentElement.style.removeProperty('--research-header-height');document.documentElement.lang=previousLanguage;};
}
