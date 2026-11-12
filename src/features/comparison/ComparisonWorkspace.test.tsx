import {afterEach,expect,test,vi} from 'vitest';
import {act,cleanup,render,screen,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComparisonWorkspace from './ComparisonWorkspace';
import {loadComparisons,saveComparisons} from '../../storage/comparison';
import {parseInventory,inventorySlots} from '../../domain/inventory';
import characterFixture from '../../../tests/fixtures/character-export.json';
vi.mock('../../storage/comparison',()=>({loadComparisons:vi.fn(),saveComparisons:vi.fn(),decodeComparisons:vi.fn(),encodeComparisons:vi.fn()}));
afterEach(cleanup);
function fixture(){const raw=structuredClone(characterFixture);for(const key of Object.keys(raw.characters[0].traces!))if(key!=='secret')Reflect.set(raw.characters[0].traces!,key,false);return parseInventory(JSON.stringify({...raw,characters:[raw.characters[0],{...raw.characters[0],id:'1001',name:'March 7th',path:'Preservation'},raw.characters[1]],relics:inventorySlots.map((slot,i)=>({_uid:`current_${i}`,set_id:i<4?'101':'301',name:'Synthetic',slot,rarity:5,level:0,mainstat:i===1?'ATK':'HP',substats:[],location:'1308',lock:false,discard:false}))}));}
async function load(user:ReturnType<typeof userEvent.setup>,id='1308'){await waitFor(()=>expect(screen.getByRole('group',{name:'Build workspace controls'})).toHaveProperty('disabled',false));await user.selectOptions(screen.getByLabelText('Character'),id);await user.click(screen.getByLabelText('Use pinned baseline kit'));await user.selectOptions(screen.getByLabelText('Profile Light Cone'),'none');await user.click(screen.getByRole('button',{name:'Load character'}));}
function setup(){vi.mocked(loadComparisons).mockResolvedValue([]);vi.mocked(saveComparisons).mockResolvedValue();return userEvent.setup();}

test('character-first review shows actual equipment, collapsed corrections and per-character goals',async()=>{
  const user=setup();const inventory=fixture();const view=render(<ComparisonWorkspace inventory={inventory}/>);
  await load(user);
  expect(screen.getByRole('heading',{name:'Current build · 6/6 slots'})).toBeTruthy();
  expect(screen.getByRole('img',{name:'Acheron artwork for the selected profile'})).toBeTruthy();
  expect(screen.getByText('Review profile').closest('details')!.open).toBe(false);
  view.rerender(<ComparisonWorkspace inventory={inventory} optimizerVisible/>);
  await user.selectOptions(screen.getByLabelText('Goal'),'targets');
  await user.type(screen.getByLabelText('Minimum SPD'),'134');
  await user.selectOptions(screen.getByLabelText('Then maximize'),'CRIT DMG_');
  expect(screen.getByRole('region',{name:'Current build assessment'}).textContent).toContain('Below target');
  expect(screen.getByRole('region',{name:'Current build assessment'}).textContent).toContain('101 < 134');
  await load(user,'1001');
  expect(screen.getByLabelText('Goal')).toHaveProperty('value','');
  await load(user,'1308');
  expect(screen.getByLabelText('Goal')).toHaveProperty('value','targets');
  expect(screen.getByLabelText('Minimum SPD')).toHaveProperty('value','134');
  view.rerender(<ComparisonWorkspace inventory={{...inventory,importedAt:'new-import'}}/>);
  expect(screen.getByRole('heading',{name:'Reference build · 6/6 slots'})).toBeTruthy();
});

test('edited drafts offer save/discard/cancel, failed save blocks character switch',async()=>{
  const user=setup();render(<ComparisonWorkspace inventory={fixture()}/>);await load(user);
  await user.click(screen.getByText('Review profile'));
  await user.clear(screen.getByLabelText('Character base SPD'));await user.type(screen.getByLabelText('Character base SPD'),'105');
  await load(user,'1001');
  vi.mocked(saveComparisons).mockRejectedValueOnce(new Error('Storage unavailable'));
  await user.type(screen.getByLabelText('Draft snapshot name'),'Protected draft');
  await user.click(screen.getByRole('button',{name:'Save draft'}));
  expect(await screen.findByRole('alert')).toHaveProperty('textContent','Storage unavailable');
  expect(screen.getByLabelText('Character/profile name')).toHaveProperty('value','Acheron');
  expect(screen.getByRole('region',{name:'Unsaved build changes'})).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Cancel switch'}));
  expect(screen.getByLabelText('Character base SPD')).toHaveProperty('value','105');
  await load(user,'1001');
  await user.click(screen.getByRole('button',{name:'Save draft'}));
  expect(screen.getByLabelText('Character/profile name')).toHaveProperty('value','March 7th');
  expect(vi.mocked(saveComparisons).mock.lastCall![0][0].profile.base.SPD).toBe(105);
  await user.clear(screen.getByLabelText('Character base SPD'));await user.type(screen.getByLabelText('Character base SPD'),'106');
  await load(user,'1308');await user.click(screen.getByRole('button',{name:'Discard changes'}));
  expect(screen.getByLabelText('Character base SPD')).toHaveProperty('value','101');
});

test('unsupported forms recover through explicit manual profile without invented stats or artwork identity',async()=>{
  const user=setup();render(<ComparisonWorkspace inventory={fixture()}/>);
  await load(user,'8007');
  expect(await screen.findByRole('alert')).toHaveProperty('textContent','This character/form has no reviewed automatic profile yet. Use a manual profile.');
  await user.click(screen.getByRole('button',{name:'Use manual profile'}));
  expect(screen.getByRole('heading',{name:'Current build · 0/6 slots'})).toBeTruthy();
  expect(screen.getByRole('button',{name:'Find upgrades'})).toHaveProperty('disabled',true);
  await user.click(screen.getByText('Review profile'));
  await user.clear(screen.getByLabelText('Character/profile name'));await user.type(screen.getByLabelText('Character/profile name'),'Custom nickname');
  expect(screen.getByRole('img',{name:/artwork for the selected profile/}).getAttribute('src')).toContain('/8007.png');
  expect(screen.getByLabelText('Character base SPD')).toHaveProperty('value','0');
});

test('candidate editing keeps current equipment stable, saved/reference origins stay honest',async()=>{
  const user=setup();const inventory=fixture();inventory.relics.push({...inventory.relics.find(r=>r.slot==='Head')!,id:'upgrade',level:15,location:'',substats:[{key:'CRIT Rate_',value:110}]});
  render(<ComparisonWorkspace inventory={inventory}/>);await load(user);
  await user.click(screen.getByRole('button',{name:'Choose Head'}));
  await user.click(screen.getByRole('button',{name:'Use Head relic upgrade in candidate'}));
  expect(screen.getByText('CRIT Rate exceeds 100%; raw CV is not capped and may include wasted CRIT Rate.')).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'All stats'}));
  expect(screen.getByText('+592.704')).toBeTruthy();
  await user.type(screen.getByLabelText('Snapshot name'),'Candidate snapshot');
  await user.click(screen.getByRole('button',{name:'Save candidate'}));
  expect(vi.mocked(saveComparisons).mock.lastCall![0][0].a.Head!.id).toBe('current_0');
  expect(vi.mocked(saveComparisons).mock.lastCall![0][0].b.Head!.id).toBe('upgrade');
  await user.click(screen.getByRole('button',{name:'Use candidate as reference'}));
  expect(screen.getByRole('region',{name:'Reference build'})).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Restore current equipment'}));
  expect(screen.getByRole('region',{name:'Current build'})).toBeTruthy();
  await user.click(screen.getByText('Saved builds and backups'));
  await user.click(screen.getByRole('button',{name:'Load Candidate snapshot'}));
  await user.click(screen.getByRole('button',{name:'Discard changes'}));
  expect(screen.getByRole('region',{name:'Saved build'})).toBeTruthy();
  expect(within(screen.getByRole('region',{name:'Candidate'})).getByText('HP 705.60')).toBeTruthy();
});

test('inventory replacement cancels a pending character switch while a draft save completes',async()=>{
  const user=setup();const inventory=fixture();const view=render(<ComparisonWorkspace inventory={inventory}/>);await load(user);
  await user.click(screen.getByText('Review profile'));
  await user.clear(screen.getByLabelText('Character base SPD'));await user.type(screen.getByLabelText('Character base SPD'),'105');
  await load(user,'1001');await user.type(screen.getByLabelText('Draft snapshot name'),'Pending draft');
  let finish!:()=>void;
  vi.mocked(saveComparisons).mockImplementationOnce(()=>new Promise<void>(resolve=>{finish=resolve;}));
  await user.click(screen.getByRole('button',{name:'Save draft'}));
  view.rerender(<ComparisonWorkspace inventory={{...inventory,importedAt:'replacement'}}/>);
  await act(async()=>finish());
  expect(screen.getByLabelText('Character/profile name')).toHaveProperty('value','Acheron');
  expect(screen.getByLabelText('Character base SPD')).toHaveProperty('value','105');
  expect(screen.queryByRole('region',{name:'Unsaved build changes'})).toBeNull();
});
