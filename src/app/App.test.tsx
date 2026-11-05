import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { GameImage } from './Equipment';

afterEach(() => { cleanup(); localStorage.clear(); });

test('theme toggle changes the rendered theme and persists the choice', async () => {
  localStorage.setItem('orbit:theme:v1', 'light');
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Gunakan tema gelap' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(localStorage.getItem('orbit:theme:v1')).toBe('dark');
  await userEvent.click(screen.getByRole('button', { name: 'Gunakan tema terang' }));
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('demo filters compose, preserve item identity, and reset after no results', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Slot' }), 'Feet');
  expect(screen.getByRole('status').textContent).toBe('2 dari 8 relic');
  await user.click(screen.getByRole('button', { name: /Feet:.*ATK 43.2%/ }));
  expect(within(screen.getByRole('complementary')).getByText('demo-feet-02')).toBeTruthy();
  await user.click(screen.getByRole('checkbox', { name: 'Hanya terkunci' }));
  expect(screen.getByRole('status').textContent).toBe('1 dari 8 relic');
  await user.type(screen.getByRole('searchbox'), 'no matching relic');
  expect(screen.getByRole('status').textContent).toBe('0 dari 8 relic');
  await user.click(screen.getByRole('button', { name: 'Tampilkan semua relic' }));
  expect(screen.getByRole('status').textContent).toBe('8 dari 8 relic');
});

test('equipment slot shortcuts select the equipped item and demo exit clears the workspace', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByRole('searchbox'), 'Izumo');
  await user.click(screen.getByRole('button', { name: 'Lihat slot Head' }));
  expect(screen.getByRole('status').textContent).toBe('2 dari 8 relic');
  expect(within(screen.getByRole('complementary')).getByText('demo-head-01')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Keluar demo' }));
  expect(screen.queryByRole('searchbox')).toBeNull();
  expect(screen.queryByRole('img', { name: /Artwork Acheron/ })).toBeNull();
  await user.click(screen.getAllByRole('button', { name: 'Jelajahi demo' })[0]);
  expect(screen.getByRole('status').textContent).toBe('8 dari 8 relic');
});

test('failed artwork retains a named fallback', () => {
  render(<GameImage file="missing.png" alt="Artwork Acheron" character />);
  fireEvent.error(screen.getByRole('img', { name: 'Artwork Acheron' }));
  expect(screen.getByRole('img', { name: 'Artwork Acheron' }).textContent).toBe('Artwork tidak tersedia');
  render(<GameImage file="missing-icon.png" alt="" />);
  fireEvent.error(screen.getByAltText(''));
  expect(screen.getAllByRole('img')).toHaveLength(1);
});
