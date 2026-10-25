// Endgame progression is separate from the established check-in/diner puzzles.
export const finaleDefaults={score:false,crank:false,graveyardUnlocked:false,casey:false,fuse:false,winchPowered:false,carKeys:false,garageClue:false,garageOpen:false,garageReward:false,flareUsed:false,won:false,deaths:0};
export const ORGAN_SEQUENCE=['G','C','C','C','G','D','B','C'];
function enter(s,scene,x,y){Object.assign(s,{scene,x,y});}
export function finaleObjective(s){
 if(s.won)return 'ESCAPED · You survived the night shift';
 if(s.carKeys)return 'RUN! Harold & Monster are chasing · Reach the Cadillac';
 if(s.winchPowered)return 'Recover the Cadillac keys from the raised wreck';
 if(s.fuse)return 'Fit the fuse to the winch control in the graveyard';
 if(s.graveyardUnlocked)return 'Find Casey · Search the wrecks for a winch fuse';
 if(s.crank)return 'Use the hand crank at the courtyard’s west graveyard gate';
 if(s.score)return 'Play the wedding score on the chapel organ';
 if(s.escaped)return s.scene==='chapel'?'Read the wedding score on the chapel lectern':'Enter the chapel · Read the wedding music on the lectern';
 return null;
}
export function finaleInteract(s,id,code=''){
 switch(id){
 case 'chapel':
  if(!s.chapelKey)return 'YOU|The gate is locked.';
  s.escaped=true;enter(s,'chapel',320,380);if(!s.carKeys)s.hp=3;
  if(s.carKeys)return 'YOU|They are coming through the chapel door. Keep moving!';
  return 'YOU|The chapel smells of old flowers. A wedding march waits on the lectern. This is a safe place to catch my breath.';
 case 'chapelExit':enter(s,'yard',440,240);return 'YOU|Back in the courtyard. The graveyard gate is on the west side, beyond the pool.';
 case 'score':s.score=true;return 'YOU|The score is marked Bridal Chorus. The first phrase reads G · C · C · C · G · D · B · C. A pencilled note says: “Our song opens the organ’s keepsake drawer.” The printed notes work even with music muted.';
 case 'organ':
  if(!s.score)return 'YOU|The organ has four labelled keys. The lectern might hold its music.';
  if(s.crank)return 'YOU|The keepsake drawer is empty. I already took the gate crank.';
  if(code!==ORGAN_SEQUENCE.join(','))return 'YOU|The phrase is not right. The score on the lectern and in my mission log shows the exact notes. I can try again.';
  s.crank=true;return 'YOU|The melody ends. A hidden drawer releases a brass hand crank labelled WEST GATE. The chapel window overlooks the car graveyard.';
 case 'graveyardDoor':
  if(!s.crank)return 'YOU|The west gate’s handle is missing. A notice reads: “Spare crank kept in chapel organ.”';
  s.graveyardUnlocked=true;enter(s,'graveyard',70,385);return 'CASEY|Over here by the entrance. Something is moving between the wrecks. Keep out of its sight.';
 case 'graveyardExit':enter(s,'yard',65,175);return 'YOU|Back through the west gate. The chapel and diner are safe places to recover.';
 case 'casey':s.casey=true;return 'CASEY|The Cadillac keys fell under the raised wreck in the northeast. The winch is dead. Find the spare fuse in the northwest tool locker, then power the control by the wreck. Hide behind the tarps. If it finds you, run; do not corner yourself.';
 case 'fuse':
  s.fuse=true;return 'YOU|A spare winch fuse in the tool locker. The diagram shows the winch controls on the east side. The motor should lift that wreck off the key box.';
 case 'winch':
  if(!s.fuse)return 'YOU|The winch control has an empty fuse socket. The label points to the tool locker in the northwest.';
  s.winchPowered=true;return 'YOU|The fuse fits. The winch groans and lifts the wreck. The Cadillac’s key box is clear now, a little farther north.';
 case 'keyBox':
  if(!s.winchPowered)return 'YOU|A wreck pins the key box shut. The winch control is just south of here.';
  s.carKeys=true;return 'YOU|Cadillac keys! Harold and the Monster heard the winch. They are coming fast, and they will follow me through every door. No time to hide. Run! Return through the west gate, retreat through the diner and office, then use the pink Cadillac in the parking lot.';
 case 'plate':s.garageClue=true;return 'YOU|An old service plate: “Garage locker: take the room number first, then the arrival minute.” My room registration has both. A flare icon is scratched beside the numbers.';
 case 'garageDoor':enter(s,'garage',320,380);return 'YOU|A forgotten garage. The workbench locker has a four-digit padlock. I can leave without opening it; the Cadillac keys are all I need to escape.';
 case 'garageExit':enter(s,'graveyard',570,380);return 'YOU|Back among the wrecks. Watch the gaps between the cars.';
 case 'garageLocker':
  if(s.garageReward)return 'YOU|The locker is empty. I already collected the emergency flare.';
  if(!s.garageClue)return 'YOU|A locked emergency locker. A service plate somewhere in the graveyard may explain the code.';
  if(code!=='0617')return 'YOU|The padlock stays closed. Room 06, arrival 03:17. The plate asks for the room number followed by the arrival minute.';
  s.garageOpen=true;s.garageReward=true;s.hp=3;return 'YOU|An emergency flare and a first-aid kit. Health restored. The FLARE button can frighten the Monster away once, buying eight seconds to get clear.';
 case 'cadillac':
  if(!s.carKeys)return 'YOU|The Cadillac could get me out of here, if I had its keys.';
  s.won=true;enter(s,'escape',320,360);return 'YOU|The engine catches. Motel lights shrink in the rear-view mirror. Whatever is behind those curtains stays behind. I survived the night shift.';
 default:return null;
 }
}
export function finaleJournal(s){return [
 s.score?'Wedding score: G → C → C → C → G → D → B → C.':'',
 s.crank?'Brass crank: opens the west courtyard gate.':'',
 s.casey?'Casey: northwest tool locker → east winch → northeast key box. Tarps are hiding places.':'',
 s.garageClue?'Garage plate: room number, then arrival minute. Room 06 / 03:17.':'',
 s.carKeys?'KEYS TAKEN: both enemies chase through every scene. Keep running; hiding and safe-room healing are unavailable. Escape route: graveyard → courtyard → diner → office → parking lot → pink Cadillac.':''
].filter(Boolean);}
