import {afterEach,beforeEach,expect,test,vi} from 'vitest';
import {cleanup,render,screen,waitFor,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpeedWorkspace from './SpeedWorkspace';
import {encodeTeam,loadTeam,saveTeam} from '../../storage/speed';
import {defaultTeam,type SpeedTeam} from '../../domain/speed';
vi.mock('../../storage/speed',async importOriginal=>({...await importOriginal<typeof import('../../storage/speed')>(),loadTeam:vi.fn(),saveTeam:vi.fn()}));
beforeEach(()=>{vi.resetAllMocks();vi.mocked(loadTeam).mockResolvedValue(null);vi.mocked(saveTeam).mockResolvedValue();});
afterEach(cleanup);
const source={name:'Synthetic candidate',baseSPD:100,panelSPD:133.33333333333334,precision:'ocr' as const};
async function ready(){await waitFor(()=>expect(screen.getByRole('group',{name:'Team workspace'})).toHaveProperty('disabled',false));}
function backup(team:SpeedTeam){const file=new File(['fixture'],'team.json',{type:'application/json'});Object.defineProperty(file,'text',{value:async()=>encodeTeam(team)});return file;}

test('new teams keep names and speeds empty until an explicit example or manual input',async()=>{
  const user=userEvent.setup();render(<SpeedWorkspace source={null}/>);await ready();
  expect(screen.getByLabelText('Member 1 name')).toHaveProperty('value','');
  expect(screen.getByLabelText('Member 1 base SPD')).toHaveProperty('value','');
  expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('value','');
  expect(screen.getByRole('button',{name:'Save team'})).toHaveProperty('disabled',true);
  expect(screen.getByRole('button',{name:'Use candidate SPD'})).toHaveProperty('disabled',true);
  expect(screen.queryByRole('region',{name:'Team results'})).toBeNull();
  await user.click(screen.getByRole('button',{name:'Load example team'}));
  expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('value','100');
  expect(screen.getByRole('region',{name:'Team results'})).toBeTruthy();
  expect(screen.getByText(/Example only: four illustrative/)).toBeTruthy();
  expect(saveTeam).not.toHaveBeenCalled();
});

test('candidate transfer requires target and confirmation, resets buffs and never live-links values',async()=>{
  const team=defaultTeam();team.members[1]={...team.members[1],name:'Synthetic second',buffPercent:10,flatBuff:5,advance:20};vi.mocked(loadTeam).mockResolvedValue(team);
  const user=userEvent.setup();const view=render(<SpeedWorkspace source={source}/>);await ready();
  await user.click(screen.getByRole('button',{name:'Use candidate SPD'}));
  expect(screen.getByRole('button',{name:'Confirm replacement'})).toHaveProperty('disabled',true);
  view.rerender(<SpeedWorkspace source={{...source,panelSPD:150}}/>);
  expect(screen.getByText(/Candidate snapshot:/).textContent).toContain('133.33333333333334');
  await user.selectOptions(screen.getByLabelText('Replace member'),'1');
  await user.click(screen.getByRole('button',{name:'Cancel transfer'}));
  await user.click(screen.getByRole('button',{name:'Edit member 2 · Synthetic second'}));
  expect(screen.getByLabelText('Member 2 panel SPD')).toHaveProperty('valueAsNumber',100);
  view.rerender(<SpeedWorkspace source={source}/>);
  await user.click(screen.getByRole('button',{name:'Use candidate SPD'}));await user.selectOptions(screen.getByLabelText('Replace member'),'1');await user.click(screen.getByRole('button',{name:'Confirm replacement'}));
  expect(screen.getByLabelText('Member 2 panel SPD')).toHaveProperty('valueAsNumber',source.panelSPD);
  await user.click(screen.getByText('Speed details',{exact:true}));
  expect(screen.getByLabelText('Member 2 additional SPD %')).toHaveProperty('value','0');
  expect(screen.getByLabelText('Member 2 additional flat SPD')).toHaveProperty('value','0');
  expect(screen.getByLabelText('Member 2 initial advance %')).toHaveProperty('value','0');
  expect(screen.getByText('ocr · Candidate · Synthetic candidate')).toBeTruthy();
  view.rerender(<SpeedWorkspace source={{...source,panelSPD:150}}/>);
  expect(screen.getByLabelText('Member 2 panel SPD')).toHaveProperty('valueAsNumber',source.panelSPD);
  await user.type(screen.getByLabelText('Member 2 additional flat SPD'),'5');
  expect(screen.getByText('ocr · Candidate · Synthetic candidate')).toBeTruthy();
  await user.clear(screen.getByLabelText('Member 2 panel SPD'));await user.type(screen.getByLabelText('Member 2 panel SPD'),'140');
  expect(screen.getByText('manual · Manual input')).toBeTruthy();
  expect(saveTeam).not.toHaveBeenCalled();
  vi.mocked(saveTeam).mockRejectedValueOnce(new Error('Storage full'));
  await user.click(screen.getByRole('button',{name:'Save team'}));expect(await screen.findByRole('alert')).toHaveProperty('textContent','Storage full');
  expect(screen.getByLabelText('Member 2 panel SPD')).toHaveProperty('value','140');
  await user.click(screen.getByRole('button',{name:'Save team'}));expect(await screen.findByText('Team configuration saved in this browser.')).toBeTruthy();
  expect(vi.mocked(saveTeam).mock.lastCall![0].members[1].panelSPD).toBe(140);
});

test('named action order and cycle counts use the existing unrounded model; ledger stays inspectable',async()=>{
  const team=defaultTeam();team.cycles=1;team.members[0]={...team.members[0],name:'Synthetic fast',baseSPD:100,panelSPD:134};team.members[1]={...team.members[1],name:'Synthetic slower',baseSPD:100,panelSPD:133.3};vi.mocked(loadTeam).mockResolvedValue(team);
  const user=userEvent.setup();render(<SpeedWorkspace source={null}/>);await ready();
  const results=within(screen.getByRole('region',{name:'Team results'}));
  expect(results.getAllByRole('listitem')[0].textContent).toContain('Synthetic fast');
  expect(results.getAllByRole('listitem')[0].textContent).toContain('74.626866 AV');
  expect(within(results.getByRole('region',{name:'Actions per cycle'})).getByRole('row',{name:'C0 2 1 1 1'})).toBeTruthy();
  expect(screen.getByText('Speed details',{exact:true}).closest('details')).toHaveProperty('open',false);
  await user.click(screen.getByText('Speed details',{exact:true}));
  expect(screen.getByRole('region',{name:'Chronological action ledger'})).toBeTruthy();
  await user.click(screen.getByText('Unbuffed cycle target',{exact:true}));
  expect(screen.getByText(/Required unbuffed SPD ≈ 133.333333333/)).toBeTruthy();
  const cycles=screen.getByLabelText('Cycles');await user.clear(cycles);await user.type(cycles,'20');
  expect(screen.getByText('Chronological actions · page 1 of 2')).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Next actions'}));expect(screen.getByText('Chronological actions · page 2 of 2')).toBeTruthy();
});

test('incomplete and extreme inputs hide results, and clearing drafts does not replace saved data',async()=>{
  vi.mocked(loadTeam).mockResolvedValue(defaultTeam());const user=userEvent.setup();render(<SpeedWorkspace source={null}/>);await ready();
  await user.clear(screen.getByLabelText('Member 1 base SPD'));
  expect(screen.queryByRole('region',{name:'Team results'})).toBeNull();
  expect(screen.getByRole('button',{name:'Save team'})).toHaveProperty('disabled',true);
  await user.type(screen.getByLabelText('Member 1 base SPD'),'100');
  await user.clear(screen.getByLabelText('Member 1 panel SPD'));await user.type(screen.getByLabelText('Member 1 panel SPD'),'1000000');
  expect(screen.getByRole('alert').textContent).toContain('2,000 actions');
  expect(screen.queryByRole('region',{name:'Chronological action ledger'})).toBeNull();
  await user.click(screen.getByText('Team backups and reset',{exact:true}));await user.click(screen.getByRole('button',{name:'Clear team inputs'}));
  expect(screen.getByLabelText('Member 1 name')).toHaveProperty('value','');
  expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('value','');
  expect(saveTeam).not.toHaveBeenCalled();
});

test('failed initial reads and failed restores preserve the old team until a validated write succeeds',async()=>{
  vi.mocked(loadTeam).mockRejectedValue(new Error('Read unavailable'));const user=userEvent.setup();render(<SpeedWorkspace source={null}/>);
  await screen.findByText('Read unavailable');await user.click(screen.getByRole('button',{name:'Load example team'}));
  expect(screen.getByRole('button',{name:'Save team'})).toHaveProperty('disabled',true);
  await user.click(screen.getByText('Team backups and reset',{exact:true}));
  const incoming=defaultTeam();incoming.members[0].name='Restored synthetic';incoming.members[0].panelSPD=144;
  await user.upload(screen.getByLabelText('Restore team backup'),backup(incoming));
  expect(saveTeam).not.toHaveBeenCalled();
  vi.mocked(saveTeam).mockRejectedValueOnce(new Error('Restore write failed'));
  await user.click(screen.getByRole('button',{name:'Replace saved team'}));expect(await screen.findByRole('alert')).toHaveProperty('textContent','Restore write failed');
  expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('value','100');
  await user.click(screen.getByRole('button',{name:'Replace saved team'}));
  await screen.findByText('Team backup restored and saved.');
  expect(screen.getByLabelText('Member 1 panel SPD')).toHaveProperty('value','144');
  expect(screen.getByRole('button',{name:'Save team'})).toHaveProperty('disabled',false);
});

test('Escape cancels a transfer and unsupported candidate SPD is never copied',async()=>{
  const user=userEvent.setup();const view=render(<SpeedWorkspace source={source}/>);await ready();
  await user.click(screen.getByRole('button',{name:'Use candidate SPD'}));await user.selectOptions(screen.getByLabelText('Replace member'),'0');
  await user.keyboard('{Escape}');expect(screen.queryByRole('region',{name:'Candidate SPD transfer'})).toBeNull();
  expect(screen.getByLabelText('Member 1 name')).toHaveProperty('value','');
  view.rerender(<SpeedWorkspace source={{...source,panelSPD:Infinity}}/>);
  expect(screen.getByRole('button',{name:'Use candidate SPD'})).toHaveProperty('disabled',true);
});
