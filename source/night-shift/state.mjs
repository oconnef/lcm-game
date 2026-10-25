export const SAVE_KEY = 'lcm-night-shift-v1';
export function freshState() { return {scene:'office', x:320,y:360, key:false, clue:false, voucher:false, completed:false, hp:3}; }
export function objective(s) { return s.completed?'Chapter complete · Diner opens next':!s.key?'Speak to Bobbi at reception':!s.clue?'Inspect the registration slip in Room 06':!s.voucher?'Use the slip’s code to unlock the drawer':'Diner lead found. Return to Bobbi'; }
export function interact(s,id,code='') {
 if(id==='bobbi') {s.key=true;if(s.voucher)s.completed=true;return s.voucher?'BOBBI LOVE|Breakfast for one? Take that voucher to the diner when it opens. You have completed this chapter.':'BOBBI LOVE|Room 06, darling. Here is your key. The registration slip is on your table. Read it carefully.';}
 if(id==='officeDoor') {if(!s.key)return 'YOU|I should check in with Bobbi before leaving.';s.scene='room';s.x=320;s.y=370;return 'YOU|Room 06. Someone has left a registration slip on the table.';}
 if(id==='roomDoor') {s.scene='office';s.x=520;s.y=340;return 'YOU|Back at reception.';}
 if(id==='slip') {s.clue=true;return 'YOU|Registration: Room 06. Arrival 03:17. A handwritten note reads: “The drawer remembers your arrival. Four digits, no colon.”';}
 if(id==='drawer') {
  if(s.voucher)return 'YOU|The drawer is empty. The diner voucher is safely in my pocket.';
  if(!s.clue)return 'YOU|A four-digit lock. There must be a clue somewhere in this room.';
  if(code!=='0317')return 'YOU|The lock stays shut. Check the arrival time on the registration slip.';
  s.voucher=true;return 'YOU|Click. Inside is a diner voucher: “Breakfast at dawn. Ask about the night shift.” I should show Bobbi.';
 }
 return 'YOU|Nothing to use here.';
}
export function load(storage) {
 try {const s=JSON.parse(storage.getItem(SAVE_KEY));if(!s || !['office','room'].includes(s.scene)||!Number.isFinite(s.x)||!Number.isFinite(s.y)||s.x<26||s.x>614||s.y<96||s.y>420||!['key','clue','voucher'].every(k=>typeof s[k]==='boolean')||s.hp!==3||(s.completed!==undefined&&typeof s.completed!=='boolean')||s.completed&&!s.voucher||s.clue&&!s.key||s.voucher&&!s.clue||s.scene==='room'&&!s.key)return freshState();return {...freshState(),...s};}catch{return freshState();}
}
export function save(storage,s) {try{storage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}
