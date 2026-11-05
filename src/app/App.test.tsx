import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

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
