const fs=require('node:fs'),postcss=require('postcss');
const source='C:/Users/User/Documents/ChatGPT/DongFunda/deliveries/DF-TONROB2570-LANDING-20261120-R07/styles.css';
const ast=postcss.parse(fs.readFileSync(source,'utf8'));
ast.walkRules(rule=>{if(rule.parent.type==='atrule'&&/keyframes/.test(rule.parent.name))return;rule.selectors=rule.selectors.map(s=>{s=s.trim();if(s===':root'||s==='body'||s==='html')return '.tonrob-r07';return '.tonrob-r07 '+s.replace(/^body\s+/,'')})});
ast.walkDecls(decl=>{decl.value=decl.value.replace(/assets\//g,'/images/tonrob/r07/')});
fs.writeFileSync('components/tonrob/r07.css',ast.toString()+'\n.tonrob-r07{font-family:Kanit,Tahoma,sans-serif}.tonrob-r07 .tonrob-closed{font-size:16px;color:#172a44;background:#f1f4f8;padding:20px;border-radius:10px}.tonrob-r07 .tonrob-closed a{color:#1e40af;text-decoration:underline}@media(max-width:700px){.tonrob-r07{padding-bottom:80px}}\n');
console.log('R07 stylesheet scoped without redesign');

