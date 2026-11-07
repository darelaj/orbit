import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { CharacterArtwork } from './CharacterArtwork';
import { characterArtwork, CHARACTER_ART_PIN } from '../domain/character-art';

afterEach(cleanup);
test('public portrait URLs use pinned IDs and never arbitrary names or URLs', () => {
  expect(characterArtwork('1308')?.name).toBe('Acheron');
  expect(characterArtwork('1101')?.name).toBe('Bronya');
  expect(characterArtwork('8007')?.name).toBe('Trailblazer (Remembrance)');
  expect(characterArtwork('8007')?.url).toBe(`https://raw.githubusercontent.com/Mar-7th/StarRailRes/${CHARACTER_ART_PIN}/image/character_portrait/8007.png`);
  for (const id of ['unknown', '__proto__', 'constructor', '../1308', 'https://example.com/image.png']) expect(characterArtwork(id)).toBeNull();
});
test('remote errors retain named fallback and do not poison a different character', () => {
  const view=render(<CharacterArtwork id="1308" />);
  const image=screen.getByRole('img',{name:'Acheron artwork'});
  expect(image.getAttribute('referrerpolicy')).toBe('no-referrer');
  expect(image.getAttribute('crossorigin')).toBe('anonymous');
  fireEvent.error(image);
  expect(screen.getByRole('img',{name:'Acheron artwork'}).textContent).toBe('Artwork unavailable');
  view.rerender(<CharacterArtwork id="1101" />);
  expect(screen.getByRole('img',{name:'Bronya artwork'}).tagName).toBe('IMG');
  expect(screen.getByRole('img',{name:'Bronya artwork'}).getAttribute('src')).toBe(characterArtwork('1101')?.url);
  view.rerender(<CharacterArtwork id="future-form" />);
  expect(screen.getByRole('img',{name:'Character future-form artwork'}).textContent).toBe('Artwork unavailable');
});
