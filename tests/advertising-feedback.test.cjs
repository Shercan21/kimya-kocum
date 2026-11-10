const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function load(file){const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,require:n=>n.endsWith('.css')?{}:n==='../data/cloud'?{TEACHER_EMAIL:'ercanseyithasan@gmail.com'}:require(n),URL,Set,console});return module.exports;}
const Feedback=load('src/components/StudentFeedback.tsx').default;
const html=renderToStaticMarkup(React.createElement(Feedback));
assert.ok(html.includes('Hata bildir / Öneri gönder'));
for(const label of ['Hatalı soru','Eksik içerik','Teknik sorun','Öneri'])assert.ok(html.includes(label));
const href=html.match(/href="(mailto:[^"]+subject=[^"]+)"/)[1].replaceAll('&amp;','&');assert.ok(href.startsWith('mailto:ercanseyithasan@gmail.com?'));
assert.ok(decodeURIComponent(href).includes('Sınıf / konu / test ve soru numarası:'));
assert.ok(!href.includes('localStorage'));assert.ok(html.includes('mesajı kontrol edip sen gönderirsin'));
const ads=load('src/components/Advertising.tsx');assert.equal(ads.ADVERTISING_PUBLIC,false);
assert.equal(renderToStaticMarkup(React.createElement(ads.AdvertisingArea,{placement:'home'})),'');
assert.ok(renderToStaticMarkup(React.createElement(ads.SponsorshipLink)).includes('noopener noreferrer'));
const app=fs.readFileSync('src/App.tsx','utf8');assert.ok(app.includes("teacherView && !openTopic && !mistakesOpen && (shown === 'today' || shown === 'progress')"));
assert.ok(fs.readFileSync('src/components/Onboarding.tsx','utf8').includes('teacherMode && <SponsorshipLink />'));
console.log('OK Student email draft, feedback categories, private sponsorship visibility and disabled ad rendering');
