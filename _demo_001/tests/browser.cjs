const {chromium}=require(process.env.PUKI_PLAYWRIGHT||'C:/Users/javiera/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url');const path=require('node:path');const fs=require('node:fs');const assert=require('node:assert/strict');
(async()=>{
const out=path.resolve(__dirname,'../test-output');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
await page.goto(url);await page.screenshot({path:path.join(out,'portada.png'),fullPage:true});
await page.selectOption('#voiceMode','reading');await page.locator('details').first().evaluate(e=>e.open=true);await page.fill('#waitSeconds','1');await page.click('#start');await page.click('#next');
assert.equal(await page.locator('#next').isDisabled(),true);
await page.locator('#responseSlider').click();await page.click('#next');await page.click('#next');
assert.equal(await page.evaluate(()=>PukiDemo.getState().step),'q1');
await page.click('#pause');await page.waitForTimeout(1300);assert.equal(await page.evaluate(()=>PukiDemo.getState().presentations),1);assert.equal(await page.evaluate(()=>PukiDemo.getSession().responses.length),1);await page.click('#resume');
await page.locator('#responseSlider').click();await page.waitForTimeout(250);await page.screenshot({path:path.join(out,'pregunta-centro.png'),fullPage:true});await page.click('#next');
assert.equal(await page.evaluate(()=>PukiDemo.getSession().responses.find(r=>r.stepId==='q1').centerSelected),true);
await page.click('#next');await page.waitForFunction(()=>PukiDemo.getState().step==='closing',null,{timeout:6500});
const r=await page.evaluate(()=>PukiDemo.getSession().responses.find(r=>r.stepId==='q2'));assert.equal(r.status,'unanswered');assert.equal(r.interacted,false);assert.equal(r.position,null);assert.equal(r.presentations,3);
await page.click('#next');assert.equal(await page.locator('#finish').isVisible(),true);
const dl=page.waitForEvent('download');await page.click('#download');const download=await dl;await download.saveAs(path.join(out,'session.json'));const data=JSON.parse(fs.readFileSync(path.join(out,'session.json'),'utf8'));assert.equal(data.summary[1].status,'unanswered');assert.equal(data.responses.length,3);
// Crear un clip sintético local de prueba, independiente de las ilustraciones del proyecto.
const base64=await page.evaluate(async()=>{const c=document.createElement('canvas');c.width=320;c.height=180;const ctx=c.getContext('2d');const chunks=[];const stream=c.captureStream(10);const rec=new MediaRecorder(stream,{mimeType:'video/webm'});return new Promise(resolve=>{rec.ondataavailable=e=>chunks.push(e.data);rec.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(new Blob(chunks,{type:'video/webm'}));};rec.start();let n=0;const timer=setInterval(()=>{ctx.fillStyle=n%2?'#c1d3ab':'#edcc94';ctx.fillRect(0,0,320,180);if(++n===10){clearInterval(timer);rec.stop();}},100);});});
await page.click('#restart');await page.fill('#waitSeconds','120');await page.locator('details').nth(1).evaluate(e=>e.open=true);await page.locator('input[data-step="q1"][data-media="video"]').setInputFiles({name:'loop-test.webm',mimeType:'video/webm',buffer:Buffer.from(base64,'base64')});
await page.click('#start');await page.click('#next');await page.locator('#responseSlider').click();await page.click('#next');await page.click('#next');await page.waitForTimeout(2200);
const video=await page.locator('#sceneVideo').evaluate(v=>({loop:v.loop,paused:v.paused,muted:v.muted,currentTime:v.currentTime,error:v.error?.code}));assert.equal(video.loop,true);assert.equal(video.paused,false);assert.equal(video.muted,true);assert.equal(video.error,undefined);
await page.click('#pause');assert.equal(await page.locator('#sceneVideo').evaluate(v=>v.paused),true);await page.click('#resume');await page.waitForTimeout(100);assert.equal(await page.locator('#sceneVideo').evaluate(v=>v.paused),false);
await page.setViewportSize({width:1024,height:768});await page.screenshot({path:path.join(out,'tablet-bucle.png'),fullPage:true});
await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(out,'movil.png'),fullPage:true});
assert.deepEqual(errors,[]);
// Una voz simulada permite comprobar que la espera empieza después de terminar el audio.
const p2=await browser.newPage();await p2.addInitScript(()=>{let utterance,t;window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>[],cancel:()=>clearTimeout(t),speak:u=>{utterance=u;u.onstart?.();t=setTimeout(()=>u.onend?.(),900);}}});});
await p2.goto(url);await p2.locator('details').first().evaluate(e=>e.open=true);await p2.fill('#waitSeconds','1');await p2.click('#start');await p2.waitForFunction(()=>PukiDemo.getState().step==='practice');await p2.waitForTimeout(1100);assert.equal(await p2.evaluate(()=>PukiDemo.getState().presentations),1);await p2.waitForFunction(()=>PukiDemo.getState().presentations===2);await p2.click('#pause');await p2.waitForTimeout(2300);assert.equal(await p2.evaluate(()=>PukiDemo.getState().presentations),2);await p2.close();
console.log('PASS: centro, práctica, pausa, omisión tras 3 presentaciones, exportación, bucle real, espera posterior al audio, tablet y ventana estrecha; sin errores JS.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
