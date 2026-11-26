const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
const root=process.cwd();
function load(file,overrides={}){file=path.resolve(file);if(file in overrides)return overrides[file];if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));const exports={};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{exports,require(name){let p=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!path.extname(p))p+='.ts';return load(p,overrides);},process:{env:{}},URL,console,Date});return exports;}
const identity=load('lib/site-identity.ts'),catalog=load('lib/dongfunda/research-catalog.ts'),seo=load('lib/dongfunda/research-seo.ts');
const hub=seo.researchStructuredData('home')['@graph'][0];assert.equal(hub['@id'],identity.SITE_URL+'/dongfunda#webpage');assert.equal(hub.mainEntity.itemListElement.length,2);
for(const section of ['one-report','financial-statements']){
 for(const slug of [undefined,'bdms']){
  const metadata=seo.researchMetadata(section,slug),graph=seo.researchStructuredData(section,slug)['@graph'];
  const expected=identity.SITE_URL+'/dongfunda/'+section+(slug?'/'+slug:'');
  assert.equal(metadata.alternates.canonical,expected);assert.equal(metadata.openGraph.url,expected);assert.equal(metadata.openGraph.siteName,'DongFunda by DAP');assert(metadata.robots?.index!==false);
  assert.equal(graph[0].url,expected);assert.equal(graph[1].itemListElement.at(-1).item,expected);
  assert.equal(graph[0].isPartOf['@id'],identity.SITE_URL+'/dongfunda'+(slug?'/'+section:'')+'#webpage');
 }
}
const snapshot=JSON.parse(fs.readFileSync('lib/dongfunda/research-catalog.json','utf8'));
snapshot.companies.push({slug:'future-stock',ticker:'FUTURE',name:'Future company',exchange:'SET',reports:[{section:'one-report',published:true,coverage:'2568',title:'Future stock summary',description:'Future company summary'},{section:'financial-statements',published:false,coverage:'2568',title:'Draft',description:'Not published'}]});
const overrides={[path.resolve('lib/dongfunda/research-catalog.json')]:{default:snapshot,__esModule:true}};
const futureCatalog=load('lib/dongfunda/research-catalog.ts',overrides),futureSeo=load('lib/dongfunda/research-seo.ts',overrides);
assert(futureCatalog.researchPaths.includes('/dongfunda/one-report/future-stock'));assert(!futureCatalog.researchPaths.includes('/dongfunda/financial-statements/future-stock'));
assert.equal(futureSeo.researchMetadata('one-report','future-stock').title.absolute,'Future stock summary');assert.throws(()=>futureSeo.researchMetadata('financial-statements','future-stock'),/Unpublished/);
const graph=futureSeo.researchStructuredData('one-report','future-stock')['@graph'];assert.equal(graph[2].alternateName,'FUTURE');assert.equal(graph[1].itemListElement.at(-1).name,'FUTURE');
const generated=fs.readFileSync('lib/dongfunda/approved-public/financial-rendered.ts','utf8');for(const value of ['113,385.9','15,848.2','93,055.6','60,172.9'])assert(generated.includes(value));assert(!generated.includes('DESIGN PREVIEW'));
console.log('PASS: hub hierarchy, unique metadata/canonicals, breadcrumbs, registry extension, unpublished exclusion, and first-load financial values.');

const templates=load('lib/dongfunda/approved-public/templates.ts').templates;
for(const page of ['home','library']){assert(templates[page].includes('href="/dongfunda/financial-statements">งบการเงิน</a>'));assert(!templates[page].includes('financial-demo'));assert(!templates[page].includes('financial-maintenance'));}
assert(!templates.library.includes('id="notice"'));
assert(!fs.readFileSync('public/dongfunda-assets/r04/library/members.js','utf8').includes('showModal'));
console.log('PASS: home and One Report navigation open the financial library without maintenance modal.');
