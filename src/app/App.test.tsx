import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { GameImage } from './Equipment';

afterEach(() => { cleanup(); localStorage.clear(); history.replaceState(null, '', '/'); });

test('keyboard skip link preserves the current calculation workspace', async () => {
  const user=userEvent.setup();render(<App/>);
  for(const destination of ['Comparison','Optimizer','Speed tuning']){
    await user.click(screen.getByRole('link',{name:destination}));
    screen.getByRole('link',{name:'Skip to content'}).focus();
    await user.keyboard('{Enter}');fireEvent(window,new Event('hashchange'));
    expect(document.activeElement).toBe(document.getElementById('main'));
    expect(location.hash).toBe(destination==='Comparison'?'#comparison':destination==='Optimizer'?'#optimizer':'#speed');
    expect(screen.getByRole('heading',{level:1,name:destination==='Comparison'?'Build comparison':destination==='Optimizer'?'Relic optimizer':'Speed tuning'})).toBeTruthy();
  }
});

test('comparison navigation preserves unsaved manual profile across views', async () => {
  const user=userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('link',{name:'Comparison'}));
  await user.type(screen.getByRole('textbox',{name:'Character/profile name'}),'Manual profile');
  await user.click(screen.getByRole('link',{name:'Inventory'}));
  expect(screen.queryByRole('textbox',{name:'Character/profile name'})).toBeNull();
  await user.click(screen.getByRole('link',{name:'Comparison'}));
  expect(screen.getByRole('textbox',{name:'Character/profile name'})).toHaveProperty('value','Manual profile');
});

test('theme toggle changes the rendered theme and persists the choice', async () => {
  localStorage.setItem('orbit:theme:v1', 'light');
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(localStorage.getItem('orbit:theme:v1')).toBe('dark');
  await userEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('demo filters compose, preserve item identity, and reset after no results', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Slot' }), 'Body');
  expect(screen.getByRole('status').textContent).toBe('2 of 8 relics');
  await user.selectOptions(screen.getByRole('combobox', { name: 'Lock status' }), 'unlocked');
  expect(screen.getByRole('status').textContent).toBe('1 of 8 relics');
  await user.click(screen.getByRole('button', { name: /Body:.*CRIT Rate 32.4%/ }));
  expect(within(screen.getByRole('complementary')).getByText('Not equipped')).toBeTruthy();
  expect(within(screen.getByRole('complementary')).getByText('32.4%')).toBeTruthy();
  expect(within(screen.getByRole('complementary')).getByText('01 / 01')).toBeTruthy();
  await user.type(screen.getByRole('searchbox'), 'no matching relic');
  expect(screen.getByRole('status').textContent).toBe('0 of 8 relics');
  await user.click(screen.getByRole('button', { name: 'Show all relics' }));
  expect(screen.getByRole('status').textContent).toBe('8 of 8 relics');
});

test('equipment selects without changing filters, and a hidden selection can be revealed', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByRole('searchbox'), 'Izumo');
  await user.click(screen.getByRole('button', { name: 'View Head equipment' }));
  expect(screen.getByRole('status').textContent).toBe('2 of 8 relics');
  expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('Izumo');
  expect(within(screen.getByRole('complementary')).getByText('Outside results')).toBeTruthy();
  expect(within(screen.getByRole('complementary')).getByRole('heading', { name: "Pioneer's Heatproof Shell" })).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Show selected relic' }));
  expect(screen.getByRole('status').textContent).toBe('8 of 8 relics');
  expect(screen.getByRole('button', { name: /Head:.*HP 705/ }).getAttribute('aria-pressed')).toBe('true');
});

test('slot sorting changes collection order without changing selection and reset restores defaults', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'slot-reverse');
  const cards = within(screen.getByLabelText('Relic results')).getAllByRole('button');
  expect(cards[0].getAttribute('aria-label')).toMatch(/^Link Rope:/);
  expect(cards.at(-1)?.getAttribute('aria-label')).toMatch(/^Head:/);
  expect(screen.getByRole('button', { name: /Body:.*CRIT DMG 64.8%/ }).getAttribute('aria-pressed')).toBe('true');
  expect(within(screen.getByRole('complementary')).getByText('05 / 08')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Reset filters' }));
  expect((screen.getByRole('combobox', { name: 'Sort by' }) as HTMLSelectElement).value).toBe('equipped');
  expect((screen.getByRole('button', { name: 'Reset filters' }) as HTMLButtonElement).disabled).toBe(true);
});

test('leaving the demo removes equipment and both entry actions restore it', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Exit demo' }));
  expect(screen.queryByRole('searchbox')).toBeNull();
  expect(screen.queryByRole('img', { name: /Acheron artwork/ })).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Open demo' }));
  expect(screen.getByRole('status').textContent).toBe('8 of 8 relics');
  await user.click(screen.getByRole('button', { name: 'Exit demo' }));
  await user.click(screen.getByRole('button', { name: 'Explore demo' }));
  expect(screen.getByRole('status').textContent).toBe('8 of 8 relics');
});

test('failed artwork retains a named fallback', () => {
  render(<GameImage file="missing.png" alt="Acheron artwork" character />);
  fireEvent.error(screen.getByRole('img', { name: 'Acheron artwork' }));
  expect(screen.getByRole('img', { name: 'Acheron artwork' }).textContent).toBe('Artwork unavailable');
  render(<GameImage file="missing-icon.png" alt="" />);
  fireEvent.error(screen.getByAltText(''));
  expect(screen.getAllByRole('img')).toHaveLength(1);
});
