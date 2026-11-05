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
  await user.selectOptions(screen.getByRole('combobox', { name: 'Slot' }), 'Body');
  expect(screen.getByRole('status').textContent).toBe('2 dari 8 relic');
  await user.selectOptions(screen.getByRole('combobox', { name: 'Status kunci' }), 'unlocked');
  expect(screen.getByRole('status').textContent).toBe('1 dari 8 relic');
  await user.click(screen.getByRole('button', { name: /Body:.*CRIT Rate 32.4%/ }));
  expect(within(screen.getByRole('complementary')).getByText('Belum dipakai')).toBeTruthy();
  expect(within(screen.getByRole('complementary')).getByText('32.4%')).toBeTruthy();
  expect(within(screen.getByRole('complementary')).getByText('01 / 01')).toBeTruthy();
  await user.type(screen.getByRole('searchbox'), 'no matching relic');
  expect(screen.getByRole('status').textContent).toBe('0 dari 8 relic');
  await user.click(screen.getByRole('button', { name: 'Tampilkan semua relic' }));
  expect(screen.getByRole('status').textContent).toBe('8 dari 8 relic');
});

test('equipment selects without changing filters, and a hidden selection can be revealed', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByRole('searchbox'), 'Izumo');
  await user.click(screen.getByRole('button', { name: 'Lihat equipment Head' }));
  expect(screen.getByRole('status').textContent).toBe('2 dari 8 relic');
  expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('Izumo');
  expect(within(screen.getByRole('complementary')).getByText('Di luar hasil')).toBeTruthy();
  expect(within(screen.getByRole('complementary')).getByRole('heading', { name: "Pioneer's Heatproof Shell" })).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Tampilkan relic terpilih' }));
  expect(screen.getByRole('status').textContent).toBe('8 dari 8 relic');
  expect(screen.getByRole('button', { name: /Head:.*HP 705/ }).getAttribute('aria-pressed')).toBe('true');
});

test('slot sorting changes collection order without changing selection and reset restores defaults', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Urutan' }), 'slot-reverse');
  const cards = within(screen.getByLabelText('Hasil relic')).getAllByRole('button');
  expect(cards[0].getAttribute('aria-label')).toMatch(/^Link Rope:/);
  expect(cards.at(-1)?.getAttribute('aria-label')).toMatch(/^Head:/);
  expect(screen.getByRole('button', { name: /Body:.*CRIT DMG 64.8%/ }).getAttribute('aria-pressed')).toBe('true');
  expect(within(screen.getByRole('complementary')).getByText('05 / 08')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Reset filter' }));
  expect((screen.getByRole('combobox', { name: 'Urutan' }) as HTMLSelectElement).value).toBe('equipped');
  expect((screen.getByRole('button', { name: 'Reset filter' }) as HTMLButtonElement).disabled).toBe(true);
});

test('leaving the demo removes equipment and both entry actions restore it', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Keluar demo' }));
  expect(screen.queryByRole('searchbox')).toBeNull();
  expect(screen.queryByRole('img', { name: /Artwork Acheron/ })).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Buka demo' }));
  expect(screen.getByRole('status').textContent).toBe('8 dari 8 relic');
  await user.click(screen.getByRole('button', { name: 'Keluar demo' }));
  await user.click(screen.getByRole('button', { name: 'Jelajahi demo' }));
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
