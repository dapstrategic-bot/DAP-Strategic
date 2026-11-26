// One inventory for canonical research URLs; never publish drafts or redirects.
const fs=require('node:fs');
const catalog=require('../lib/dongfunda/research-catalog.json');
function pathsFor(catalog){return [...catalog.sections.map(s=>'/dongfunda/'+s.slug),...catalog.companies.flatMap(c=>c.reports.filter(r=>r.published).map(r=>'/dongfunda/'+r.section+'/'+c.slug))];}
function sync(){
const paths=pathsFor(catalog);
const sections=new Set(catalog.sections.map(s=>s.slug));
if(new Set(catalog.companies.map(c=>c.slug)).size!==catalog.companies.length)throw Error('Duplicate company slug');
for(const company of catalog.companies){
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(company.slug))throw Error('Invalid company slug');
for(const report of company.reports){if(!sections.has(report.section))throw Error('Unknown report section');if(report.published&&(!report.title.trim()||!report.description.trim()||!report.coverage.trim()))throw Error('Incomplete published SEO entry');}
}
if(new Set(paths).size!==paths.length)throw Error('Duplicate research URL');
for(const path of paths)if(!fs.existsSync('app/(th)'+path+'/page.tsx'))throw Error('Published research route missing: '+path);
const file='public/sitemap-core.xml';let xml=fs.readFileSync(file,'utf8');
xml=xml.replace(/\s*<!-- DONGFUNDA RESEARCH START -->[\s\S]*?<!-- DONGFUNDA RESEARCH END -->/g,'');
xml=xml.replace(/\s*<url><loc>https:\/\/www\.dap\.co\.th\/dongfunda\/(?:one-report|financial-statements)(?:\/[^<]*)?<\/loc><\/url>/g,'');
xml=xml.replace('</urlset>','  <!-- DONGFUNDA RESEARCH START -->\n'+paths.map(p=>'  <url><loc>https://www.dap.co.th'+p+'</loc></url>').join('\n')+'\n  <!-- DONGFUNDA RESEARCH END -->\n</urlset>');
fs.writeFileSync(file,xml);console.log('Synced '+paths.length+' published DongFunda research URLs');
}
if(require.main===module)sync();
module.exports={pathsFor,sync};
