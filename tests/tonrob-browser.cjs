const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const base='http://127.0.0.1:3215',out=path.resolve('review-results');fs.mkdirSync(out,{recursive:true});
const chrome='C:/Users/User/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const child=spawn(chrome,['--headless','--no-sandbox','--disable-gpu','--hide-scrollbars','--remote-debugging-port=9227','--user-data-dir='+path.join(out,'browser-profile'),'about:blank'],{stdio:'ignore',windowsHide:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ws;
(async()=>{
 let info;for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:9227/json');info=(await r.json()).find(x=>x.type==='page');if(info)break;}catch{}await sleep(200)}
 assert.ok(info,'Headless test browser unavailable');
 ws=new WebSocket(info.webSocketDebuggerUrl);await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});
 let id=0;const pending=new Map();ws.onmessage=e=>{const v=JSON.parse(e.data);if(v.id){const p=pending.get(v.id);if(p){pending.delete(v.id);v.error?p.reject(Error(JSON.stringify(v.error))):p.resolve(v.result)}}};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
 const evalJS=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
 await send('Page.enable');await send('Runtime.enable');
 const checks=[];
 for(const route of ['/products/tonrob','/products/tonrob-2570','/products/tonrob-2570?previewStatus=closed','/products']){
  const response=await fetch(base+route);assert.equal(response.status,200);const source=await response.text();fs.writeFileSync(path.join(out,route.replace(/[^a-z0-9]/gi,'_')+'.html'),source);
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1080,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:base+route});await sleep(1300);await evalJS('document.fonts.ready.then(()=>true)');await sleep(600);
  const state=await evalJS(`(()=>({title:document.title,path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,canonical:document.querySelector('link[rel=canonical]')?.href,robots:document.querySelector('meta[name=robots]')?.content,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent),text:document.querySelector('.tonrob')?.innerText,events:window.__tonrobPreviewEvents||[],gtm:[...document.scripts].filter(x=>/googletagmanager|google-analytics|connect.facebook/.test(x.src)).map(x=>x.src),poster:[...document.querySelectorAll('img[src*="tonrob"]')].map(x=>({loaded:x.complete&&x.naturalWidth>0,src:x.getAttribute('src')}))}))()`);
  assert.equal(state.scrollWidth,1440);assert.equal(state.gtm.length,0);assert.match(state.robots,/noindex/);
  if(route.includes('tonrob')){assert.equal(state.h1.length,1);assert.ok(!/\bACE\b/.test(state.text));assert.ok(state.poster.every(x=>x.loaded));assert.equal(state.canonical,'https://www.dap.co.th'+state.path)}
  if(route==='/products/tonrob'){
   const overview=await evalJS("({topics:document.querySelectorAll('#learn .curriculum article').length,sections:document.querySelectorAll('.tonrob-r07 section').length,price:document.querySelector('.purchase-price').innerText,cta:document.querySelector('.light-outline').getAttribute('href')})");
   assert.equal(overview.topics,5);assert.ok(overview.sections>=9);assert.ok(overview.price.includes('3,103'));assert.equal(overview.cta,'#purchase');state.r07Overview=overview;
  }
  if(route==='/products/tonrob-2570'){
   const interactive=await evalJS(`(()=>{document.querySelector('.purchase-open').click();let d=document.querySelector('dialog');const opened=d.open;const checkout=document.querySelector('[data-checkout-link]');const href=checkout.href;checkout.addEventListener('click',e=>e.preventDefault(),{once:true});checkout.click();d.querySelector('.dialog-close').click();const closed=!d.open;const line=document.querySelector('.line-green');line.addEventListener('click',e=>e.preventDefault(),{once:true});line.click();const faq=document.querySelector('details');faq.querySelector('summary').click();return{opened,closed,href,faqOpen:faq.open,events:window.__tonrobPreviewEvents}})()`);
   assert.ok(interactive.opened&&interactive.closed&&interactive.faqOpen);assert.equal(interactive.href,'https://pay.sn/dongfunda/3103/Tonrop-2570');
   assert.ok(interactive.events.some(x=>x.event==='begin_checkout'));assert.ok(interactive.events.some(x=>x.event==='tonrob_line_click'));assert.ok(!interactive.events.some(x=>x.event==='purchase'));
   state.interactive=interactive;
  }
  if(route.includes('closed')){
   const closed=await evalJS(`({buttons:document.querySelectorAll('.purchase-open').length,checkout:document.querySelectorAll('[data-checkout-link]').length,closedText:document.querySelector('.tonrob-closed')?.innerText,schema:JSON.parse([...document.querySelectorAll('script[type="application/ld+json"]')].find(x=>x.textContent.includes('"@type":"Course"')).textContent)})`);
   assert.equal(closed.buttons,0);assert.equal(closed.checkout,0);assert.equal(closed.schema.offers.availability,'https://schema.org/SoldOut');state.closed=closed;
  }
  if(route==='/products'){
   const entry=await evalJS(`[...document.querySelectorAll('a[href="/products/tonrob"]')].map(x=>x.innerText)`);assert.ok(entry.length);state.catalogEntry=entry;
  }
  const name=route.includes('closed')?'closed':route.split('/').pop();
  const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'-desktop.png'),Buffer.from(shot.data,'base64'));
  if(route==='/products/tonrob-2570'){
   for(const [label,selector] of [['curriculum','#learn'],['purchase','#purchase']]){
    await evalJS(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView()`);await sleep(300);
    const detail=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'-'+label+'.png'),Buffer.from(detail.data,'base64'));
   }
   await evalJS('window.scrollTo(0,0)');
  }
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(250);
  const mobile=await evalJS('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})');assert.equal(mobile.scrollWidth,390);state.mobile=mobile;
  const sm=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'-mobile.png'),Buffer.from(sm.data,'base64'));
  checks.push(state);console.log(JSON.stringify({route,status:'PASS',canonical:state.canonical,mobileOverflow:false}));
 }
 const map=await(await fetch(base+'/sitemap-core.xml')).text();assert.equal((map.match(/<loc>/g)||[]).length,20);
 fs.writeFileSync(path.join(out,'browser-checks.json'),JSON.stringify({status:'PASS',checks,externalPaymentNavigation:false,transactions:false,realAnalytics:false},null,2));
})().then(()=>{ws?.close();child.kill()}).catch(e=>{console.error(e.stack);ws?.close();child.kill();process.exitCode=1});

