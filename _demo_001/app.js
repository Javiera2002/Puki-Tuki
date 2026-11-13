(()=>{
'use strict';
const $=id=>document.getElementById(id), content=window.PUKI_CONTENT, steps=content.steps;
const media=new Map(); let index=-1, answer=null, session=null, paused=false, epoch=0, timer=null, voice=null, voiceWatch=null, audio=null, waiting=false, audioBusy=false, error=false, sceneReady=false;
const question=step=>step&&['question','practice'].includes(step.kind);
const step=()=>steps[index];
const event=(type,data={})=>session?.events.push({type,stepId:step()?.id||null,at:new Date().toISOString(),...data});
function stopSound(){clearTimeout(voiceWatch);voiceWatch=null;window.speechSynthesis?.cancel();if(audio){audio.pause();audio.onended=audio.onerror=null;audio=null;}voice=null;audioBusy=false;}
function stop(){epoch++;clearTimeout(timer);timer=null;waiting=false;stopSound();$('sceneVideo').pause();}
function fail(message){stop();error=true;$('mediaError').hidden=false;$('errorText').textContent=message;$('next').disabled=true;event('media_error',{message});}
function speak(text,done){
 const token=epoch; let ended=false; audioBusy=true;
 const complete=()=>{if(ended||token!==epoch)return;ended=true;clearTimeout(voiceWatch);audioBusy=false;done();};
 const src=media.get(step().id)?.audio;
 if(src){audio=new Audio(src);audio.onended=complete;audio.onerror=()=>{if(token===epoch)fail('No se pudo reproducir el audio. Puedes reintentarlo o continuar en modo lectura.');};audio.play().catch(()=>{if(token===epoch)fail('El navegador no pudo iniciar el audio. Reintenta o usa el modo lectura.');});return;}
 if(session.settings.mode==='reading'||!text){complete();return;}
 if(!window.speechSynthesis){fail('Este navegador no dispone de voz provisional. Selecciona modo lectura.');return;}
 const u=new SpeechSynthesisUtterance(text);voice=u;u.lang='es-CL';u.rate=.88;
 const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==='es-CL')||voices.find(v=>v.lang.startsWith('es'))||null;
 u.onstart=()=>clearTimeout(voiceWatch);u.onend=complete;u.onerror=e=>{if(token===epoch&&!['canceled','interrupted'].includes(e.error))fail('La voz provisional no está disponible. Puedes reintentar o usar el modo lectura.');};
 voiceWatch=setTimeout(()=>{if(token===epoch)fail('La voz provisional no comenzó. Puedes usar un audio local o continuar en modo lectura.');},7000);
 speechSynthesis.speak(u);
}
function setVideo(loop){
 const video=$('sceneVideo'),src=media.get(step().id)?.video;video.onended=video.onerror=null;
 $('stage').classList.toggle('has-video',!!src);video.hidden=!src;$('provisionalTag').hidden=!!src;
 if(!src){video.removeAttribute('src');video.load();return Promise.resolve();}
 video.src=src;video.loop=loop;video.muted=true;const token=epoch;
 return new Promise(resolve=>{
  video.onerror=()=>{if(token===epoch)fail('No se pudo abrir el video elegido. Reintenta o continúa con la composición provisional.');};
  if(!loop)video.onended=()=>{if(token===epoch)resolve();};
  video.play().then(()=>{if(loop)resolve();}).catch(()=>{if(token===epoch)fail('No se pudo iniciar el video. Reintenta o continúa con la composición provisional.');});
 });
}
function updateSelection(){
 const touched=answer?.interacted,value=answer?.position??50;$('responseSlider').value=value;$('thumb').style.left=value+'%';
 $('leftCard').style.setProperty('--strength',touched?Math.max(0,(50-value)/50):0);$('rightCard').style.setProperty('--strength',touched?Math.max(0,(value-50)/50):0);
 $('next').disabled=!touched||paused||error;
 $('selectionHint').textContent=!touched?'Mueve o toca la barra y luego toca la flecha.':value===50?'Centro elegido. Toca la flecha para continuar.':'Puedes cambiar tu elección antes de tocar la flecha.';
}
function select(value){if(!answer||paused||error||answer.closed)return;answer.select(value);event('selection',{position:answer.position});updateSelection();if(waiting)schedule();}
function schedule(){
 clearTimeout(timer);if(paused||error||!answer||answer.closed)return;waiting=true;const token=epoch;
 timer=setTimeout(()=>{if(token!==epoch||paused||error)return;waiting=false;if(answer.presentations<session.settings.presentations)ask(true);else finishAnswer(false);},session.settings.waitSeconds*1000);
}
function ask(newPresentation){
 clearTimeout(timer);waiting=false;if(newPresentation)answer.present();event('question_presented',{presentation:answer.presentations,resumed:!newPresentation});
 speak(step().text,()=>{if(!paused&&!error&&!answer.closed)schedule();});
}
function renderFigures(){
 const s=step();for(const [side,name]of [['left','puki'],['right','tuki']]){
  const card=$(side+'Card');card.style.setProperty('--strength',0);card.querySelector('.sprite').className='sprite '+name;card.querySelector('.character-description').textContent=question(s)?s[side+'Label']||'':'';
  const props=card.querySelector('.props');props.className='props';props.textContent='';
  if(s.look==='fruit')props.textContent=name==='puki'?'🍎':'🍌';
  if(s.look==='blocks')props.classList.add('blocks');
  if(s.look==='aches'&&name==='puki'){props.classList.add('aches');props.textContent='〰';}
 }
}
function enter(nextIndex){
 stop();index=nextIndex;paused=false;error=false;$('mediaError').hidden=true;$('pauseOverlay').hidden=true;$('stage').classList.remove('paused');$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-label','Pausar');
 if(index>=steps.length){session.completedAt=new Date().toISOString();$('player').hidden=true;$('finish').hidden=false;return;}
 const s=step();event('step_enter');$('chapterName').textContent=s.chapter;$('sceneTitle').textContent=s.title;$('caption').textContent=s.text||s.description||'';$('caption').classList.toggle('long',s.text.length>180);$('stepLabel').textContent=s.kind==='practice'?'Práctica':s.item?'Pregunta '+(s.id==='q1'?'1':'2')+' de 2':'Capítulo 1 · Demostración';
 $('answerArea').hidden=!question(s);$('next').disabled=true;$('next').setAttribute('aria-label',question(s)?'Confirmar respuesta':'Continuar');renderFigures();
 if(question(s)){answer=new PukiEngine.Answer(s);updateSelection();setVideo(true);if(!error)ask(true);}
 else {answer=null;playScene();}
}
function playScene(){
 const token=epoch;sceneReady=false;
 const videoPromise=setVideo(false),audioPromise=new Promise(resolve=>speak(step().text,resolve));
 Promise.all([videoPromise,audioPromise]).then(()=>{
  if(token!==epoch||paused||error)return;sceneReady=true;$('next').disabled=false;
  if(session.settings.mode!=='reading')timer=setTimeout(()=>{if(token===epoch&&!paused&&!error)enter(index+1);},step().text?800:3000);
 });
}
function finishAnswer(confirm){
 if(!answer||paused||error)return;const result=answer.finish(confirm);if(!result)return;
 session.responses.push(result);event(confirm?'confirmed':'unanswered',{position:result.position,interacted:result.interacted});enter(index+1);
}
function pause(){if(index<0||index>=steps.length||paused)return;stop();paused=true;event('paused');$('pauseOverlay').hidden=false;$('stage').classList.add('paused');$('next').disabled=true;$('pause').textContent='▶';$('pause').setAttribute('aria-label','Reanudar');}
function resume(){
 if(!paused)return;paused=false;event('resumed');$('pauseOverlay').hidden=true;$('stage').classList.remove('paused');$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-label','Pausar');
 if(error)return;
 if(question(step())){if(!$('sceneVideo').hidden)$('sceneVideo').play().catch(()=>fail('No se pudo reanudar el video.'));updateSelection();ask(false);}
 else playScene();
}
function exportData(){
 if(!session)return;
 const data={...session,exportedAt:new Date().toISOString(),centerMeaning:'Propuesta: no me identifico con ninguno; pendiente de revisión profesional',summary:steps.filter(s=>s.kind==='question').map(s=>({stepId:s.id,item:s.item,status:session.responses.find(r=>r.stepId===s.id)?.status||(session.events.some(e=>e.type==='step_enter'&&e.stepId===s.id)?'in_progress':'not_presented')}))};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='puki-tuki-'+session.startedAt.replace(/[:.]/g,'-')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return data;
}
for(const s of steps){
 const row=document.createElement('div');row.className='asset-row';const title=document.createElement('strong');title.textContent=s.title+(question(s)?' · pregunta':'');row.append(title);
 for(const type of ['video','audio']){const label=document.createElement('label');label.textContent=type==='video'?(question(s)?'Video de la situación en bucle':'Video de la escena'):'Audio narrado';const input=document.createElement('input');input.type='file';input.accept=type+'/*';input.dataset.step=s.id;input.dataset.media=type;input.addEventListener('change',()=>{const values=media.get(s.id)||{};if(values[type])URL.revokeObjectURL(values[type]);values[type]=input.files[0]?URL.createObjectURL(input.files[0]):null;media.set(s.id,values);});label.append(input);row.append(label);}
 $('assetInputs').append(row);
}
$('start').onclick=()=>{
 const wait=Number($('waitSeconds').value),count=Number($('presentations').value);if(!Number.isInteger(wait)||wait<1||wait>120){$('waitSeconds').reportValidity();return;}if(!Number.isInteger(count)||count<1||count>5){$('presentations').reportValidity();return;}
 session={schemaVersion:1,startedAt:new Date().toISOString(),completedAt:null,settings:{waitSeconds:wait,presentations:count,mode:$('voiceMode').value},contentVersion:content.version,responses:[],events:[]};
 $('home').hidden=true;$('finish').hidden=true;$('player').hidden=false;enter(0);
};
$('responseSlider').addEventListener('input',e=>select(e.target.value));
$('responseSlider').addEventListener('pointerdown',e=>{const r=e.currentTarget.getBoundingClientRect();select((e.clientX-r.left)/r.width*100);});
$('responseSlider').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End',' ','Enter'].includes(e.key))select(e.currentTarget.value);});
$('next').onclick=()=>{if($('next').disabled)return;if(question(step()))finishAnswer(true);else if(sceneReady)enter(index+1);};
$('pause').onclick=()=>paused?resume():pause();$('resume').onclick=resume;
$('retry').onclick=()=>{stop();error=false;$('mediaError').hidden=true;if(question(step())){setVideo(true);updateSelection();ask(false);}else playScene();};
$('readInstead').onclick=()=>{stop();session.settings.mode='reading';const m=media.get(step().id)||{};media.set(step().id,{...m,video:null,audio:null});error=false;$('mediaError').hidden=true;event('reading_fallback');if(question(step())){setVideo(true);updateSelection();ask(false);}else playScene();};
$('download').onclick=exportData;$('downloadPartial').onclick=exportData;
$('restart').onclick=()=>{stop();index=-1;$('finish').hidden=true;$('home').hidden=false;};
window.addEventListener('pagehide',stop);
// Read-only inspection for local verification; production data stays in this tab.
window.PukiDemo={getSession:()=>session,getState:()=>({index,paused,waiting,error,step:step()?.id,presentations:answer?.presentations})};
})();
