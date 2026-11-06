import {expect,test} from 'vitest';
import {defaultTeam,effectiveSPD,requiredSPD,simulateSpeed} from './speed';
test('fixed buffs scale character base SPD, not final panel speed',()=>{
  const member={...defaultTeam().members[0],baseSPD:100,panelSPD:150,buffPercent:20,flatBuff:5};
  expect(effectiveSPD(member)).toBe(175);
  expect(simulateSpeed({cycles:1,members:[member,...defaultTeam().members.slice(1)]}).members[0].interval).toBeCloseTo(10000/175);
});
test('initial advance applies once and exact boundaries belong to the ending cycle',()=>{
  const team=defaultTeam();team.cycles=2;team.members[0].advance=50;
  const result=simulateSpeed(team);
  expect(result.events.filter(e=>e.member===0).map(e=>[e.av,e.cycle])).toEqual([[50,0],[150,0],[250,1]]);
  team.members[0].advance=100;
  expect(simulateSpeed(team).events.filter(e=>e.member===0).map(e=>e.av)).toEqual([0,100,200]);
});
test('ties use stable member order and thresholds retain fractional SPD',()=>{
  const team=defaultTeam();team.cycles=1;const threshold=requiredSPD(2,1);
  expect(threshold).toBeCloseTo(133.33333333333334);
  team.members=team.members.map(m=>({...m,panelSPD:threshold}));
  const result=simulateSpeed(team);
  expect(result.events.map(e=>e.member)).toEqual([0,1,2,3,0,1,2,3]);
  expect(result.counts).toEqual([[2,2,2,2]]);
  team.members[0].panelSPD=threshold-0.001;
  expect(simulateSpeed(team).counts[0][0]).toBe(1);
});
test('invalid input and excessive output are rejected before rendering a partial timeline',()=>{
  const team=defaultTeam();team.members[0].advance=101;expect(()=>simulateSpeed(team)).toThrow('advance');
  team.members[0].advance=0;team.members[0].panelSPD=0;expect(()=>simulateSpeed(team)).toThrow('positive');
  team.members[0].panelSPD=NaN;expect(()=>simulateSpeed(team)).toThrow('finite');
  team.members=team.members.map(m=>({...m,panelSPD:1000000}));expect(()=>simulateSpeed(team)).toThrow('2,000');
});
test('the exact 2,000-action limit is accepted and numeric underflow is rejected',()=>{
  const team=defaultTeam();team.cycles=2;team.members=team.members.map(m=>({...m,panelSPD:20000}));
  expect(simulateSpeed(team).events).toHaveLength(2000);
  team.members[0].panelSPD=20040;expect(()=>simulateSpeed(team)).toThrow('2,000');
  team.members[0].panelSPD=Number.MIN_VALUE;expect(()=>simulateSpeed(team)).toThrow('numeric range');
});
