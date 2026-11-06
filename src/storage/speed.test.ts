import 'fake-indexeddb/auto';
import {expect,test} from 'vitest';
import {defaultTeam} from '../domain/speed';
import {decodeTeam,encodeTeam,loadTeam,saveTeam} from './speed';
test('team persistence/backup preserve fractional speed and provenance; invalid replacement does not erase the saved team',async()=>{
  const team=defaultTeam();team.members[0]={...team.members[0],panelSPD:131.032,precision:'ocr',source:'Comparison B · Manual'};
  await saveTeam(team);expect(await loadTeam()).toEqual(team);expect(decodeTeam(encodeTeam(team))).toEqual(team);
  await expect(saveTeam({...team,cycles:0})).rejects.toThrow();expect(await loadTeam()).toEqual(team);
  for(const text of ['{',JSON.stringify({format:'orbit-speed-team',schemaVersion:2}),JSON.stringify({format:'orbit-speed-team',schemaVersion:1,team:{cycles:1,members:[]}}),' '.repeat(16385)])expect(()=>decodeTeam(text)).toThrow();
});
