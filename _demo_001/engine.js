(function(root){
  'use strict';
  class Answer {
    constructor(step, now=Date.now()) { this.step=step; this.started=now; this.position=50; this.interacted=false; this.presentations=0; this.closed=false; }
    select(value) { if(this.closed)return false; const n=Number(value); if(!Number.isFinite(n))return false; this.position=Math.max(0,Math.min(100,Math.round(n))); this.interacted=true; return true; }
    present() { if(!this.closed)this.presentations++; }
    finish(confirm, now=Date.now()) {
      if(this.closed || (confirm&&!this.interacted))return null;
      this.closed=true;
      return {stepId:this.step.id,item:this.step.item||null,practice:this.step.kind==='practice',status:confirm?'confirmed':'unanswered',position:confirm?this.position:null,centerSelected:confirm?this.position===50:null,selectedCharacter:confirm?(this.position<50?this.step.left:this.position>50?this.step.right:null):null,interacted:this.interacted,presentations:this.presentations,durationMs:now-this.started};
    }
  }
  const api={Answer}; root.PukiEngine=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
